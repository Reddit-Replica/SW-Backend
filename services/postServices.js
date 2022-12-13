import Post from "../models/Post.js";
import Subreddit from "../models/Community.js";

/**
 * A function used to check if the owner user is trying to edit the post and throws an error if another user is trying to edit that post
 * @param {ObjectID} postId Request object
 * @param {ObjectID} userId Request object
 * @returns {neededPost} the needed post to edit is all checks succeeded to help the next service
 */
export async function checkSameUserEditing(postId, userId) {
  const neededPost = await Post.findById(postId);
  if (!neededPost || neededPost.deletedAt) {
    const error = new Error("Post is not found");
    error.statusCode = 404;
    throw error;
  }
  if (neededPost.ownerId.toString() !== userId) {
    const error = new Error("User not allowed to edit this post");
    error.statusCode = 401;
    throw error;
  }
  if (neededPost.kind !== "hybrid") {
    const error = new Error("Not allowed to edit this post");
    error.statusCode = 400;
    throw error;
  }
  return neededPost;
}

/**
 * A function used to edit the post and add the post tothe subreddit edited posts if the post belongs to a subreddit
 * @param {post} post Request object
 * @param {string} postContent Request object
 * @returns {void} the needed post to edit is all checks succeeded to help the next service
 */
export async function editPostService(post, postContent) {
  const subreddit = post.subredditName;
  const subbredditObject = await Subreddit.findOne({
    title: subreddit,
    deletedAt: null,
  });
  if (!subbredditObject) {
    const error = new Error("Subreddit not found!");
    error.statusCode = 404;
    throw error;
  }
  post.content = postContent;
  post.editedAt = Date.now();
  if (subreddit) {
    const postIndex = subbredditObject.editedPosts.findIndex(
      (postId) => postId.toString() === post._id.toString()
    );
    if (postIndex === -1) {
      subbredditObject.editedPosts.push(post._id);
      await subbredditObject.save();
    }
  }
  await post.save();
}
