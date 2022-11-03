import bcrypt from "bcryptjs";
import { body } from "express-validator";
import User from "../models/User.js";
import jwt from "../utils/token.js";
import pass from "../utils/password.js";
import sendgrid from "../utils/email.js";

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
      return res.status(400).send({
        error: "Username not found",
      });
    }
    const doMatch = pass.comparePasswords(password, user.password);
    if (doMatch) {
      const token = jwt.generateJWT(user);
      res.header("Authorization", "Bearer " + token);
      return res.status(200).send("Logged in successfully!");
    }
    return res.status(400).send({
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
      return res.status(400).send({
        error: "Invalid email (User not found)",
      });
    }
    if (user.username !== username) {
      return res.status(400).send({
        error: "Invalid username",
      });
    }
    const token = jwt.generateJWT(user);
    sendgrid.sendResetPasswordEmail(
      "abdelrahmanhamdy49@gmail.com",
      email,
      user.id,
      token
    );
    return res.status(200).send("Email has been sent");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const resetPassword = async (req, res) => {
  const userId = req.params.id;
  const token = req.params.token;
  const newPassword = req.body.newPassword;
  const verifyPassword = req.body.verifyPassword;
  try {
    if (jwt.verifyJWT(userId, token)) {
      const user = await User.findOne({
        _id: userId,
      });
      if (newPassword !== verifyPassword) {
        return res.status(400).send({
          error: "Passwords do not match",
        });
      }
      const newHashedPassword = pass.hashPassword(newPassword);
      user.password = newHashedPassword;
      await user.save();
      return res.status(200).send("Password updated successfully");
    } else {
      return res.status(403).send("Invalid Token");
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
    return res.status(400).send({
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
