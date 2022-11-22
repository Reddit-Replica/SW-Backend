import Subreddit from "../models/Community.js";

/**
 * This function removes a post from the list of unmoderated posts in a subreddit.
 * @param {string} id Post ID
 * @param {string} subredditName Title of the subreddit
 * @returns {void}
 */
export async function markPostAsModerated(id, subredditName) {
  const subreddit = await Subreddit.findOne({ title: subredditName });
  subreddit.unmoderatedPosts = subreddit.unmoderatedPosts.filter(
    (postId) => postId.toString() !== id.toString()
  );
  await subreddit.save();
}
