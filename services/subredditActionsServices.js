import Subreddit from "../models/Community.js";

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
    error.statusCode = 400;
    throw error;
  }
  return subreddit;
}

/**
 * Function used to check if the user is a moderator to that subreddit.
 * It throw an error if he was not a moderator.
 *
 * @param {Object} user User to check if he is a moderator to the subreddit
 * @param {Object} subreddit Subreddit object
 */
function checkIfModerator(user, subreddit) {
  // check if user is moderator in the subreddit
  const index = subreddit.moderators.findIndex(
    (elem) => elem.userID.toString() === user._id.toString()
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
  const mod = checkIfModerator(moderator, subreddit);
  if (!mod) {
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
  const mod = checkIfModerator(moderator, subreddit);
  if (!mod) {
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
  const mod = checkIfModerator(moderator, subreddit);
  if (!mod) {
    let error = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  // check if user is already a moderator
  const userMod = checkIfModerator(userToInvite, subreddit);
  if (userMod) {
    let error = new Error("User is already a moderator in that subreddit");
    error.statusCode = 400;
    throw error;
  }

  // check if user was invited before
  const foundUserIndex = subreddit.invitedModerators.findIndex(
    (elem) => elem.userID.toString() === userToInvite._id.toString()
  );
  if (foundUserIndex === -1) {
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

    subreddit.invitedModerators.push({
      userID: userToInvite._id,
      permissions: permissions,
    });
    await subreddit.save();
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
  const mod = checkIfModerator(moderator, subreddit);
  if (!mod) {
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
 *
 * It checks if [moderator] is a moderator of the wanted subreddit.
 *
 * @param {Object} user User object that was invited to be a moderator
 * @param {Object} subreddit Subreddit object
 * @returns The response to that request containing [statusCode, data]
 */
export async function acceptModerationInviteService(user, subreddit) {
  // check if user is already a moderator
  const userMod = checkIfModerator(user, subreddit);
  if (userMod) {
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
  });

  subreddit.invitedModerators.splice(invitedUserIndex, 1);

  await subreddit.save();

  return {
    statusCode: 200,
    message: "Invitation accepted successfully",
  };
}
