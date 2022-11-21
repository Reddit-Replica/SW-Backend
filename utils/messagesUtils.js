import User from "../models/User.js";
/**
 * This function is used to add a msg to the user's sent message list
 * @param {Object} message message that will be sent by the user
 * @param {String} userId the id of the user that the msg will be sent from
 * @returns {boolean} indicates if the message was sent successfully or not
 */

export async function addSentMessages(userId, message) {
  try {
    const user = await User.findById(userId);
    user.sentMessages.push({
      messageID: message.id,
    });
    user.save();
    return true;
  } catch (err) {
    return "Couldn't Add the message";
  }
}
/**
 * This function is used to add a msg to the user's received message list
 * @param {Object} message message that will be received by the user
 * @param {String} userId the id of the user that the msg will be received
 * @returns {boolean} indicates if the message was received successfully or not
 */
export async function addReceivedMessages(userId, message) {
  try {
    const user = await User.findById(userId);
    user.receivedMessages.push({
      messageID: message.id,
    });
    user.save();
    return true;
  } catch (err) {
    return false;
  }
}
/**
 * This function is used to add a msg to the user's mention list
 * @param {Object} message the mention that is done for the user
 * @param {String} userId the id of the user that got the mention
 * @returns {boolean} indicates if the mention was made successfully or not
 */
export async function addUserMention(userId, message) {
  try {
    const user = await User.findById(userId);
    user.userMentions.push({
      messageID: message.id,
    });
    user.save();
    return true;
  } catch (err) {
    return "Couldn't Add the message";
  }
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
    user.postReplies.push({
      messageID: message.id,
    });
    user.save();
    return true;
  } catch (err) {
    return "Couldn't Add the message";
  }
}