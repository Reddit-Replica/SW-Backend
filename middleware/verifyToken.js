import jwt from "jsonwebtoken";

/**
 * Middleware used to check the token in the request.
 * If it was a valid token given by the server, the next function will be called.
 * If it wasn't, a response with status code 401 will be sent
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
const verifyAuthToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.Authorization;
    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET);

    next();
  } catch (err) {
    res.status(401).send("Access Denied");
  }
};

export default {
  verifyAuthToken,
};
