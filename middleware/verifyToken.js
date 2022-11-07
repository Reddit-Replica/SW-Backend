import jwt from "jsonwebtoken";

/**
 * Middleware used to check the token in the request.
 * If it was a valid token given by the server, the next function will be called
 * and token payload will be saved in the request object
 * If it wasn't, a response with status code 401 will be sent
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export const verifyAuthToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];

    const decodedPayload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.decodedPayload = decodedPayload;

    next();
  } catch (err) {
    res.status(401).send("Access Denied");
  }
};
