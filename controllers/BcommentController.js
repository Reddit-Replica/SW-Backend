import { body, param } from "express-validator";
import {
  commentTreeListingService,
  checkPostId,
  checkCommentId,
  checkloggedInUser,
  commentTreeOfCommentListingService,
  createCommentService,
} from "../services/commentServices.js";

const createCommentValidator = [
  body("content")
    .not()
    .isEmpty()
    .withMessage("Content of the comment can not be empty"),
  body("parentId").not().isEmpty().withMessage("Parent Id can not be empty"),
  body("postId").not().isEmpty().withMessage("Post Id can not be empty"),
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
    const {
      content,
      postId,
      parentId,
      parentType,
      level,
      subredditName,
      haveSubreddit,
    } = req.body;
    const { username, userId } = req.payload;

    const post = await checkPostId(postId);
    const result = await createCommentService(
      {
        content,
        parentId,
        postId,
        parentType,
        level,
        subredditName,
        haveSubreddit,
        username,
        userId,
      },
      post
    );

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

const commentTree = async (req, res) => {
  try {
    let { sort } = req.query;
    const { before, after, limit } = req.query;
    const { postId } = req.params;

    const post = await checkPostId(postId);
    const user = await checkloggedInUser(req.userId);

    if (!sort) {
      sort = post.suggestedSort;
    }

    const result = await commentTreeListingService(user, post, {
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
    let { sort } = req.query;
    const { before, after, limit } = req.query;
    const { postId, commentId } = req.params;

    const post = await checkPostId(postId);
    const comment = await checkCommentId(commentId);
    const user = await checkloggedInUser(req.userId);

    if (!sort) {
      sort = post.suggestedSort;
    }

    const result = await commentTreeOfCommentListingService(
      user,
      post,
      comment,
      {
        sort,
        before,
        after,
        limit,
      }
    );

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
