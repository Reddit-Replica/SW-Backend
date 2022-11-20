import {
  validateCreateOrEditFlair,
  prepareCreateFlairBody,
  createFlair,
  validateId,
  checkFlair,
  deleteFlair,
  editFlair,
  prepareFlairDetails,
  prepareFlairs,
} from "../services/subredditFlairs.js";

const addSubredditFlair = async (req, res) => {
  try {
    validateCreateOrEditFlair(req);
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
    await deleteFlair(flair, req.subreddit);
    res.status(200).json("Post flair successfully deleted");
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const editSubredditFlair = async (req, res) => {
  try {
    validateId(req.params.flairId);
    const neededFlair = await checkFlair(req.params.flairId, req.subreddit);
    validateCreateOrEditFlair(req);
    const preparedFlairObject = prepareCreateFlairBody(req);
    editFlair(preparedFlairObject, neededFlair);
    res.status(200).json("Post flair successfully edited");
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getFlairDetails = async (req, res) => {
  try {
    validateId(req.params.flairId);
    const neededFlair = await checkFlair(req.params.flairId, req.subreddit);
    const flairObjectToReturn = prepareFlairDetails(neededFlair);
    res.status(200).json(flairObjectToReturn);
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getAllFlairs = async (req, res) => {
  try {
    const flairsArray = await prepareFlairs(req.subreddit);
    res.status(200).json({ postFlairs: flairsArray });
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
  editSubredditFlair,
  getFlairDetails,
  getAllFlairs,
};
