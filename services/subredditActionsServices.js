import Subreddit from "../models/Community.js";

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
