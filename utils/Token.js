import jwt from "jsonwebtoken";

/**
 * This function accepts a user object and generates
 * a JWT token with a secret by using the built-in sign function
 *
 * @param {object} user The user object which contains the id and username
 * @returns {string} The JSON web token
 */
function generateJWT(user) {
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.TOKEN_SECRET
  );

  return token;
}

/**
 * This function verifies a jwt token using the built-in verify
 * function and a secret. We then check if the user id in that token
 * matches the id passed in the parameters or no
 *
 * @param {string} id  The user Id
 * @param {string} token
 * @returns {boolean} True if the token is verified and false if it's invalid
 */
function verifyJWT(id, token) {
  try {
    const decodedPayload = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decodedPayload.userId.toString() === id.toString()) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export default {
  generateJWT,
  verifyJWT,
};
