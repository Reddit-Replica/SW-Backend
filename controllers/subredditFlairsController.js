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
  prepareFlairsSettings,
  validateFlairSettingsBody,
  editFlairsSettingsService,
  checkDublicateFlairOrderService,
  editFlairsOrderService,
  checkEditFlairsOrderService,
} from "../services/subredditFlairs.js";

const addSubredditFlair = async (req, res) => {
  try {
    validateCreateOrEditFlair(req);
    const flairObject = prepareCreateFlairBody(req);
    const flairId = await createFlair(flairObject, req.subreddit);
    res.status(200).json({ flairId: flairId });
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
    await editFlair(preparedFlairObject, neededFlair);
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

const getFlairsSettings = (req, res) => {
  try {
    const flairsSettings = prepareFlairsSettings(req.subreddit);
    res.status(200).json(flairsSettings);
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const editFlairsSettings = async (req, res) => {
  try {
    const flairsSettings = validateFlairSettingsBody(req);
    await editFlairsSettingsService(req.subreddit, flairsSettings);
    res.status(200).json("Post flairs settings changed successfully");
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const editFlairsOrder = async (req, res) => {
  try {
    await req.subreddit.populate("flairs");
    console.log(req.subreddit.flairs);
    checkEditFlairsOrderService(req);
    checkDublicateFlairOrderService(req);
    await editFlairsOrderService(req);
    res.status(200).json("Order edited successfully");
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
  getFlairsSettings,
  editFlairsSettings,
  editFlairsOrder,
};
