/* eslint-disable max-statements */
import Subreddit from "./../models/Community.js";
import Post from "../models/Post.js";
import { searchForUserService } from "../services/userServices.js";

/**
 * This function is used to search for a subreddit with its name
 * it gets the subreddit from the database then it checks about it's validity
 * if there is no subreddit or we found one but it's deleted then we return an error
 * @param {String} subredditName subreddit Name
 * @returns {Object} error object that contains the msg describing why there is an error and its status code , or if there is no error then it returns the subreddit itself
 */
export async function searchForPost(postId) {
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("This Post isn't found");
    error.statusCode = 400;
    throw error;
  }
  return post;
}

async function checkForSavedPosts(post, user) {
    //CHECK IF THE POST IS ALREADY SAVED
    for (const smallPost of user.savedPosts) {
      if (post.id === smallPost) {
return true;
      }
    }
    return false;
}

export async function savePost(post, user) {
  //CHECK IF THE POST IS ALREADY SAVED
  const saved=await checkForSavedPosts(post,user);
  if (saved){
      let error = new Error("This Post is already saved");
      error.statusCode = 400;
      throw error;
  }
  //ADD THE POST TO USER'S SAVED POSTS
  user.savedPosts.push(smallPost.id);
  await user.save();
  return {
    statusCode: 200,
    message: "Post is saved successfully",
  };
}

export async function unSavePost(post, user) {
    //CHECK IF THE POST IS ALREADY SAVED
const saved=await checkForSavedPosts(post,user);
if (!saved){
    let error = new Error("This Post is not saved");
    error.statusCode = 400;
    throw error;
}
    //ADD THE POST TO USER'S SAVED POSTS
    user.savedPosts.push(smallPost.id);
    await user.save();
    return {
      statusCode: 200,
      message: "Post is saved successfully",
    };
  }


