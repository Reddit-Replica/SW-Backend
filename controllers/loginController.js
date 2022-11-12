import { body, param } from "express-validator";
import User from "../models/User.js";
import { generateJWT, generateVerifyToken } from "../utils/generateTokens.js";
import { hashPassword, comparePasswords } from "../utils/passwordUtils.js";
import {
  sendResetPasswordEmail,
  sendUsernameEmail,
} from "../utils/sendEmails.js";
import Token from "../models/VerifyToken.js";

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

const forgetUsernameValidator = [
  body("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email must be a valid email"),
];

// eslint-disable-next-line max-statements
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
    const doMatch = comparePasswords(password, user.password);
    if (doMatch) {
      try {
        const token = generateJWT(user);
        return res.status(200).json({
          username: username,
          token: token,
        });
      } catch (err) {
        return res.status(400).json({
          error: "Couldn't create token",
        });
      }
    }
    return res.status(400).json({
      error: "Invalid password",
    });
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

// eslint-disable-next-line max-statements
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
    try {
      const token = await generateVerifyToken(user.id, "forgetPassword");
      const emailSent = sendResetPasswordEmail(
        email,
        user.username,
        user.id,
        token
      );
      if (emailSent) {
        return res.status(200).json("Email has been sent");
      } else {
        return res.status(400).json({
          error: `An error occured while sending the email. 
                  Check the email address and try again`,
        });
      }
    } catch (err) {
      return res.status(400).json({
        error: "Couldn't create token",
      });
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

// eslint-disable-next-line max-statements
const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword, verifyPassword } = req.body;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(403).json("User not found");
    }
    const returnedToken = await Token.findOne({
      userId: user._id,
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
    if (newPassword !== verifyPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }
    user.password = hashPassword(newPassword);
    await user.save();
    await returnedToken.remove();
    return res.status(200).json("Password updated successfully");
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

const forgetUsername = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "No user with that email found" });
    }

    const sentEmail = sendUsernameEmail(email, user.username);

    if (!sentEmail) {
      return res.status(400).json({
        error: "Could not send the email",
      });
    }

    res.status(200).json("Email has been sent");
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default {
  loginValidator,
  resetPasswordValidator,
  forgetPasswordValidator,
  forgetUsernameValidator,
  login,
  forgetPassword,
  resetPassword,
  forgetUsername,
};
