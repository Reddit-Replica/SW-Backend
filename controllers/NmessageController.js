/* eslint-disable max-len */
import Subreddit from "./../models/Community.js";
import User from "./../models/User.js";
import { body } from "express-validator";

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
    .withMessage(
      "message type must be Mentions or Messages"
    ),
];

//CREATE SUBREDDIT
// eslint-disable-next-line max-statements
const createMessage = async (req, res) => {
  try {
    //MAKE THE USER OWNER OF THE SUBREDDIT
    const moderator = await User.findById(creatorId);
    const addedSubreddit = {
      subredditId: subreddit.id,
      name: title,
    };
    moderator.ownedSubreddits.push(addedSubreddit);
    await moderator.save();
    moderator.joinedSubreddits.push(addedSubreddit);
    await moderator.save();
    //RETURN RESPONSE
    return res.status(201).send({
      subreddit: subreddit,
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
};
