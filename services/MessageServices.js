/* eslint-disable max-len */
import User from "../models/User.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import {
  addSentMessages,
  addReceivedMessages,
  addUserMention,
} from "../utils/messagesUtils.js";
import { searchForUserService } from "./userServices.js";
import { searchForSubreddit } from "./communityServices.js";
/**
 * This function is used to add a message
 * it add the msg to sender's sent messages and to the receiver's received messages
 * then it's responsible for calling the functions that are used to handling the conversations
 * @param {Object} req req object from which we get our data
 * @returns {String} indicates if the message was sent successfully or not
 */
export async function addMessage(req) {
  //SAVING MESSAGE TO DATABASE
  const message = await new Message(req.msg).save();

  //IN CASE OF THE SENDER IS A USER THEN THIS MESSAGE WILL BE ADDED TO HIS SENT MESSAGES , IF IT'S A SUBREDDIT THEN IT WON'T BE ADDED
  if (message.isSenderUser) {
    const sender = await searchForUserService(message.senderUsername);
    //ADD THIS MESSAGE TO SENDER SENT MESSAGES
    addSentMessages(sender.id, message);
  }

  //IN CASE OF THE RECEIVER IS A USER THEN THIS MESSAGE WILL BE ADDED TO HIS RECEIVED MESSAGES , IF IT'S A SUBREDDIT THEN IT WON'T BE ADDED
  if (message.isReceiverUser) {
    const receiver = await searchForUserService(message.receiverUsername); //
    //ADD THIS MESSAGE TO RECEIVER RECEIVED MESSAGES
    addReceivedMessages(receiver.id, message);
  }

  //CREATING A NEW CONVERSATIONS USING THE MESSAGE SENT
  const conversationId = await createNewConversation(message);
  //GETTING THE CONVERSATION SO WE WOULD BE ABLE TO ADD THE MSG TO IT
  const conversation = await Conversation.findById(conversationId);
  conversation.messages.push({ messageID: message.id });
  await conversation.save();
  //ADDING THIS CONVERSATION TO THE USERS IF IT EXISTS THERE
  await addConversationToUsers(message, conversationId);
}
/**
 * This function is used to add a mention
 * it add the mention to the receiver mention list
 * @param {Object} req req object from which we get our data
 * @returns {String} indicates if the message was sent successfully or not
 */
export async function addMention(req) {
  const mention = await new Message(req.msg).save();
  const receiver = await User.findOne({
    username: mention.receiverUsername,
    deletedAt: undefined,
  });
  addUserMention(receiver.id, mention);
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
  //CHECK IF THE CONVERSATION IS IN THE DATABASE
  const conversation = await Conversation.findOne({
    subject: msg.subject,
    $or: [
      { firstUsername: msg.senderUsername },
      { firstUsername: msg.receiverUsername },
    ],
    $or: [
      { secondUsername: msg.senderUsername },
      { secondUsername: msg.receiverUsername },
    ],
  });
  //IF THERE IS NO CONVERSATION WITH THESE DATA THEN WE WILL CREATE A NEW ONE AND RETURN ITS ID , BUT IF THERE IS SO WE WILL RETURN THE ID OF THE EXISTING ONE
  if (!conversation) {
    const createdConversation = await new Conversation({
      latestDate: msg.sentAt,
      subject: msg.subject,
      messages: [],
      firstUsername: msg.senderUsername,
      secondUsername: msg.receiverUsername,
    }).save();
    return createdConversation.id;
  } else {
    return conversation.id;
  }
}
/**
 * This function is used to add new messages to the conversation
 * at each time we send a message then this message will be added to a conversation throw this function
 * @param {Object} msg msg object to add it to the conversation
 * @param {Object} conversationId the id of the conversation we want to add that message to
 * @returns {Object} defines if there is an error or not and specifies the kind of the error if there was
 */
