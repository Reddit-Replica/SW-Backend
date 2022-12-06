/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
  unfollowPost,
  followPost,
  unSavePost,
  savePost,
  searchForPost,
  validateFollowPost,
  validateSavedPost,
  saveComment,
  unSaveComment,
  searchForComment,
  hideAPost,
  unhideAPost,
  validateHidePost,
  unmarkPostAsSpam,
  markPostAsSpam,
  validateSpam,
  markCommentAsSpam,unmarkCommentAsSpam,
} from "../services/PostActions.js";
import { searchForUserService } from "../services/userServices.js";
import { searchForMessage,markMessageAsSpam,unmarkMessageAsSpam } from "../services/messageServices.js";
//------------------------------------------------------------------------------------------------------------------------------------------------
//FOLLOW
const followOrUnfollowPost = async (req, res) => {
  try {
    await validateFollowPost(req);
    const post = await searchForPost(req.body.id);
    const user = await searchForUserService(req.payload.username);
    let result;
    if (req.body.follow) {
      result = await followPost(post, user);
    } else {
      result = await unfollowPost(post, user);
    }
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Server Error");
    }
  }
};
//------------------------------------------------------------------------------------------------------------------------------------------------
//SAVE
const savePostOrComment = async (req, res) => {
  try {
    await validateSavedPost(req);
    const type = req.body.type;
    let result;
    const user = await searchForUserService(req.payload.username);
    if (type === "post") {
      const post = await searchForPost(req.body.id);
      result = await savePost(post, user);
    }
    if (type === "comment") {
      const comment = await searchForComment(req.body.id);
      result = saveComment(comment, user);
    }
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Server Error");
    }
  }
};
//------------------------------------------------------------------------------------------------------------------------------------------------
//UNSAVE
const unsavePostOrComment = async (req, res) => {
  try {
    await validateSavedPost(req);
    const type = req.body.type;
    let result;
    const user = await searchForUserService(req.payload.username);
    if (type === "post") {
      const post = await searchForPost(req.body.id);
      result = await unSavePost(post, user);
    }
    if (type === "comment") {
      const comment = await searchForComment(req.body.id);
      result = await unSaveComment(comment, user);
    }
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Server Error");
    }
  }
};
//------------------------------------------------------------------------------------------------------------------------------------------------
//HIDE
const hidePost = async (req, res) => {
  try {
    await validateHidePost(req);
    const user = await searchForUserService(req.payload.username);
    const post = await searchForPost(req.body.id);
    const result = await hideAPost(post, user);
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Server Error");
    }
  }
};
//------------------------------------------------------------------------------------------------------------------------------------------------
//UNHIDE
const unhidePost = async (req, res) => {
  try {
    await validateHidePost(req);
    const user = await searchForUserService(req.payload.username);
    const post = await searchForPost(req.body.id);
    const result = await unhideAPost(post, user);
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Server Error");
    }
  }
};
//------------------------------------------------------------------------------------------------------------------------------------------------
//markAsSpam
const markAsSpam = async (req, res) => {
  try {
    await validateSpam(req);
    const user = await searchForUserService(req.payload.username);
    const type = req.body.type;
    let result;
    if (type === "post") {
      const post = await searchForPost(req.body.id);
      result = await markPostAsSpam(post, user);
    }
    if (type === "comment") {
      const comment = await searchForComment(req.body.id);
      result=await markCommentAsSpam(comment,user);
    }
    if (type === "message") {
        const message=await searchForMessage(req.body.id);
        result=await markMessageAsSpam(message,user);
    }
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Server Error");
    }
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//unmarkAsSpam
const unmarkAsSpam = async (req, res) => {
  try {
    await validateSpam(req);
    const user = await searchForUserService(req.payload.username);
    const type = req.body.type;
    let result;
    if (type === "post") {
      const post = await searchForPost(req.body.id);
      result = await unmarkPostAsSpam(post, user);
    }
    if (type === "comment") {
      const comment = await searchForComment(req.body.id);
      result=await unmarkCommentAsSpam(comment,user);
    }
    if (type === "message") {
        const message=await searchForMessage(req.body.id);
        result=await unmarkMessageAsSpam(message,user);
    }
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Server Error");
    }
  }
};

export default {
  followOrUnfollowPost,
  savePostOrComment,
  unsavePostOrComment,
  hidePost,
  unhidePost,
  markAsSpam,
  unmarkAsSpam,
};
