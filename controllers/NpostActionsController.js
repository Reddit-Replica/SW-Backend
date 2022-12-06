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
} from "../services/PostActions.js";
import { searchForUserService } from "../services/userServices.js";
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
      result=saveComment(comment, user);
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
      result - (await unSaveComment(comment, user));
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

export default {
  followOrUnfollowPost,
  savePostOrComment,
  unsavePostOrComment,
};
