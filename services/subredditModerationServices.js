import { prepareLimit } from "../utils/prepareLimit.js";
import { validateId } from "./subredditFlairs.js";
import Subreddit from "../models/Community.js";
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
