import Subreddit from "./../models/Community.js";
import { searchForUserService } from "../services/userServices.js";

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

export async function addUserToWaitingList(
  subreddit,
  username,
  userId,
  message
) {
  subreddit.waitedUsers.push({
    username: username,
    userID: userId,
    message: message,
  });
  await subreddit.save();
  return {
    statusCode: 200,
    message: "Your request is sent successfully",
  };
}

export async function addToJoinedSubreddit(user, subreddit) {
  user.joinedSubreddits.push({
    subredditId: subreddit.id,
    name: subreddit.title,
  });
  await user.save();
  subreddit.members += 1;
  await subreddit.save();
  return {
    statusCode: 200,
    message: "you joined the subreddit successfully",
  };
}

export async function addToDescription(subredditName, description) {
  const subreddit = await searchForSubreddit(subredditName);
  subreddit.description = description;
  await subreddit.save();
  return {
    statusCode: 200,
    message: "description is submitted successfully",
  };
}

export async function addToMainTopic(subredditName, mainTopic) {
  const subreddit = await searchForSubreddit(subredditName);
  subreddit.mainTopic = mainTopic;
  await subreddit.save();

  return {
    statusCode: 200,
    message: "Successfully updated primary topic!",
  };
}

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

export async function validateSubtopics(subTopics, referenceArr) {
  for (const subtopic of subTopics) {
    if (!referenceArr.includes(subtopic)) {
      let error = new Error(`Subtopic ${subtopic} is not available`);
      error.statusCode = 404;
      throw error;
    }
  }
}

export async function addSubreddit(req, authPayload) {
  //GETTING USER DATA
  const creatorUsername = authPayload.username;
  const creatorId = authPayload.userId;
  const moderator = await searchForUserService(creatorUsername);
  const { subredditName, category, type, nsfw } = req.body;
  const owner = {
    username: creatorUsername,
    userID: creatorId,
  };
  const moderators = [];
  moderators.push({
    username: creatorUsername,
    userID: creatorId,
  });
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

  user.moderatedSubreddits.push(addedSubreddit);
  subreddit.moderators.push(addedUser);
  console.log(subreddit.moderators);

  await user.save();
  await subreddit.save();
}
