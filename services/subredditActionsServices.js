import Subreddit from "../models/Community.js";
import { addMessage, validateMessage } from "./messageServices.js";

/**
 * Function used to check that a subreddit with that name exists and return its object
 *
 * @param {String} subredditName Name of the subreddit to return
 * @returns {Object} Subreddit object that was found
 */
export async function getSubredditService(subredditName) {
  const subreddit = await Subreddit.findOne({
    title: subredditName,
    deletedAt: null,
  });
  if (!subreddit) {
    let error = new Error("Can not find subreddit with that name");
    error.statusCode = 404;
    throw error;
  }
  return subreddit;
}

/**
 * Function used to check if the user is a moderator to that subreddit.
 * It throw an error if he was not a moderator.
 *
 * @param {Object} userId User id to check if he is a moderator to the subreddit
 * @param {Object} subreddit Subreddit object
 * @returns {Number} Index of the moderator in subreddit.moderators array, -1 if none
 */
export function checkIfModerator(userId, subreddit) {
  // check if user is moderator in the subreddit
  const index = subreddit.moderators.findIndex(
    (elem) => elem.userID.toString() === userId.toString()
  );
  return index;
}

/**
 * Function used to check if the user is banned from that subreddit.
 * It checks if the ban period is done to remove that user from the ban list of that subreddit.
 *
 * @param {Object} userId User id to check if he is banned from that subreddit
 * @param {Object} subreddit Subreddit object
 * @returns {Boolean} True if the user was banned from that subreddit, false otherwise
 */
export async function checkIfBanned(userId, subreddit) {
  // check if user is banned from that subreddit
  const index = subreddit.bannedUsers.findIndex(
    (elem) => elem.userId.toString() === userId.toString()
  );
  if (index !== -1) {
    // check for the period
    const banDate = new Date(subreddit.bannedUsers[index].bannedAt);
    banDate.setDate(banDate.getDate() + subreddit.bannedUsers[index].banPeriod);
    if (banDate > Date.now()) {
      return true;
    } else {
      // remove the user from banned list
      subreddit.bannedUsers.splice(index, 1);
      await subreddit.save();
    }
  }
  return false;
}

/**
 * Function used to check if the user is muted in this subreddit.
 *
 * @param {Object} userId User id to check if he is muted in this subreddit
 * @param {Object} subreddit Subreddit object
 * @returns {Boolean} True if the user was muted from that subreddit, false otherwise
 */
export function checkIfMuted(userId, subreddit) {
  // check if user is banned from that subreddit
  const index = subreddit.mutedUsers.findIndex(
    (elem) => elem.userID.toString() === userId.toString()
  );
  return index !== -1;
}

/**
 * Function used to ban a user from a certain subreddit. It checks if [moderator] is a moderator of
 * the wanted subreddit. It also checks if the user was banned before in the same subreddit.
 *
 * @param {Object} moderator Moderator object of the subreddit
 * @param {Object} userToBan User object that we want to ban
 * @param {Object} subreddit Subreddit object
 * @param {Object} data Request body containing [banPeriod, reasonForBan, modNote, noteInclude]
 * @returns The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function banUserService(moderator, userToBan, subreddit, data) {
  const mod = checkIfModerator(moderator._id, subreddit);
  if (mod === -1) {
    let error = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  // make sure that the moderator is not trying to ban himself
  if (moderator._id.toString() === userToBan._id.toString()) {
    let error = new Error("User can not ban himself");
    error.statusCode = 400;
    throw error;
  }

  // make sure that this user has not been blocked before
  const foundUser = subreddit.bannedUsers.findIndex(
    (elem) => elem.userId.toString() === userToBan._id.toString()
  );
  if (foundUser === -1) {
    const bannedUser = {
      username: userToBan.username,
      userId: userToBan._id,
      banPeriod: data.banPeriod,
      bannedAt: Date.now(),
      reasonForBan: data.reasonForBan,
      modNote: data.modNote,
      noteInclude: data.noteInclude,
    };

    subreddit.bannedUsers.push(bannedUser);
    await subreddit.save();
  } else {
    // user was blocked before and need to edit his data
    subreddit.bannedUsers[foundUser].banPeriod = data.banPeriod;
    subreddit.bannedUsers[foundUser].reasonForBan = data.reasonForBan;
    subreddit.bannedUsers[foundUser].modNote = data.modNote;
    subreddit.bannedUsers[foundUser].noteInclude = data.noteInclude;
    await subreddit.save();
  }

  return {
    statusCode: 200,
    message: "User banned successfully",
  };
}

/**
 * Function used to unban a user from a certain subreddit. It checks if [moderator] is a moderator of
 * the wanted subreddit.
 *
 * @param {Object} moderator Moderator object of the subreddit
 * @param {Object} userToBan User object that we want to ban
 * @param {Object} subreddit Subreddit object
 * @returns The response to that request containing [statusCode, data]
 */
