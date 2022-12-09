import { body } from "express-validator";
import Comment from "../models/Comment.js";
import Message from "../models/Message.js";
import Post from "../models/Post.js";

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
    let item = {};
    let itemOwnerId = "ownerId";
    if (type === "post") {
      item = await Post.findById(id);
    } else if (type === "comment") {
      item = await Comment.findById(id);
    } else if (type === "message") {
      item = await Message.findById(id);
      itemOwnerId = "receiverId";
    } else {
      return res
        .status(400)
        .json({ error: "Invalid request: type is invalid value" });
    }

    // check if the item was deleted before or does not exist
    if (!item || item.deletedAt) {
      return res.status(404).json("Item was not found");
    }

    // check if the item was created by the same user making the request
    const { userId } = req.payload;
    if (item[itemOwnerId].toString() !== userId) {
      return res.status(401).json("Access Denied");
    }

    // if yes then add deletedAt to the post
    item.deletedAt = Date.now();
    await item.save();

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
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
