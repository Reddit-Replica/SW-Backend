import User from "../models/User.js";
import { body, query } from "express-validator";
// // import jwt from "jsonwebtoken";

const signupValidator = [
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
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long"),
];

const usernameValidator = [
  query("username")
    .not()
    .isEmpty()
    .withMessage("Username must not be empty")
    .trim()
    .escape(),
];

const signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  // Check for the ReCAPTCHAs [later]
  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const usernameAvailable = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.query.username.trim() });
    if (user) {
      return res.status(409).send("Username is already taken");
    }
    res.send("The username is available");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export default {
  signupValidator,
  signup,
  usernameValidator,
  usernameAvailable,
};
