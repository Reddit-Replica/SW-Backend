import { body, param, check } from "express-validator";
import {
  checkDuplicateSocialLink,
  checkSocialLink,
  connectToFacebook,
  connectToGoogle,
  deleteFile,
  getUser,
  setNewEmail,
  setNewPassword,
  verifyCredentials,
} from "../services/userSettings.js";
import { listingBlockedUsers } from "../services/userListing.js";

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
    .withMessage("Password must not be empty")
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

const changePasswordValidator = [
  body("currentPassword")
    .not()
    .isEmpty()
    .withMessage("Current password must not be empty")
    .isLength({ min: 8 })
    .withMessage("Current password must be at least 8 chars long"),
  body("newPassword")
    .not()
    .isEmpty()
    .withMessage("New password must not be empty")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 chars long"),
  body("confirmNewPassword")
    .not()
    .isEmpty()
    .withMessage("Confirm New password must not be empty")
    .isLength({ min: 8 })
    .withMessage("Confirm New password must be at least 8 chars long"),
];

const changeEmailValidator = [
  body("currentPassword")
    .not()
    .isEmpty()
    .withMessage("Current password must not be empty")
    .isLength({ min: 8 })
    .withMessage("Current password must be at least 8 chars long"),
  body("newEmail").not().isEmpty().withMessage("New email must not be empty"),
];

const connectValidator = [
  param("type")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Type can not be empty"),
  check("type").isIn("google", "facebook"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password must not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long"),
  body("accessToken")
    .not()
    .isEmpty()
    .withMessage("Access Token must not be empty"),
];

const disconnectValidator = [
  param("type")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Type can not be empty"),
  check("type").isIn("google", "facebook"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password must not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long"),
];

const getAccountSettings = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    res.status(200).json({
      email: user.email,
      googleEmail: user.googleEmail,
      facebookEmail: user.facebookEmail,
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

// eslint-disable-next-line max-statements
const addSocialLink = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    if (!user.userSettings.socialLinks) {
      user.userSettings.socialLinks = [];
    }
    checkDuplicateSocialLink(
      user,
      req.body.type,
      req.body.displayText,
      req.body.link
    );
    if (user.userSettings.socialLinks.length >= 5) {
      return res.status(400).json({
        error: "Max social links limit reached",
      });
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

const deleteSocialLink = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    checkSocialLink(user, req.body.type, req.body.displayText, req.body.link);
    user.userSettings.socialLinks = user.userSettings.socialLinks.filter(
      (socialLink) =>
        socialLink.type !== req.body.type ||
        socialLink.displayText !== req.body.displayText ||
        socialLink.link !== req.body.link
    );
    await user.save();
    return res.status(204).json("Link deleted successfully");
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

// eslint-disable-next-line max-statements
const addProfilePicture = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({
        error: "Profile picture is required",
      });
    }
    if (user.avatar) {
      deleteFile(user.avatar);
    }
    user.avatar = req.files.avatar[0].path;
    await user.save();
    return res.status(200).json({
      path: user.avatar,
    });
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

const deleteProfilePicture = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    if (!user.avatar) {
      return res.status(400).json({
        error: "Profile picture already deleted",
      });
    }
    deleteFile(user.avatar);
    user.avatar = undefined;
    await user.save();
    return res.status(204).json("Profile picture deleted successfully");
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

// eslint-disable-next-line max-statements
const addBanner = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    if (!req.files || !req.files.banner) {
      return res.status(400).json({
        error: "Banner is required",
      });
    }
    if (user.banner) {
      deleteFile(user.banner);
    }
    user.banner = req.files.banner[0].path;
    await user.save();
    return res.status(200).json({
      path: user.banner,
    });
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

const deleteBanner = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    if (!user.banner) {
      return res.status(400).json({
        error: "Banner already deleted",
      });
    }
    deleteFile(user.banner);
    user.banner = undefined;
    await user.save();
    return res.status(204).json("Banner deleted successfully");
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

const getBlockedUsers = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await getUser(userId);
    const { before, after, limit } = req.query;

    let result = await listingBlockedUsers(limit, before, after, user);

    res.status(200).json(result);
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

const changePassword = async (req, res) => {
  const userId = req.payload.userId;
  const username = req.payload.username;
  try {
    const user = await getUser(userId);
    verifyCredentials(user, username, req.body.currentPassword);
    await setNewPassword(
      user,
      req.body.newPassword,
      req.body.confirmNewPassword
    );
    return res.status(200).json("Password changed successfully");
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

// eslint-disable-next-line max-statements
const changeEmail = async (req, res) => {
  const userId = req.payload.userId;
  const username = req.payload.username;
  try {
    const user = await getUser(userId);
    verifyCredentials(user, username, req.body.currentPassword);
    if (user.email === req.body.newEmail) {
      return res.status(400).json({
        error: "This email is already set",
      });
    }
    await setNewEmail(user, userId, req.body.newEmail);
    return res.status(200).json("Email changed successfully");
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

const connect = async (req, res) => {
  const type = req.params.type;
  try {
    const user = await getUser(req.payload.userId);
    verifyCredentials(user, req.payload.username, req.body.password);
    if (type === "google") {
      connectToGoogle(user, req.body.accessToken);
    } else {
      connectToFacebook(user, req.body.accessToken);
    }
    await user.save();
    return res.status(200).json("Connected successfully");
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

// eslint-disable-next-line max-statements
const disconnect = async (req, res) => {
  const type = req.params.type;
  try {
    const user = await getUser(req.payload.userId);
    verifyCredentials(user, req.payload.username, req.body.password);
    if (type === "google") {
      if (!user.googleEmail) {
        return res
          .status(400)
          .json({ error: "Google Email already disconnected" });
      }
      user.googleEmail = undefined;
    } else {
      if (!user.facebookEmail) {
        return res
          .status(400)
          .json({ error: "Facebook Email already disconnected" });
      }
      user.facebookEmail = undefined;
    }
    await user.save();
    return res.status(200).json("Disconnected successfully");
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
  deleteValidator,
  socialLinkValidator,
  changePasswordValidator,
  changeEmailValidator,
  disconnectValidator,
  connectValidator,
  getAccountSettings,
  editAccountSettings,
  deleteAccount,
  addSocialLink,
  deleteSocialLink,
  addProfilePicture,
  deleteProfilePicture,
  addBanner,
  deleteBanner,
  getBlockedUsers,
  changePassword,
  changeEmail,
  connect,
  disconnect,
};
