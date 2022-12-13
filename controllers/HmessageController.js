import { body, check } from "express-validator";
import {
  readPostReplies,
  readReceivedMessages,
  readUnreadMessages,
  readUsernameMentions,
} from "../services/readMessages.js";

const messageValidator = [
  body("type").not().isEmpty().withMessage("Message type can't be empty"),
  check("type").isIn([
    "Post Replies",
    "Messages",
    "Username Mentions",
    "Unread Messages",
  ]),
];

const readAllMessages = async (req, res) => {
  const userId = req.payload.userId;
  const type = req.body.type;
  try {
    type === "Messages" && (await readReceivedMessages(userId));
    type === "Post Replies" && (await readPostReplies(userId));
    type === "Username Mentions" && (await readUsernameMentions(userId));
    type === "Unread Messages" && (await readUnreadMessages(userId));
    return res.status(200).json("Messages marked as read successfully");
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      if (error.statusCode === 400) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(error.statusCode).json(error.message);
      }
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

export default {
  messageValidator,
  readAllMessages,
};
