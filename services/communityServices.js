/* eslint-disable max-len */
/* eslint-disable max-statements */
import Subreddit from "./../models/Community.js";
import Category from "./../models/Category.js";
import { searchForUserService } from "../services/userServices.js";
import {
  getSortedCategories,
  insertCategoriesIfNotExists,
} from "../services/categories.js";
import { checkIfModerator } from "./subredditActionsServices.js";
import { addMessage } from "./messageServices.js";
/**
 * This function is used to search for a subreddit with its name
 * it gets the subreddit from the database then it checks about it's validity
 * if there is no subreddit or we found one but it's deleted then we return an error
 * @param {String} subredditName subreddit Name
 * @returns {Object} error object that contains the msg describing why there is an error and its status code , or if there is no error then it returns the subreddit itself
 */
export async function searchForSubreddit(subredditName) {
  //GETTING SUBREDDIT DATA
  const subreddit = await Subreddit.findOne({
    title: subredditName,
    deletedAt: undefined,
  });
  if (!subreddit) {
    let error = new Error("This subreddit isn't found");
    error.statusCode = 400;
    throw error;
  }

  if (subreddit.deletedAt) {
    let error = new Error("This subreddit is deleted");
    error.statusCode = 400;
    throw error;
  }
  return subreddit;
}
/**
 * This function is used to check if the subredditName is available or not
 * it gets the subreddit from the database then it checks about it's validity
 * if there is no subreddit then it's available
 * @param {String} subredditName subreddit Name
 * @returns {Object} error object that contains the msg describing why there is an error and its status code , or if there is no error then it returns the subreddit itself
 */
//ADD EXTRA CHECK ON REGULAR EXPRESSIONS
export async function subredditNameAvailable(subredditName) {
  if (!subredditName.match(/^[A-Za-z0-9\-\_]+$/)) {
    let error = new Error(
      "subreddit name can only contain letters, numbers, or underscores."
    );
    error.statusCode = 400;
    throw error;
  }
  if (subredditName.length < 3 || subredditName.length > 21) {
    let error = new Error("Community names must be between 3–21 characters");
    error.statusCode = 409;
    throw error;
  }
  const subreddit = await Subreddit.findOne({ title: subredditName });
  if (!subreddit) {
    return {
      statusCode: 200,
      message: "The subreddit's name is available",
    };
  }
  let error = new Error("Subreddit's name is already taken");
  error.statusCode = 409;
  throw error;
}
/**
 * This function is used to search for a subreddit with its id
 * it gets the subreddit from the database then it checks about it's validity
 * if there is no subreddit or we found one but it's deleted then it will return an error
 * or if the passed id isn't valid as an object id then it will return an error also
 * @param {String} subredditId subreddit Id
 * @returns {Object} error object that contains the msg describing why there is an error and its status code , or if there is no error then it return the subreddit itself
 */
export async function searchForSubredditById(subredditId) {
  //GETTING SUBREDDIT DATA
  if (!subredditId.match(/^[0-9a-fA-F]{24}$/)) {
    let error = new Error("This is not a valid subreddit id");
    error.statusCode = 400;
    throw error;
  }
  const subreddit = await Subreddit.findById(subredditId);
  if (!subreddit) {
    let error = new Error("This subreddit isn't found");
    error.statusCode = 400;
    throw error;
  }
  if (subreddit.deletedAt) {
    let error = new Error("This subreddit is deleted");
    error.statusCode = 400;
    throw error;
  }
  return subreddit;
}

/**
 * This function is used to add a subreddit to the ones that the user joined
 * it adds the subreddit to joinedSubreddit list then increment the number of members of the subreddit
 * @param {object} subreddit object that contains the data of the subreddit that we will add it to users joined Subreddits
 * @param {object} user object that contains the data of the user that the subreddit will be added to
 * @returns {Object} success objects that contains the msg describing what happened and its status code
 */
