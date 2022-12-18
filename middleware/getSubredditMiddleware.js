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
export async function getBodySubreddit(req, res, next) {
  const subreddit = await Subreddit.findOne({
    title: req.body.subreddit,
    deletedAt: null,
  });
  if (!subreddit) {
    res.status(404).json({
      error: "Subreddit not found",
    });
  } else {
    req.subreddit = subreddit;
    next();
  }
}
