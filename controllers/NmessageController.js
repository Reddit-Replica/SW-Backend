/* eslint-disable max-len */
import { body } from "express-validator";
import {
  addMention,
  addMessage,
  validateMessage,
} from "../services/MessageServices.js";

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
    const valid = await validateMessage(req);
    if (!valid) {
      throw new Error("this msg isn't valid to be sent", { cause: 401 });
    }
    let msg;
    if ((req.msg.type = "Messages")) {
      msg = await addMessage(req);
    }
    if ((req.msg.type = "Mentions")) {
      msg = await addMention(req);
    }
    if (msg !== "created") {
      throw new Error(msg, { cause: 401 });
    }
    return res.status(201).json("Your message is sent successfully");
  } catch (err) {
    if (err.cause) {
      return res.status(err.cause).json({
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
};
