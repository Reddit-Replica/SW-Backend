import {
  validateCreateFlair,
  prepareCreateFlairBody,
  createFlair,
  validateId,
  checkFlair,
  deleteFlair,
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

const deleteSubredditFlair = async (req, res) => {
  try {
    validateId(req.params.flairId);
    const flair = await checkFlair(req.params.flairId, req.subreddit);
    deleteFlair(flair, req.subreddit);
    res.json("test");
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
  deleteSubredditFlair,
};
