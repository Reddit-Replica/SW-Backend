import verifyUser from "../utils/verifyUser.js";

/**
 * Middleware used to check if there is a token in the request
 * header and if yes, then userId is passed with the request and
 * a flag to indicate that the user is logged in
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export function optionalToken(req, _res, next) {
  const authResult = verifyUser(req);
  if (authResult) {
    req.loggedIn = true;
    req.userId = authResult.userId;
    req.payload = authResult;
  } else {
    req.loggedIn = false;
  }
  next();
}
