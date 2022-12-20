/* eslint-disable max-statements */
/* eslint-disable max-len */
import User from "../models/User.js";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import {
  addSentMessages,
  addReceivedMessages,
  addUserMention,
} from "../utils/messagesUtils.js";
import { searchForUserService } from "./userServices.js";
import { searchForSubreddit } from "./communityServices.js";
import Mention from "../models/Mention.js";
import { searchForComment, searchForPost } from "./PostActions.js";
import { sendMentionMail, sendMessageMail } from "../utils/sendEmails.js";
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
    if (
      !receiver.userSettings.unsubscribeFromEmails &&
      !receiver.facebookEmail&& receiver.username !== message.senderUsername
    ) {
      console.log("sent");
      sendMessageMail(receiver,message);
      console.log("sent");
    }
  }
  let conversationId;
  //CREATING A NEW CONVERSATIONS USING THE MESSAGE SENT
  if (!message.isReply) {
    conversationId = await createNewConversation(message);
  } else {
    conversationId = await getExistingConversation(message.repliedMsgId);
  }
  //GETTING THE CONVERSATION SO WE WOULD BE ABLE TO ADD THE MSG TO IT
  await addToConversation(message, conversationId);
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
  const existingMention = await Mention.findOne({
    commentId: req.mention.commentId,
    receiverUsername: req.mention.receiverUsername,
  });
  if (existingMention) {
    let error = new Error("This mention already exists");
    error.statusCode = 400;
    throw error;
  }
  const comment = await searchForComment(req.mention.commentId);

  console.log(comment.content, req.mention.receiverUsername);
  if (!comment.content.includes(req.mention.receiverUsername)) {
    let error = new Error(
      "The comment doesn't contain the name of the receiver username"
    );
    error.statusCode = 400;
    throw error;
  }
  if (comment.ownerUsername !== req.payload.username) {
    let error = new Error("The user sent the request isn't the comment owner");
    error.statusCode = 400;
    throw error;
  }

  const post = await searchForPost(req.mention.postId);
  const mention = await new Mention(req.mention).save();
  const receiver = await searchForUserService(mention.receiverUsername);
  if (
    !receiver.userSettings.unsubscribeFromEmails &&
    comment.ownerUsername !== req.mention.receiverUsername &&
    !receiver.facebookEmail
  ) {
    sendMentionMail(receiver, post, comment);
  }
  for (const smallUser of post.usersCommented) {
    if (smallUser.toString() === receiver.id) {
      await addUserMention(receiver.id, mention);
      break;
    }
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
//DONE
export async function createNewConversation(msg) {
  //IF THERE IS NO CONVERSATION WITH THESE DATA THEN WE WILL CREATE A NEW ONE AND RETURN ITS ID , BUT IF THERE IS SO WE WILL RETURN THE ID OF THE EXISTING ONE
  const createdConversation = await new Conversation({
    latestDate: msg.sentAt,
    subject: msg.subject,
    messages: [],
    firstUsername: msg.senderUsername,
    secondUsername: msg.receiverUsername,
    isFirstNameUser: msg.isSenderUser,
    isSecondNameUser: msg.isReceiverUser,
  }).save();
  return createdConversation.id;
}
/**
 * This function is used to create a new conversation
 * firstly we check if there was an existing one with the same users and subject
 * if there is then we won't create a new one but we will return the id of that old conversation
 * so we will be able to add more messages to this conversation
 * @param {Object} msg msg object from which we will get our data to check if the conversation was created before or not
 * @returns {String} it return the id of the created conversation or the already existing one
 */

//DONE
export async function getExistingConversation(repliedMsgId) {
  //IF THERE IS NO CONVERSATION WITH THESE DATA THEN WE WILL CREATE A NEW ONE AND RETURN ITS ID , BUT IF THERE IS SO WE WILL RETURN THE ID OF THE EXISTING ONE
  if (!mongoose.Types.ObjectId.isValid(repliedMsgId)) {
    let error = new Error("Invalid Message id");
    error.statusCode = 400;
    throw error;
  }
  console.log(repliedMsgId);
  const existedConversation = await Conversation.findOne({
    messages: repliedMsgId.toString(),
  });
  if (!existedConversation) {
    let err = new Error("This conversation is not found");
    err.statusCode = 400;
    throw err;
  }
  return existedConversation.id;
}
/**
 * This function is used to add new messages to the conversation
 * at each time we send a message then this message will be added to a conversation throw this function
 * @param {Object} msg msg object to add it to the conversation
 * @param {Object} conversationId the id of the conversation we want to add that message to
 * @returns {Object} defines if there is an error or not and specifies the kind of the error if there was
 */
//DONE
export async function addToConversation(msg, conversationId) {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    let error = new Error("Invalid conversation id");
    error.statusCode = 400;
    throw error;
  }
  //HERE WE NEED TO ADD THE MSG TO THE CONVERSATION
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    let err = new Error("This conversation is not found");
    err.statusCode = 400;
    throw err;
  }
  for (const msg of conversation.messages) {
    if (msg.toString() === msg.id.toString()) {
      let err = new Error("This Message already exists in the conversation");
      err.statusCode = 400;
      throw err;
    }
  }
  conversation.messages.push(msg.id);
  conversation.latestDate = Date.now();
  await conversation.save();
  return true;
}
/**
 * This function is used to check if the user has already that conversation or we will need to add a new one for him
 * @param {Object} user user object to check if he has the that conversation or not
 * @param {Object} conversationId the id of the conversation we want to check if the user had it or not
 * @returns {Boolean} defines if the user has already that conversation or not
 */
