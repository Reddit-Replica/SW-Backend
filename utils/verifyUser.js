import jwt from "jsonwebtoken";

/**
 * This function checks for the authorization header of a request
 * and extracts the token from it for verification with the help of jwt
 *
 * @param {object} req The request made
 * @returns {string} Returns the user id if the token is verified, otherwise null
 */
export default function verifyUser(req) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return null;
  }
  const token = authorizationHeader.split(" ")[1];
  try {
    const decodedPayload = jwt.verify(token, process.env.TOKEN_SECRET);
    return decodedPayload;
  } catch (err) {
    return null;
  }
}
