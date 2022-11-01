import User from "../models/User.js";
import { body } from "express-validator";
// // import jwt from "jsonwebtoken";

const signupValidator = [
  body("email")
    .trim()
    .not()
    .isEmpty()
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

const signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send(user);
  });
};

export default {
  signupValidator,
  signup,
};