export async function addToJoinedSubreddit(user, subreddit) {
  if (subreddit.subredditSettings.sendWelcomeMessage) {
    if (subreddit.subredditSettings.welcomeMessage) {
      let sendingDate = new Date();
      sendingDate.setHours(sendingDate.getHours() + 1);
      let smallreq = {};
      smallreq.msg = {
        senderUsername: subreddit.title,
        isSenderUser: false,
        receiverUsername: user.username,
        isReceiverUser: true,
        receiverId: user.id,
        text:
          subreddit.subredditSettings.welcomeMessage +
          ` This message can not be replied to. If you have questions for the moderators of r/${subreddit.title} you can message them here.`,
        subject: `Welcome to r/${subreddit.title}!`,
        isReply: false,
        createdAt: sendingDate,
      };
      addMessage(smallreq);
    }
  }
  user.joinedSubreddits.push({
    subredditId: subreddit.id,
    name: subreddit.title,
  });
  await user.save();
  subreddit.members += 1;
  subreddit.joinedUsers.push({
    userId: user.id,
    joinDate: Date.now(),
  });
  await subreddit.save();
  return {
    statusCode: 200,
    message: "you joined the subreddit successfully",
  };
}

/**
 * Function used to remove the subreddit from the joinedSubreddit list of the user,
 * then decrement the number of members of the subreddit.
 * @param {object} user User object that contains the data of the user
 * @param {object} subreddit Subreddit object that user want to leave
 */
export async function leaveSubredditService(user, subreddit) {
  // check if the user is the owner of the subreddit or moderator
  if (subreddit.owner.userID.toString() === user._id.toString()) {
    let error = new Error("Owner of the subreddit can not leave");
    error.statusCode = 400;
    throw error;
  }
  if (checkIfModerator(user._id, subreddit) !== -1) {
    let error = new Error("Moderators of the subreddit can not leave");
    error.statusCode = 400;
    throw error;
  }

  // check if the user is not a member in that subreddit
  const joinedIndex = user.joinedSubreddits.findIndex(
    (ele) => ele.subredditId.toString() === subreddit._id.toString()
  );
  const waitedIndex = subreddit.waitedUsers.findIndex(
    (ele) => ele.userID.toString() === user._id.toString()
  );

  if (joinedIndex === -1 && waitedIndex === -1) {
    let error = new Error("Can not leave a subreddit that you did not join");
    error.statusCode = 400;
    throw error;
  }

  // if the user was a member in that subreddit
  if (joinedIndex !== -1) {
    user.joinedSubreddits.splice(joinedIndex, 1);
    subreddit.members -= 1;

    const joinedSubIndex = subreddit.joinedUsers.findIndex(
      (ele) => ele.userId.toString() === user._id.toString()
    );
    subreddit.joinedUsers.splice(joinedSubIndex, 1);

    const leftIndex = subreddit.leftUsers.findIndex(
      (ele) => ele.userId.toString() === user._id.toString()
    );
    // add him to leftList or update his leaveDate
    if (leftIndex === -1) {
      subreddit.leftUsers.push({
        userId: user._id,
        leaveDate: Date.now(),
      });
    } else {
      subreddit.leftUsers[leftIndex].leaveDate = Date.now();
    }

    const approvedIndex = subreddit.approvedUsers.findIndex(
      (ele) => ele.userID.toString() === user._id.toString()
    );
    if (approvedIndex !== -1) {
      subreddit.approvedUsers.splice(approvedIndex, 1);
    }
  }

  // if the user is still in the waiting list for that subreddit
  if (waitedIndex !== -1) {
    subreddit.waitedIndex.splice(waitedIndex, 1);
  }

  await user.save();
  await subreddit.save();

  return {
    statusCode: 200,
    message: "You left the subreddit successfully",
  };
}

/**
 * This function is used to add a description to a subreddit using one of the moderators
 * @param {String} subredditName subreddit Name
 * @param {String} description description of the subreddit that will be added
 * @returns {Object} success objects that contains the msg describing what happened and its status code
 */
export async function addToDescription(subredditName, description) {
  const subreddit = await searchForSubreddit(subredditName);
  subreddit.description = description;
  await subreddit.save();
  return {
    statusCode: 200,
    message: "description is submitted successfully",
  };
}
/**
 * This function is used to add a main Topic to a subreddit using one of the moderators
 * @param {String} subredditName subreddit Name
 * @param {String} mainTopic mainTopic of the subreddit that will be added
 * @returns {Object} success objects that contains the msg describing what happened and its status code
 */
