import Post from "./../models/Post.js";
import Comment from "../models/Comment.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";
import { checkPostId, checkCommentId } from "./commentServices.js";

/**
 * Function used to delete the post and all of its comments.
 * It also check if the user trying to delete the post is not the owner of the post.
 *
 * @param {String} userId User id (owner of the post)
 * @param {String} postId Post id that we want to delete
 */
async function deletePost(userId, postId) {
  const post = await checkPostId(postId);

  // check if the user trying to delete the post is not the owner of the post
  if (post.ownerId.toString() !== userId.toString()) {
    let error = new Error("Unauthorized to delete this post");
    error.statusCode = 401;
    throw error;
  }

  // delete all comments to that post
  await Comment.updateMany(
    { postId: post.id },
    { $set: { deletedAt: Date.now() } }
  );

  // delete the post itself
  post.deletedAt = Date.now();
  await post.save();
}

/**
 * Function used to delete all the children of a comment recursively.
 * It deletes the children of the comment at all levels.
 *
 * @param {Array} children Array of comments that we want to delete
 * @returns {Number} Number of deleted comments
 */
async function deleteCommentChildren(children) {
  if (!children.length) {
    return 0;
  }

  let count = children.length;
  children.forEach(async (comment) => {
    await Comment.updateMany(
      { parentId: comment },
      { $set: { deletedAt: Date.now() } }
    );
    const innerChildren = await Comment.findById(comment).select("children");
    count += await deleteCommentChildren(innerChildren.children);
  });

  return count;
}

/**
 * Function used to delete a comment with all of it children.
 * It also check if the user trying to delete the comment is not the owner of the comment
 *
 * @param {String} userId User id (owner of the comment)
 * @param {String} commentId Comment id that we want to delete
 */
// eslint-disable-next-line max-statements
async function deleteComment(userId, commentId) {
  const comment = await checkCommentId(commentId);

  if (comment.ownerId.toString() !== userId.toString()) {
    let error = new Error("Unauthorized to delete this comment");
    error.statusCode = 401;
    throw error;
  }

  const post = await Post.findById(comment.postId);
  if (!post || post.deletedAt) {
    let error = new Error("Can not find a post with that id");
    error.statusCode = 404;
    throw error;
  }

  let numOfDeleted = 1;
  // delete all child comments to that comment
  await Comment.updateMany(
    { parentId: comment.id },
    { $set: { deletedAt: Date.now() } }
  );
  numOfDeleted += await deleteCommentChildren(comment.children);

  comment.deletedAt = Date.now();
  await comment.save();

  post.numberOfComments = post.numberOfComments - numOfDeleted;
  await post.save();
}

/**
 * Function used to delete a message for the receiver user.
 * It also check if the user trying to delete the message is not the receiver of the message
 *
 * @param {String} userId User id (owner of the message)
 * @param {String} messageId Message id that we want to delete
 */
async function deleteMessage(userId, messageId) {
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    let error = new Error("Invalid message id");
    error.statusCode = 400;
    throw error;
  }
  const message = await Message.findById(messageId);
  if (!message || message.deletedAt) {
    let error = new Error("Can not find a message with that id");
    error.statusCode = 404;
    throw error;
  }

  if (
    !message.isReceiverUser ||
    (message.isReceiverUser &&
      message.receiverId.toString() !== userId.toString())
  ) {
    let error = new Error("Unauthorized to delete this message");
    error.statusCode = 401;
    throw error;
  }

  message.deletedAt = Date.now();
  await message.save();
}

/**
 *
 * @param {String} userId User id that want to delete an item
 * @param {String} id Id of the item that we want to delete
 * @param {String} type Type of the item to be deleted [post, comment, message]
 * @returns {Object} The response to that request containing [statusCode, data]
 */
export async function deleteItems(userId, id, type) {
  if (type === "post") {
    await deletePost(userId, id);
  } else if (type === "comment") {
    await deleteComment(userId, id);
  } else if (type === "message") {
    await deleteMessage(userId, id);
  } else {
    return {
      statusCode: 400,
      message: "type is invalid value",
    };
  }

  return {
    statusCode: 200,
    message: "Deleted successfully",
  };
}
