import { commentListing } from "../utils/prepareListing.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

/**
 * Function used to check if the id of the post is valid and if the post exists in the database
 *
 * @param {String} postId Id of the post to check
 * @returns {Object} Post with that id
 */
export async function checkPostId(postId) {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    let error = new Error("Invalid post id");
    error.statusCode = 400;
    throw error;
  }
  const post = await Post.findById(postId);
  if (!post || post.deletedAt) {
    let error = new Error("Can not find a post with that id");
    error.statusCode = 400;
    throw error;
  }
  return post;
}

/**
 * Function used to prepare the comment response that will be send to the user,
 * and also check if the logged in user saved, followed, or vote that comment
 *
 * @param {Object} comment Comment object from the database
 * @param {Object} user User object to get comment lists from it
 * @param {Boolean} checkChildren Flag used to check the children or ignore them
 * @returns {Object} The final data that will be sent to the user
 */
// eslint-disable-next-line max-statements
function prepareComment(comment, user, checkChildren) {
  let data = {
    commentId: comment._id.toString(),
    commentedBy: comment.ownerUsername,
    userImage: comment.ownerAvatar,
    editTime: comment.editedAt,
    publishTime: comment.createdAt,
    commentBody: comment.content,
    votes: comment.numberOfVotes,
    parent: comment.parentId,
    level: comment.level,
    numberofChildren: comment.children.length,
    vote: 0,
    followed: false,
    saved: false,
  };

  // prepare saved, followed, vote flags
  if (user) {
    // check voting type
    if (user.upvotedComments.includes(comment._id)) {
      data.vote = 1;
    } else if (user.downvotedComments.includes(comment._id)) {
      data.vote = -1;
    } else {
      data.vote = 0;
    }

    // check if the comment was saved before
    if (user.savedComments.includes(comment._id)) {
      data.saved = true;
    } else {
      data.saved = false;
    }

    // check if the comment was followed before
    if (user.followedComments.includes(comment._id)) {
      data.followed = true;
    } else {
      data.followed = false;
    }
  }

  let children = [];
  if (checkChildren) {
    for (let i = 0; i < comment.children.length; i++) {
      if (i === 5) {
        break;
      }
      children.push(prepareComment(comment.children[i], user, false));
    }
  }
  data.children = children;

  return data;
}

/**
 * Function that get the comments that we want to list from a certain post
 * then sort, match, and limit them, then finally save the last id so that it can
 * be used next time to get different results.
 *
 * @param {String} loggedInUserId Id of the logged in user
 * @param {Object} post Post that contains the comments wanted
 * @param {Object} listingParams Listing parameters that was in the query of the request
 * @returns The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function commentTreeListing(loggedInUserId, post, listingParams) {
  //get the logged in user
  let loggedInUser = null;
  if (loggedInUserId) {
    if (!mongoose.Types.ObjectId.isValid(loggedInUserId)) {
      let error = new Error("Invalid id from the token");
      error.statusCode = 400;
      throw error;
    }
    loggedInUser = await User.findById(loggedInUserId).select(
      "upvotedComments downvotedComments followedComments savedComments"
    );
  }

  // prepare the listing parameters
  const listingResult = await commentListing(listingParams);

  const result = await Comment.find({
    ...listingResult.find,
    parentType: "post",
    parentId: post._id,
    level: 1,
  })
    .populate("children")
    .sort(listingResult.sort)
    .limit(listingResult.limit);

  // prepare the body
  let children = [];
  for (const i in result) {
    const prepareResult = prepareComment(result[i], loggedInUser, true);
    children.push(prepareResult);
  }

  let after = "",
    before = "";
  if (result.length) {
    after = result[result.length - 1]._id.toString();
    before = result[0]._id.toString();
  }

  return {
    statusCode: 200,
    data: {
      before,
      after,
      children,
    },
  };
}
