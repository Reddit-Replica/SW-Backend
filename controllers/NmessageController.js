/* eslint-disable max-len */
import { body } from "express-validator";
import {
  addMention,
  addMessage,
  validateMessage,
  markMessageAsSpam,
  searchForMessage,
  unreadMessage,
} from "../services/messageServices.js";
import { searchForUserService } from "../services/userServices.js";

//CHECKING ON MESSAGE CONTENT
const messageValidator = [
  body("text")
    .trim()
    .not()
    .isEmpty()
    .withMessage("message content can not be empty"),
  body("senderUsername")
    .trim()
    .not()
    .isEmpty()
    .withMessage("sender username can not be empty"),
  body("receiverUsername")
    .trim()
    .not()
    .isEmpty()
    .withMessage("receiver username can not be empty"),
  body("type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("type can not be empty")
    .isIn(["Mentions", "Messages"])
    .withMessage("message type must be either Mentions or Messages"),
];

const createMessage = async (req, res) => {
  try {
    //ADDING NEW MESSAGE
    await validateMessage(req);
    if (req.msg.type === "Messages") {
      await addMessage(req);
    }
    if (req.msg.type === "Mentions") {
      await addMention(req);
    }
    return res.status(201).json("Your message is sent successfully");
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

const markMsgAsSpam = async (req, res) => {
  try {
    const user = await searchForUserService(req.payload.username);
    const msg = await searchForMessage(req.body.id);
    const result = await markMessageAsSpam(msg, user);
    res.status(result.statusCode).json(result.message);
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

const unreadMsg = async (req, res) => {
  try {
    const user = await searchForUserService(req.payload.username);
    const msg = await searchForMessage(req.body.id);
    const result = await unreadMessage(msg, user);
    res.status(result.statusCode).json(result.message);
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
  createMessage,
  messageValidator,
  markMsgAsSpam,
  unreadMsg,
};
