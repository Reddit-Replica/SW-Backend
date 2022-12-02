import User from "../models/User.js";
import Subreddit from "../models/Community.js";
import { searchForSubredditbyId } from "./../services/communityServices.js";

/**
 * Middleware used to check if the user joined the desired subreddit before or not
 * It gets the subreddits that the user joined before and searches for the desired one
 * if the desired one is found then the user cannot join it
 * but if he doesn't that user passed that validation successfully
 * it will send status code 400 saying the user joined this subreddit before
 * it may send status code 400 saying Token may be invalid or not found
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */

// eslint-disable-next-line max-statements
export async function checkJoinedBefore(req, res, next) {
  const authPayload = req.payload;
  try {
    //GETTING LIST OF SUBREDDITS THE USER JOINED BEFORE
    const { joinedSubreddits } = await User.findById(authPayload.userId).select(
      "joinedSubreddits"
    );
    const subreddit = await searchForSubredditbyId(req.body.subredditId);
    for (const smallSubreddit of joinedSubreddits) {
      //CHECKING IF THE SUBREDDIT HE WANTS TO JOIN WAS JOINED BEFORE
      if (smallSubreddit.subredditId.toString() === subreddit.id) {
        // eslint-disable-next-line max-len
        let error = new Error("you already joined the subreddit");
        error.statusCode = 409;
        throw error;
      }
    }
    const waitedUsers = subreddit.waitedUsers;
    for (const user of waitedUsers) {
      //CHECKING IF THE SUBREDDIT HE WANTS TO JOIN WAS JOINED BEFORE
      if (user.userID.toString() === authPayload.userId) {
        let error = new Error("your request is already pending");
        error.statusCode = 409;
        throw error;
      }
    }
    //CONTINUE TO JOIN CONTROLLER TO DO THE LOGIC OF JOINING
    next();
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
}
