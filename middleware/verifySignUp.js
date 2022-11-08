import User from "../models/User.js";

/**
 * Middleware used to check the username and email used to sign up
 * if there was used before by another user.
 * It searches for the username and email and if one document was found
 * it will send status code 400 saying that the username or email is already in use
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function checkDuplicateUsernameOrEmail(req, res, next) {
  try {
    // Username
    const username = await User.findOne({ username: req.body.username.trim() });
    if (username) {
      return res.status(400).json({ error: "Username is already in use" });
    }

    //Email
    const email = req.body.email.trim();
    const emailUser = await User.findOne().or([
      { email: email },
      { googleEmail: email },
      { facebookEmail: email },
    ]);
    if (emailUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // if everything is good then continue
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
}
