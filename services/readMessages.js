import User from "../models/User.js";

/**
 * A function used to mark all username mentions of the user's collection as read
 * @param {string} userId User ID
 * @returns {void}
 */

export async function readUsernameMentions(userId) {
  const user = await User.findById(userId).populate("usernameMentions");
  for (message of user.usernameMentions) {
    message.isRead = true;
    await message.save();
  }
}

/**
 * A function used to mark all post replies of the user's collection as read
 * @param {string} userId User ID
 * @returns {void}
 */

export async function readPostReplies(userId) {
  const user = await User.findById(userId).populate("postReplies");
  for (message of user.postReplies) {
    message.isRead = true;
    await message.save();
  }
}

/**
 * A function used to mark all received messages of the user's collection as read
 * @param {string} userId User ID
 * @returns {void}
 */

export async function readReceivedMessages(userId) {
  const user = await User.findById(userId).populate("receivedMessages");
  for (message of user.receivedMessages) {
    message.isRead = true;
    await message.save();
  }
}

/**
 * A function used to mark all unread messages of the user's collection as read
 * @param {string} userId User ID
 * @returns {void}
 */

export async function readUnreadMessages(userId) {
  const user = await User.findById(userId).populate("unreadMessages");
  for (message of user.unreadMessages) {
    message.isRead = true;
    await message.save();
  }
}
