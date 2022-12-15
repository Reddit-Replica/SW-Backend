import { body } from "express-validator";
import Comment from "../models/Comment.js";
import { deleteItems } from "../services/itemsActionsServices.js";

const deleteValidator = [
  body("id").not().isEmpty().withMessage("Id can not be empty"),
  body("type").not().isEmpty().withMessage("Type can not be empty"),
];

const editComValidator = [
  body("id").not().isEmpty().withMessage("Id can not be empty"),
  body("content").not().isEmpty().withMessage("New content can not be empty"),
];

// eslint-disable-next-line max-statements
const deletePoComMes = async (req, res) => {
  try {
    const { id, type } = req.body;

    const result = await deleteItems(req.payload.userId, id, type);
    res.status(result.statusCode).json(result.message);
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

// eslint-disable-next-line max-statements
const editComment = async (req, res) => {
  try {
    const { id, content } = req.body;
    const comment = await Comment.findById(id);

    // check if the comment was deleted before or does not exist
    if (!comment || comment.deletedAt) {
      return res.status(404).json("Comment was not found");
    }

    // check if the comment was created by the same user making the request
    const { userId } = req.payload;
    if (comment.ownerId.toString() !== userId) {
      return res.status(401).json("Access Denied");
    }

    comment.content = content;
    await comment.save();
    res.status(200).json("Item edited successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export default {
  deleteValidator,
  deletePoComMes,
  editComValidator,
  editComment,
};
