import User from "../models/User.js";
/**
 * This function is used to add a msg to the user's sent message list
 * @param {Object} message message that will be sent by the user
 * @param {String} userId the id of the user that the msg will be sent from
 * @returns {boolean} indicates if the message was sent successfully or not
 */

export async function addSentMessages(userId, message) {
  const user = await User.findById(userId);
  for (const msg of user.sentMessages) {
    if (msg === message.id) {
      let err = new Error("This msg already exists");
      err.statusCode = 400;
      throw err;
    }
  }
  user.sentMessages.push(message.id);
  await user.save();
  return true;
}
/**
 * This function is used to add a msg to the user's received message list
 * @param {Object} message message that will be received by the user
 * @param {String} userId the id of the user that the msg will be received
 * @returns {boolean} indicates if the message was received successfully or not
 */
export async function addReceivedMessages(userId, message) {
  const user = await User.findById(userId);
  for (const msg of user.receivedMessages) {
    if (msg === message.id) {
      let err = new Error("This msg already exists");
      err.statusCode = 400;
      throw err;
    }
  }
  user.receivedMessages.push(message.id);
  await user.save();
  return true;
}
/**
 * This function is used to add a msg to the user's mention list
 * @param {Object} message the mention that is done for the user
 * @param {String} userId the id of the user that got the mention
 * @returns {boolean} indicates if the mention was made successfully or not
 */
export async function addUserMention(userId, message) {
  const user = await User.findById(userId);
  for (const mention of user.usernameMentions) {
    if (mention === message.id) {
      let err = new Error("This mention already exists");
      err.statusCode = 400;
      throw err;
    }
  }
  user.usernameMentions.push(message.id);
  await user.save();
  return true;
}
/**
 * This function is used to add a msg to the user's post reply list
 * @param {Object} message the post reply that the user got
 * @param {String} userId the id of the user that got the post reply
 * @returns {boolean} indicates if the post reply was made successfully or not
 */
export async function addPostReply(userId, message) {
  try {
    const user = await User.findById(userId);
    for (const postReply of user.usernameMentions) {
      if (postReply === message.id) {
        let err = new Error("This postReply already exists");
        err.statusCode = 400;
        throw err;
      }
    }
    user.postReplies.push(message.id);
    await user.save();
    return true;
  } catch (err) {
    return "Couldn't Add the message";
  }
}
