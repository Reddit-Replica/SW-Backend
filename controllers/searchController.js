import { check, query } from "express-validator";
import {
  searchComments,
  searchPosts,
  searchSubreddits,
  searchUsers,
} from "../services/search.js";

const searchValidator = [
  query("q").not().isEmpty().withMessage("Query must be given").trim().escape(),
  query("type")
    .not()
    .isEmpty()
    .withMessage("Type must be given")
    .trim()
    .escape(),
  check("type").isIn(["post", "comment", "user", "subreddit"]),
];

// eslint-disable-next-line max-statements
const search = async (req, res) => {
  const type = req.query.type;
  const query = req.query.q;
  const { after, before, limit, sort, time } = req.query;
  try {
    let result;
    if (type === "post") {
      result = await searchPosts(query, {
        after,
        before,
        limit,
        sort,
        time,
      });
    } else if (type === "comment") {
      searchComments(query, { after, before, limit, sort, time });
    } else if (type === "user") {
      searchUsers(query, { after, before, limit, sort, time });
    } else {
      searchSubreddits(query, { after, before, limit, sort, time });
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
  search,
};
