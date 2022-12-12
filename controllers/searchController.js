import { check, param, query } from "express-validator";
import {
  getLoggedInUser,
  searchComments,
  searchPosts,
  searchSubreddits,
  searchUsers,
} from "../services/search.js";
import {
  searchForComments,
  searchForPosts,
} from "../services/searchInSubreddit.js";

const searchValidator = [
  query("q").not().isEmpty().withMessage("Query must be given").trim().escape(),
  query("type")
    .optional()
    .isIn(["post", "comment", "user", "subreddit"])
    .withMessage("Invalid value for type"),
];

const searchSubredditValidator = [
  query("q").not().isEmpty().withMessage("Query must be given").trim().escape(),
  query("type")
    .optional()
    .isIn(["post", "comment", "user", "subreddit"])
    .withMessage("Invalid value for type"),
  param("subreddit")
    .not()
    .isEmpty()
    .withMessage("Subreddit name should be given")
    .trim()
    .escape(),
];

// eslint-disable-next-line max-statements
const search = async (req, res) => {
  let type = req.query.type;
  const query = req.query.q;
  const { after, before, limit, sort, time } = req.query;
  try {
    let loggedInUser = undefined;
    if (req.loggedIn) {
      const user = await getLoggedInUser(req.userId);
      if (user) {
        loggedInUser = user;
      }
    }
    let result;
    if (!type) {
      type = "post";
    }
    if (type === "post") {
      result = await searchPosts(query, {
        after,
        before,
        limit,
        sort,
        time,
      });
    } else if (type === "comment") {
      result = await searchComments(query, {
        after,
        before,
        limit,
        sort,
        time,
      });
    } else if (type === "user") {
      result = await searchUsers(
        query,
        { after, before, limit, time },
        loggedInUser
      );
    } else {
      result = await searchSubreddits(
        query,
        {
          after,
          before,
          limit,
          time,
        },
        loggedInUser
      );
    }
    res.status(result.statusCode).json(result.data);
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
const searchSubreddit = async (req, res) => {
  const type = req.query.type;
  const subreddit = req.params.subreddit;
  const query = req.query.q;
  const { after, before, limit, sort, time } = req.query;
  try {
    let result;
    if (!type) {
      type = "post";
    }
    if (type === "post") {
      result = await searchForPosts(subreddit, query, {
        after,
        before,
        limit,
        sort,
        time,
      });
    } else {
      result = await searchForComments(subreddit, query, {
        after,
        before,
        limit,
        sort,
        time,
      });
    }
    res.status(result.statusCode).json(result.data);
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
  searchValidator,
  searchSubredditValidator,
  search,
  searchSubreddit,
};
