import jwt from "jsonwebtoken";

/**
 * A middleware used to verify the token and send back status code 401 with error message if the token is invalid or not provided
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export function verifyAuthToken(req, res, next) {
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
}

/**
 * A middleware used to verify that the user is a moderator in that subreddit
 * If not it returns status code 401 Unauthorized Access
 * Else it pass the request to the next middleware
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */

export function verifyAuthTokenModerator(req, res, next) {
  const moderators = req.subreddit.moderators;
  const payload = req.payload;
  const moderatorIndex = moderators.findIndex(
    (mod) => mod.userID.toString() === payload.userId
  );
  if (moderatorIndex === -1) {
    res.status(401).json({
      error: "Unauthorized Access",
    });
  } else {
    next();
  }
}

/**
 * A middleware used to verify that the user is a moderator in that subreddit having permessions to manage subreddit settings
 * If not it returns status code 401 Unauthorized Access
 * Else it pass the request to the next middleware
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export function verifyAuthTokenModeratorManageSettings(req, res, next) {
  const moderators = req.subreddit.moderators;
  const payload = req.payload;
  const moderatorIndex = moderators.findIndex(
    (mod) => mod.userID.toString() === payload.userId
  );
  if (moderatorIndex === -1) {
    res.status(401).json({
      error: "Unauthorized Access",
    });
  } else {
    const permessionIndex = moderators[moderatorIndex].permissions.findIndex(
      (permission) =>
        permission === "Everything" || permission === "Manage Settings"
    );
    if (permessionIndex === -1) {
      res.status(401).json({
        error: "Unauthorized Access",
      });
    } else {
      next();
    }
  }
}

/**
 * A middleware used to verify that the user is a moderator in that subreddit having permessions to manage subreddit users
 * If not it returns status code 401 Unauthorized Access
 * Else it pass the request to the next middleware
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export function verifyAuthTokenModeratorManageUsers(req, res, next) {
  const moderators = req.subreddit.moderators;
  const payload = req.payload;
  const moderatorIndex = moderators.findIndex(
    (mod) => mod.userID.toString() === payload.userId
  );
  if (moderatorIndex === -1) {
    res.status(401).json({
      error: "Unauthorized Access",
    });
  } else {
    const permessionIndex = moderators[moderatorIndex].permissions.findIndex(
      (permission) =>
        permission === "Everything" || permission === "Manage Users"
    );
    if (permessionIndex === -1) {
      res.status(401).json({
        error: "Unauthorized Access",
      });
    } else {
      next();
    }
  }
}

/**
 * A middleware used to verify that the user is a moderator in that subreddit having permessions to manage subreddit falirs
 * If not it returns status code 401 Unauthorized Access
 * Else it pass the request to the next middleware
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export function verifyAuthTokenModeratorManageFlairs(req, res, next) {
  const moderators = req.subreddit.moderators;
  const payload = req.payload;
  const moderatorIndex = moderators.findIndex(
    (mod) => mod.userID.toString() === payload.userId
  );
  if (moderatorIndex === -1) {
    res.status(401).json({
      error: "Unauthorized Access",
    });
  } else {
    const permessionIndex = moderators[moderatorIndex].permissions.findIndex(
      (permission) =>
        permission === "Everything" || permission === "Manage Flair"
    );
    if (permessionIndex === -1) {
      res.status(401).json({
        error: "Unauthorized Access",
      });
    } else {
      next();
    }
  }
}

/**
 * A middleware used to verify that the user is a moderator in that subreddit having permessions to manage subreddit posts and comments
 * If not it returns status code 401 Unauthorized Access
 * Else it pass the request to the next middleware
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export function verifyAuthTokenModeratorManagePostsAndComments(req, res, next) {
  const moderators = req.subreddit.moderators;
  const payload = req.payload;
  const moderatorIndex = moderators.findIndex(
    (mod) => mod.userID.toString() === payload.userId
  );
  if (moderatorIndex === -1) {
    res.status(401).json({
      error: "Unauthorized Access",
    });
  } else {
    const permessionIndex = moderators[moderatorIndex].permissions.findIndex(
      (permission) =>
        permission === "Everything" || permission === "Manage Posts & Comments"
    );
    if (permessionIndex === -1) {
      res.status(401).json({
        error: "Unauthorized Access",
      });
    } else {
      next();
    }
  }
}
