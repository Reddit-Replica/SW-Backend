import {
  validateCreateFlair,
  prepareCreateFlairBody,
  createFlair,
} from "../services/subredditFlairs.js";
const addSubredditFlair = async (req, res) => {
  try {
    validateCreateFlair(req);
    const flairObject = prepareCreateFlairBody(req);
    createFlair(flairObject, req.subreddit);
    res.status(200).json("Post flair successfully added");
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

export default {
  addSubredditFlair,
};
