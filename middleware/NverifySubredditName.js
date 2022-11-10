import Subreddit from "../models/Community.js";

/**
 * Middleware used to check if the name of the subreddit was used before or not
 * It searches for the name of the subreddit that it took from the request
 * this search is done in all the subreddits that created before
 * if it's found so it send status code 400 saying title is already in use
 * else it will continue to the next middleware
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */

export async function checkDuplicateSubredditTitle(req, res, next) {
  try {
    console.log(req.body.title);
    const subreddit = await Subreddit.findOne({
      title: req.body.title,
    });
    if (!subreddit){
      next();
      return;
    }
    if (subreddit.title && !subreddit.deletedAt) {
      // eslint-disable-next-line max-len
      return res.status(409).json({ error: "Subreddit's name is already taken" });
    }
  } catch (err) {
    if (err.cause) {
      return res.status(err.cause).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
}