export async function addToConversation(msg, conversationId) {
  //HERE WE NEED TO ADD THE MSG TO THE CONVERSATION
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    let err = new Error("This conversation is not found");
    err.statusCode = 400;
    throw err;
  }
  conversation.messages.push({ messageID: msg.id });
  conversation.save();
}
/**
 * This function is used to check if the user has already that conversation or we will need to add a new one for him
 * @param {Object} user user object to check if he has the that conversation or not
 * @param {Object} conversationId the id of the conversation we want to check if the user had it or not
 * @returns {Boolean} defines if the user has already that conversation or not
 */
async function checkExistingConversation(user, conversationId) {
  //CHECKING IF THE USER HAVE ALREADY THAT CONVERSATION OR WE NEED TO ADD IT
  await user.populate("conversations.conversationId");
  const conversations = user.conversations;
  let valid = false;
  conversations.forEach((conversation) => {
    if (conversation.conversationId.id === conversationId) {
      valid = true;
    }
  });
  return valid;
}
/**
 * This function is used to add the conversation to the users in case that they don't have it
 * @param {String} senderUsername the username of the sender user
 * @param {String} receiverUsername the username of the receiver user
 * @param {Object} convId the id of the conversation we want to check if the user had it or not
 * @returns {string} defines if the conversation was added successfully or not
 */
