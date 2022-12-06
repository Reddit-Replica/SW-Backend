/* eslint-disable max-len */
/* eslint-disable max-statements */
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { searchForSubreddit } from "./communityServices.js";
//------------------------------------------------------------------------------------------------------------------------------------------------
//GENERAL FUNCTION
/**
 * This function is used to search for a post
 * it makes sure that the id of the post is a valid id
 * then it checks if the post is existed and not deleted
 * @param {String} postId the full name of the post that you want to search
 * @returns {Object} Object contains the post or maybe the error that happened
 */
export async function searchForPost(postId) {
  if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
    let error = new Error("This is not a valid post id");
    error.statusCode = 400;
    throw error;
  }
  const post = await Post.findById(postId);
  if (!post || post.deletedAt) {
    let error = new Error("This Post isn't found");
    error.statusCode = 404;
    throw error;
  }
  return post;
}
export async function isUserMod(post, user) {
  const subredditName = post.subredditName;
  const subreddit = searchForSubreddit(subredditName);
  for (const moderator of subreddit.moderators) {
    if (moderator.username === user.username) {
      return true;
    }
  }
  return false;
}
/**
 * This function is used to search for a comment
 * it makes sure that the id of the comment is a valid id
 * then it checks if the comment is existed and not deleted
 * @param {String} postId the full name of the post that you want to search
 * @returns {Object} Object contains the post or maybe the error that happened
 */
export async function searchForComment(commentId) {
  if (!commentId.match(/^[0-9a-fA-F]{24}$/)) {
    let error = new Error("This is not a valid comment id");
    error.statusCode = 400;
    throw error;
  }
  const comment = await Comment.findById(commentId);
  if (!comment || comment.deletedAt) {
    let error = new Error("This comment isn't found");
    error.statusCode = 404;
    throw error;
  }
  return comment;
}
//------------------------------------------------------------------------------------------------------------------------------------------------
//VALIDATION SERVICES
/**
 * This function is used to validate the request of save a post
 * @param {Object} req req object that contains the input data
 * @returns {Object} error object that contains the error message and Status code
 */
export async function validateSavedPost(req) {
  if (!req.body.id) {
    let error = new Error("you must enter the id of the post or comment");
    error.statusCode = 400;
    throw error;
  }
  if (req.body.type === undefined) {
    let error = new Error(
      "you must enter if you want to saved a post or a comment"
    );
    error.statusCode = 400;
    throw error;
  }
  if (req.body.type !== "post" && req.body.type !== "comment") {
    let error = new Error("type must be post or comment");
    error.statusCode = 400;
    throw error;
  }
}

export async function validateSpam(req) {
  if (!req.body.id) {
    let error = new Error(
      "you must enter the id of the post or comment or message"
    );
    error.statusCode = 400;
    throw error;
  }
  if (req.body.type === undefined) {
    let error = new Error(
      "you must enter if you want to saved a post or a comment or a message"
    );
    error.statusCode = 400;
    throw error;
  }
  if (
    req.body.type !== "post" &&
    req.body.type !== "comment" &&
    req.body.type !== "message"
  ) {
    let error = new Error("type must be post or comment or message");
    error.statusCode = 400;
    throw error;
  }
}
/**
 * This function is used to validate the request of follow a post
 * @param {Object} req req object that contains the input data
 * @returns {Object} error object that contains the error message and Status code
 */
export async function validateFollowPost(req) {
  if (!req.body.id) {
    let error = new Error("you must enter the id of the post");
    error.statusCode = 400;
    throw error;
  }
  if (req.body.follow === undefined) {
    let error = new Error(
      "you must enter if you want to follow the post or not"
    );
    error.statusCode = 400;
    throw error;
  }
}
/**
 * This function is used to validate the request of hide a post
 * @param {Object} req req object that contains the input data
 * @returns {Object} error object that contains the error message and Status code
 */
