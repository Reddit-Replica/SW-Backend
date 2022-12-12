import Subreddit from "../models/Community.js";

/**
 * This function removes a post from the list of unmoderated posts in a subreddit and adds
 * it to spammed posts if the type is "spam"
 * @param {string} id Post ID
 * @param {string} type Type of moderation
 * @param {string} subredditName Title of the subreddit
 * @returns {void}
 */
export async function markPostAsModerated(id, subredditName, type) {
  const subreddit = await Subreddit.findOne({ title: subredditName });
  subreddit.unmoderatedPosts = subreddit.unmoderatedPosts.filter(
    (postId) => postId.toString() !== id.toString()
  );
  if (type === "spam") {
    subreddit.spammedPosts.push(id.toString());
  } else if (type === "approve") {
    subreddit.spammedPosts = subreddit.spammedPosts.filter(
      (postId) => postId.toString() !== id.toString()
    );
  }
  await subreddit.save();
}

/**
 * This function adds a comment to the list of spammed comments in the
 * subreddit
 * @param {string} id Comment ID
 * @param {string} subredditName Title of the subreddit
 * @returns {void}
 */
export async function addToSpammedComments(id, subredditName) {
  const subreddit = await Subreddit.findOne({ title: subredditName });
  subreddit.spammedComments.push(id.toString());
  await subreddit.save();
}

/**
 * This function removes a comment from the list of spammed comments in the
 * subreddit
 * @param {string} id Comment ID
 * @param {string} subredditName Title of the subreddit
 * @returns {void}
 */
export async function removeFromSpammedComments(id, subredditName) {
  const subreddit = await Subreddit.findOne({ title: subredditName });
  subreddit.spammedComments = subreddit.spammedComments.filter(
    (commentId) => commentId.toString() !== id.toString()
  );
  await subreddit.save();
}

/**
 * This function checks if a user already exists in the subreddit's
 * list of approved users and adds it if not. It also adds the subreddit
 * to the user's list of joined subreddits
 * @param {object} subreddit Subreddit object
 * @param {object} user User object
 * @returns {void}
 */
export async function addToApprovedUsers(subreddit, user) {
  if (
    subreddit.approvedUsers.find(
      (approvedUser) => approvedUser.userID.toString() === user.id.toString()
    )
  ) {
    const error = new Error("This user is already approved");
    error.statusCode = 400;
    throw error;
  }
  subreddit.approvedUsers.push({
    userID: user.id,
    dateOfApprove: Date.now(),
  });
  await subreddit.save();
  if (!user.joinedSubreddits.find((sr) => sr.name === subreddit.title)) {
    user.joinedSubreddits.push({
      subredditId: subreddit.id,
      name: subreddit.title,
    });
    await user.save();
  }
}

/**
 * This function checks if a user already exists in the subreddit's
 * list of muted users and adds it if not.
 * @param {object} subreddit Subreddit object
 * @param {object} user User object
 * @returns {void}
 */
export async function addToMutedUsers(subreddit, user, muteReason) {
  if (
    subreddit.mutedUsers.find(
      (mutedUser) => mutedUser.userID.toString() === user.id.toString()
    )
  ) {
    const error = new Error("This user is already muted");
    error.statusCode = 400;
    throw error;
  }
  subreddit.mutedUsers.push({
    userID: user.id,
    dateOfMute: Date.now(),
    muteReason: muteReason,
  });
  await subreddit.save();
}
