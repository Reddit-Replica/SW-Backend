/* eslint-disable max-len */
/* eslint-disable max-statements */
import mongoose from "mongoose";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { searchForSubreddit } from "./communityServices.js";
import { searchForUserService } from "./userServices.js";
//------------------------------------------------------------------------------------------------------------------------------------------------
//GENERAL FUNCTIONS
/**
 * This function is used to search for a post
 * it makes sure that the id of the post is a valid id
 * then it checks if the post is existed and not deleted
 * @param {String} postId the full name of the post that you want to search
 * @returns {Object} Object contains the post or maybe the error that happened
 */
export async function searchForPost(postId) {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    let error = new Error("Invalid post id");
    error.statusCode = 400;
    throw error;
  }
  const post = await Post.findById(postId);
  if (!post || post.deletedAt) {
    let error = new Error("This post isn't found");
    error.statusCode = 404;
    throw error;
  }
  return post;
}
/**
 * This function is used to check if the user that made the post action is a moderator or not
 * it gets the subreddit that the post is in
 * then it checks if the user who made the post action is a moderator in that subreddit or not
 * @param {Object} post the post object that we will check for
 * @param {Object} user the user object that made the action
 * @returns {Boolean} indicates whether the user is a mod or not
 */
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
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    let error = new Error("Invalid comment id");
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

  const index = user.savedPosts.findIndex(
    (elem) => elem.toString() === comment.postId.toString()
  );
  if (index === -1) {
    user.savedPosts.push(comment.postId);
  }
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

  // remove the post id of the saved comment if it was the last saved comment for that post
  const savedPostsComments = await User.findById(user._id)
    .populate("savedPosts savedComments")
    .select("savedPosts savedComments");
  let numOfComments = 0;

  for (const i in savedPostsComments["savedPosts"]) {
    for (const j in savedPostsComments["savedComments"]) {
      if (
        savedPostsComments["savedPosts"][i]._id.toString() ===
        savedPostsComments["savedComments"][j].parentId.toString()
      ) {
        numOfComments++;
      }
    }
  }
  if (numOfComments === 1) {
    user.savedPosts = user.savedPosts.filter((smallPost) => {
      return smallPost.toString() !== comment.postId.toString();
    });
  }
  await user.save();
  return {
    statusCode: 200,
    message: "comment is unsaved successfully",
  };
}
//------------------------------------------------------------------------------------------------------------------------------------------------
//FOLLOW AND UNFOLLOW POSTS
/**
 * This function is used to check if the given post exists in user's followed posts
 * @param {Object} post the post object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */
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

//------------------------------------------------------------------------------------------------------------------------------------------------
//UPVOTING AND DOWNVOTING A POST
/**
 * This function is used to check if the given post exists in user's upVoted posts
 * @param {Object} post the post object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */
function checkForUpVotedPosts(post, user) {
  //CHECK IF THE POST IS ALREADY HIDDEN
  for (const smallPost of user.upvotedPosts) {
    if (post.id === smallPost.toString()) {
      return true;
    }
  }
  return false;
}
/**
 * This function is used to check if the given post exists in user's downVoted posts
 * @param {Object} post the post object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */
function checkForDownVotedPosts(post, user) {
  //CHECK IF THE POST IS ALREADY HIDDEN
  for (const smallPost of user.downvotedPosts) {
    if (post.id === smallPost.toString()) {
      return true;
    }
  }
  return false;
}

/**
 * This function is used to upvote a post
 * @param {Object} post the post object that we will upvote
 * @param {Object} user the user object that will upvote the post
 * @returns {Object} success object that contains the message and status code
 */
