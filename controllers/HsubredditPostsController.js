import { body, query } from "express-validator";
import {
  addToApprovedUsers,
  addToMutedUsers,
  checkUserInSubreddit,
  removeFromApprovedUsers,
  removeFromMutedUsers,
} from "../services/postsModeration.js";
import {
  listingSubredditPosts,
  listingSubredditComments,
} from "../services/subredditItemsListing.js";
import { deleteFile, getUserByUsername } from "../services/userSettings.js";

const modValidator = [
  query("only")
    .optional()
    .isIn(["posts", "comments"])
    .withMessage("Only must be posts or comments"),
];

const usernameValidator = [
  body("username").not().isEmpty().withMessage("Username can't be empty"),
];

const getSpammedItems = async (req, res) => {
  try {
    let { sort, only, before, after, limit } = req.query;
    if (!sort) {
      sort = "new";
    }
    let result;
    if (!only) {
      only = "posts";
    }
    if (only === "posts") {
      result = await listingSubredditPosts(
        req.payload.userId,
        req.params.subreddit,
        "spammedPosts",
        { sort, before, after, limit }
      );
    } else if (only === "comments") {
      result = await listingSubredditComments(
        req.payload.userId,
        req.params.subreddit,
        "spammedComments",
        { sort, before, after, limit }
      );
    }

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

const getEditedItems = async (req, res) => {
  try {
    let { sort, only, before, after, limit } = req.query;
    if (!sort) {
      sort = "new";
    }
    let result;
    if (!only) {
      only = "posts";
    }
    if (only === "posts") {
      result = await listingSubredditPosts(
        req.payload.userId,
        req.params.subreddit,
        "editedPosts",
        { sort, before, after, limit }
      );
    } else if (only === "comments") {
      result = await listingSubredditComments(
        req.payload.userId,
        req.params.subreddit,
        "editedComments",
        { sort, before, after, limit }
      );
    }

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

const getUnmoderatedPosts = async (req, res) => {
  try {
    const { sort, before, after, limit } = req.query;
    if (!sort) {
      sort = "new";
    }
    let result;
    result = await listingSubredditPosts(
      req.payload.userId,
      req.params.subreddit,
      "unmoderatedPosts",
      { sort, before, after, limit }
    );

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

// eslint-disable-next-line max-statements
const addProfilePicture = async (req, res) => {
  try {
    const subreddit = req.subreddit;
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({
        error: "Subreddit picture is required",
      });
    }
    if (subreddit.picture) {
      deleteFile(subreddit.picture);
    }
    subreddit.picture = req.files.avatar[0].path;
    await subreddit.save();
    return res.status(200).json({
      path: subreddit.picture,
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
  try {
    const subreddit = req.subreddit;
    if (!subreddit.picture) {
      return res.status(400).json({
        error: "Profile picture already deleted",
      });
    }
    deleteFile(subreddit.picture);
    subreddit.picture = undefined;
    await subreddit.save();
    return res.status(204).json("Subreddit picture deleted successfully");
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
  try {
    const subreddit = req.subreddit;
    if (!req.files || !req.files.banner) {
      return res.status(400).json({
        error: "Banner is required",
      });
    }
    if (subreddit.banner) {
      deleteFile(subreddit.banner);
    }
    subreddit.banner = req.files.banner[0].path;
    await subreddit.save();
    return res.status(200).json({
      path: subreddit.banner,
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
  try {
    const subreddit = req.subreddit;
    if (!subreddit.banner) {
      return res.status(400).json({
        error: "Banner already deleted",
      });
    }
    deleteFile(subreddit.banner);
    subreddit.banner = undefined;
    await subreddit.save();
    return res.status(204).json("Subreddit banner deleted successfully");
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

const approveUser = async (req, res) => {
  try {
    const subreddit = req.subreddit;
    const user = await getUserByUsername(req.body.username);
    await addToApprovedUsers(subreddit, user, req.payload);
    return res.status(200).json("User successfully approved");
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

const muteUser = async (req, res) => {
  try {
    const subreddit = req.subreddit;
    const user = await getUserByUsername(req.body.username);
    checkUserInSubreddit(subreddit, user);
    await addToMutedUsers(subreddit, user, req.body.muteReason);
    return res.status(200).json("User successfully muted");
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

const removeUser = async (req, res) => {
  try {
    const subreddit = req.subreddit;
    const user = await getUserByUsername(req.body.username);
    await removeFromApprovedUsers(subreddit, user);
    return res.status(200).json("User successfully removed");
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

const unmuteUser = async (req, res) => {
  try {
    const subreddit = req.subreddit;
    const user = await getUserByUsername(req.body.username);
    checkUserInSubreddit(subreddit, user);
    await removeFromMutedUsers(subreddit, user);
    return res.status(200).json("User successfully unmuted");
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
  modValidator,
  usernameValidator,
  getSpammedItems,
  getEditedItems,
  getUnmoderatedPosts,
  addBanner,
  deleteBanner,
  addProfilePicture,
  deleteProfilePicture,
  approveUser,
  muteUser,
  removeUser,
  unmuteUser,
};
