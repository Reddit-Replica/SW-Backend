import Post from "../models/Post.js";
import Subreddit from "../models/Community.js";

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
