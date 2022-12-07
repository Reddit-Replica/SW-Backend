/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
  unfollowPost,
  followPost,
  unSavePost,
  savePost,
  searchForPost,
  saveComment,
  unSaveComment,
  searchForComment,
  hideAPost,
  unhideAPost,
  unmarkPostAsSpam,
  markPostAsSpam,
  markCommentAsSpam,
  unmarkCommentAsSpam,
  downVoteAPost,
  upVoteAPost,
} from "../services/PostActions.js";
import { searchForUserService } from "../services/userServices.js";
import {
  searchForMessage,
  markMessageAsSpam,
  unmarkMessageAsSpam,
} from "../services/messageServices.js";

import { body } from "express-validator";
//------------------------------------------------------------------------------------------------------------------------------------------------
//VALIDATION
const voteValidator = [
  body("id").trim().not().isEmpty().withMessage("id content can not be empty"),
  body("direction")
    .trim()
    .not()
    .isEmpty()
    .withMessage("direction can not be empty")
    .isIn([1, -1])
    .withMessage("direction must be either 1 or -1"),
  body("type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("type can not be empty")
    .isIn(["post", "comment"])
    .withMessage("vote type must be either post or comment"),
];
const saveValidator = [
  body("id").trim().not().isEmpty().withMessage("id content can not be empty"),
  body("type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("type can not be empty")
    .isIn(["post", "comment"])
    .withMessage("vote type must be either post or comment"),
];
const spamValidator = [
  body("id").trim().not().isEmpty().withMessage("id content can not be empty"),
  body("type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("type can not be empty")
    .isIn(["post", "comment", "message"])
    .withMessage("vote type must be either post or comment or message"),
];
const followValidator = [
  body("id").trim().not().isEmpty().withMessage("id content can not be empty"),
  body("follow")
    .trim()
    .not()
    .isEmpty()
    .withMessage("type can not be empty")
    .isBoolean()
    .withMessage("follow must be true or false"),
];
const hideValidator = [
  body("id").trim().not().isEmpty().withMessage("id content can not be empty"),
];
//------------------------------------------------------------------------------------------------------------------------------------------------
//FOLLOW
const followOrUnfollowPost = async (req, res) => {
  try {
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
//SAVE
const savePostOrComment = async (req, res) => {
  try {
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
//MARK AS SPAM
const markAsSpam = async (req, res) => {
  try {
    const user = await searchForUserService(req.payload.username);
    const type = req.body.type;
    let result;
    if (type === "post") {
      const post = await searchForPost(req.body.id);
      result = await markPostAsSpam(post, user);
    }
    if (type === "comment") {
      const comment = await searchForComment(req.body.id);
      result = await markCommentAsSpam(comment, user);
    }
    if (type === "message") {
      const message = await searchForMessage(req.body.id);
      result = await markMessageAsSpam(message, user);
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
//UNMARK AS SPAM
const unmarkAsSpam = async (req, res) => {
  try {
    const user = await searchForUserService(req.payload.username);
    const type = req.body.type;
    let result;
    if (type === "post") {
      const post = await searchForPost(req.body.id);
      result = await unmarkPostAsSpam(post, user);
    }
    if (type === "comment") {
      const comment = await searchForComment(req.body.id);
      result = await unmarkCommentAsSpam(comment, user);
    }
    if (type === "message") {
      const message = await searchForMessage(req.body.id);
      result = await unmarkMessageAsSpam(message, user);
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
//VOTE
const vote = async (req, res) => {
  try {
    const user = await searchForUserService(req.payload.username);
    const type = req.body.type;
    const direction = parseInt(req.body.direction);

    let result;
    if (direction === 1) {
      console.log("haaa");
      if (type === "post") {
        const post = await searchForPost(req.body.id);
        result = await upVoteAPost(post, user);
      }
      if (type === "comment") {
        const comment = await searchForComment(req.body.id);
        result = await unmarkCommentAsSpam(comment, user);
      }
    } else if (direction === -1) {
      if (type === "post") {
        const post = await searchForPost(req.body.id);
        result = await downVoteAPost(post, user);
      }
      if (type === "comment") {
        const comment = await searchForComment(req.body.id);
        result = await unmarkCommentAsSpam(comment, user);
      }
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
  vote,
  voteValidator,
  saveValidator,
  hideValidator,
  followValidator,
  spamValidator,
};
