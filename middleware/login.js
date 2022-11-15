import User from "../models/User.js";
import Token from "../models/VerifyToken.js";
import { generateJWT } from "../utils/generateTokens.js";
import { comparePasswords } from "../utils/passwordUtils.js";
import { sendResetPasswordEmail } from "../utils/sendEmails.js";
import { generateVerifyToken } from "../utils/generateTokens.js";

/**
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function checkUserExistence(req, res, next) {
  const username = req.body.username;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({
        error: "Username not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
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
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
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
    if (!user) {
      return res.status(400).json({
        error: "Invalid email (User not found)",
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
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function ResetPasswordEmail(req, res, next) {
  try {
    const token = await generateVerifyToken(req.user.id, "forgetPassword");
    const emailSent = sendResetPasswordEmail(
      req.user.email,
      req.user.username,
      req.user.id,
      token
    );
    req.emailSent = emailSent;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
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
    if (!user) {
      return res.status(403).json("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
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
    if (!returnedToken) {
      return res.status(403).json("Invalid Token");
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
