import User from "../models/User.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
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
      const conversationId = await createNewConversation(message);
      const conversation = await Conversation.findById(conversationId);
      conversation.messages.push({ messageID: message.id });
      conversation.save();

      await addConversationToUsers(
        message.senderUsername,
        message.receiverUsername,
        conversationId
      );
    } else if (message.type === "Mentions") {
      //add this mention to receiver mentions
      addUserMention(receiver.id, message);
    }
    return message;
  } catch (err) {
    return "error in creating";
  }
}

export async function createNewConversation(msg) {
  //HERE WE NEED TO CREATE THE CONVERSATION FROM SCRATCH
  try {
    //check if the conversation is already in database
    const conversation1 = await Conversation.findOne({
      subject: msg.subject,
      firstUsername: msg.senderUsername,
      secondUsername: msg.receiverUsername,
    });
    const conversation2 = await Conversation.findOne({
      subject: msg.subject,
      firstUsername: msg.receiverUsername,
      secondUsername: msg.senderUsername,
    });
    //IF THERE IS NO CONVERSATION WITH THESE DATA THEN WE WILL CREATE A NEW ONE
    if (!conversation1 && !conversation2) {
      const conversation = await new Conversation({
        latestDate: msg.sentAt,
        subject: msg.subject,
        messages: [],
        firstUsername: msg.senderUsername,
        secondUsername: msg.receiverUsername,
      }).save();
      return conversation.id;
    }
    //BUT IF THERE IS THEN WE NEED TO RETURN THE ID OF THAT CONVERSATION TO ADD THE MESSAGE INTO IT
    if (!conversation1) {
      return conversation2.id;
    } else {
      return conversation1.id;
    }
  } catch (err) {
    return "error in creating msg";
  }
}

export async function addToConversation(msg, conversationId) {
  //HERE WE NEED TO ADD THE MSG TO THE CONVERSATION
  try {
    const conversation = await Conversation.findById(conversationId);
    conversation.messages.push({ messageID: msg.id });
    conversation.save();
  } catch (err) {
    return "error in add conversation";
  }
}

async function checkExistingConversation(user, conversationId) {
  try {
  await user.populate("conversations.conversationId");
  const conversations = user.conversations;
  let valid=false;
  conversations.forEach((conversation) => {
    console.log(conversation.conversationId.id,conversationId);
    if (conversation.conversationId.id === conversationId) {
      valid=true;
    }
  });
  return valid;
} catch (err) {
  return "error in add conversation";
}
}

async function addConversationToUsers(
  senderUsername,
  receiverUsername,
  convId
) {
  try {
  const userOne = await User.findOne({ username: senderUsername });
  const userTwo = await User.findOne({ username: receiverUsername });
  const userOneConv = await checkExistingConversation(userOne, convId);
  console.log(userOneConv);
  const userTwoConv = await checkExistingConversation(userTwo, convId);
  if (!userOneConv) {
    userOne.conversations.push({
      conversationId: convId,
      with: receiverUsername,
    });

    userOne.save();
  }
  if (!userTwoConv) {
    userTwo.conversations.push({
      conversationId: convId,
      with: senderUsername,
    });

    userTwo.save();
  }
} catch (err) {
  return "error in add conversation";
}
}

//check if sender and receiver ids are for persons not deleted

// eslint-disable-next-line max-statements
export async function validateMessage(req) {
  try {
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
  const receiver = await User.findOne({ username: msg.receiverUsername });
  if (!receiver) {
    return false;
  }
  const sender=await User.findOne({ username:msg.senderUsername });
  if (sender.username !== req.payload.username) {
    return false;
  }
  req.msg = msg;
  return true;
} catch (err) {
  return "error in add validating";
}
}
