import User from "../models/User.js";
import { body, query } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

const emailValidator = [
  query("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email must be a valid email"),
];

const signup = async (req, res) => {
  // Check for the ReCAPTCHAs [TODO]
  const { username, email, password } = req.body;

  try {
    const hashedPass = bcrypt.hashSync(
      password + process.env.BCRYPT_PASSWORD,
      parseInt(process.env.SALT_ROUNDS)
    );

    const user = new User({
      username: username,
      email: email,
      password: hashedPass,
    });

    await user.save();

    // Send verification email [TODO]

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.TOKEN_SECRET
    );
    res.header("Authorization", "Bearer " + token);

    res.send(user); // Change to res.status(201).send("The account has been successfully created");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const usernameAvailable = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.query.username.trim() });
    if (user) {
      return res.status(409).send("Username is already taken");
    }
    res.send("The username is available");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const emailAvailable = async (req, res) => {
  try {
    const email = req.query.email.trim();
    const user = await User.findOne().or([
      { email: email },
      { googleEmail: email },
      { facebookEmail: email },
    ]);

    if (user) {
      return res.status(409).send("Email is already taken");
    }
    res.send("The email is available");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export default {
  signupValidator,
  signup,
  usernameValidator,
  usernameAvailable,
  emailValidator,
  emailAvailable,
};
