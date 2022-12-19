import { query } from "express-validator";
import {
  checkSubredditFlair,
  subredditHome,
} from "../services/subredditItemsListing.js";
import { getUser } from "../services/userSettings.js";

const limitValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit can't be <= 0"),
];

// eslint-disable-next-line max-statements
const getHotSubredditPosts = async (req, res) => {
  try {
    const userId = req.payload?.userId;
    const subredditName = req.params.subreddit;
    let { flairId, before, after, limit } = req.query;
    let user = undefined;
    if (userId) {
      user = await getUser(userId);
    }
    const flair = await checkSubredditFlair(subredditName, flairId);
    const sort = "hot";
    if (!before & !after) {
      after = 0;
    }
    const result = await subredditHome(user, subredditName, flair, {
      sort,
      before,
      after,
      limit,
    });

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
const getTrendingSubredditPosts = async (req, res) => {
  try {
    const userId = req.payload?.userId;
    const subredditName = req.params.subreddit;
    let { flairId, before, after, limit } = req.query;
    let user = undefined;
    if (userId) {
      user = await getUser(userId);
    }
    const flair = await checkSubredditFlair(subredditName, flairId);
    const sort = "trending";
    if (!before & !after) {
      after = 0;
    }
    const result = await subredditHome(user, subredditName, flair, {
      sort,
      before,
      after,
      limit,
    });

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
const getNewSubredditPosts = async (req, res) => {
  try {
    const userId = req.payload?.userId;
    const subredditName = req.params.subreddit;
    let { flairId, before, after, limit } = req.query;
    let user = undefined;
    if (userId) {
      user = await getUser(userId);
    }
    const flair = await checkSubredditFlair(subredditName, flairId);
    const sort = "new";
    if (!before & !after) {
      after = 0;
    }
    const result = await subredditHome(user, subredditName, flair, {
      sort,
      before,
      after,
      limit,
    });

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
const getTopSubredditPosts = async (req, res) => {
  try {
    const userId = req.payload?.userId;
    const subredditName = req.params.subreddit;
    let { flairId, before, after, limit, time } = req.query;
    let user = undefined;
    if (userId) {
      user = await getUser(userId);
    }
    const flair = await checkSubredditFlair(subredditName, flairId);
    const sort = "top";
    if (!before & !after) {
      after = 0;
    }
    const result = await subredditHome(user, subredditName, flair, {
      sort,
      before,
      after,
      limit,
      time,
    });

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
  limitValidator,
  getHotSubredditPosts,
  getNewSubredditPosts,
  getTopSubredditPosts,
  getTrendingSubredditPosts,
};