export async function upVoteAPost(post, user) {
  let result = {};
  //CHECKING IF THE POST EXISTS IN UPVOTED POSTS IN THE USER
  const upvoted = checkForUpVotedPosts(post, user);
  //CHECKING IF THE POST EXISTS IN DOWNVOTED POSTS IN THE USER
  const downvoted = checkForDownVotedPosts(post, user);
  //GETTING THE USER WHO WROTE THE POST TO CHANGE HIS KARMA
  const postWriter = await searchForUserService(post.ownerUsername);
  //IF THE POST IS UPVOTED AND IT'S ALREADY UPVOTED THEN IT WILL CANCEL THE UPVOTE THAT IT HAD
  if (upvoted) {
    user.upvotedPosts = user.upvotedPosts.filter((smallPost) => {
      return smallPost.toString() !== post.id;
    });
    post.numberOfUpvotes--;
    postWriter.upVotes--;
    result = {
      statusCode: 200,
      message: "Post upvote is cancelled successfully",
    };
    //IF IT'S NOT UPVOTED THEN WE HAVE TWO CASES
  } else {
    if (downvoted) {
      //FIRST CASE IF THE POST WAS DOWNVOTED THEN WE WILL CANCEL THAT DOWNVOTE AND MODIFY ON KARMA
      user.downvotedPosts = user.downvotedPosts.filter((smallPost) => {
        return smallPost.toString() !== post.id;
      });
      post.numberOfDownvotes--;
      postWriter.downVotes--;
    }
    //THEN THE SECOND MODIFICATION THAT MUST HAPPEN IN CASE THE POST WASN'T UPVOTED ALREADY
    post.numberOfUpvotes++;
    user.upvotedPosts.push(post.id);
    postWriter.upVotes++;
    result = {
      statusCode: 200,
      message: "Post is Upvoted successfully",
    };
  }
  postWriter.karma = postWriter.upVotes - postWriter.downVotes;
  post.numberOfVotes = post.numberOfUpvotes - post.numberOfDownvotes;
  post.hotScore =
    post.hotTimingScore + post.numberOfVotes + post.numberOfComments;
  post.bestScore =
    post.bestTimingScore + post.numberOfVotes + post.numberOfComments;
  await post.save();
  await user.save();
  await postWriter.save();
  return result;
}

/**
 * This function is used to downVote a post
 * @param {Object} post the post object that we will downVote
 * @param {Object} user the user object that will downVote the post
 * @returns {Object} success object that contains the message and status code
 */
