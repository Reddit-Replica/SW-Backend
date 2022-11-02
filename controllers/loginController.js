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

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("Username not found");
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      const token = generateJWT(user);
      res.header("Authorization", "Bearer " + token);
      res.status(200).send("Logged in successfuly!");
    }
    return res.status(400).send("Invalid credentials");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export default {
  loginValidator,
  login,
};
