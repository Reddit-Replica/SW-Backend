import { query } from "express-validator";
import {
  listingSubredditPosts,
  listingSubredditComments,
} from "../services/subredditItemsListing.js";

const modValidator = [
  query("only")
    .optional()
    .isIn(["posts", "comments"])
    .withMessage("Only must be posts or comments"),
];

const getSpammedItems = async (req, res) => {
  try {
    let { sort, only, before, after, limit } = req.query;
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

export default {
  modValidator,
  getSpammedItems,
  getEditedItems,
  getUnmoderatedPosts,
};
