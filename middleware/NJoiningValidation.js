import User from "../models/User.js";
import Subreddit from "../models/Community.js";
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
export async function checkJoinedBefore(req, res, next) {
  //CHECK ON USER DATA
  const authPayload = req.payload;
  try {
    //GETTING LIST OF SUBREDDITS THE USER JOINED BEFORE
    // eslint-disable-next-line max-len
    const { joinedSubreddits } = await User.findById(authPayload.userId).select(
      "joinedSubreddits"
    );
    joinedSubreddits.forEach(function (subreddit) {
      //CHECKING IF THE SUBREDDIT HE WANTS TO JOIN WAS JOINED BEFORE
      if (subreddit.subredditId.toString() === req.body.subredditId) {
        // eslint-disable-next-line max-len
        throw new Error("you already joined the subreddit", { cause: 409 });
      }
    });
    // eslint-disable-next-line max-len
    const { waitedUsers } = await Subreddit.findById(req.body.subredditId);
    waitedUsers.forEach(function (users) {
      //CHECKING IF THE SUBREDDIT HE WANTS TO JOIN WAS JOINED BEFORE
      if (users.userID.toString() === authPayload.userId) {
        throw new Error("your request is already pending", { cause: 409 });
      }
    });
    //CONTINUE TO JOIN CONTROLLER TO DO THE LOGIC OF JOINING
    next();
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
