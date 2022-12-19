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
      let fav = false;

      const index = user.favoritesSubreddits.findIndex(
        (subredditElement) =>
          subredditElement.subredditId.toString() ===
          user.moderatedSubreddits[i].subredditId._id.toString()
      );

      if (index !== -1) {
        fav = true;
      }

      response.push({
        title: user.moderatedSubreddits[i].subredditId.title,
        picture: user.moderatedSubreddits[i].subredditId.picture,
        members: user.moderatedSubreddits[i].subredditId.members,
        isFavorite: fav,
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
      let fav = false;

      const index = user.favoritesSubreddits.findIndex(
        (subredditElement) =>
          subredditElement.subredditId.toString() ===
          user.joinedSubreddits[i].subredditId._id.toString()
      );

      if (index !== -1) {
        fav = true;
      }

      response.push({
        title: user.joinedSubreddits[i].subredditId.title,
        picture: user.joinedSubreddits[i].subredditId.picture,
        members: user.joinedSubreddits[i].subredditId.members,
        isFavorite: fav,
      });
    }
  }
  return response;
}

/**
 * A Service function used to get the Favorite subreddits for the controller
 * @param {ObjectID} userId the user id
 * @returns {response} the prepared response for the controller
 */
export async function getFavoriteSubredditsService(userId) {
  const response = [];
  const user = await User.findById(userId);
  if (!user || user.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  await user.populate("favoritesSubreddits.subredditId");
  for (let i = 0; i < user.favoritesSubreddits.length; i++) {
    if (!user.favoritesSubreddits[i].subredditId.deletedAt) {
      response.push({
        title: user.favoritesSubreddits[i].subredditId.title,
        picture: user.favoritesSubreddits[i].subredditId.picture,
        members: user.favoritesSubreddits[i].subredditId.members,
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
// eslint-disable-next-line max-statements
export async function getTrafficService(user, subreddit) {
  const mod = checkIfModerator(user._id, subreddit);
  if (mod === -1) {
    let error = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  // prepare the days array
  let days = [];
  for (let i = 0; i < 31; i++) {
    days.push({
      day: new Date(new Date().setDate(new Date().getDate() - i)),
      numberOfJoined: 0,
      numberOfLeft: 0,
    });
  }

  // sunday => 0
  const daysName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weeks = [];
  for (let i = 0; i < 7; i++) {
    weeks.push({
      day: daysName[
        new Date(new Date().setDate(new Date().getDate() - i)).getDay()
      ],
      numberOfJoined: 0,
    });
  }

  // jan => 0
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let months = [];
  let monthIntervals = [];
  for (let i = 0; i < 12; i++) {
    months.push({
      month:
        monthNames[
          new Date(new Date().setMonth(new Date().getMonth() - i)).getMonth()
        ],
      numberOfJoined: 0,
    });

    monthIntervals.push({
      start: new Date(
        new Date(new Date().setMonth(new Date().getMonth() - i)).setDate(1)
      ),
      end: new Date(
        new Date(new Date().setMonth(new Date().getMonth() - i)).setDate(31)
      ),
    });
  }

  const day = new Date().setDate(new Date().getDate() - 1);
  const week = new Date().setDate(new Date().getDate() - 7);
  const month = new Date().setMonth(new Date().getMonth() - 1);

  // get number of joined users last day, last week, and last month
  let joinedLastDay = 0,
    joinedLastWeek = 0,
    joinedLastMonth = 0;

  const weekDaysStart = new Date(new Date().setDate(new Date().getDate() - 7));
  const weekDaysEnd = new Date();
  const daysStart = new Date(new Date().setDate(new Date().getDate() - 31));
  const daysEnd = new Date();

  // eslint-disable-next-line max-statements
  subreddit.joinedUsers.forEach((el) => {
    const joinDate = new Date(el.joinDate);

    // extract the days array => [today => today - 30]
    if (joinDate >= daysStart && joinDate <= daysEnd) {
      if (new Date().getDate() - joinDate.getDate() < 0) {
        days[30 + (new Date().getDate() - joinDate.getDate())].numberOfJoined++;
      } else {
        days[new Date().getDate() - joinDate.getDate()].numberOfJoined++;
      }
    }

    // extract the week days => [today => today - 7]
    if (joinDate >= weekDaysStart && joinDate <= weekDaysEnd) {
      if (new Date().getDay() - joinDate.getDay() < 0) {
        weeks[7 + (new Date().getDay() - joinDate.getDay())].numberOfJoined++;
      } else {
        weeks[new Date().getDay() - joinDate.getDay()].numberOfJoined++;
      }
    }

    // extract the months => [this month => this month - 12]
    for (const i in monthIntervals) {
      if (
        joinDate >= monthIntervals[i].start &&
        joinDate <= monthIntervals[i].end
      ) {
        if (new Date().getMonth() - joinDate.getMonth() < 0) {
          months[12 + (new Date().getMonth() - joinDate.getMonth())]
            .numberOfJoined++;
        } else {
          months[new Date().getMonth() - joinDate.getMonth()].numberOfJoined++;
        }
        break;
      }
    }

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
    const leaveDate = new Date(el.leaveDate);

    // extract the days array => [today => today - 30]
    if (leaveDate >= daysStart && leaveDate <= daysEnd) {
      if (new Date().getDate() - leaveDate.getDate() < 0) {
        days[30 + (new Date().getDate() - leaveDate.getDate())].numberOfLeft++;
      } else {
        days[new Date().getDate() - leaveDate.getDate()].numberOfLeft++;
      }
    }
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
      days: days,
      weeks: weeks,
      months: months,
    },
  };
}
