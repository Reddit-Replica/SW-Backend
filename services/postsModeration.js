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