export async function addToMainTopic(subredditName, mainTopic) {
  const subreddit = await searchForSubreddit(subredditName);
  subreddit.mainTopic = mainTopic;
  await subreddit.save();

  return {
    statusCode: 200,
    message: "Successfully updated primary topic!",
  };
}
/**
 * This function is used to add sub topics to a subreddit using one of the moderators
 * firstly it checks if the input is an array or not
 * then it adds that array to a set then return it to an array to remove all the duplicates that may be in the array
 * then it checks if the values in this array is valid to be added or not
 * @param {String} subredditName subreddit Name
 * @param {Array} subTopics array of sub topics that may be added to the subreddit
 * @param {Array} referenceArr array of the sub topics that we have and we can't anything is out of that list
 * @returns {Object} success object that contains the msg describing what happened and its status code , or an error object that describes why there is an error and it's status code
 */
export async function addToSubtopics(subredditName, subTopics, referenceArr) {
  if (!Array.isArray(subTopics)) {
    let error = new Error("Subtopics must be an array");
    error.statusCode = 400;
    throw error;
  }
  const noDuplicateSubtopic = [...new Set(subTopics)];
  await validateSubtopics(noDuplicateSubtopic, referenceArr);
  const subreddit = await searchForSubreddit(subredditName);
  subreddit.subTopics = noDuplicateSubtopic;
  await subreddit.save();
  return {
    statusCode: 200,
    message: "Community topics saved",
  };
}
/**
 * This function is used to validate the array of subtopics that is sent to be added
 * @param {Array} subTopics array of sub topics that may be added to the subreddit
 * @param {Array} referenceArr array of the sub topics that we have and we can't anything is out of that list
 * @returns {Object} error object that contains the msg describing why there is an error and its status code
 */
export async function validateSubtopics(subTopics, referenceArr) {
  for (const subtopic of subTopics) {
    if (!referenceArr.includes(subtopic)) {
      let error = new Error(`Subtopic ${subtopic} is not available`);
      error.statusCode = 404;
      throw error;
    }
  }
}
/**
 * This function is used to add a subreddit
 * it creates a new subreddit by an order of a user
 * then this subreddit is added to the database and this user will be a moderator in it
 * this subreddit will be added to user's joined , moderated and owned subreddits
 * @param {object} req object that contains the data of the subreddit that we will added
 * @param {object} authPayload object that contains the data of the user that wants to create the subreddit
 * @returns {Object} success object that contains the msg describing what happened and its status code
 */
export async function addSubreddit(req, authPayload) {
  //GETTING USER DATA
  const creatorUsername = authPayload.username;
  const creatorId = authPayload.userId;
  const moderator = await searchForUserService(creatorUsername);
  const { subredditName, category, type, nsfw } = req.body;
  if (!subredditName.match(/^[A-Za-z0-9\-\_]+$/)) {
    let error = new Error(
      "subreddit name can only contain letters, numbers, or underscores."
    );
    error.statusCode = 400;
    throw error;
  }
  await checkOnCategory(category);
  const owner = {
    username: creatorUsername,
    userID: creatorId,
  };
  const joinedUsers = [];
  joinedUsers.push({
    userId: owner.userID,
    joinDate: Date.now(),
  });
  const approvedUsers = [];
  approvedUsers.push({
    userID: owner.userID,
    dateOfApprove: Date.now(),
  });
  const subreddit = await new Subreddit({
    title: subredditName,
    viewName: subredditName,
    category: category,
    type: type,
    nsfw: nsfw,
    owner: owner,
    dateOfCreation: Date.now(),
    joinedUsers: joinedUsers,
    approvedUsers: approvedUsers,
  }).save();
  await Category.updateOne({ name: category }, { $set: { visited: true } });
  const addedSubreddit = {
    subredditId: subreddit.id,
    name: subredditName,
  };
  moderator.ownedSubreddits.push(addedSubreddit);
  moderator.joinedSubreddits.push(addedSubreddit);
  await moderator.save();

  await moderateSubreddit(moderator.username, subredditName);
  return {
    statusCode: 201,
    message: "The subreddit has been successfully created",
  };
}
/**
 * This function is used to make a user a moderator of a subreddit
 * it adds the subreddit to the list of moderated subreddits in the user
 * it adds the user to the list of moderators of the subreddit
 * @param {String} username username of the user
 * @param {String} subredditName subreddit name
 * @returns {Object} success object that contains the msg describing what happened and its status code
 */
