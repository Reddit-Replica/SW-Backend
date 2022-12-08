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
 * Function used to ban a user from a certain subreddit. It checks if [moderator] is a moderator of
 * the wanted subreddit. It also checks if the user was banned before in the same subreddit.
 *
 * @param {Object} moderator Moderator object of the subreddit
 * @param {Object} userToBan User object that we want to ban
 * @param {Object} subreddit Subreddit object
 * @param {Object} data Request body containing [banPeriod, reasonForBan, modNote, noteInclude]
 * @returns The response to that request containing [statusCode, data]
 */
export async function banUserService(moderator, userToBan, subreddit, data) {
  // check if user is moderator in the subreddit
  const index = subreddit.moderators.findIndex(
    (elem) => elem.userID.toString() === moderator._id.toString()
  );
  if (index === -1) {
    let error = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  // make sure that this user has not been blocked before
  const foundUser = subreddit.bannedUsers.findIndex((elem) => {
    console.log(elem);
    return elem.userId.toString() === userToBan._id.toString();
  });
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
  }

  return {
    statusCode: 200,
    message: "User banned successfully",
  };
}
