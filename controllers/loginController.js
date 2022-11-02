import bcrypt from "bcryptjs";
import { body } from "express-validator";
import User from "../models/User.js";
import jwt from "../utils/Token.js";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

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
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      const token = jwt.generateJWT(user);
      res.header("Authorization", "Bearer " + token);
      return res.status(200).send("Logged in successfuly!");
    }
    return res.status(400).send({
      error: "Invalid credentials",
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
        error: "User not found",
      });
    }
    if (user.username !== username) {
      return res.status(400).send({
        error: "Invalid username",
      });
    }
    const token = jwt.generateJWT(user);
    transporter.sendMail({
      to: email,
      from: "abdelrahmanhamdy49@gmail.com",
      subject: "Password Reset",
      html: `
              <p>You requested a password reset</p>
              <p>Click this <a 
              href="http://localhost:3000/reset-password/${user.id}/${token}">
              link
              </a> to set a new password.</p>
            `,
    });
    return res.status(200).send("Email has been sent");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const resetPassword = async (req, res) => {
  const userId = req.params.id;
  const token = req.params.token;
  const newPassword = req.params.newPassword;
  const verifyPassword = req.params.verifyPassword;
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
      hashedPassword = bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();
      return res.status(200).send("Password updated successfully");
    } else {
      return res.status(403).send("Invalid Token");
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export default {
  loginValidator,
  resetPasswordValidator,
  forgetPasswordValidator,
  login,
  forgetPassword,
  resetPassword,
};
