import User from "../models/User.js";
import Comment from "../models/Comment.js";

/**
 * A function used to validate the comment and check if that comment exists and throws error if the comment is not found and returns the comment if it exists
 * @param {ObjectId} commentId the id of the comment
 * @returns {Comment} the neededComment
 */
async function validateExistingComment(commentId) {
  const neededComment = await Comment.findById(commentId);
  if (!neededComment || neededComment.deletedAt) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }
  return neededComment;
}

/**
 * A function used to add the comment to the user followed comments
 * @param {ObjectId} userId the id of the user
 * @param {ObjectId} commentId the id of the comment
 * @returns {Object} the neededComment and user to make the next step easier
 */
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

/**
 * A function used to add the user to the comment following users
 * @param {User} user that specific user
 * @param {Comment} comment that specific comment
 * @returns {void}
 */
export async function addToCommentFollowedUsers(user, comment) {
  comment.followingUsers.push({
    username: user.username,
    userId: user._id,
  });
  await comment.save();
}


/**
 * A function used to remove the comment from the user followed comments
 * @param {ObjectId} userId the id of the user
 * @param {ObjectId} commentId the id of the comment
 * @returns {Object} the neededComment and user to make the next step easier
 */
export async function removeFromUserFollowedComments(userId, commentId) {
  const neededUser = await User.findById(userId);
  const neededComment = await validateExistingComment(commentId);
  const commentIndex = neededUser.followedComments.findIndex(
    (comment) => comment.toString() === commentId
  );
  if (commentIndex === -1) {
    const error = new Error("You are not following this comment");
    error.statusCode = 400;
    throw error;
  }
  neededUser.followedComments.splice(commentIndex, 1);
  await neededUser.save();
  return { comment: neededComment, user: neededUser };
}


/**
 * A function used to remove the user from the comment following users
 * @param {User} user that specific user
 * @param {Comment} comment that specific comment
 * @returns {void}
 */
export async function removeFromCommentFollowedUsers(user, comment) {
  const userIndex = comment.followingUsers.findIndex(
    (userItem) => userItem.userId.toString() === user._id.toString()
  );
  comment.followingUsers.splice(userIndex, 1);
  await comment.save();
}
