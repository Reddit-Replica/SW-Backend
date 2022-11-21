import User from "../models/User.js";
import { body, check } from "express-validator";
import { listingSubredditPosts } from "../services/subredditItems.js";

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

export default {
  postIdValidator,
  pinPostValidator,
  submitValidator,
  submit,
  pinPost,
  getPinnedPosts,
  postDetails,
  postInsights,
};
