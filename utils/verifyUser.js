import jwt from "jsonwebtoken";

/**
 * This function checks for the authorization of a request
 * and extracts the token from the body for verification with the help of jwt
 *
 * @param {object} req The request made
 * @returns {object} Returns the decoded payload of the token
 * containing the userId and username, else null
 */
export default function verifyUser(req) {
  const authorizationHeader = req.headers?.authorization;
  const token = authorizationHeader?.split(" ")[1];
  if (!token) {
    return null;
  }
  try {
    const decodedPayload = jwt.verify(token, process.env.TOKEN_SECRET);
    return decodedPayload;
  } catch (err) {
    return null;
  }
}
