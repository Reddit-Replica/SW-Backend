import { body } from "express-validator";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const deleteValidator = [
  body("id").not().isEmpty().withMessage("Id can not be empty"),
  body("type").not().isEmpty().withMessage("Type can not be empty"),
];

const editPoComValidator = [
  body("id").not().isEmpty().withMessage("Id can not be empty"),
  body("type").not().isEmpty().withMessage("Type can not be empty"),
  body("text").not().isEmpty().withMessage("New text can not be empty"),
];

// eslint-disable-next-line max-statements
const deletePoComMes = async (req, res) => {
  try {
    const { id, type } = req.body;
    let item = {};
    if (type === "post") {
      item = await Post.findById(id);
    } else if (type === "comment") {
      item = await Comment.findById(id);
    } else if (type === "message") {
      // TODO
      // item = await Message.findById(id);
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
    if (item.ownerId.toString() !== userId) {
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
const editPoCom = async (req, res) => {
  try {
    const { id, type, text } = req.body;
    let item = {};
    if (type === "post") {
      item = await Post.findById(id);
    } else if (type === "comment") {
      item = await Comment.findById(id);
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
    if (item.ownerId.toString() !== userId) {
      return res.status(401).json("Access Denied");
    }

    if (type === "post") {
      // check the king of the post first
      if (item.kind !== "text") {
        return res.status(400).json("Post have no text to edit");
      }
    }

    item.content = text;
    await item.save();
    res.status(200).json("Item edited successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export default {
  deleteValidator,
  deletePoComMes,
  editPoComValidator,
  editPoCom,
};
