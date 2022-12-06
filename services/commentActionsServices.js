import User from "../models/User.js";
import Comment from "../models/Comment.js";

async function validateExistingComment(commentId) {
  const neededComment = await Comment.findById(commentId);
  if (!neededComment || neededComment.deletedAt) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }
  return neededComment;
}

export async function addToUserFollowedComments(userId, commentId) {
  const neededUser = await User.findById(userId);
  const neededComment = await validateExistingComment(commentId);
  const comment = neededUser.followedComments.find(
    (comment) => comment.toString() === commentId
  );
  if (comment) {
    const error = new Error("You are following this comment");
    error.statusCode = 400;
    throw error;
  }
  neededUser.followedComments.push(commentId);
  await neededUser.save();
  return { comment: neededComment, user: neededUser };
}

export async function addToCommentFollowedUsers(user, comment) {
  comment.followingUsers.push({
    username: user.username,
    userId: user._id,
  });
  await comment.save();
}