export async function moderateSubreddit(username, subredditName) {
  const user = await searchForUserService(username);
  const subreddit = await searchForSubreddit(subredditName);

  const addedSubreddit = {
    subredditId: subreddit.id,
    name: subredditName,
  };

  const addedUser = {
    username: username,
    userID: user.id,
    dateOfModeration: Date.now(),
    permissions: ["Everything"],
  };
  for (const moderator of subreddit.moderators) {
    if (moderator.username === user.username) {
      let error = new Error(`${user.username} is already a moderator`);
      error.statusCode = 400;
      throw error;
    }
  }

  user.moderatedSubreddits.push(addedSubreddit);
  subreddit.moderators.push(addedUser);

  await user.save();
  await subreddit.save();

  return {
    statusCode: 200,
    message: `${username} has been moderator to ${subredditName} successfuly`,
  };
}
/**
 * This function is used to check if the input category is valid or not
 * @param {String} category username of the user
 * @returns {Object} error object that contains the msg describing what happened and its status code
 */
export async function checkOnCategory(category) {
  await insertCategoriesIfNotExists();
  const categories = await getSortedCategories();
  let includes = false;
  for (const smallCategory of categories) {
    if (smallCategory.name === category) {
      includes = true;
      break;
    }
  }
  if (!includes) {
    let error = new Error(`${category} is not available as a category`);
    error.statusCode = 404;
    throw error;
  }
}
/**
 * This function is used to check if the user joined the subreddit to do any action in it or not
 * it searches for the subreddit in the users joined subreddits
 * @param {Object} user user object containing information about him
 * @param {String} subredditName subreddit name
 * @returns {Boolean} Indicates if the user is in the subreddit or not
 */
export async function checkJoining(user, subredditName) {
  for (const subreddit of user.joinedSubreddits) {
    if (subreddit.name === subredditName) {
      return true;
    }
  }
  let error = new Error(
    `You haven't joined ${subredditName} yet , to do this action you have to join it first`
  );
  error.statusCode = 401;
  throw error;
}
/**
 * This function is used to check if the subreddit is private or not and if it was then does the user a part of it or not
 * @param {Object} user user object containing information about him
 * @param {Object} subreddit subreddit object containing information about it
 * @returns {Boolean} Indicates if the user is in the subreddit or not
 */
export async function checkForPrivateSubreddits(user, subreddit) {
  if (subreddit.type === "Private") {
    for (const smallSubreddit of user.joinedSubreddits) {
      if (smallSubreddit.name === subreddit.title) {
        return true;
      }
    }
  } else {
    return true;
  }
  let error = new Error(
    `${subreddit.title} is a private subreddit, to do this action you have to request for joining it first`
  );
  error.statusCode = 401;
  throw error;
}
/**
 * This function is used to check if the subreddit is favorite to the user or not
 * @param {Object} user user object containing information about him
 * @param {Object} subreddit subreddit object containing information about it
 * @returns {Boolean} Indicates if the subreddit is favorite or not
 */
export async function checkForFavoriteSubreddits(user, subreddit) {
  for (const smallSubreddit of user.favoritesSubreddits) {
    if (smallSubreddit.name === subreddit.title) {
      return true;
    }
  }
  return false;
}
/**
 * This function is used to make the subreddit favorite
 * @param {Object} user user object containing information about him
 * @param {String} subredditName name of the subreddit
 * @param {String} subredditId name of the subreddit
 * @returns {Boolean} Indicates if the subreddit is favorite or not
 */
export async function makeSubredditFavorite(user, subredditName, subredditId) {
  user.favoritesSubreddits.push({
    subredditId: subredditId,
    name: subredditName,
  });
  await user.save();
  return {
    statusCode: 200,
    message: "subreddit is now favorite",
  };
}
/**
 * This function is used to remove the subreddit from favorites
 * @param {Object} user user object containing information about him
 * @param {String} subredditName name of the subreddit
 * @returns {Boolean} Indicates if the subreddit is favorite or not
 */
export async function removeSubredditFromFavorite(user, subredditName) {
  user.favoritesSubreddits = user.favoritesSubreddits.filter(
    (smallSubreddit) => {
      return smallSubreddit.name !== subredditName;
    }
  );
  await user.save();
  return {
    statusCode: 200,
    message: "subreddit is now un favorite",
  };
}
