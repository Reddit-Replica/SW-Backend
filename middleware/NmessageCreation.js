import Message from "../models/Message.js";
import User from "../models/User.js";

/**
 * Middleware used to add a message o he database
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */

export async function addMessage(req, res, next) {
  //Extracting data from request body
  try {
    //ADDING NEW MESSAGE
    const message = await new Message(req.msg).save();
    const senderID = await User.findOne({ username: senderUsername });
    const receiverID = await User.findOne({ username: receiverUsername });
    if (message.type === "Messages") {
    } else if (message.type === "Mentions") {
    }
    next();
  } catch (err) {
    if (err.cause) {
      return res.status(err.cause).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
}
