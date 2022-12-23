import Subreddit from "../models/Community.js";

/**
 * A middleware used to make sure that the provided subreddit name exists
 * If that subreddit exists it adds it to the request object to make the next middleware access it
 * It it doesn't exist then it returns a response with status code 404 and error message
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */

const checkSubreddit = async (req, res, next) => {
  const subredditName = req.params.subreddit;
  const subbredditObject = await Subreddit.findOne({
    title: subredditName,
    deletedAt: null,
  });
  if (!subbredditObject || subbredditObject.deletedAt) {
    res.status(404).json({
      error: "Subreddit not found!",
    });
  } else {
    req.subreddit = subbredditObject;
    next();
  }
};

export default {
  checkSubreddit,
};
