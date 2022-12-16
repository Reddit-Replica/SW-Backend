import { prepareLimit } from "../utils/prepareLimit.js";
import { validateId } from "./subredditFlairs.js";
import { checkIfModerator } from "./subredditActionsServices.js";
import User from "../models/User.js";

/**
 * A Service function used to get the subreddit moderators for the controller
 * @param {Number} limitReq the limit identified in the request
 * @param {ObjectID} beforeReq Before id
 * @param {ObjectID} afterReq After id
 * @param {Subreddit} subreddit The subreddit object
 * @returns {preparedResponse} the prepared response for the controller
 */
export async function getSubredditModerators(
  limitReq,
  beforeReq,
  afterReq,
  subreddit
) {
  let preparedResponse;
  let limit = prepareLimit(limitReq);
  await subreddit.populate("moderators.userID");
  if (!beforeReq && !afterReq) {
    preparedResponse = getSubredditModeratorsFirstTime(subreddit, limit);
  } else if (beforeReq && afterReq) {
    const error = new Error("Can't set before and after");
    error.statusCode = 400;
    throw error;
  } else if (beforeReq) {
    validateId(beforeReq);
    preparedResponse = getSubredditModeratorsBefore(
      subreddit,
      limit,
      beforeReq
    );
  } else {
    validateId(afterReq);
    preparedResponse = getSubredditModeratorsAfter(subreddit, limit, afterReq);
  }

  return preparedResponse;
}

/**
 * A Service helper function used to get the subreddit moderators for the main service function in case of first time
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
function getSubredditModeratorsFirstTime(subreddit, limit) {
  const response = { children: [] };
  const numberOfModerators = subreddit.moderators.length;
  let myLimit;
  if (numberOfModerators > limit) {
    myLimit = limit;
  } else {
    myLimit = numberOfModerators;
  }
  for (let i = 0; i < myLimit; i++) {
    response.children.push({
      username: subreddit.moderators[i].userID.username,
      avatar: subreddit.moderators[i].userID.avatar,
      dateOfModeration: subreddit.moderators[i].dateOfModeration,
      permissions: subreddit.moderators[i].permissions,
    });
  }
  if (myLimit !== numberOfModerators) {
    response.after = subreddit.moderators[myLimit - 1].userID._id;
  }
  return response;
}

/**
 * A Service helper function used to get the subreddit moderators for the main service function in case of before
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getSubredditModeratorsBefore(subreddit, limit, before) {
  const response = { children: [] };
  let myStart;
  const numberOfModerators = subreddit.moderators.length;
  const neededIndex = subreddit.moderators.findIndex(
    (mod) => mod.userID._id.toString() === before
  );
  if (neededIndex === -1) {
    const error = new Error("invalid moderator id");
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
      username: subreddit.moderators[i].userID.username,
      avatar: subreddit.moderators[i].userID.avatar,
      dateOfModeration: subreddit.moderators[i].dateOfModeration,
      permissions: subreddit.moderators[i].permissions,
    });
  }
  if (response.children.length >= 1) {
    if (myStart !== 0) {
      response.before = subreddit.moderators[myStart].userID._id;
    }
    if (neededIndex !== numberOfModerators - 1) {
      response.after = subreddit.moderators[neededIndex - 1].userID._id;
    }
  }
  return response;
}

/**
 * A Service helper function used to get the subreddit moderators for the main service function in case of after
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getSubredditModeratorsAfter(subreddit, limit, after) {
  const response = { children: [] };
  let myLimit;
  const numberOfModerators = subreddit.moderators.length;
  const neededIndex = subreddit.moderators.findIndex(
    (mod) => mod.userID._id.toString() === after
  );
  if (neededIndex === -1) {
    const error = new Error("invalid moderator id");
    error.statusCode = 400;
    throw error;
  }

  if (neededIndex + limit + 1 >= numberOfModerators) {
    myLimit = numberOfModerators;
  } else {
    myLimit = neededIndex + limit + 1;
  }
  for (let i = neededIndex + 1; i < myLimit; i++) {
    response.children.push({
      username: subreddit.moderators[i].userID.username,
      avatar: subreddit.moderators[i].userID.avatar,
      dateOfModeration: subreddit.moderators[i].dateOfModeration,
      permissions: subreddit.moderators[i].permissions,
    });
  }
  if (response.children.length >= 1) {
    if (myLimit !== numberOfModerators) {
      response.after = subreddit.moderators[myLimit - 1].userID._id;
    }
    response.before = subreddit.moderators[neededIndex + 1].userID._id;
  }
  return response;
}

/**
 * A Service function used to get the invited subreddit moderators for the controller
 * @param {Number} limitReq the limit identified in the request
 * @param {ObjectID} beforeReq Before id
 * @param {ObjectID} afterReq After id
 * @param {Subreddit} subreddit The subreddit object
 * @returns {preparedResponse} the prepared response for the controller
 */
