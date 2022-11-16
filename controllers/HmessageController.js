import { body, check } from "express-validator";
import {
  readPostReplies,
  readReceivedMessages,
  readUnreadMessages,
  readUsernameMentions,
} from "../services/readMessages.js";

const messageValidator = [
  body("type").not().isEmpty().withMessage("Message type can't be empty"),
  check("type").isIn(["Post Replies", "Messages", "Username Mentions"]),
];

const readAllMessages = async (req, res) => {
  const userId = req.payload.userId;
  const type = req.body.type;
  try {
    type === "Messages" && readReceivedMessages(userId);
    type === "Post Replies" && readPostReplies(userId);
    type === "Username Mentions" && readUsernameMentions(userId);
    type === "Unread Messages" && readUnreadMessages(userId);
    return res.status(200).json("Messages marked as read successfully");
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

export default {
  messageValidator,
  readAllMessages,
};
