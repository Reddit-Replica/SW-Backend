import jwt from "jsonwebtoken";

/**
 * A middleware used to verify the token and send back status code 401 with error message if the token is invalid or not provided
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
const verifyAuthToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    // console.log(authorizationHeader);
    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET);

    next();
  } catch (err) {
    res.status(401).json({
      error: "Invalid Token",
    });
  }
};

export default {
  verifyAuthToken,
};