async function addConversationToUsers(message, convId) {
  // WE SEARCH FOR THE SENDER TO CHECK IF HE HAS THE CONVERSATION OR NOT
  if (message.isSenderUser) {
    const userOne = await User.findOne({
      username: message.senderUsername,
      deletedAt: undefined,
    });
    const userOneConv = await checkExistingConversation(userOne, convId);
    if (!userOneConv) {
      userOne.conversations.push({
        conversationId: convId,
        with: message.receiverUsername,
      });
      await userOne.save();
    }
  }
  if (message.isReceiverUser) {
    const userTwo = await User.findOne({
      username: message.receiverUsername,
      deletedAt: undefined,
    });
    const userTwoConv = await checkExistingConversation(userTwo, convId);
    if (!userTwoConv) {
      userTwo.conversations.push({
        conversationId: convId,
        with: message.senderUsername,
      });
      await userTwo.save();
    }
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
  //MESSAGE TYPE MUST BE MENTIONS OR MESSAGES ONLY
  if (req.body.type !== "Mentions" && req.body.type !== "Messages") {
    let err = new Error("Message type should be either Mentions or Messages");
    err.statusCode = 400;
    throw err;
  }
  //IF THE TYPE IS MENTION THEN POST ID MUST BE ADDED
  // => WE NEED TO ADD COMMENT ID ALSO
  if (req.body.type === "Mentions") {
    if (!req.body.postId) {
      let err = new Error("Post Id is needed when type is Mentions");
      err.statusCode = 400;
      throw err;
    }
  }
  //IF THE TYPE IS COMMENT THEN SUBJECT MUST BE ADDED
  if (req.body.type === "Messages") {
    if (!req.body.subject) {
      let err = new Error("Subject is needed when type is Messages");
      err.statusCode = 400;
      throw err;
    }
  }
  //SENDER AND RECEIVER USERNAME MUST BE IN THE FORM /U/USERNAME OR /R/SUBREDDITNAME
  if (
    !req.body.senderUsername.includes("/") ||
    !req.body.receiverUsername.includes("/")
  ) {
    let err = new Error("Invalid sender or receiver username");
    err.statusCode = 400;
    throw err;
  }
  //CREATING THE ARRAY THAT WILL BE USED TO GET THE KIND AND USERNAME OF THE SENDER AND RECEIVER
  const senderArr = req.body.senderUsername.split("/");
  const receiverArr = req.body.receiverUsername.split("/");

  //CREATING THE MAIN STRUCTURE OF THE MESSAGE
  const msg = {
    text: req.body.text,
    senderUsername: senderArr[senderArr.length - 1],
    receiverUsername: receiverArr[receiverArr.length - 1],
    type: req.body.type,
  };
  //CHECKING IF THE SENDER IS SUBREDDIT OR NORMAL USER
  if (senderArr[senderArr.length - 2] === "r" && msg.type !== "Mentions") {
    msg.isSenderUser = false;
  } else if (senderArr[senderArr.length - 2] === "u") {
    msg.isSenderUser = true;
  } else {
    let err = new Error("Invalid sender username");
    err.statusCode = 400;
    throw err;
  }
  //CHECKING IF THE RECEIVER IS A SUBREDDIT OR A NORMAL USER
  if (receiverArr[receiverArr.length - 2] === "r" && msg.type !== "Mentions") {
    msg.isReceiverUser = false;
  } else if (receiverArr[receiverArr.length - 2] === "u") {
    msg.isReceiverUser = true;
  } else {
    let err = new Error("Invalid receiver username");
    err.statusCode = 400;
    throw err;
  }
  //YOU CAN'T SEND A MSG FROM A SUBREDDIT TO ANOTHER
  if (!msg.isReceiverUser && !msg.isSenderUser) {
    let err = new Error("You can't send a message from a subreddit to another");
    err.statusCode = 400;
    throw err;
  }
  //ADDING EXTRA PARTS OF THE MESSAGE IF IT'S IN THE BODY
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
  //CHECKING IF THE RECEIVER IS AVAILABLE OR NOT
  if (msg.isReceiverUser) {
    const receiver = await searchForUserService(msg.receiverUsername);
    msg.receiverId = receiver.id;
  } else {
    await searchForSubreddit(msg.receiverUsername);
  }
  //CHECKING IF THE SENDER IS AVAILABLE OR NOT
  if (msg.isSenderUser) {
    await searchForUserService(msg.senderUsername);
  } else {
    await searchForSubreddit(msg.senderUsername);
  }
  req.msg = msg;
}

export async function searchForMessage(messageId) {
  const msg = await Message.findById(messageId);
  if (!msg || msg.deletedAt) {
    let error = new Error("Couldn't find a message with that Id");
    error.statusCode = 404;
    throw error;
  }
  return msg;
}

async function checkForMsgReceiver(message, user) {
  if (message.isReceiverUser) {
    if (!(message.receiverUsername === user.username)) {
      let err = new Error(
        "You can't do action to this messages, you are not the receiver"
      );
      err.statusCode = 400;
      throw err;
    }
  } else {
    let err = new Error(
      "You can't do this action to this message,it was sent to subreddit"
    );
    err.statusCode = 400;
    throw err;
  }
}

export async function markMessageAsSpam(message, user) {
  await checkForMsgReceiver(message, user);
  //SHOULD BE ADDED TO SPAMMED MESSAGES LIST TO THE ADMIN
  if (message.isSpam) {
    let err = new Error("Msg is already spammed");
    err.statusCode = 409;
    throw err;
  }
  message.isSpam = true;
  await message.save();
  return {
    statusCode: 200,
    message: "Message has been spammed successfully",
  };
}

export async function unmarkMessageAsSpam(message, user) {
  await checkForMsgReceiver(message, user);
  //SHOULD BE REMOVED FROM SPAMMED MESSAGES LIST OF THE ADMIN
  if (!message.isSpam) {
    let err = new Error("Msg is already unspammed");
    err.statusCode = 409;
    throw err;
  }
  message.isSpam = false;
  await message.save();
  return {
    statusCode: 200,
    message: "Message has been unspammed successfully",
  };
}

export async function unreadMessage(message, user) {
  await checkForMsgReceiver(message, user);
  if (!message.isRead) {
    let err = new Error("Msg is already unread");
    err.statusCode = 400;
    throw err;
  }
  message.isRead = false;
  await message.save();
  return {
    statusCode: 200,
    message: "Message has been unread successfully",
  };
}