export async function validateHidePost(req) {
  if (!req.body.id) {
    let error = new Error("you must enter the id of the post");
    error.statusCode = 400;
    throw error;
  }
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//SAVE AND UNSAVE POSTS
/**
 * This function is used to check if the given post exists in user's saved posts
 * @param {Object} post the post object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */
async function checkForSavedPosts(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  for (const smallPost of user.savedPosts) {
    if (post.id === smallPost.toString()) {
      return true;
    }
  }
  return false;
}

/**
 * This function is used to save a post to a user
 * @param {Object} post the post object that we will save
 * @param {Object} user the user object that we will save the post to
 * @returns {Object} success object that contains the message and status code
 */
export async function savePost(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  const saved = await checkForSavedPosts(post, user);
  if (saved) {
    let error = new Error("This Post is already saved");
    error.statusCode = 409;
    throw error;
  }
  //ADD THE POST TO USER'S SAVED POSTS
  user.savedPosts.push(post.id);
  await user.save();
  return {
    statusCode: 200,
    message: "Post is saved successfully",
  };
}

/**
 * This function is used to unsave a post to a user
 * @param {Object} post the post object that we will unsave
 * @param {Object} user the user object that we will unsave the post from
 * @returns {Object} success object that contains the message and status code
 */
export async function unSavePost(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  const saved = await checkForSavedPosts(post, user);
  if (!saved) {
    let error = new Error("This Post is not saved already");
    error.statusCode = 400;
    throw error;
  }

  user.savedPosts = user.savedPosts.filter((smallPost) => {
    return smallPost.toString() !== post.id;
  });
  await user.save();
  return {
    statusCode: 200,
    message: "Post is unsaved successfully",
  };
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//SAVE AND UNSAVE COMMENTS

/**
 * This function is used to check if the given post exists in user's saved posts
 * @param {Object} post the post object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */
async function checkForSavedcomments(comment, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  for (const smallComment of user.savedComments) {
    if (comment.id === smallComment.toString()) {
      return true;
    }
  }
  return false;
}

/**
 * This function is used to save a comment to a user
 * @param {Object} comment the comment object that we will save
 * @param {Object} user the user object that we will save the comment to
 * @returns {Object} success object that contains the message and status code
 */
export async function saveComment(comment, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  const saved = await checkForSavedcomments(comment, user);
  if (saved) {
    let error = new Error("This Comment is already saved");
    error.statusCode = 409;
    throw error;
  }
  //ADD THE comments TO USER'S SAVED comments
  user.savedComments.push(comment.id);
  await user.save();
  return {
    statusCode: 200,
    message: "comment is saved successfully",
  };
}

/**
 * This function is used to unsave a comment
 * @param {Object} comment the comment object that we will unsave
 * @param {Object} user the user object that we will unsave the comment from
 * @returns {Object} success object that contains the message and status code
 */
export async function unSaveComment(comment, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  const saved = await checkForSavedcomments(comment, user);
  if (!saved) {
    let error = new Error("This Comment is not saved already");
    error.statusCode = 400;
    throw error;
  }
  user.savedComments = user.savedComments.filter((smallComment) => {
    return smallComment.toString() !== comment.id;
  });
  await user.save();
  return {
    statusCode: 200,
    message: "comment is unsaved successfully",
  };
}
/**
 * This function is used to check if the given post exists in user's followed posts
 * @param {Object} post the post object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */

//------------------------------------------------------------------------------------------------------------------------------------------------
//FOLLOW AND UNFOLLOW POSTS

async function checkForFollowedPosts(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  for (const smallPost of user.followedPosts) {
    if (post.id === smallPost.toString()) {
      return true;
    }
  }
  return false;
}

/**
 * This function is used to follow a post to a user
 * @param {Object} post the post object that will be followed
 * @param {Object} user the user object that will follow
 * @returns {Object} success object that contains the message and status code
 */
export async function followPost(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  const followed = await checkForFollowedPosts(post, user);
  if (followed) {
    let error = new Error("This Post is already followed");
    error.statusCode = 400;
    throw error;
  }
  //ADD THE POST TO USER'S SAVED POSTS
  user.followedPosts.push(post.id);
  await user.save();
  return {
    statusCode: 200,
    message: "Followed! You will get updates when there is new activity.",
  };
}
/**
 * This function is used to make user unfollow a post
 * @param {Object} post the post object that will be unfollowed
 * @param {Object} user the user object that will unfollow the post
 * @returns {Object} success object that contains the message and status code
 */
export async function unfollowPost(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  const followed = await checkForFollowedPosts(post, user);
  if (!followed) {
    let error = new Error("This Post is not followed already");
    error.statusCode = 400;
    throw error;
  }
  user.followedPosts = user.followedPosts.filter((smallPost) => {
    return smallPost.toString() !== post.id;
  });
  await user.save();
  return {
    statusCode: 200,
    message: "Unfollowed. You will not get updates on this post anymore.",
  };
}
//------------------------------------------------------------------------------------------------------------------------------------------------
//HIDE AND UNHIDE POSTS
/**
 * This function is used to check if the given post exists in user's hidden posts
 * @param {Object} post the post object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */
function checkForHiddenPosts(post, user) {
  //CHECK IF THE POST IS ALREADY HIDDEN
  for (const smallPost of user.hiddenPosts) {
    if (post.id === smallPost.toString()) {
      return true;
    }
  }
  return false;
}

/**
 * This function is used to hide a post from a user
 * @param {Object} post the post object that we will hide
 * @param {Object} user the user object that we will hide the post to
 * @returns {Object} success object that contains the message and status code
 */
export async function hideAPost(post, user) {
  //CHECK IF THE POST IS ALREADY HIDDEN
  const hidden = checkForHiddenPosts(post, user);
  if (hidden) {
    let error = new Error("This Post is already hidden");
    error.statusCode = 409;
    throw error;
  }
  //ADD THE POST TO USER'S HIDDEN POSTS
  user.hiddenPosts.push(post.id);
  await user.save();
  return {
    statusCode: 200,
    message: "Post is hidden successfully",
  };
}

/**
 * This function is used to unhide a post to a user
 * @param {Object} post the post object that we will unhide
 * @param {Object} user the user object that we will hide the post from
 * @returns {Object} success object that contains the message and status code
 */
export async function unhideAPost(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  const hidden = checkForHiddenPosts(post, user);
  if (!hidden) {
    let error = new Error("This Post is not hidden already");
    error.statusCode = 400;
    throw error;
  }

  user.hiddenPosts = user.hiddenPosts.filter((smallPost) => {
    return smallPost.toString() !== post.id;
  });
  await user.save();
  return {
    statusCode: 200,
    message: "Post is unhidden successfully",
  };
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//MARk POSTS AS SPAM
/**
 * This function is used to check if the given post exists in user's hidden posts
 * @param {Object} post the post object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */
function checkForSpammedPosts(post, user) {
  //CHECK IF THE POST IS ALREADY HIDDEN
  for (const smallPost of user.spammedPosts) {
    if (post.id === smallPost.toString()) {
      return true;
    }
  }
  return false;
}

/**
 * This function is used to mark a post as a spam from a user
 * @param {Object} post the post object that we will mark as spam
 * @param {Object} user the user object that will mark the post as spam
 * @returns {Object} success object that contains the message and status code
 */
export async function markPostAsSpam(post, user) {
  //CHECK IF THE POST IS ALREADY HIDDEN
  const spammed = checkForSpammedPosts(post, user);
  if (spammed) {
    let error = new Error("This Post is already spammed");
    error.statusCode = 409;
    throw error;
  }
  //ADD THE POST TO USER'S HIDDEN POSTS
  user.spammedPosts.push(post.id);
  await user.save();
  post.markedSpam = true;
  /*const moderator=isUserMod(post,user);
  if (moderator){
post.moderation.spam={
    spammedBy:user.username,
    spammedDate:Date.now(),
};
  }*/
  post.save();
  return {
    statusCode: 200,
    message: "Post is spammed successfully",
  };
}

/**
 * This function is used to unmark a post as a spam from a user
 * @param {Object} post the post object that we will ummark as spam
 * @param {Object} user the user object that will ummark the post as spam
 * @returns {Object} success object that contains the message and status code
 */
export async function unmarkPostAsSpam(post, user) {
  //CHECK IF THE POST IS ALREADY HIDDEN
  const spammed = checkForSpammedPosts(post, user);
  if (!spammed) {
    let error = new Error("This Post is already unspammed");
    error.statusCode = 409;
    throw error;
  }
  //ADD THE POST TO USER'S HIDDEN POSTS
  user.spammedPosts = user.spammedPosts.filter((smallPost) => {
    return smallPost.toString() !== post.id;
  });
  await user.save();
  post.markedSpam = false;
  /*const moderator=isUserMod(post,user);
  if (moderator){
    post.moderation.spam={};
  }*/
  post.save();
  return {
    statusCode: 200,
    message: "Post is unspammed successfully",
  };
}
//------------------------------------------------------------------------------------------------------------------------------------------------
//MARK COMMENTS AS SPAM
/**
 * This function is used to check if the given post exists in user's hidden posts
 * @param {Object} post the post object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */
function checkForSpammedComments(comment, user) {
  //CHECK IF THE POST IS ALREADY HIDDEN
  for (const smallComment of user.spammedComments) {
    if (comment.id === smallComment.toString()) {
      return true;
    }
  }
  return false;
}

/**
 * This function is used to mark a post as a spam from a user
 * @param {Object} post the post object that we will mark as spam
 * @param {Object} user the user object that will mark the post as spam
 * @returns {Object} success object that contains the message and status code
 */
export async function markCommentAsSpam(comment, user) {
  //CHECK IF THE POST IS ALREADY HIDDEN
  const spammed = checkForSpammedComments(comment, user);
  if (spammed) {
    let error = new Error("This Comment is already spammed");
    error.statusCode = 409;
    throw error;
  }
  //ADD THE POST TO USER'S HIDDEN POSTS
  user.spammedComments.push(comment.id);
  await user.save();
  comment.markedSpam = true;
  /*const moderator=isUserMod(post,user);
    if (moderator){
  post.moderation.spam={
      spammedBy:user.username,
      spammedDate:Date.now(),
  };
    }*/
  comment.save();
  return {
    statusCode: 200,
    message: "Comment is spammed successfully",
  };
}

/**
 * This function is used to unmark a post as a spam from a user
 * @param {Object} post the post object that we will ummark as spam
 * @param {Object} user the user object that will ummark the post as spam
 * @returns {Object} success object that contains the message and status code
 */
export async function unmarkCommentAsSpam(comment, user) {
  //CHECK IF THE POST IS ALREADY HIDDEN
  const spammed = checkForSpammedComments(comment, user);
  if (!spammed) {
    let error = new Error("This comment is already unspammed");
    error.statusCode = 409;
    throw error;
  }
  //ADD THE POST TO USER'S HIDDEN POSTS
  user.spammedComments = user.spammedComments.filter((smallComment) => {
    return smallComment.toString() !== comment.id;
  });
  await user.save();
  comment.markedSpam = false;
  /*const moderator=isUserMod(post,user);
    if (moderator){
      post.moderation.spam={};
    }*/
  comment.save();
  return {
    statusCode: 200,
    message: "Comment is unspammed successfully",
  };
}