export async function getSubredditInvitedModerators(
  limitReq,
  beforeReq,
  afterReq,
  subreddit
) {
  let preparedResponse;
  let limit = prepareLimit(limitReq);
  await subreddit.populate("invitedModerators.userID");
  if (!beforeReq && !afterReq) {
    preparedResponse = getSubredditInvitedModeratorsFirstTime(subreddit, limit);
  } else if (beforeReq && afterReq) {
    const error = new Error("Can't set before and after");
    error.statusCode = 400;
    throw error;
  } else if (beforeReq) {
    validateId(beforeReq);
    preparedResponse = getSubredditInvitedModeratorsBefore(
      subreddit,
      limit,
      beforeReq
    );
  } else {
    validateId(afterReq);
    preparedResponse = getSubredditInvitedModeratorsAfter(
      subreddit,
      limit,
      afterReq
    );
  }

  return preparedResponse;
}

/**
 * A Service helper function used to get the invited subreddit moderators for the main service function in case of first time
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
function getSubredditInvitedModeratorsFirstTime(subreddit, limit) {
  const response = { children: [] };
  const numberOfModerators = subreddit.invitedModerators.length;
  let myLimit;
  if (numberOfModerators > limit) {
    myLimit = limit;
  } else {
    myLimit = numberOfModerators;
  }
  for (let i = 0; i < myLimit; i++) {
    response.children.push({
      username: subreddit.invitedModerators[i].userID.username,
      avatar: subreddit.invitedModerators[i].userID.avatar,
      dateOfInvitation: subreddit.invitedModerators[i].dateOfInvitation,
      permissions: subreddit.invitedModerators[i].permissions,
    });
  }
  if (myLimit !== numberOfModerators) {
    response.after = subreddit.invitedModerators[myLimit - 1].userID._id;
  }
  return response;
}

/**
 * A Service helper function used to get the invited subreddit moderators for the main service function in case of before
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getSubredditInvitedModeratorsBefore(subreddit, limit, before) {
  const response = { children: [] };
  let myStart;
  const numberOfModerators = subreddit.invitedModerators.length;
  const neededIndex = subreddit.invitedModerators.findIndex(
    (mod) => mod.userID._id.toString() === before
  );
  if (neededIndex === -1) {
    const error = new Error("invalid moderator id");
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
      username: subreddit.invitedModerators[i].userID.username,
      avatar: subreddit.invitedModerators[i].userID.avatar,
      dateOfModeration: subreddit.invitedModerators[i].dateOfModeration,
      permissions: subreddit.invitedModerators[i].permissions,
    });
  }
  if (response.children.length >= 1) {
    if (myStart !== 0) {
      response.before = subreddit.invitedModerators[myStart].userID._id;
    }
    if (neededIndex !== numberOfModerators - 1) {
      response.after = subreddit.invitedModerators[neededIndex - 1].userID._id;
    }
  }
  return response;
}

/**
 * A Service helper function used to get the invited subreddit moderators for the main service function in case of after
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getSubredditInvitedModeratorsAfter(subreddit, limit, after) {
  const response = { children: [] };
  let myLimit;
  const numberOfModerators = subreddit.invitedModerators.length;
  const neededIndex = subreddit.invitedModerators.findIndex(
    (mod) => mod.userID._id.toString() === after
  );
  if (neededIndex === -1) {
    const error = new Error("invalid moderator id");
    error.statusCode = 400;
    throw error;
  }

  if (neededIndex + limit + 1 >= numberOfModerators) {
    myLimit = numberOfModerators;
  } else {
    myLimit = neededIndex + limit + 1;
  }
  for (let i = neededIndex + 1; i < myLimit; i++) {
    response.children.push({
      username: subreddit.invitedModerators[i].userID.username,
      avatar: subreddit.invitedModerators[i].userID.avatar,
      dateOfModeration: subreddit.invitedModerators[i].dateOfModeration,
      permissions: subreddit.invitedModerators[i].permissions,
    });
  }
  if (response.children.length >= 1) {
    if (myLimit !== numberOfModerators) {
      response.after = subreddit.invitedModerators[myLimit - 1].userID._id;
    }
    response.before = subreddit.invitedModerators[neededIndex + 1].userID._id;
  }
  return response;
}

/**
 * A Service function used to get the moderated subreddits for the controller
 * @param {ObjectID} userId the user id
 * @returns {response} the prepared response for the controller
 */
