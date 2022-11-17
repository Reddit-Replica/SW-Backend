import jwt from "jsonwebtoken";

/**
 * A middleware used to verify the token and send back status code 401 with error message if the token is invalid or not provided
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export const verifyAuthToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    // console.log(authorizationHeader);
    const token = authorizationHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    req.payload = payload;
    next();
  } catch (err) {
    res.status(401).json({
      error: "Invalid Token",
    });
  }
};

/**
 * A middleware used to verify that the user requesting the subreddits rules is a moderator in that subreddit
 * If not it returns status code 401 Unauthorized Access
 * Else it pass the request to the next middleware
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */

export const verifyAuthTokenModerator = (req, res, next) => {
  const moderators = req.subreddit.moderators;
  const payload = req.payload;
  const moderator = moderators.find(
    (mod) => mod.userID.toString() === payload.userId
  );
  if (!moderator) {
    res.status(401).json({
      error: "Unauthorized Access",
    });
  } else {
    next();
  }
};
