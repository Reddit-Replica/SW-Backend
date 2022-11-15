import Message from "../models/Message.js";

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
  const { senderUsername, receiverUsername, text, subject } = req.body;
  try {
    //ADDING NEW MESSAGE
    const message = await new Message({
      senderUsername: senderUsername,
      receiverUsername: receiverUsername,
      text: text,
      subject: subject,
    }).save();
    //Getting Sender to add the message to his sentmessages
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
