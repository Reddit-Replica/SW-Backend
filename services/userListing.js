import { prepareLimit } from "../utils/prepareLimit.js";
import { validateId } from "./subredditFlairs.js";
/**
 * A Service function used to get the subreddit banned users for the controller
 * @param {Number} limitReq the limit identified in the request
 * @param {ObjectID} beforeReq Before id
 * @param {ObjectID} afterReq After id
 * @param {Subreddit} subreddit The subreddit object
 * @returns {preparedResponse} the prepared response for the controller
 */
export async function listingBannedUsers(
  limitReq,
  beforeReq,
  afterReq,
  subreddit
) {
  let preparedResponse;
  let limit = prepareLimit(limitReq);
  await subreddit.populate("bannedUsers.userId");
  if (!beforeReq && !afterReq) {
    preparedResponse = getBannedUsersFirstTime(subreddit, limit);
  } else if (beforeReq && afterReq) {
    const error = new Error("Can't set before and after");
    error.statusCode = 400;
    throw error;
  } else if (beforeReq) {
    validateId(beforeReq);
    preparedResponse = getBannedUsersBefore(subreddit, limit, beforeReq);
  } else {
    validateId(afterReq);
    preparedResponse = getBannedUsersAfter(subreddit, limit, afterReq);
  }

  return preparedResponse;
}

/**
 * A Service helper function used to get the banned users for the main service function in case of first time
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
function getBannedUsersFirstTime(subreddit, limit) {
  const response = { children: [] };
  const numberOfBannedUsers = subreddit.bannedUsers.length;
  let myLimit;
  if (numberOfBannedUsers > limit) {
    myLimit = limit;
  } else {
    myLimit = numberOfBannedUsers;
  }
  for (let i = 0; i < myLimit; i++) {
    response.children.push({
      username: subreddit.bannedUsers[i].userId.username,
      userId: subreddit.bannedUsers[i].userId.id.toString(),
      avatar: subreddit.bannedUsers[i].userId.avatar,
      bannedAt: subreddit.bannedUsers[i].bannedAt,
      banPeriod: subreddit.bannedUsers[i].banPeriod,
      modNote: subreddit.bannedUsers[i].modNote,
      noteInclude: subreddit.bannedUsers[i].noteInclude,
      reasonForBan: subreddit.bannedUsers[i].reasonForBan,
    });
  }
  if (myLimit !== numberOfBannedUsers) {
    response.after = subreddit.bannedUsers[myLimit - 1].userId._id;
  }
  return response;
}

/**
 * A Service helper function used to get the banned users for the main service function in case of before
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getBannedUsersBefore(subreddit, limit, before) {
  const response = { children: [] };
  let myStart;
  const numberOfBannedUsers = subreddit.bannedUsers.length;
  const neededIndex = subreddit.bannedUsers.findIndex(
    (user) => user.userId._id.toString() === before
  );
  if (neededIndex === -1) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  if (neededIndex - limit < 0) {
    myStart = 0;
  } else {
    myStart = neededIndex - limit;
  }
  for (let i = myStart; i < neededIndex; i++) {
    response.children.push({
      username: subreddit.bannedUsers[i].userId.username,
      userId: subreddit.bannedUsers[i].userId.id.toString(),
      avatar: subreddit.bannedUsers[i].userId.avatar,
      bannedAt: subreddit.bannedUsers[i].bannedAt,
      banPeriod: subreddit.bannedUsers[i].banPeriod,
      modNote: subreddit.bannedUsers[i].modNote,
      noteInclude: subreddit.bannedUsers[i].noteInclude,
      reasonForBan: subreddit.bannedUsers[i].reasonForBan,
    });
  }
  if (response.children.length >= 1) {
    if (myStart !== 0) {
      response.before = subreddit.bannedUsers[myStart].userId._id;
    }
    if (neededIndex !== numberOfBannedUsers - 1) {
      response.after = subreddit.bannedUsers[neededIndex - 1].userId._id;
    }
  }
  return response;
}

/**
 * A Service helper function used to get the banned users for the main service function in case of after
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getBannedUsersAfter(subreddit, limit, after) {
  const response = { children: [] };
  let myLimit;
  const numberOfBannedUsers = subreddit.bannedUsers.length;
  const neededIndex = subreddit.bannedUsers.findIndex(
    (user) => user.userId._id.toString() === after
  );
  if (neededIndex === -1) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  if (neededIndex + limit + 1 >= numberOfBannedUsers) {
    myLimit = numberOfBannedUsers;
  } else {
    myLimit = neededIndex + limit + 1;
  }
  for (let i = neededIndex + 1; i < myLimit; i++) {
    response.children.push({
      username: subreddit.bannedUsers[i].userId.username,
      userId: subreddit.bannedUsers[i].userId.id.toString(),
      avatar: subreddit.bannedUsers[i].userId.avatar,
      bannedAt: subreddit.bannedUsers[i].bannedAt,
      banPeriod: subreddit.bannedUsers[i].banPeriod,
      modNote: subreddit.bannedUsers[i].modNote,
      noteInclude: subreddit.bannedUsers[i].noteInclude,
      reasonForBan: subreddit.bannedUsers[i].reasonForBan,
    });
  }
  if (response.children.length >= 1) {
    if (myLimit !== numberOfBannedUsers) {
      response.after = subreddit.bannedUsers[myLimit - 1].userId._id;
    }
    response.before = subreddit.bannedUsers[neededIndex + 1].userId._id;
  }
  return response;
}

/**
 * A Service function used to get the user blocked users for the controller
 * @param {Number} limitReq the limit identified in the request
 * @param {ObjectID} beforeReq Before id
 * @param {ObjectID} afterReq After id
 * @param {object} user The user object
 * @returns {preparedResponse} the prepared response for the controller
 */
