import User from "../models/User.js";
import Message from "../models/Message.js";
import Mention from "../models/Mention.js";
import PostReplies from "../models/PostReplies.js";

/**
 * A function used to mark all username mentions of the user's collection as read
 * @param {string} userId User ID
 * @returns {void}
 */

export async function readUsernameMentions(userId) {
  const user = await User.findById(userId);
  if (!user || user.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }
  await Mention.updateMany(
    { _id: { $in: user.usernameMentions } },
    { $set: { isRead: true } }
  );
}

/**
 * A function used to mark all post replies of the user's collection as read
 * @param {string} userId User ID
 * @returns {void}
 */

export async function readPostReplies(userId) {
  const user = await User.findById(userId);
  if (!user || user.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }
  await PostReplies.updateMany(
    { _id: { $in: user.postReplies } },
    { $set: { isRead: true } }
  );
}

/**
 * A function used to mark all received messages of the user's collection as read
 * @param {string} userId User ID
 * @returns {void}
 */

export async function readReceivedMessages(userId) {
  const user = await User.findById(userId);
  if (!user || user.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }
  await Message.updateMany(
    { _id: { $in: user.receivedMessages } },
    { $set: { isRead: true } }
  );
}
