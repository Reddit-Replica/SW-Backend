/* eslint-disable max-statements */
/* eslint-disable max-depth */
/* eslint-disable max-len */
import { body } from "express-validator";
import {
  addMention,
  addMessage,
  validateMessage,
  markMessageAsSpam,
  searchForMessage,
  unreadMessage,
  validateMention,
} from "../services/messageServices.js";
import {
  userMessageListing,
  userMentionsListing,
  userConversationListing,
  userInboxListing,
} from "../services/messageListing.js";
import { searchForUserService } from "../services/userServices.js";
import { ConsoleReporter } from "jasmine";
import Mention from "../models/Mention.js";
import Message from "../models/Message.js";
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
    await addMessage(req);
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

const createMention = async (req, res) => {
  try {
    //ADDING NEW MENTION
    validateMention(req);
    await addMention(req);
    return res.status(201).json("Your mention is sent successfully");
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

const getSentMsg = async (req, res) => {
  try {
    let { before, after, limit } = req.query;
    const user = await searchForUserService(req.payload.username);
    if (!before && !after) {
      for (const msgId of user.sentMessages) {
        const msg = await Message.findById(msgId);
        if (msg && !msg.deletedAt) {
          before = msgId;
          break;
        }
      }
    }
    if (!before && !after) {
      res.status(200).json({ before: "", after: "", children: [] });
    } else {
      const result = await userMessageListing(
        user,
        "sentMessages",
        {
          before,
          after,
          limit,
        },
        false
      );
      res.status(result.statusCode).json(result.data);
    }
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getUnreadMsg = async (req, res) => {
  try {
    let { before, after, limit } = req.query;
    const user = await searchForUserService(req.payload.username);
    if (!before && !after) {
      for (const msgId of user.receivedMessages) {
        const msg = await Message.findById(msgId);
        if (msg && !msg.deletedAt) {
          before = msgId;
          break;
        }
      }
    }
    if (!before && !after) {
      res.status(200).json({ before: "", after: "", children: [] });
    } else {
      const result = await userMessageListing(
        user,
        "receivedMessages",
        {
          before,
          after,
          limit,
        },
        true
      );
      res.status(result.statusCode).json(result.data);
    }
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getUsernameMentions = async (req, res) => {
  try {
    let { before, after, limit } = req.query;
    const user = await searchForUserService(req.payload.username);
    if (!before && !after) {
      for (const mentionId of user.usernameMentions) {
        const mention = await Mention.findById(mentionId);
        if (mention && !mention.deletedAt) {
          before = mentionId;
          break;
        }
      }
    }
    if (!before && !after) {
      res.status(200).json({ before: "", after: "", children: [] });
    } else {
      const result = await userMentionsListing(user, "UsernameMention", {
        before,
        after,
        limit,
      });
      res.status(result.statusCode).json(result.data);
    }
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getpostReplies = async (req, res) => {
  try {
    const { before, after, limit } = req.query;
    const user = await searchForUserService(req.payload.username);
    const result = await userMessageListing(user, "postReplies", {
      before,
      after,
      limit,
    });
    res.status(result.statusCode).json(result.data);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getConversations = async (req, res) => {
  try {
    const { before, after, limit } = req.query;
    const user = await searchForUserService(req.payload.username);
    const result = await userConversationListing(user, "conversations", {
      before,
      after,
      limit,
    });
    res.status(result.statusCode).json(result.data);
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getInbox = async (req, res) => {
  try {
    const { before, after, limit } = req.query;
    const user = await searchForUserService(req.payload.username);
    const result = await userInboxListing(user, {
      before,
      after,
      limit,
    });
    res.status(result.statusCode).json(result.data);
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

export default {
  createMessage,
  messageValidator,
  markMsgAsSpam,
  unreadMsg,
  getSentMsg,
  getUsernameMentions,
  getpostReplies,
  createMention,
  getUnreadMsg,
  getConversations,
  getInbox,
};
