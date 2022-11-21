import User from "../models/User.js";
import { body, check } from "express-validator";
import { listingSubredditPosts } from "../services/subredditItems.js";

const modValidator = [
  check("only")
    .isIn(["posts", "comments"])
    .withMessage("Only must be posts or comments"),
];

const getSpammedItems = async (req, res) => {
  try {
    const { sort, only, before, after, limit } = req.query;
    let result;
    if (only === "posts") {
      result = await listingSubredditPosts(
        req.params.subreddit,
        "spammedPosts",
        { sort, before, after, limit }
      );
    } else {
      result = await listingSubredditPosts(
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
    const { sort, only, before, after, limit } = req.query;
    let result;
    if (only === "posts") {
      result = await listingSubredditPosts(
        req.params.subreddit,
        "editedPosts",
        { sort, before, after, limit }
      );
    } else {
      result = await listingSubredditPosts(
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
    let result;
    result = await listingSubredditPosts(
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

export default {
  modValidator,
  getSpammedItems,
  getEditedItems,
  getUnmoderatedPosts,
};
