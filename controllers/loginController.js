import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

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

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation failed!");
    return res.status(422);
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("User not found.");
        return res.status(404);
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          // We make it here whether the passwords match or not
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              console.log("Logged In");
              res.status(200);
            });
          }
          console.log("Invalid credentials.");
          return res.status(422);
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log("Internal Server Error", err);
      return res.status(500);
    });
};

export default {
  loginValidator,
  login,
};
