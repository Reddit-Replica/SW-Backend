import bcrypt from "bcryptjs";
import { body } from "express-validator";
import User from "../models/User.js";
import generateJWT from "../utils/generateToken.js";

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

const passwordValidator = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long"),
];

const usernameValidator = [
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
      return res.status(400).send("Username not found");
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      const token = generateJWT(user);
      res.header("Authorization", "Bearer " + token);
      return res.status(200).send("Logged in successfuly!");
    }
    return res.status(400).send("Invalid credentials");
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
      return res.status(400).send("User not found");
    }
    if (user.username !== username) {
      return res.status(400).send("Invalid username");
    }
    const token = generateJWT(user);
    user.token = token;
    user.expirationDate = Date.now() + 3600000;
    await user.save();
    transporter.sendMail({
      to: email,
      from: "read-it@gmail.com",
      subject: "Password Reset",
      html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/reset-password/${user.id}/${token}">link</a> to set a new password.</p>
            `,
    });
    return res.status(200).send("Email has been sent");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const forgetUsername = async (req, res) => {
  const email = req.body.email;
  try {
  } catch (err) {}
};

const resetPassword = async (req, res) => {
  const userId = req.params.id;
  const token = req.params.token;
  const newPassword = req.params.newPassword;
  const verifyPassword = req.params.verifyPassword;
  try {
  } catch {}
};

export default {
  loginValidator,
  usernameValidator,
  passwordValidator,
  login,
  forgetPassword,
  forgetUsername,
  resetPassword,
};
