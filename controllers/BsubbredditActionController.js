import { body } from "express-validator";
import {
  banUserService,
  getSubredditService,
  inviteToModerateService,
  cancelInvitationService,
  unbanUserService,
  acceptModerationInviteService,
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

const unbanUserValidator = [
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
];

const inviteModeratorValidator = [
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
  body("permissionToEverything")
    .not()
    .isEmpty()
    .withMessage("permissionToEverything can not be empty"),
  body("permissionToManageUsers")
    .not()
    .isEmpty()
    .withMessage("permissionToManageUsers can not be empty"),
  body("permissionToManageSettings")
    .not()
    .isEmpty()
    .withMessage("permissionToManageSettings can not be empty"),
  body("permissionToManageFlair")
    .not()
    .isEmpty()
    .withMessage("permissionToManageFlair can not be empty"),
  body("permissionToManagePostsComments")
    .not()
    .isEmpty()
    .withMessage("permissionToManagePostsComments can not be empty"),
];

const acceptModerationInviteValidator = [
  body("subreddit")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Subreddit name can not be empty"),
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

const unbanUser = async (req, res) => {
  try {
    const moderator = await getUserFromJWTService(req.payload.userId);
    const userToBan = await searchForUserService(req.body.username);
    const subreddit = await getSubredditService(req.body.subreddit);

    const result = await unbanUserService(moderator, userToBan, subreddit);
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

const inviteModerators = async (req, res) => {
  try {
    const moderator = await getUserFromJWTService(req.payload.userId);
    const userToInvite = await searchForUserService(req.body.username);
    const subreddit = await getSubredditService(req.body.subreddit);

    const result = await inviteToModerateService(
      moderator,
      userToInvite,
      subreddit,
      {
        permissionToEverything: req.body.permissionToEverything,
        permissionToManageUsers: req.body.permissionToManageUsers,
        permissionToManageSettings: req.body.permissionToManageSettings,
        permissionToManageFlair: req.body.permissionToManageFlair,
        permissionToManagePostsComments:
          req.body.permissionToManagePostsComments,
      }
    );
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

const cancelInvitation = async (req, res) => {
  try {
    const moderator = await getUserFromJWTService(req.payload.userId);
    const invitedUser = await searchForUserService(req.body.username);
    const subreddit = await getSubredditService(req.body.subreddit);

    const result = await cancelInvitationService(
      moderator,
      invitedUser,
      subreddit
    );
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

const acceptModerationInvite = async (req, res) => {
  try {
    const user = await getUserFromJWTService(req.payload.userId);
    const subreddit = await getSubredditService(req.body.subreddit);

    const result = await acceptModerationInviteService(user, subreddit);
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
  unbanUserValidator,
  unbanUser,
  inviteModeratorValidator,
  inviteModerators,
  cancelInvitation,
  acceptModerationInviteValidator,
  acceptModerationInvite,
};
