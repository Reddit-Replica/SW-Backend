import User from "../models/User.js";

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username
    let username = await User.findOne({ username: req.body.username.trim() });
    if (username) {
      return res.status(400).send({ error: "Username is already in use!" });
    }

    //Email
    let email = await User.findOne({ email: req.body.email.trim() });
    if (email) {
      return res.status(400).send({ error: "Email is already in use!" });
    }

    // if everything is good then continue
    next();
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
