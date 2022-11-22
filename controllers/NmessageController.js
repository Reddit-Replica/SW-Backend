/* eslint-disable max-len */
import { body } from "express-validator";
import { addMessage, validateMessage } from "../services/MessageServices.js";

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
    const valid = validateMessage(req);
    if (!valid) {
      throw new Error("this msg can't be sent", { cause: 400 });
    }
    const msg = await addMessage(req);
    console.log(msg);
    if (!msg.id) {
      throw new Error(msg, { cause: 400 });
    }
    return res.status(201).send({
      msg: msg,
    });
  } catch (err) {
    if (err.cause) {
      return res.status(err.cause).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

export default {
  createMessage,
  messageValidator,
};
