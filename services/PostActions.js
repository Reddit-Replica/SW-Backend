/* eslint-disable max-len */
/* eslint-disable max-statements */
import Post from "../models/Post.js";

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

async function checkForSavedPosts(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  for (const smallPost of user.savedPosts) {
    if (post.id === smallPost.toString()) {
      return true;
    }
  }
  return false;
}

export async function validateSavedPost(req){
    if (!req.body.id){
        let error = new Error("you must enter the id of the post or comment");
        error.statusCode = 400;
        throw error;
    }
    if (req.body.type===undefined){
        let error = new Error("you must enter if you want to saved a post or a comment");
        error.statusCode = 400;
        throw error;
    }
}



export async function savePost(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  const saved = await checkForSavedPosts(post, user);
  if (saved) {
    let error = new Error("This Post is already saved");
    error.statusCode = 400;
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

export async function saveComment(Comment, user) {
    //CHECK IF THE POST IS ALREADY SAVED
    const saved = await checkForSavedPosts(post, user);
    if (saved) {
      let error = new Error("This Post is already saved");
      error.statusCode = 400;
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

export async function unSavePost(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  const saved = await checkForSavedPosts(post, user);
  if (!saved) {
    let error = new Error("This Post is not saved already");
    error.statusCode = 400;
    throw error;
  }
  user.savedPosts = user.savedPosts.filter((smallPost) => {
    return smallPost.toString !== post.id;
  });
  await user.save();
  return {
    statusCode: 200,
    message: "Post is unsaved successfully",
  };
}

async function checkForFollowedPosts(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  for (const smallPost of user.followedPosts) {
    console.log(smallPost.toString(),post.id);
    if (post.id === smallPost.toString()) {
      return true;
    }
  }
  return false;
}
export async function validateFollowPost(req){
    if (!req.body.id){
        let error = new Error("you must enter the id of the post");
        error.statusCode = 400;
        throw error;
    }
    if (req.body.follow===undefined){
        let error = new Error("you must enter if you want to follow the post or not");
        error.statusCode = 400;
        throw error;
    }
}

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
