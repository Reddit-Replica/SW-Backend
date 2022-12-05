/* eslint-disable max-len */
/* eslint-disable max-statements */
import Subreddit from "./../models/Community.js";
import { searchForUserService } from "../services/userServices.js";
import {
  getSortedCategories,
  insertCategoriesIfNotExists,
} from "../services/categories.js";
/**
 * This function is used to search for a subreddit with its name
 * it gets the subreddit from the database then it checks about it's validity
 * if there is no subreddit or we found one but it's deleted then we return an error
 * @param {String} subredditName subreddit Name
 * @returns {Object} error object that contains the msg describing why there is an error and its status code , or if there is no error then it returns the subreddit itself
 */
export async function searchForSubreddit(subredditName) {
  //GETTING SUBREDDIT DATA
  const subreddit = await Subreddit.findOne({ title: subredditName });
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
 * This function is used to add a user to the waiting list of a subreddit if the requested subreddit was private
 * @param {Object} subreddit object that contains the data of the subreddit that we will push the user into its waited list
 * @param {String} username username of the user that wants to join the subreddit
 * @param {String} message message that the user sent while joining the subreddit
 * @returns {Object} success object that contains the msg describing what happened and its status code
 */
export async function addUserToWaitingList(subreddit, username, message = "") {
  const user1 = await searchForUserService(username);
  subreddit.waitedUsers.push({
    username: username,
    userID: user1.id,
    message: message,
  });
  await subreddit.save();
  return {
    statusCode: 200,
    message: "Your request is sent successfully",
  };
}
/**
 * This function is used to add a subreddit to the ones that the user joined
 * it adds the subreddit to joinedSubreddit list then increment the number of members of the subreddit
 * @param {object} subreddit object that contains the data of the subreddit that we will add it to users joined Subreddits
 * @param {object} user object that contains the data of the user that the subreddit will be added to
 * @returns {Object} success objects that contains the msg describing what happened and its status code
 */
export async function addToJoinedSubreddit(user, subreddit) {
  user.joinedSubreddits.push({
    subredditId: subreddit.id,
    name: subreddit.title,
  });
  console.log(user);
  await user.save();
  subreddit.members += 1;
  await subreddit.save();
  return {
    statusCode: 200,
    message: "you joined the subreddit successfully",
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
  await checkOnCategory(category);
  const owner = {
    username: creatorUsername,
    userID: creatorId,
  };
  const subreddit = await new Subreddit({
    title: subredditName,
    category: category,
    type: type,
    nsfw: nsfw,
    owner: owner,
  }).save();
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
async function checkOnCategory(category) {
  await insertCategoriesIfNotExists();
  const categories = await getSortedCategories();
  let includes = false;
  for (const smallCategory of categories) {
    if (smallCategory.name === category) {
      includes = true;
    }
  }
  if (!includes) {
    let error = new Error(`${category} is not available as a category`);
    error.statusCode = 404;
    throw error;
  }
}

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

export async function checkForPrivateSubreddits(user, subreddit) {

if (subreddit.type==="Private"){
  for (const smallSubreddit of user.joinedSubreddits) {
    if (smallSubreddit.name === subreddit.title) {
      return true;
    }
  }
} else {
  return true;
}
  let error = new Error(
    `You haven't joined ${subredditName} yet , to do this action you have to join it first`
  );
  error.statusCode = 401;
  throw error;
}

export async function makeSubredditFavorite(user,subredditName,subredditId){
  user.favoritesSubreddits.push({
    subredditId:subredditId,
    name:subredditName,
  });
  await user.save();

}