//DONE
export async function checkExistingConversation(user, conversationId) {
  //CHECKING IF THE USER HAVE ALREADY THAT CONVERSATION OR WE NEED TO ADD IT
  for (const conversation of user.conversations) {
    if (conversation.toString() === conversationId) {
      return true;
    }
  }
  return false;
}
/**
 * This function is used to add the conversation to the users in case that they don't have it
 * @param {String} senderUsername the username of the sender user
 * @param {String} receiverUsername the username of the receiver user
 * @param {Object} convId the id of the conversation we want to check if the user had it or not
 * @returns {string} defines if the conversation was added successfully or not
 */
//DONE
export async function addConversationToUsers(message, convId) {
  // WE SEARCH FOR THE SENDER TO CHECK IF HE HAS THE CONVERSATION OR NOT
  if (message.isSenderUser) {
    const sender = await User.findOne({ username: message.senderUsername });
    const senderConversation = await checkExistingConversation(sender, convId);
    if (!senderConversation) {
      sender.conversations.push(convId);
      await sender.save();
    }
  }

  if (message.isReceiverUser) {
    const receiver = await User.findOne({
      username: message.receiverUsername,
      deletedAt: undefined,
    });
    const receiverConversation = await checkExistingConversation(
      receiver,
      convId
    );
    if (!receiverConversation) {
      receiver.conversations.push(convId);
      await receiver.save();
    }
  }
  return true;
}

/**
 * This function is used to validate the data of the req that we wil add to the msg
 * and it injects the msg content to the req body so we will be able to use it later
 * @param {Object} req req object from which we get our data
 * @returns {boolean} defines if the data is valid or not
 */
// eslint-disable-next-line max-statements
export async function validateMessage(req) {
  if (!req.body.subject) {
    let err = new Error("Subject is needed");
    err.statusCode = 400;
    throw err;
  }
  if (!req.body.senderUsername) {
    let err = new Error("senderUsername is needed");
    err.statusCode = 400;
    throw err;
  }
  if (!req.body.receiverUsername) {
    let err = new Error("receiverUsername is needed");
    err.statusCode = 400;
    throw err;
  }
  if (!req.body.text) {
    let err = new Error("text is needed");
    err.statusCode = 400;
    throw err;
  }
  if (req.body.isReply === undefined) {
    let err = new Error("isReply is needed");
    err.statusCode = 400;
    throw err;
  }
  if (req.body.isReply) {
    if (!req.body.repliedMsgId) {
      let err = new Error("repliedMsgId is needed");
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
    subject: req.body.subject,
  };
  if (req.body.isReply !== undefined) {
    msg.isReply = req.body.isReply;
  }
  if (req.body.repliedMsgId && req.body.isReply) {
    msg.repliedMsgId = req.body.repliedMsgId;
    await searchForMessage(msg.repliedMsgId);
  }
  //CHECKING IF THE SENDER IS SUBREDDIT OR NORMAL USER
  if (senderArr[senderArr.length - 2] === "r") {
    msg.isSenderUser = false;
  } else if (senderArr[senderArr.length - 2] === "u") {
    msg.isSenderUser = true;
  } else {
    let err = new Error("Invalid sender username");
    err.statusCode = 400;
    throw err;
  }
  //CHECKING IF THE RECEIVER IS A SUBREDDIT OR A NORMAL USER
  if (receiverArr[receiverArr.length - 2] === "r") {
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

  if (req.body.subredditName) {
    msg.subredditName = req.body.subredditName;
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
    if (msg.senderUsername !== req.payload.username) {
      let err = new Error("This isn't the token of the sender");
      err.statusCode = 400;
      throw err;
    }
  } else {
    await searchForSubreddit(msg.senderUsername);
  }
  msg.createdAt = Date.now();
  req.msg = msg;
}

/**
 * This function is used to validate the data of the req that we wil add to the mention
 * and it injects the mention content to the req body so we will be able to use it later
 * @param {Object} req req object from which we get our data
 * @returns {boolean} defines if the data is valid or not
 */
export async function validateMention(req) {
  if (!req.body.postId || !req.body.commentId) {
    let err = new Error("Post Id and Comment Id is needed");
    err.statusCode = 400;
    throw err;
  }
  if (!req.body.receiverUsername) {
    let err = new Error("receiverUsername is needed");
    err.statusCode = 400;
    throw err;
  }
  const post = searchForPost(req.body.postId);
  const comment = searchForComment(req.body.commentId);
  //CREATING THE MAIN STRUCTURE OF THE MENTION
  const mention = {
    commentId: req.body.commentId,
    postId: req.body.postId,
    receiverUsername: req.body.receiverUsername,
  };
  mention.createdAt = Date.now();
  req.mention = mention;
}

export async function searchForMessage(messageId) {
  const msg = await Message.findById(messageId);
  if (!msg || msg.deletedAt) {
    let error = new Error("Couldn't find a message with that Id");
    error.statusCode = 400;
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
