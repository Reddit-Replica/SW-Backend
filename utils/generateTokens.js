import jwt from "jsonwebtoken";
import Token from "../models/VerifyToken.js";
import crypto from "crypto";

/**
 * This function accepts user object and return the JWT created for that user
 * using jwt.sign function
 *
 * @param {Object} user User object that contains userId, and username
 * @returns {string} JWT created for that user
 */
export function generateJWT(user) {
  try {
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.TOKEN_SECRET
    );

    return token;
  } catch (error) {
    throw new Error("Could not create a token");
  }
}

/**
 * This function accepts user id and return a verification token
 * that will be used later to verify email or reset password
 *
 * @param {string} userId User Id
 * @returns {string} Token created for that user
 */
export async function generateVerifyToken(userId) {
  try {
    const token = await new Token({
      userId: userId,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    return token.token;
  } catch (error) {
    throw new Error("Could not create a token");
  }
}
