// packages
import jwtDecode from "jwt-decode";

// models
import User from "../models/User.js";
import Token from "../models/VerifyToken.js";

// validator
import { body, query, param } from "express-validator";

// utils
import { generateJWT } from "../utils/generateTokens.js";
import { finalizeCreateUser } from "../utils/createUser.js";
import { hashPassword } from "./../utils/passwordUtils.js";
import { generateRandomUsernameUtil } from "../utils/generateRandomUsername.js";

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
    .withMessage("Username can not be empty")
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
    .withMessage("Username can not be empty")
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
  param("id").trim().not().isEmpty().withMessage("Id must can be empty"),
  param("token").trim().not().isEmpty().withMessage("Token can not be empty"),
];

const gfsigninValidator = [
  param("type").trim().not().isEmpty().withMessage("Type can not be empty"),
  body("accessToken")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Access Token can not be empty"),
];

const editUsernameValidator = [
  body("username")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Username can not be empty"),
];

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({
      username: username,
      email: email,
      password: hashPassword(password),
      createdAt: Date.now(),
    });
    await user.save();

    const result = await finalizeCreateUser(user, true);
    res.status(result.statusCode).json(result.body);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const usernameAvailable = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.query.username,
      deletedAt: null,
    });
    if (user) {
      return res.status(409).json("Username is already taken");
    }
    res.status(200).json("The username is available");
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
};

const emailAvailable = async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne().or([
      { email: email, deletedAt: null },
      { googleEmail: email, deletedAt: null },
      { facebookEmail: email, deletedAt: null },
    ]);

    if (user) {
      return res.status(409).json("Email is already taken");
    }
    res.status(200).json("The email is available");
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

// eslint-disable-next-line max-statements
const verifyEmail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.deletedAt) {
      return res.status(400).json({
        error: "Invalid Link",
      });
    }

    // there is a user with that id
    const token = await Token.findOne({
      userId: user._id,
      type: "verifyEmail",
      token: req.params.token,
    });
    if (!token) {
      return res.status(403).json({
        error: "Invalid Token",
      });
    }

    user.userSettings.verifiedEmail = true;
    await user.save();
    await token.remove();

    res.status(200).json("Email verified successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
};

// eslint-disable-next-line max-statements
const signinWithGoogleFacebook = async (req, res) => {
  try {
    const type = req.params.type.trim();
    if (type !== "google" && type !== "facebook") {
      res.status(400).json({ error: "Invalid type" });
    }
    // get the token and decode it
    let decodedToken;
    try {
      decodedToken = jwtDecode(req.body.accessToken);
    } catch (error) {
      return res.status(400).json({ error: "Invalid token" });
    }

    let user = null;
    let email = "";
    let sendEmail = false;
    let verifiedEmail = false;
    let emailType = "googleEmail";
    if (type === "google") {
      sendEmail = true;
      email = decodedToken.email;

      // check if the email was used before then login
      user = await User.findOne({
        googleEmail: email,
        deletedAt: null,
      });
    } else {
      sendEmail = false;
      verifiedEmail = true;
      email = decodedToken["user_id"];
      emailType = "facebookEmail";

      user = await User.findOne({
        facebookEmail: email,
        deletedAt: null,
      });
    }

    if (user) {
      // user signed up before
      const token = generateJWT(user);
      return res.status(200).json({ username: user.username, token: token });
    }

    // generate random username
    const randomUsername = await generateRandomUsernameUtil();
    if (randomUsername === "Couldn't generate") {
      throw new Error("Couldn't generate");
    }

    // if not then create a new account
    const newUser = new User({
      username: randomUsername,
      email: email,
      createdAt: Date.now(),
    });
    newUser[emailType] = email;
    newUser.userSettings.verifiedEmail = verifiedEmail;
    await newUser.save();

    const result = await finalizeCreateUser(newUser, sendEmail);
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};

// eslint-disable-next-line max-statements
const editUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const { userId } = req.payload;

    const user = await User.findById(userId);
    if (!user || user.deletedAt) {
      return res
        .status(400)
        .json({ error: "Can not find a user with that id" });
    }
    if (user.editedAt) {
      return res
        .status(400)
        .json({ error: "Can not change the username for this user again" });
    }

    const userWithUsername = await User.findOne({
      username: username,
      deletedAt: null,
    });
    if (userWithUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    user.editedAt = Date.now();
    user.username = username;
    await user.save();

    res.status(200).json("Username updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
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
  gfsigninValidator,
  signinWithGoogleFacebook,
  editUsernameValidator,
  editUsername,
};
