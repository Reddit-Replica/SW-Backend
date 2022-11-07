import verifyUser from "../utils/verifyUser.js";

/**
 * Middleware used to check the request if there is an error
 * it will send a response with status code 400 with all errors
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export function optionalToken(req, res, next) {
  const authResult = verifyUser(req);
  if (authResult) {
    req.loggedIn = true;
    req.userId = authResult.userId;
  } else {
    req.loggedIn = false;
  }
  next();
}
