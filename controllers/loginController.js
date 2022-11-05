import { body } from "express-validator";
import { sendUsernameEmail } from "../utils/sendEmails.js";
import User from "./../models/User.js";

const forgetUsernameValidator = [
  body("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email must be a valid email"),
];

const forgetUsername = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "No user with that email found" });
    }

    const sentEmail = sendUsernameEmail(email, user.username);

    if (!sentEmail) {
      return res.status(400).json({
        error: "Could not send the email",
      });
    }

    res.send("Email has been sent");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export default {
  forgetUsernameValidator,
  forgetUsername,
};
