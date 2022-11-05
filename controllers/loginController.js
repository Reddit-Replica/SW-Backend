import { body, param } from "express-validator";
import User from "../models/User.js";
import tokenUtils from "../utils/token.js";
import crypto from "crypto";
import pass from "../utils/password.js";
import sendgrid from "../utils/email.js";
import Token from "../models/Token.js";

const loginValidator = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("Username must not be empty")
    .trim()
    .escape(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long"),
];

const resetPasswordValidator = [
  param("id").trim().not().isEmpty().withMessage("Id must not be empty"),
  param("token").trim().not().isEmpty().withMessage("Token must not be empty"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long"),
  body("verifyPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long"),
];

const forgetPasswordValidator = [
  body("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email must be a valid email"),
  body("username")
    .not()
    .isEmpty()
    .withMessage("Username must not be empty")
    .trim()
    .escape(),
];

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({
        error: "Username not found",
      });
    }
    const doMatch = pass.comparePasswords(password, user.password);
    if (doMatch) {
      const token = tokenUtils.generateJWT(user);
      res.header("Authorization", "Bearer " + token);
      return res.status(200).send("Logged in successfully!");
    }
    return res.status(400).json({
      error: "Invalid password",
    });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const forgetPassword = async (req, res) => {
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
    crypto.randomBytes(32, (err, buffer) => {
      const token = buffer.toString("hex");
      const emailSent = sendgrid.sendResetPasswordEmail(
        process.env.SENDER_EMAIL,
        email,
        user.id,
        token
      );
      if (emailSent) {
        return res.status(200).send("Email has been sent");
      } else {
        return res.status(400).json({
          error: `An error occured while sending the email. 
                  Check the email address and try again`,
        });
      }
    });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

// eslint-disable-next-line max-statements
const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword, verifyPassword } = req.body;
  try {
    const user = await User.findOne({ id: id });
    if (user) {
      const returnedToken = await Token.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
        userId: id,
      });
      if (returnedToken) {
        // eslint-disable-next-line max-depth
        if (newPassword !== verifyPassword) {
          return res.status(400).json({
            error: "Passwords do not match",
          });
        }
        user.password = pass.hashPassword(newPassword);
        await user.save();
        await returnedToken.remove();
        return res.status(200).send("Password updated successfully");
      } else {
        return res.status(403).send("Token invalid or may have been expired");
      }
    } else {
      return res.status(403).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const loginWithFacebook = async (token) => {};

const loginWithGoogle = async (token) => {};

const loginWith = async (req, res) => {
  const type = req.params.type;
  const token = req.params.accessToken;
  if (type === "facebook") {
    loginWithFacebook(token);
  } else if (type === "google") {
    loginWithGoogle(token);
  } else {
    return res.status(400).json({
      error: "Invalid type. Should be either google or facebook only",
    });
  }
};

export default {
  loginValidator,
  resetPasswordValidator,
  forgetPasswordValidator,
  login,
  loginWith,
  forgetPassword,
  resetPassword,
};
