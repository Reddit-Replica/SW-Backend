import User from "../models/User.js";
import { body } from "express-validator";
import {
  checkSocialLink,
  getUser,
  verifyCredentials,
} from "../services/userSettings.js";

const deleteValidator = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("Username must not be empty")
    .trim()
    .escape(),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Username must not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long"),
];

const socialLinkValidator = [
  body("type")
    .not()
    .isEmpty()
    .withMessage("Type can't be empty")
    .trim()
    .escape(),
  body("displayText")
    .not()
    .isEmpty()
    .withMessage("Display text can't be empty")
    .trim()
    .escape(),
  body("link")
    .not()
    .isEmpty()
    .withMessage("Link can't be empty")
    .trim()
    .escape(),
];

const getAccountSettings = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    res.status(200).json({
      email: user.email,
      country: user.userSettings.country,
      gender: user.userSettings.gender,
      displayName: user.displayName,
      about: user.about,
      socialLinks: user.userSettings.socialLinks,
      havePassword: user.password ? true : false,
      hasVerifiedEmail: user.userSettings.verifiedEmail,
      nsfw: user.userSettings.nsfw,
      allowToFollowYou: user.userSettings.allowToFollowYou,
      adultContent: user.userSettings.adultContent,
      autoplayMedia: user.userSettings.autoplayMedia,
      newFollowerEmail: user.userSettings.newFollowerEmail,
      unsubscribeFromEmails: user.userSettings.unsubscribeFromEmails,
    });
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

// eslint-disable-next-line max-statements
const editAccountSettings = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    user.userSettings.country = req.body.country ?? user.userSettings.country;
    user.userSettings.gender = req.body.gender ?? user.userSettings.gender;
    user.displayName = req.body.displayName ?? user.displayName;
    user.about = req.body.about ?? user.about;
    user.userSettings.nsfw = req.body.nsfw ?? user.userSettings.nsfw;
    user.userSettings.allowToFollowYou =
      req.body.allowToFollowYou ?? user.userSettings.allowToFollowYou;
    user.userSettings.adultContent =
      req.body.adultContent ?? user.userSettings.adultContent;
    user.userSettings.autoplayMedia =
      req.body.autoplayMedia ?? user.userSettings.autoplayMedia;
    user.userSettings.newFollowerEmail =
      req.body.newFollowerEmail ?? user.userSettings.newFollowerEmail;
    user.userSettings.unsubscribeFromEmails =
      req.body.unsubscribeFromEmails ?? user.userSettings.unsubscribeFromEmails;
    await user.save();
    res.status(200).json("Account settings changed successfully");
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const deleteAccount = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    verifyCredentials(user, req.body.username, req.body.password);
    if (user.deletedAt) {
      return res.status(401).json("Account is already deleted");
    }
    user.deletedAt = Date.now();
    await user.save();
    return res.status(204).json("Account deleted successfully");
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const addSocialLink = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    if (!user.userSettings.socialLinks) {
      user.userSettings.socialLinks = [];
    }
    user.userSettings.socialLinks.push({
      type: req.body.type,
      displayText: req.body.displayText,
      link: req.body.link,
    });
    await user.save();
    return res.status(201).json("Link added successfully");
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const deleteSocialLink = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    checkSocialLink(user, req.body.type, req.body.displayText, req.body.link);
    user.userSettings.socialLinks = user.userSettings.socialLinks.filter(
      (socialLink) =>
        socialLink.type !== req.body.type &&
        socialLink.displayText !== req.body.displayText &&
        socialLink.link !== req.body.link
    );
    await user.save();
    return res.status(204).json("Link deleted successfully");
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
  deleteValidator,
  socialLinkValidator,
  getAccountSettings,
  editAccountSettings,
  deleteAccount,
  addSocialLink,
  deleteSocialLink,
};
