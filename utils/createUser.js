import { generateJWT, generateVerifyToken } from "./generateTokens.js";
import { sendVerifyEmail } from "./sendEmails.js";

/**
 * Functin used to send the verification email after signing in
 * and then create a jwt and send it back to the user in the response
 *
 * @param {Object} user User object
 * @returns {Object} Response to the request containing [statusCode, body]
 */
export async function finalizeCreateUser(user) {
  // Create the verify token and send an email to the user
  const verifyToken = await generateVerifyToken(user._id, "verifyEmail");
  const sentEmail = sendVerifyEmail(user, verifyToken);

  if (!sentEmail) {
    return {
      statusCode: 400,
      body: {
        error: "Could not send the verification email",
      },
    };
  }

  const token = generateJWT(user);
  return {
    statusCode: 201,
    body: { username: user.username, token: token },
  };
}
