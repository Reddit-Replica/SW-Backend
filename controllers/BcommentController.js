import { body, param } from "express-validator";
import Comment from "../models/Comment.js";
import User from "./../models/User.js";
import Community from "./../models/Community.js";
import Post from "./../models/Post.js";
import mongoose from "mongoose";
import {
  commentTreeListing,
  checkPostId,
  checkCommentId,
  checkloggedInUser,
  commentTreeOfCommentListing,
} from "../services/commentServices.js";

const createCommentValidator = [
  body("text").not().isEmpty().withMessage("Text can not be empty"),
  body("parentId").not().isEmpty().withMessage("Parent Id can not be empty"),
  body("parentType")
    .not()
    .isEmpty()
    .withMessage("Parent Type can not be empty"),
  body("level").not().isEmpty().withMessage("Level can not be empty"),
  body("haveSubreddit")
    .not()
    .isEmpty()
    .withMessage("Have subreddit boolean can not be empty"),
];

const getCommentTreeValidator = [
  param("postId")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Post id can not be empty"),
];

const getCommentTreeOfCommentValidator = [
  param("postId")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Post id can not be empty"),
  param("commentId")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Comment id can not be empty"),
];

// eslint-disable-next-line max-statements
const createComment = async (req, res) => {
  try {
    // REFACTOR and add postId and ownerAvatar
    const { text, parentId, parentType, level, subredditName, haveSubreddit } =
      req.body;
    const { username, userId } = req.payload;

    if (parentType !== "post" && parentType !== "comment") {
      return res.status(400).json({ error: "Invalid parent type" });
    }

    const user = await User.findById(userId);
    if (!user || user.deletedAt) {
      return res.status(400).json({ error: "Can not find user with that id" });
    }

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ error: "Invalid parent id" });
    }

    // if the parent is a post get it
    let post = {};
    if (parentType === "post") {
      post = await Post.findById(parentId);
      if (!post || post.deletedAt) {
        return res
          .status(400)
          .json({ error: "Can not find post with that id" });
      }
    }

    let parentComment = {};
    if (parentType === "comment") {
      parentComment = await Comment.findById(parentId);
      if (!parentComment || parentComment.deletedAt) {
        return res
          .status(400)
          .json({ error: "Can not find comment with that id" });
      }
    }

    const commentObject = {
      parentId: parentId,
      parentType: parentType,
      level: level,
      content: text,
      ownerUsername: username,
      ownerId: userId,
    };

    // check if the subreddit exists
    if (haveSubreddit) {
      const subreddit = await Community.findOne({
        title: subredditName,
        deletedAt: null,
      });
      if (!subreddit) {
        return res
          .status(400)
          .json({ error: "Can not find subreddit with that name" });
      }
      commentObject.subredditName = subredditName;
    }

    const comment = new Comment(commentObject);
    await comment.save();

    user.comments.push(comment._id);
    await user.save();

    if (parentType === "post") {
      const index = post.usersCommented.findIndex(
        (elem) => elem.toString() === userId
      );
      if (index === -1) {
        post.usersCommented.push(user._id);
        await post.save();
      }
    } else {
      parentComment.children.push(comment._id);
      await parentComment.save();
    }

    res.status(201).json("Comment created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const commentTree = async (req, res) => {
  try {
    const { sort, before, after, limit } = req.query;
    const { postId } = req.params;

    const post = await checkPostId(postId);
    const user = await checkloggedInUser(req.userId);
    const result = await commentTreeListing(user, post, {
      sort,
      before,
      after,
      limit,
    });

    res.status(result.statusCode).json(result.data);
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const commentTreeOfComment = async (req, res) => {
  try {
    const { sort, before, after, limit } = req.query;
    const { postId, commentId } = req.params;

    const post = await checkPostId(postId);
    const comment = await checkCommentId(commentId);
    const user = await checkloggedInUser(req.userId);
    const result = await commentTreeOfCommentListing(user, post, comment, {
      sort,
      before,
      after,
      limit,
    });

    res.status(result.statusCode).json(result.data);
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

export default {
  createCommentValidator,
  createComment,
  getCommentTreeValidator,
  commentTree,
  getCommentTreeOfCommentValidator,
  commentTreeOfComment,
};
