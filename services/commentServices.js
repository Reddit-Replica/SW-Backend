import { commentTreeListing } from "../utils/prepareListing.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Subreddit from "../models/Community.js";

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
 * Function used to check if the id of the comment is valid and if the comment exists in the database
 *
 * @param {String} commentId Id of the comment to check
 * @returns {Object} Comment with that id
 */
export async function checkCommentId(commentId) {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    let error = new Error("Invalid comment id");
    error.statusCode = 400;
    throw error;
  }
  const comment = await Comment.findById(commentId);
  if (!comment || comment.deletedAt) {
    let error = new Error("Can not find a comment with that id");
    error.statusCode = 400;
    throw error;
  }
  return comment;
}

/**
 * Function used to check if the id of the user is valid and if the user exists in the database,
 * then return the comment lists for that user
 *
 * @param {String} loggedInUserId Id of the user to check
 * @returns {Object} user with that id
 */
export async function checkloggedInUser(loggedInUserId) {
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
  return loggedInUser;
}

/**
 * Function used to create a new comment and check every parameter to be a valid one
 *
 * @param {Object} data Data required to create a new comment [text, parentId, postId, parentType, level, subredditName, haveSubreddit, username, userId]
 * @param {Object} post Post object that we want to add the comment to it
 * @returns The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function createCommentService(data, post) {
  // check the parent type and id
  if (data.parentType !== "post" && data.parentType !== "comment") {
    let error = new Error("Invalid parent type");
    error.statusCode = 400;
    throw error;
  }
  if (!mongoose.Types.ObjectId.isValid(data.parentId)) {
    let error = new Error("Invalid parent id");
    error.statusCode = 400;
    throw error;
  }

  // check the user id and get the user
  if (!mongoose.Types.ObjectId.isValid(data.userId)) {
    let error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.findById(data.userId);
  if (!user || user.deletedAt) {
    let error = new Error("Can not find a user with that id");
    error.statusCode = 400;
    throw error;
  }

  // get the parent comment if exist
  let parentComment = {};
  if (data.parentType === "comment") {
    parentComment = await checkCommentId(data.parentId);
  }

  const commentObject = {
    parentId: data.parentId,
    postId: post._id,
    parentType: data.parentType,
    level: data.level,
    content: data.text,
    ownerUsername: data.username,
    ownerAvatar: user.avatar,
    ownerId: data.userId,
  };

  // check if the subreddit exists
  if (data.haveSubreddit) {
    const subreddit = await Subreddit.findOne({
      title: data.subredditName,
      deletedAt: null,
    });
    if (!subreddit) {
      let error = new Error("Can not find subreddit with that name");
      error.statusCode = 400;
      throw error;
    }
    commentObject.subredditName = data.subredditName;
  }

  const comment = new Comment(commentObject);
  await comment.save();

  // update commentedPosts array for that user
  if (post.ownerId.toString() !== data.userId.toString()) {
    const index = user.commentedPosts.findIndex(
      (elem) => elem.toString() === post._id.toString()
    );
    if (index === -1) {
      user.commentedPosts.push(post._id);
      await user.save();
    }
  }

  // add the comment to children of parent comment
  if (data.parentType === "comment") {
    parentComment.children.push(comment._id);
    await parentComment.save();
  }

  // add the user to the commented users in that post
  const index = post.usersCommented.findIndex(
    (elem) => elem.toString() === data.userId
  );
  if (index === -1) {
    post.usersCommented.push(user._id);
    await post.save();
  }

  return {
    statusCode: 201,
    data: "Comment created successfully",
  };
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
  if (comment.deletedAt) {
    return null;
  }

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
      const resultData = prepareComment(comment.children[i], user, false);
      if (resultData) {
        children.push(resultData);
      }
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
 * @param {String} loggedInUser Logged in user object
 * @param {Object} post Post that contains the comments wanted
 * @param {Object} listingParams Listing parameters that was in the query of the request
 * @returns The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function commentTreeListingService(
  loggedInUser,
  post,
  listingParams
) {
  // prepare the listing parameters
  const listingResult = await commentTreeListing(listingParams);

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
    children.push(prepareComment(result[i], loggedInUser, true));
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

/**
 * Function that list the children of a certain comment from a certain post
 * then sort, match, and limit them, then finally save the last id so that it can
 * be used next time to get different results.
 *
 * @param {String} loggedInUser Logged in user object
 * @param {Object} post Post that contains the comments wanted
 * @param {Object} comment Comment to list its children
 * @param {Object} listingParams Listing parameters that was in the query of the request
 * @returns The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function commentTreeOfCommentListingService(
  loggedInUser,
  post,
  comment,
  listingParams
) {
  // prepare the listing parameters
  const listingResult = await commentTreeListing(listingParams);

  const result = await Comment.find({
    ...listingResult.find,
    parentType: "comment",
    parentId: comment._id,
    postId: post._id,
  })
    .populate("children")
    .sort(listingResult.sort)
    .limit(listingResult.limit);

  // prepare the body
  let children = [];
  for (const i in result) {
    children.push(prepareComment(result[i], loggedInUser, true));
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
