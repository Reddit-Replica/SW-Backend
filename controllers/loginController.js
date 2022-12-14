import { body, param } from "express-validator";
import User from "../models/User.js";
import { hashPassword } from "../utils/passwordUtils.js";
import { sendUsernameEmail } from "../utils/sendEmails.js";

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

const login = async (req, res) => {
  return res.status(200).json({
    username: req.user.username,
    token: req.token,
  });
};

const forgetPassword = async (req, res) => {
  if (req.emailSent) {
    return res.status(200).json("Email has been sent");
  } else {
    return res.status(400).json({
      error: "An error occured while sending the email",
    });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword, verifyPassword } = req.body;
  const user = req.user;
  const token = req.token;
  try {
    if (newPassword !== verifyPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }
    user.password = hashPassword(newPassword);
    await user.save();
    await token.remove();
    return res.status(200).json("Password updated successfully");
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

const forgetUsername = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user || user.deletedAt) {
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
