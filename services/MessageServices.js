import User from "../models/User.js";
import Message from "../models/Message.js";
// eslint-disable-next-line max-len
import {
  addSentMessages,
  addReceivedMessages,
  addUserMention,
} from "../utils/messagesUtils.js";

// eslint-disable-next-line max-statements
export async function addMessage(req) {
  try {
    const message = await new Message(req.msg).save();

    const sender = await User.findOne({ username: message.senderUsername });
    const receiver = await User.findOne({ username: message.receiverUsername });
    if (message.type === "Messages") {
      //add this message to the sender user as sent message
      addSentMessages(sender.id, message);
      //add this message to the receiver user as received message
      addReceivedMessages(receiver.id, message);
      addConversation(message, sender.id, receiver.username);
      addConversation(message, receiver.id, sender.username);
    } else if (message.type === "Mentions") {
      //add this mention to receiver mentions
      addUserMention(receiver.id, message);
    }
    return message;
  } catch (err) {
    return "error in creating msg";
  }
}

export async function addConversation(msg, userId, username) {
  try {
    const user = await User.findById(userId);
    console.log("user is ", user.username);
    user.conversations.forEach((conversation) => {
      if (
        conversation.subject === msg.subject &&
        conversation.username === username
      ) {
        console.log(user.conversations);
        user.conversation.messages.push({ messageID: msg.messageID });
        user.conversation.latestDate = msg.sentAt;
        user.save();
        return;
      }
    });
    createNewConversation(msg, userId, username);
  } catch (err) {
    return "error in add conversation";
  }
}
export async function createNewConversation(msg, userId, username) {
  try {
    const user = await User.findById(userId);
    console.log("user is ", user.username);
    user.conversations.push({
      latestDate: msg.sentAt,
      subject: msg.subject,
      username: username,
      messages: [
        {
          messageID: msg.id,
        },
      ],
    });
    user.save();
    return;
  } catch (err) {
    return "error in creating msg";
  }
}

//check if sender and receiver ids are for persons not deleted

// eslint-disable-next-line max-statements
export function validateMessage(req) {
  /* sender = checkOnUser(req.body.senderUsername);
  receiver = checkOnUser(req.body.receiverUsername);
  if (!sender || !receiver) {
    return false;
  }*/
  if (req.body.type === "Mentions") {
    if (!req.body.postId) {
      return false;
    }
  }
  if (req.body.type === "Messages") {
    if (!req.body.subject) {
      return false;
    }
  }
  const msg = {
    text: req.body.text,
    senderUsername: req.body.senderUsername,
    receiverUsername: req.body.receiverUsername,
    type: req.body.type,
  };
  if (req.body.postId) {
    msg.postId = req.body.postId;
  }
  if (req.body.subredditName) {
    msg.subredditName = req.body.subredditName;
  }
  if (req.body.repliedMsgId) {
    msg.repliedMsgId = req.body.repliedMsgId;
  }
  if (req.body.subject) {
    msg.subject = req.body.subject;
  }
  req.msg = msg;
  return true;
}

async function checkOnUser(username) {
  const user = await User.findOne({ username: username });
  if (!user) {
    return false;
  }
  return true;
}
