import {
  prepareSubredditSettings,
  updateSubredditSettings,
} from "../services/subredditSettings.js";
import { body } from "express-validator";
import { MainTopics } from "./NcommunityController.js";
// eslint-disable-next-line max-len
import {
  getSubredditModerators,
  getSubredditInvitedModerators,
} from "../services/subredditModerationServices.js";
const subredditSettingsValidator = [
  body("communityName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("communityName is required"),
  body("mainTopic")
    .trim()
    .not()
    .isEmpty()
    .withMessage("mainTopic is required")
    .isIn(MainTopics)
    .withMessage("Invalid main topic"),
  body("subTopics").isArray().withMessage("subTopics must be array"),
  body("subTopics.*").isIn(MainTopics).withMessage("invalid subtopics"),
  body("sendWelcomeMessage")
    .trim()
    .not()
    .isEmpty()
    .withMessage("sendWelcomeMessage is required"),
  body("language").trim().not().isEmpty().withMessage("language is required"),
  body("Type").trim().not().isEmpty().withMessage("Type is required"),
  body("Type")
    .isIn(["Private", "Restricted", "Public"])
    .withMessage("Invalid type"),
  body("NSFW").trim().not().isEmpty().withMessage("NSFW is required"),
  body("approvedUsersHaveTheAbilityTo")
    .optional()
    .isIn(["Post only", "Comment only", "Post & Comment"])
    .withMessage("invalid value for approvedUsersHaveTheAbilityTo"),
];

const getSubredditSettings = (req, res) => {
  try {
    const settings = prepareSubredditSettings(req.subreddit);
    res.status(200).json(settings);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};

const setSubredditSettings = async (req, res) => {
  try {
    await updateSubredditSettings(req.subreddit, req.body);
    res.status(200).json("Accepted");
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
};

const getModerators = async (req, res) => {
  try {
    const response = await getSubredditModerators(
      req.query.limit,
      req.query.before,
      req.query.after,
      req.subreddit
    );
    res.status(200).json(response);
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
};

const getInvitedModerators = async (req, res) => {
  try {
    const response = await getSubredditInvitedModerators(
      req.query.limit,
      req.query.before,
      req.query.after,
      req.subreddit
    );
    res.status(200).json(response);
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
};

export default {
  getSubredditSettings,
  setSubredditSettings,
  getModerators,
  getInvitedModerators,
  subredditSettingsValidator,
};