export async function unbanUserService(moderator, userToBan, subreddit) {
  const mod = checkIfModerator(moderator._id, subreddit);
  if (mod === -1) {
    let error = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  const foundUserIndex = subreddit.bannedUsers.findIndex(
    (elem) => elem.userId.toString() === userToBan._id.toString()
  );
  if (foundUserIndex !== -1) {
    subreddit.bannedUsers.splice(foundUserIndex, 1);
    await subreddit.save();
  }

  return {
    statusCode: 200,
    message: "User unbanned successfully",
  };
}

/**
 * Function used to map the permissions object into array of string permissions
 *
 * @param {Object} data Permissions that was sent in the request body
 * @returns {Array} Array of permissions
 */
function extractPermissions(data) {
  let permissions = [];
  if (data.permissionToEverything) {
    permissions.push("Everything");
  } else {
    if (data.permissionToManageUsers) {
      permissions.push("Manage Users");
    }
    if (data.permissionToManageSettings) {
      permissions.push("Manage Settings");
    }
    if (data.permissionToManageFlair) {
      permissions.push("Manage Flair");
    }
    if (data.permissionToManagePostsComments) {
      permissions.push("Manage Posts & Comments");
    }
  }
  return permissions;
}

/**
 * Function used to invite a user to be a moderator to that subreddit by adding that user
 * to invitedModerators array of the subreddit object and prepare the permissions array.
 * It checks if [moderator] is a moderator of the wanted subreddit.
 *
 * @param {Object} moderator Moderator object of the subreddit
 * @param {Object} userToInvite User object that we want to invite
 * @param {Object} subreddit Subreddit object
 * @param {Object} data Request body containing all permissions
 * @returns The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function inviteToModerateService(
  moderator,
  userToInvite,
  subreddit,
  data
) {
  const mod = checkIfModerator(moderator._id, subreddit);
  if (mod === -1) {
    let error = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  // check if user is already a moderator
  const userMod = checkIfModerator(userToInvite._id, subreddit);
  if (userMod !== -1) {
    // edit his permissions
    const permissions = extractPermissions(data);
    subreddit.moderators[userMod].permissions = permissions;
    await subreddit.save();

    return {
      statusCode: 200,
      message: "Moderator's permissions edited successfully",
    };
  }

  // check if user was invited before
  const foundUserIndex = subreddit.invitedModerators.findIndex(
    (elem) => elem.userID.toString() === userToInvite._id.toString()
  );
  if (foundUserIndex === -1) {
    const permissions = extractPermissions(data);

    subreddit.invitedModerators.push({
      userID: userToInvite._id,
      permissions: permissions,
      dateOfInvitation: Date.now(),
    });
    await subreddit.save();

    // Send a message to the invited user from the subreddit
    const req = {
      payload: {
        username: moderator.username,
      },
      body: {
        subject: `invitation to moderate /r/${subreddit.title}`,
        subredditName: subreddit.title,
        senderUsername: `/u/${moderator.username}`,
        receiverUsername: `/u/${userToInvite.username}`,
        // eslint-disable-next-line max-len
        text: `gadzooks! you are invited to become a moderator of /r/${subreddit.title}! to accept, visit the moderators page for /r/${subreddit.title} and click "accept". otherwise, if you did not expect to receive this, you can simply ignore this invitation or report it.`,
      },
    };
    await validateMessage(req);
    await addMessage(req);
  }

  return {
    statusCode: 200,
    message: "Invitation sent successfully",
  };
}

/**
 * Function used to cancel the moderation invitation to a user for a certain subreddit by removing him
 * from the invitedModerators array of that subreddit.
 * It checks if [moderator] is a moderator of the wanted subreddit.
 *
 * @param {Object} moderator Moderator object of the subreddit
 * @param {Object} invitedUser User object that we want to cancel his invitation
 * @param {Object} subreddit Subreddit object
 * @returns The response to that request containing [statusCode, data]
 */
export async function cancelInvitationService(
  moderator,
  invitedUser,
  subreddit
) {
  const mod = checkIfModerator(moderator._id, subreddit);
  if (mod === -1) {
    let error = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  const foundUserIndex = subreddit.invitedModerators.findIndex(
    (elem) => elem.userID.toString() === invitedUser._id.toString()
  );
  if (foundUserIndex !== -1) {
    subreddit.invitedModerators.splice(foundUserIndex, 1);
    await subreddit.save();
  }

  return {
    statusCode: 200,
    message: "Invitation canceled successfully",
  };
}

/**
 * Function used to accept the invitation to be a moderator in a subreddit.
 * It checks if user is already a moderator in that subreddit, else it removes him from
 * invited moderators and add him to moderators arry in that subreddit
 * It checks if [moderator] is a moderator of the wanted subreddit.
 *
 * @param {Object} user User object that was invited to be a moderator
 * @param {Object} subreddit Subreddit object
 * @returns The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function acceptModerationInviteService(user, subreddit) {
  // check if user is already a moderator
  const userMod = checkIfModerator(user._id, subreddit);
  if (userMod !== -1) {
    let error = new Error("User is already a moderator in that subreddit");
    error.statusCode = 400;
    throw error;
  }

  // removed the user from invited moderators and add him to moderators
  const invitedUserIndex = subreddit.invitedModerators.findIndex(
    (elem) => elem.userID.toString() === user._id.toString()
  );
  if (invitedUserIndex === -1) {
    let error = new Error(
      "User was not invited to be a moderator in that subreddit"
    );
    error.statusCode = 401;
    throw error;
  }

  subreddit.moderators.push({
    userID: user._id,
    permissions: subreddit.invitedModerators[invitedUserIndex].permissions,
    dateOfModeration: Date.now(),
  });

  subreddit.invitedModerators.splice(invitedUserIndex, 1);
  await subreddit.save();

  // Send a message to the invited user from the subreddit
  const req = {
    payload: {
      username: user.username,
    },
    body: {
      subject: "moderator added",
      subredditName: subreddit.title,
      senderUsername: `/u/${user.username}`,
      receiverUsername: `/r/${subreddit.title}`,
      // eslint-disable-next-line max-len
      text: `/u/${user.username} has accepted an invitation to become moderator if /r/${subreddit.title}`,
    },
  };
  await validateMessage(req);
  await addMessage(req);

  return {
    statusCode: 200,
    message: "Invitation accepted successfully",
  };
}

/**
 * Function used to remove a user from the moderators array of a subreddit and also
 * check if the user was not a moderator at first place.
 *
 * @param {Object} user User that want to leave the moderation
 * @param {Object} subreddit Subreddit object
 * @returns The response to that request containing [statusCode, data]
 */
export async function leaveModerationService(user, subreddit) {
  // check if user is the owner
  if (subreddit.owner.userID.toString() === user._id.toString()) {
    let error = new Error(
      "Owner can not leave the moderation of the subreddit"
    );
    error.statusCode = 400;
    throw error;
  }
  // check if user is already a moderator
  const modUserIndex = subreddit.moderators.findIndex(
    (elem) => elem.userID.toString() === user._id.toString()
  );

  if (modUserIndex === -1) {
    let error = new Error("User is not a moderator in that subreddit");
    error.statusCode = 401;
    throw error;
  }

  // removed the user from moderators
  subreddit.moderators.splice(modUserIndex, 1);
  await subreddit.save();

  return {
    statusCode: 200,
    message: "Moderation has been successfully left",
  };
}
