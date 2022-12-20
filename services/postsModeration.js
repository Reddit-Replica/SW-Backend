import Subreddit from "../models/Community.js";
import { addMessage } from "./messageServices.js";

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
export async function addToApprovedUsers(subreddit, user, payload) {
  if (!user.joinedSubreddits.find((sr) => sr.name === subreddit.title)) {
    user.joinedSubreddits.push({
      subredditId: subreddit.id,
      name: subreddit.title,
    });
    await user.save();
  }
  if (
    !subreddit.joinedUsers.find(
      (jUser) => jUser.userId.toString() === user.id.toString()
    )
  ) {
    subreddit.joinedUsers.push({
      userId: user.id,
      joinDate: Date.now(),
    });
    await subreddit.save();
  }
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
  await addMessage({
    msg: {
      subredditName: subreddit.title,
      createdAt: Date.now(),
      receiverId: user.id,
      receiverUsername: user.username,
      senderUsername: payload.username,
      isSenderUser: true,
      isReceiverUser: true,
      subject: "You are an approved user",
      // eslint-disable-next-line max-len
      text: `You have been added as an approved user to /r/${subreddit.title}: ${subreddit.viewName}`,
    },
  });
  await subreddit.save();
}

/**
 * This function checks if a user is already removed from the subreddit's
 * list of approved users and removes it if not. It also removes the subreddit from
 * user's list of joined subreddits
 * @param {object} subreddit Subreddit object
 * @param {object} user User object
 * @returns {void}
 */
export async function removeFromApprovedUsers(subreddit, user) {
  if (subreddit.type === "Private") {
    user.joinedSubreddits = user.joinedSubreddits.filter(
      (sr) => sr.name !== subreddit.title
    );
    subreddit.joinedUsers = subreddit.joinedUsers.filter(
      (jUser) => jUser.userId.toString() !== user.id.toString()
    );
    subreddit.mutedUsers = subreddit.mutedUsers.filter(
      (mutedUser) => mutedUser.userID.toString() !== user.id.toString()
    );
    await user.save();
    await subreddit.save();
  }
  if (
    !subreddit.approvedUsers.find(
      (approvedUser) => approvedUser.userID.toString() === user.id.toString()
    )
  ) {
    const error = new Error("This user is already removed");
    error.statusCode = 400;
    throw error;
  }
  subreddit.approvedUsers = subreddit.approvedUsers.filter(
    (approvedUser) => approvedUser.userID.toString() !== user.id.toString()
  );
  await subreddit.save();
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

/**
 * This function removes a user from the subreddit's list of muted users
 * @param {object} subreddit Subreddit object
 * @param {object} user User object
 * @returns {void}
 */
export async function removeFromMutedUsers(subreddit, user) {
  if (
    !subreddit.mutedUsers.find(
      (mutedUser) => mutedUser.userID.toString() === user.id.toString()
    )
  ) {
    const error = new Error("This user is already unmuted");
    error.statusCode = 400;
    throw error;
  }
  subreddit.mutedUsers = subreddit.mutedUsers.filter(
    (mutedUser) => mutedUser.userID.toString() !== user.id.toString()
  );
  await subreddit.save();
}

/**
 * This function checks if a user is in the given subreddit
 * @param {object} subreddit Subreddit object
 * @param {object} user User object
 * @returns {void}
 */
export function checkUserInSubreddit(subreddit, user) {
  if (!user.joinedSubreddits.find((sr) => sr.name === subreddit.title)) {
    const error = new Error("This user is not a member of " + subreddit.title);
    error.statusCode = 400;
    throw error;
  }
}
