import User from "../models/User.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import {
  addSentMessages,
  addReceivedMessages,
  addUserMention,
} from "../utils/messagesUtils.js";

/**
 * This function is used to add a message
 * it add the msg to sender's sent messages and to the receiver's received messages
 * then it's responsible for calling the functions that are used to handling the conversations
 * @param {Object} req req object from which we get our data
 * @returns {String} indicates if the message was sent successfully or not
 */

export async function addMessage(req) {
  try {
    const message = await new Message(req.msg).save();

    const sender = await User.findOne({ username: message.senderUsername });
    const receiver = await User.findOne({ username: message.receiverUsername });
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
    return "created";
  } catch (err) {
    return "error in creating the message";
  }
}
/**
 * This function is used to add a mention
 * it add the mention to the receiver mention list
 * @param {Object} req req object from which we get our data
 * @returns {String} indicates if the message was sent successfully or not
 */
export async function addMention(req) {
  try {
    const mention = await new Message(req.msg).save();
    const receiver = await User.findOne({ username: mention.receiverUsername });
    addUserMention(receiver.id, mention);
    return "created";
  } catch (err) {
    return "error in creating the mention";
  }
}

/**
 * This function is used to create a new conversation
 * firstly we check if there was an existing one with the same users and subject
 * if there is then we won't create a new one but we will return the id of that old conversation
 * so we will be able to add more messages to this conversation
 * @param {Object} msg msg object from which we will get our data to check if the conversation was created before or not
 * @returns {String} it return the id of the created conversation or the already existing one
 */
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

/**
 * This function is used to add new messages to the conversation
 * at each time we send a message then this message will be added to a conversation throw this function
 * @param {Object} msg msg object to add it to the conversation
 * @param {Object} conversationId the id of the conversation we want to add that message to
 * @returns {String} defines if the message was added successfully or not
 */
export async function addToConversation(msg, conversationId) {
  //HERE WE NEED TO ADD THE MSG TO THE CONVERSATION
  try {
    const conversation = await Conversation.findById(conversationId);
    conversation.messages.push({ messageID: msg.id });
    conversation.save();
    return "added";
  } catch (err) {
    return "error in add a message to conversation";
  }
}
/**
 * This function is used to check if the user has already that conversation or we will need to add a new one for him
 * @param {Object} user user object to check if he has the that conversation or not
 * @param {Object} conversationId the id of the conversation we want to check if the user had it or not
 * @returns {string} defines if the user has already that conversation or not
 */
async function checkExistingConversation(user, conversationId) {
  try {
    await user.populate("conversations.conversationId");
    const conversations = user.conversations;
    let valid = false;
    conversations.forEach((conversation) => {
      console.log(conversation.conversationId.id, conversationId);
      if (conversation.conversationId.id === conversationId) {
        valid = true;
      }
    });
    return valid;
  } catch (err) {
    return "there is an error while checking if that conversation exists or not";
  }
}
/**
 * This function is used to add the conversation to the users in case that they don't have it
 * @param {String} senderUsername the username of the sender user
 * @param {String} receiverUsername the username of the receiver user
 * @param {Object} convId the id of the conversation we want to check if the user had it or not
 * @returns {string} defines if the conversation was added successfully or not
 */
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
    return "error in add conversation to users";
  }
}

/**
 * This function is used to validate the data of the req that we wil add to the msg
 * and it injects the msg content to the req body so we will be able to use it later
 * @param {Object} req req object from which we get our data
 * @returns {boolean} defines if the data is valid or not
 */
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
    const sender = await User.findOne({ username: msg.senderUsername });
    if (sender.username !== req.payload.username) {
      return false;
    }
    req.msg = msg;
    return true;
  } catch (err) {
    return "error in add validating";
  }
}
