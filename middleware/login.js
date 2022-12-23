import User from "../models/User.js";
import Token from "../models/VerifyToken.js";
import { generateJWT } from "../utils/generateTokens.js";
import { comparePasswords } from "../utils/passwordUtils.js";
import { sendResetPasswordEmail } from "../utils/sendEmails.js";
import { generateVerifyToken } from "../utils/generateTokens.js";

/**
 * Middleware used to check if a user exists using the username from
 * the request body and then pass the user object in the request if it exists.
 * Otherwise return a 400 response with an error message.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function verifyUserByUsername(req, res, next) {
  const username = req.body.username;
  try {
    const user = await User.findOne({ username: username });
    if (!user || user.deletedAt) {
      return res.status(400).json({
        error: "Username not found/deleted",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to check if the password entered by the user
 * matches the correct password in the database. If it matches, then a
 * jwt token is generated and passed in with the request and if not, an
 * invalid password response is returned with a 400 code.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export function checkPasswords(req, res, next) {
  const password = req.body.password;
  try {
    const doMatch = comparePasswords(password, req.user.password);
    if (doMatch) {
      try {
        const token = generateJWT(req.user);
        req.token = token;
      } catch (err) {
        return res.status(400).json({
          error: "Couldn't create token",
        });
      }
    } else {
      return res.status(400).json({
        error: "Invalid password",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to check if a user exists with a given email
 * and then if a user is returned, it verifies the username is
 * matched as well. Then the user is passed with the request and
 * invalid email/username responses are returned if the conditions fail.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function verifyUsernameAndEmail(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user || user.deletedAt) {
      return res.status(400).json({
        error: "Invalid email (User not found or deleted)",
      });
    }
    if (user.username !== username) {
      return res.status(400).json({
        error: "Invalid username",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to generate a crypto token using the generateVerifyToken
 * utility function passing in the userId and the token type to be "forgetPassword".
 * The token returned is sent with the email, username and id of the user to the
 * sendResetPasswordEmail function to send this user an email. It returns true if the
 * email is sent successfully and false otherwise. This boolean is passed with the request
 * to the controller to make a decision and return a response.
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function ResetPasswordEmail(req, res, next) {
  try {
    const token = await generateVerifyToken(req.user.id, "forgetPassword");
    const emailSent = sendResetPasswordEmail(req.user, token);
    req.emailSent = emailSent;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to verify if a user exists by its id and pass this
 * user with the request if it exists, otherwise, returns a 403 error response
 * with a message
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function verifyUserById(req, res, next) {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user || user.deletedAt) {
      return res.status(403).json("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to find a token in the database with type "forgetPassword", a user id
 * and the crypto token string itself. If a token is returned then we check to see if
 * it's expired or not by comparing with the current date. If the token is expired,
 * it is removed from the database and a token expired response is returned. If it's not
 * expired then it's passed in with the request (success)
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function verifyResetToken(req, res, next) {
  const token = req.params.token;
  try {
    const returnedToken = await Token.findOne({
      userId: req.user.id,
      type: "forgetPassword",
      token: token,
    });
    if (!returnedToken || returnedToken.deletedAt) {
      return res.status(403).json("Invalid Token/deleted");
    }
    if (returnedToken.expireAt < Date.now()) {
      await returnedToken.remove();
      return res.status(403).json("Token is expired");
    }
    req.token = returnedToken;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}