export async function listingBlockedUsers(limitReq, beforeReq, afterReq, user) {
  let preparedResponse;
  let limit = prepareLimit(limitReq);
  await user.populate("blockedUsers.blockedUserId");
  if (!beforeReq && !afterReq) {
    preparedResponse = getBlockedUsersFirstTime(user, limit);
  } else if (beforeReq && afterReq) {
    const error = new Error("Can't set before and after");
    error.statusCode = 400;
    throw error;
  } else if (beforeReq) {
    validateId(beforeReq);
    preparedResponse = getBlockedUsersBefore(user, limit, beforeReq);
  } else {
    validateId(afterReq);
    preparedResponse = getBlockedUsersAfter(user, limit, afterReq);
  }

  return preparedResponse;
}

/**
 * A Service helper function used to get the user blocked users for the main service function in case of first time
 * @param {object} user The user object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
function getBlockedUsersFirstTime(user, limit) {
  const response = { children: [] };
  const numberOfBlockedUsers = user.blockedUsers.length;
  let myLimit;
  if (numberOfBlockedUsers > limit) {
    myLimit = limit;
  } else {
    myLimit = numberOfBlockedUsers;
  }
  for (let i = 0; i < myLimit; i++) {
    response.children.push({
      userId: user.blockedUsers[i].blockedUserId.id.toString(),
      username: user.blockedUsers[i].blockedUserId.username,
      avatar: user.blockedUsers[i].blockedUserId.avatar,
      blockDate: user.blockedUsers[i].blockDate,
    });
  }
  if (myLimit !== numberOfBlockedUsers) {
    response.after = user.blockedUsers[myLimit - 1].blockedUserId._id;
  }
  return response;
}

/**
 * A Service helper function used to get the user blocked users for the main service function in case of before
 * @param {object} user The user object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getBlockedUsersBefore(user, limit, before) {
  const response = { children: [] };
  let myStart;
  const numberOfBlockedUsers = user.blockedUsers.length;
  const neededIndex = user.blockedUsers.findIndex(
    (blockedUser) => blockedUser.blockedUserId._id.toString() === before
  );
  if (neededIndex === -1) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  if (neededIndex - limit < 0) {
    myStart = 0;
  } else {
    myStart = neededIndex - limit;
  }
  for (let i = myStart; i < neededIndex; i++) {
    response.children.push({
      userId: user.blockedUsers[i].blockedUserId.id.toString(),
      username: user.blockedUsers[i].blockedUserId.username,
      avatar: user.blockedUsers[i].blockedUserId.avatar,
      blockDate: user.blockedUsers[i].blockDate,
    });
  }
  if (response.children.length >= 1) {
    if (myStart !== 0) {
      response.before = user.blockedUsers[myStart].blockedUserId._id;
    }
    if (neededIndex !== numberOfBlockedUsers - 1) {
      response.after = user.blockedUsers[neededIndex - 1].blockedUserId._id;
    }
  }
  return response;
}

/**
 * A Service helper function used to get the user blocked users for the main service function in case of after
 * @param {object} user The user object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getBlockedUsersAfter(user, limit, after) {
  const response = { children: [] };
  let myLimit;
  const numberOfBlockedUsers = user.blockedUsers.length;
  const neededIndex = user.blockedUsers.findIndex(
    (blockedUser) => blockedUser.blockedUserId._id.toString() === after
  );
  if (neededIndex === -1) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }

  if (neededIndex + limit + 1 >= numberOfBlockedUsers) {
    myLimit = numberOfBlockedUsers;
  } else {
    myLimit = neededIndex + limit + 1;
  }
  for (let i = neededIndex + 1; i < myLimit; i++) {
    response.children.push({
      userId: user.blockedUsers[i].blockedUserId.id.toString(),
      username: user.blockedUsers[i].blockedUserId.username,
      avatar: user.blockedUsers[i].blockedUserId.avatar,
      blockDate: user.blockedUsers[i].blockDate,
    });
  }
  if (response.children.length >= 1) {
    if (myLimit !== numberOfBlockedUsers) {
      response.after = user.blockedUsers[myLimit - 1].blockedUserId._id;
    }
    response.before = user.blockedUsers[neededIndex + 1].blockedUserId._id;
  }
  return response;
}
