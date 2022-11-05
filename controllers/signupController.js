// models
import User from "../models/User.js";
import Token from "../models/VerifyToken.js";

// validator
import { body, query, param } from "express-validator";

// utils
import { generateJWT, generateVerifyToken } from "../utils/generateTokens.js";
import { sendVerifyEmail } from "../utils/sendEmails.js";
import hashPassord from "../utils/hashPassword.js";

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

const verifyEmailValidator = [
  param("id").trim().not().isEmpty().withMessage("Id must not be empty"),
  param("token").trim().not().isEmpty().withMessage("Token must not be empty"),
];

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({
      username: username,
      email: email,
      password: hashPassord(password),
    });

    await user.save();

    // Create the verify token and send an email to the user
    const verifyToken = await generateVerifyToken(user._id);
    const sentEmail = sendVerifyEmail(email, user._id, verifyToken);

    if (!sentEmail) {
      return res.status(400).json({
        error: "Could not send the verification email",
      });
    }

    const token = generateJWT(user);
    res.header("Authorization", "Bearer " + token);

    res.status(201).send("The account has been successfully created");
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

// eslint-disable-next-line max-statements
const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({
        error: "Invalid Link",
      });
    }

    // there is a user with that id
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(403).json({
        error: "Invalid Token",
      });
    }

    // if the token expired, delete it and don't verify the email
    if (token.expireAt < Date.now()) {
      await token.remove();
      return res.status(403).json({
        error: "Invalid Token",
      });
    }

    user.userSettings.verifiedEmail = true;
    await user.save();
    await token.remove();

    const jwToken = generateJWT(user);
    res.header("Authorization", "Bearer " + jwToken);

    res.send("Email verified successfully");
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
  verifyEmailValidator,
  verifyEmail,
};
