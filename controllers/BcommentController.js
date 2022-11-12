import { body } from "express-validator";
import Comment from "../models/Comment.js";
import User from "./../models/User.js";
import Community from "./../models/Community.js";

const createCommentValidator = [
  body("text").not().isEmpty().withMessage("Text can not be empty"),
  body("parentId").not().isEmpty().withMessage("Parent Id can not be empty"),
  body("parentType")
    .not()
    .isEmpty()
    .withMessage("Parent Type can not be empty"),
  body("level").not().isEmpty().withMessage("Level can not be empty"),
  body("subredditName")
    .not()
    .isEmpty()
    .withMessage("Subreddit name can not be empty"),
];

// eslint-disable-next-line max-statements
const createComment = async (req, res) => {
  try {
    const { text, parentId, parentType, level } = req.body;
    const { username, userId } = req.payload;
    let subredditName = req.body.subredditName;

    // check if the subreddit exists
    if (subredditName !== "user") {
      const subreddit = await Community.findOne({ title: subredditName });
      if (!subreddit) {
        return res
          .status(400)
          .json({ error: "Can not find subreddit with that name" });
      }
    } else {
      subredditName = "null";
    }

    if (parentType !== "post" && parentType !== "comment") {
      return res.status(400).json({ error: "Invalid parent type" });
    }

    const comment = new Comment({
      parentId: parentId,
      parentType: parentType,
      level: level,
      content: text,
      ownerUsername: username,
      ownerId: userId,
      subredditName: subredditName,
    });

    await comment.save();

    const user = await User.findById(userId);
    user.comments.push(comment._id);
    await user.save();

    res.status(201).json("Comment created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export default { createCommentValidator, createComment };