export async function downVoteAPost(post, user) {
  let result = {};
  //CHECKING IF THE POST EXISTS IN UPVOTED POSTS IN THE USER
  const upvoted = checkForUpVotedPosts(post, user);
  //CHECKING IF THE POST EXISTS IN DOWNVOTED POSTS IN THE USER
  const downvoted = checkForDownVotedPosts(post, user);
  //GETTING THE USER WHO WROTE THE POST TO CHANGE HIS KARMA
  const postWriter = await searchForUserService(post.ownerUsername);
  //IF THE POST IS DOWNVOTED AND IT'S ALREADY DOWNVOTED THEN IT WILL CANCEL THE DOWNVOTE THAT IT HAD
  if (downvoted) {
    user.downvotedPosts = user.downvotedPosts.filter((smallPost) => {
      return smallPost.toString() !== post.id;
    });
    post.numberOfDownvotes--;
    postWriter.downVotes--;
    result = {
      statusCode: 200,
      message: "Post downvote is cancelled successfully",
    };
    //IF IT'S NOT DOWNVOTED THEN WE HAVE TWO CASES
  } else {
    //FIRST CASE IF THE POST WAS UPVOTED THEN WE WILL CANCEL THAT UPVOTE AND MODIFY ON KARMA
    if (upvoted) {
      user.upvotedPosts = user.upvotedPosts.filter((smallPost) => {
        return smallPost.toString() !== post.id;
      });
      post.numberOfUpvotes--;
      postWriter.upVotes--;
    }
    //THEN THE SECOND MODIFICATION THAT MUST HAPPEN IN CASE THE POST WASN'T DOWNVOTED ALREADY
    post.numberOfDownvotes++;
    user.downvotedPosts.push(post.id);
    postWriter.downVotes++;
    result = {
      statusCode: 200,
      message: "Post is Downvoted successfully",
    };
  }
  postWriter.karma = postWriter.upVotes - postWriter.downVotes;
  post.numberOfVotes = post.numberOfUpvotes - post.numberOfDownvotes;
  post.hotScore =
    post.hotTimingScore + post.numberOfVotes + post.numberOfComments;
  post.bestScore =
    post.bestTimingScore + post.numberOfVotes + post.numberOfComments;
  await post.save();
  await user.save();
  await postWriter.save();

  return result;
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//UPVOTING AND DOWNVOTING A Comment
/**
 * This function is used to check if the given post exists in user's upVoted comments
 * @param {Object} comment the comment object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */
export function checkForUpVotedComments(comment, user) {
  for (const smallComment of user.upvotedComments) {
    if (comment.id === smallComment.toString()) {
      return true;
    }
  }
  return false;
}
/**
 * This function is used to check if the given post exists in user's downVoted comments
 * @param {Object} comment the comment object that we will check for
 * @param {Object} user the user object that we will search in
 * @returns {Boolean} detects if the post exists or not
 */
export function checkForDownVotedComments(comment, user) {
  for (const smallComment of user.downvotedComments) {
    if (comment.id === smallComment.toString()) {
      return true;
    }
  }
  return false;
}

/**
 * This function is used to upvote a comment
 * @param {Object} comment the comment object that we will upvote
 * @param {Object} user the user object that will upvote the comment
 * @returns {Object} success object that contains the message and status code
 */
export async function upVoteAComment(comment, user) {
  let result = {};
  //CHECKING IF THE COMMENT EXISTS IN UPVOTED COMMENT IN THE USER
  const upvoted = checkForUpVotedComments(comment, user);
  //CHECKING IF THE COMMENT EXISTS IN DOWNVOTED COMMENT IN THE USER
  const downvoted = checkForDownVotedComments(comment, user);
  //GETTING THE USER WHO WROTE THE COMMENT TO CHANGE HIS KARMA
  const commentWriter = await searchForUserService(comment.ownerUsername);
  //IF THE COMMENT IS UPVOTED AND IT'S ALREADY UPVOTED THEN IT WILL CANCEL THE UPVOTE THAT IT HAD
  if (upvoted) {
    user.upvotedComments = user.upvotedComments.filter((smallComment) => {
      return smallComment.toString() !== comment.id;
    });
    comment.numberOfVotes--;
    commentWriter.upVotes--;
    result = {
      statusCode: 200,
      message: "Comment upvote is cancelled successfully",
    };
    //IF IT'S NOT UPVOTED THEN WE HAVE TWO CASES
  } else {
    if (downvoted) {
      //FIRST CASE IF THE POST WAS DOWNVOTED THEN WE WILL CANCEL THAT DOWNVOTE AND MODIFY ON KARMA
      user.downvotedComments = user.downvotedComments.filter((smallComment) => {
        return smallComment.toString() !== comment.id;
      });
      comment.numberOfVotes++;
      commentWriter.downVotes--;
    }
    //THEN THE SECOND MODIFICATION THAT MUST HAPPEN IN CASE THE COMMENT WASN'T UPVOTED ALREADY
    comment.numberOfVotes++;
    user.upvotedComments.push(comment.id);
    commentWriter.upVotes++;
    result = {
      statusCode: 200,
      message: "Comment is Upvoted successfully",
    };
  }
  commentWriter.karma = commentWriter.upVotes - commentWriter.downVotes;
  await comment.save();
  await user.save();
  await commentWriter.save();
  return result;
}

/**
 * This function is used to downVote a comment
 * @param {Object} comment the comment object that we will downVote
 * @param {Object} user the user object that will downVote the comment
 * @returns {Object} success object that contains the message and status code
 */
export async function downVoteAComment(comment, user) {
  let result = {};
  //CHECKING IF THE COMMENT EXISTS IN UPVOTED COMMENT IN THE USER
  const upvoted = checkForUpVotedComments(comment, user);
  //CHECKING IF THE COMMENT EXISTS IN DOWNVOTED COMMENT IN THE USER
  const downvoted = checkForDownVotedComments(comment, user);
  //GETTING THE USER WHO WROTE THE COMMENT TO CHANGE HIS KARMA
  const commentWriter = await searchForUserService(comment.ownerUsername);
  //IF THE COMMENT IS DOWNVOTED AND IT'S ALREADY DOWNVOTED THEN IT WILL CANCEL THE DOWNVOTE THAT IT HAD
  if (downvoted) {
    user.downvotedComments = user.downvotedComments.filter((smallComment) => {
      return smallComment.toString() !== comment.id;
    });
    comment.numberOfVotes++;
    commentWriter.downVotes--;
    result = {
      statusCode: 200,
      message: "Comment downvote is cancelled successfully",
    };
    //IF IT'S NOT DOWNVOTED THEN WE HAVE TWO CASES
  } else {
    //FIRST CASE IF THE COMMENT WAS UPVOTED THEN WE WILL CANCEL THAT UPVOTE AND MODIFY ON KARMA
    if (upvoted) {
      user.upvotedComments = user.upvotedComments.filter((smallComment) => {
        return smallComment.toString() !== comment.id;
      });
      comment.numberOfVotes--;
      commentWriter.upVotes--;
    }
    //THEN THE SECOND MODIFICATION THAT MUST HAPPEN IN CASE THE COMMENT WASN'T DOWNVOTED ALREADY
    comment.numberOfVotes--;
    user.downvotedComments.push(comment.id);
    commentWriter.downVotes++;
    result = {
      statusCode: 200,
      message: "Comment is Downvoted successfully",
    };
  }
  commentWriter.karma = commentWriter.upVotes - commentWriter.downVotes;
  await comment.save();
  await user.save();
  await commentWriter.save();

  return result;
}

/**
 * This function is used to set a suggested sort for the post
 * @param {String} postId Id of the post that we will set the suggested sort for
 * @param {Object} user the user object that will set the suggested sort for the post
 * @param {String} sort the type of sort that will be set for the post
 * @returns {Object} success object that contains the message and status code
 */
export async function setSuggestedSort(postId, user, sort) {
  const post = await searchForPost(postId);
  const postOwner = post.ownerId.toString();
  if (user.id !== postOwner) {
    let error = new Error("You don't have the right to do this action");
    error.statusCode = 401;
    throw error;
  }
  post.suggestedSort = sort;
  await post.save();
  return {
    statusCode: 200,
    message: `post-suggested sort is ${sort} now`,
  };
}

/**
 * This function is used to clear the suggested sort for the post
 * @param {String} postId Id of the post that we will clear the suggested sort for
 * @param {Object} user the user object that will clear the suggested sort for the post
 * @returns {Object} success object that contains the message and status code
 */
export async function clearSuggestedSort(postId, user) {
  const post = await searchForPost(postId);
  const postOwner = post.ownerId.toString();
  if (user.id !== postOwner) {
    let error = new Error("You don't have the right to do this action");
    error.statusCode = 401;
    throw error;
  }
  post.suggestedSort = "best";
  await post.save();
  return {
    statusCode: 200,
    message: "post-suggested sort is best now",
  };
}

/**
 * This function is used to get the commented users on a post
 * @param {String} postId Id of the post that we will get people who commented on
 * @returns {Object} success object that contains the message and status code
 */
export async function getCommentedUsers(postId) {
  const post = await searchForPost(postId);
  const users=new Set();
  for (const user of post.usersCommented){
    const { username }=await User.findById(user);
    users.add(username);
  }
  return {
    data: [...users],
    statusCode:200,
  };
}