export async function getModeratedSubredditsService(userId) {
  const response = [];
  const user = await User.findById(userId);
  if (!user || user.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  await user.populate("moderatedSubreddits.subredditId");
  for (let i = 0; i < user.moderatedSubreddits.length; i++) {
    if (!user.moderatedSubreddits[i].subredditId.deletedAt) {
      response.push({
        title: user.moderatedSubreddits[i].subredditId.title,
        picture: user.moderatedSubreddits[i].subredditId.picture,
        members: user.moderatedSubreddits[i].subredditId.members,
      });
    }
  }
  return response;
}

/**
 * A Service function used to get the joined subreddits for the controller
 * @param {ObjectID} userId the user id
 * @returns {response} the prepared response for the controller
 */
export async function getJoinedSubredditsService(userId) {
  const response = [];
  const user = await User.findById(userId);
  if (!user || user.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  await user.populate("joinedSubreddits.subredditId");
  for (let i = 0; i < user.joinedSubreddits.length; i++) {
    if (!user.joinedSubreddits[i].subredditId.deletedAt) {
      response.push({
        title: user.joinedSubreddits[i].subredditId.title,
        picture: user.joinedSubreddits[i].subredditId.picture,
        members: user.joinedSubreddits[i].subredditId.members,
      });
    }
  }
  return response;
}

/**
 * A Service function used to get the subreddit approved users for the controller
 * @param {Number} limitReq the limit identified in the request
 * @param {ObjectID} beforeReq Before id
 * @param {ObjectID} afterReq After id
 * @param {Subreddit} subreddit The subreddit object
 * @returns {preparedResponse} the prepared response for the controller
 */
export async function getSubredditApproved(
  limitReq,
  beforeReq,
  afterReq,
  subreddit
) {
  let preparedResponse;
  let limit = prepareLimit(limitReq);
  await subreddit.populate("approvedUsers.userID");
  if (!beforeReq && !afterReq) {
    preparedResponse = getSubredditApprovedFirstTime(subreddit, limit);
  } else if (beforeReq && afterReq) {
    const error = new Error("Can't set before and after");
    error.statusCode = 400;
    throw error;
  } else if (beforeReq) {
    validateId(beforeReq);
    preparedResponse = getSubredditApprovedBefore(subreddit, limit, beforeReq);
  } else {
    validateId(afterReq);
    preparedResponse = getSubredditApprovedAfter(subreddit, limit, afterReq);
  }

  return preparedResponse;
}

/**
 * A Service helper function used to get the subreddit approved for the main service function in case of first time
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
function getSubredditApprovedFirstTime(subreddit, limit) {
  const response = { children: [] };
  const numberOfApproved = subreddit.approvedUsers.length;
  let myLimit;
  if (numberOfApproved > limit) {
    myLimit = limit;
  } else {
    myLimit = numberOfApproved;
  }
  for (let i = 0; i < myLimit; i++) {
    response.children.push({
      username: subreddit.approvedUsers[i].userID.username,
      avatar: subreddit.approvedUsers[i].userID.avatar,
      dateOfApprove: subreddit.approvedUsers[i].dateOfApprove,
    });
  }
  if (myLimit !== numberOfApproved) {
    response.after = subreddit.approvedUsers[myLimit - 1].userID._id;
  }
  return response;
}

/**
 * A Service helper function used to get the subreddit approved users for the main service function in case of before
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getSubredditApprovedBefore(subreddit, limit, before) {
  const response = { children: [] };
  let myStart;
  const numberOfApproved = subreddit.approvedUsers.length;
  const neededIndex = subreddit.approvedUsers.findIndex(
    (mod) => mod.userID._id.toString() === before
  );
  if (neededIndex === -1) {
    const error = new Error("invalid approved id");
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
      username: subreddit.approvedUsers[i].userID.username,
      avatar: subreddit.approvedUsers[i].userID.avatar,
      dateOfApprove: subreddit.approvedUsers[i].dateOfApprove,
    });
  }
  if (response.children.length >= 1) {
    if (myStart !== 0) {
      response.before = subreddit.approvedUsers[myStart].userID._id;
    }
    if (neededIndex !== numberOfApproved - 1) {
      response.after = subreddit.approvedUsers[neededIndex - 1].userID._id;
    }
  }
  return response;
}

/**
 * A Service helper function used to get the subreddit approved users for the main service function in case of after
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getSubredditApprovedAfter(subreddit, limit, after) {
  const response = { children: [] };
  let myLimit;
  const numberOfApproved = subreddit.approvedUsers.length;
  const neededIndex = subreddit.approvedUsers.findIndex(
    (mod) => mod.userID._id.toString() === after
  );
  if (neededIndex === -1) {
    const error = new Error("invalid approved id");
    error.statusCode = 400;
    throw error;
  }

  if (neededIndex + limit + 1 >= numberOfApproved) {
    myLimit = numberOfApproved;
  } else {
    myLimit = neededIndex + limit + 1;
  }
  for (let i = neededIndex + 1; i < myLimit; i++) {
    response.children.push({
      username: subreddit.approvedUsers[i].userID.username,
      avatar: subreddit.approvedUsers[i].userID.avatar,
      dateOfApprove: subreddit.approvedUsers[i].dateOfApprove,
    });
  }
  if (response.children.length >= 1) {
    if (myLimit !== numberOfApproved) {
      response.after = subreddit.approvedUsers[myLimit - 1].userID._id;
    }
    response.before = subreddit.approvedUsers[neededIndex + 1].userID._id;
  }
  return response;
}

/**
 * A Service function used to get the subreddit muted users for the controller
 * @param {Number} limitReq the limit identified in the request
 * @param {ObjectID} beforeReq Before id
 * @param {ObjectID} afterReq After id
 * @param {Subreddit} subreddit The subreddit object
 * @returns {preparedResponse} the prepared response for the controller
 */
export async function getSubredditMuted(
  limitReq,
  beforeReq,
  afterReq,
  subreddit
) {
  let preparedResponse;
  let limit = prepareLimit(limitReq);
  await subreddit.populate("mutedUsers.userID");
  // subreddit.mutedUsers.push({
  //   userID: "63972839aea1062bb18835d4",
  //   dateOfMute: Date.now(),
  // });
  // await subreddit.save();
  if (!beforeReq && !afterReq) {
    preparedResponse = getSubredditMutedFirstTime(subreddit, limit);
  } else if (beforeReq && afterReq) {
    const error = new Error("Can't set before and after");
    error.statusCode = 400;
    throw error;
  } else if (beforeReq) {
    validateId(beforeReq);
    preparedResponse = getSubredditMutedBefore(subreddit, limit, beforeReq);
  } else {
    validateId(afterReq);
    preparedResponse = getSubredditMutedAfter(subreddit, limit, afterReq);
  }

  return preparedResponse;
}

/**
 * A Service helper function used to get the subreddit muted for the main service function in case of first time
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
function getSubredditMutedFirstTime(subreddit, limit) {
  const response = { children: [] };
  const numberOfMuted = subreddit.mutedUsers.length;
  let myLimit;
  if (numberOfMuted > limit) {
    myLimit = limit;
  } else {
    myLimit = numberOfMuted;
  }
  for (let i = 0; i < myLimit; i++) {
    response.children.push({
      username: subreddit.mutedUsers[i].userID.username,
      avatar: subreddit.mutedUsers[i].userID.avatar,
      dateOfMute: subreddit.mutedUsers[i].dateOfMute,
      muteReason: subreddit.mutedUsers[i].muteReason,
    });
  }
  if (myLimit !== numberOfMuted) {
    response.after = subreddit.mutedUsers[myLimit - 1].userID._id;
  }
  return response;
}

/**
 * A Service helper function used to get the subreddit muted users for the main service function in case of before
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getSubredditMutedBefore(subreddit, limit, before) {
  const response = { children: [] };
  let myStart;
  const numberOfMuted = subreddit.mutedUsers.length;
  const neededIndex = subreddit.mutedUsers.findIndex(
    (mod) => mod.userID._id.toString() === before
  );
  if (neededIndex === -1) {
    const error = new Error("invalid muted user  id");
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
      username: subreddit.mutedUsers[i].userID.username,
      avatar: subreddit.mutedUsers[i].userID.avatar,
      dateOfMute: subreddit.mutedUsers[i].dateOfMute,
      muteReason: subreddit.mutedUsers[i].muteReason,
    });
  }
  if (response.children.length >= 1) {
    if (myStart !== 0) {
      response.before = subreddit.mutedUsers[myStart].userID._id;
    }
    if (neededIndex !== numberOfMuted - 1) {
      response.after = subreddit.mutedUsers[neededIndex - 1].userID._id;
    }
  }
  return response;
}

/**
 * A Service helper function used to get the subreddit muted users for the main service function in case of after
 * @param {Subreddit} subreddit The subreddit object
 * @param {Number} limit the limit identified in the request
 * @returns {response} the prepared response for the main service function
 */
// eslint-disable-next-line max-statements
function getSubredditMutedAfter(subreddit, limit, after) {
  const response = { children: [] };
  let myLimit;
  const numberOfMuted = subreddit.mutedUsers.length;
  const neededIndex = subreddit.mutedUsers.findIndex(
    (mod) => mod.userID._id.toString() === after
  );
  if (neededIndex === -1) {
    const error = new Error("invalid muted user id");
    error.statusCode = 400;
    throw error;
  }

  if (neededIndex + limit + 1 >= numberOfMuted) {
    myLimit = numberOfMuted;
  } else {
    myLimit = neededIndex + limit + 1;
  }
  for (let i = neededIndex + 1; i < myLimit; i++) {
    response.children.push({
      username: subreddit.mutedUsers[i].userID.username,
      avatar: subreddit.mutedUsers[i].userID.avatar,
      dateOfMute: subreddit.mutedUsers[i].dateOfMute,
      muteReason: subreddit.mutedUsers[i].muteReason,
    });
  }
  if (response.children.length >= 1) {
    if (myLimit !== numberOfMuted) {
      response.after = subreddit.mutedUsers[myLimit - 1].userID._id;
    }
    response.before = subreddit.mutedUsers[neededIndex + 1].userID._id;
  }
  return response;
}

/**
 * A Service function used to get the subreddit post settings
 * @param {Subreddit} subreddit The subreddit object
 * @returns {response} the prepared response for the controller
 */
export function getSubredditPostSettingsService(subreddit) {
  return {
    enableSpoiler: subreddit.subredditPostSettings.enableSpoiler,
    suggestedSort: subreddit.subredditPostSettings.suggestedSort,
    allowImagesInComment: subreddit.subredditPostSettings.allowImagesInComment,
  };
}

/**
 * A Service function used to set the subreddit post settings
 * @param {Subreddit} subreddit The subreddit object
 * @returns {void}
 */
export async function setSubredditPostSettingsService(
  subreddit,
  enableSpoiler,
  suggestedSort,
  allowImagesInComment
) {
  subreddit.subredditPostSettings.enableSpoiler = enableSpoiler;
  subreddit.subredditPostSettings.suggestedSort = suggestedSort;
  subreddit.subredditPostSettings.allowImagesInComment = allowImagesInComment;
  await subreddit.save();
}

/**
 * Function used to get the traffic stats of a certain sureddit, and also check that the user
 * requesting is the owner of a moderator of this subreddit.
 *
 * @param {Object} user User object that who request to see the traffic
 * @param {Object} subreddit Subreddit Object that we need to get its traffic stats
 * @returns {Object} The response to that request containing [statusCode, data]
 */
export async function getTrafficService(user, subreddit) {
  const mod = checkIfModerator(user._id, subreddit);
  if (mod === -1) {
    let error = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  const day = new Date().setDate(new Date().getDate() - 1);
  const week = new Date().setDate(new Date().getDate() - 7);
  const month = new Date().setMonth(new Date().getMonth() - 1);

  // get number of joined users last day, last week, and last month
  let joinedLastDay = 0,
    joinedLastWeek = 0,
    joinedLastMonth = 0;

  subreddit.joinedUsers.forEach((el) => {
    if (el.joinDate > day) {
      joinedLastDay++;
    }
    if (el.joinDate > week) {
      joinedLastWeek++;
    }
    if (el.joinDate > month) {
      joinedLastMonth++;
    }
  });

  // get number of left users last day, last week, and last month
  let leftLastDay = 0,
    leftLastWeek = 0,
    leftLastMonth = 0;

  subreddit.leftUsers.forEach((el) => {
    if (el.leaveDate > day) {
      leftLastDay++;
    }
    if (el.leaveDate > week) {
      leftLastWeek++;
    }
    if (el.leaveDate > month) {
      leftLastMonth++;
    }
  });
  return {
    statusCode: 200,
    data: {
      numberOfJoinedLastDay: joinedLastDay,
      numberOfJoinedLastWeek: joinedLastWeek,
      numberOfJoinedLastMonth: joinedLastMonth,
      numberOfLeftLastDay: leftLastDay,
      numberOfLeftLastWeek: leftLastWeek,
      numberOfLeftLastMonth: leftLastMonth,
    },
  };
}
