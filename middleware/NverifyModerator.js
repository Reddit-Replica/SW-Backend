import Subreddit from "../models/Community.js";

/**
 * Middleware used to check if the user is a moderator in the desired subreddit or not
 * It gets the moderators of that desired one
 * and searches for the id of that user
 * if it's found then this user is a moderator and has the rights to do that action
 * if it's not found then he can't access the action
 * it will send status code 400 saying that the user doesn't have the right to do this action
 * it may send status code 400 saying Token may be invalid or not found
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function checkModerator(req, res, next) {
  const authPayload = req.payload;
  try {
    const subreddit = await Subreddit.findOne({ title: req.params.subreddit });
    if (!subreddit) {
      throw new Error("this subreddit isn't found", { cause: 400 });
    }
    // eslint-disable-next-line max-len
    const { moderators } = subreddit;
    let isThere = false;
    const userId = authPayload.userId;
    moderators.forEach(function (moderator) {
      if (moderator.userID.toString() === userId) {
        isThere = true;
      }
    });
    if (isThere) {
      next();
    } else {
      // eslint-disable-next-line max-len
      throw new Error("you don't have the right to do this action", {
        cause: 403,
      });
    }
  } catch (err) {
    if (err.cause) {
      return res.status(err.cause).json({
        error: err.message,
      });
    } else {
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
}
