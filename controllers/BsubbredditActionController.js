import { body } from "express-validator";
import {
  banUserService,
  getSubredditService,
} from "../services/subredditActionsServices.js";
import {
  getUserFromJWTService,
  searchForUserService,
} from "../services/userServices.js";

const banUserValidator = [
  body("username")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Username can not be empty"),
  body("subreddit")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Subreddit name can not be empty"),
  body("reasonForBan")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Reason for ban can not be empty"),
];

const banUser = async (req, res) => {
  try {
    const moderator = await getUserFromJWTService(req.payload.userId);
    const userToBan = await searchForUserService(req.body.username);
    const subreddit = await getSubredditService(req.body.subreddit);

    const result = await banUserService(moderator, userToBan, subreddit, {
      banPeriod: req.body.banPeriod,
      reasonForBan: req.body.reasonForBan,
      modNote: req.body.modNote,
      noteInclude: req.body.noteInclude,
    });
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

export default {
  banUserValidator,
  banUser,
};
