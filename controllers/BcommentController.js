import { body } from "express-validator";
import Comment from "../models/Comment.js";

const createCommentValidator = [
  body("text").not().isEmpty().withMessage("Text can not be empty"),
  body("parentId").not().isEmpty().withMessage("Parent Id can not be empty"),
  body("parentType")
    .not()
    .isEmpty()
    .withMessage("Parent Type can not be empty"),
  body("level").not().isEmpty().withMessage("Level can not be empty"),
];

const createComment = async (req, res) => {
  try {
    const { text, parentId, parentType, level } = req.body;
    const username = req.decodedPayload.username;

    const comment = new Comment({
      parentId: parentId,
      parentType: parentType,
      level: level,
      content: text,
      ownerUsername: username,
    });

    await comment.save();
    res.status(201).send("Comment created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export default { createCommentValidator, createComment };
