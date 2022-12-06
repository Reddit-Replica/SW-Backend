import User from "../models/User.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import Subreddit from "../models/Community.js";
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
  //SAVING MESSAGE TO DATABASE
  const message = await new Message(req.msg).save();
  if (message.isSenderUser) {
    //GETTING SENDER USER
    const sender = await User.findOne({ username: message.senderUsername });
    //ADD THIS MESSAGE TO SENDER SENT MESSAGES
    addSentMessages(sender.id, message);
  }
  if (message.isReceiverUser) {
    //GETTING RECEIVER USER
    const receiver = await User.findOne({
      username: message.receiverUsername,
    });
    //ADD THIS MESSAGE TO RECEIVER RECEIVED MESSAGES
    addReceivedMessages(receiver.id, message);
  }
  //CREATING A NEW CONVERSATIONS USING THE MESSAGE SENT , IF IT WAS CREATED BEFORE THEN THE MESSAGE WILL BE ADDED TO IT THEN
  const conversationId = await createNewConversation(message);
  const conversation = await Conversation.findById(conversationId);
  //PUSHING THE MESSAGE TO THE CONVERSATION'S MESSAGES
  conversation.messages.push({ messageID: message.id });
  //SAVING CONVERSATION
  await conversation.save();
  console.log("saved");
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
  const receiver = await User.findOne({ username: mention.receiverUsername });
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
  const conversation = await Conversation.findById(conversationId);
  conversation.messages.push({ messageID: msg.id });
  conversation.save();
  return "added";
}
/**
 * This function is used to check if the user has already that conversation or we will need to add a new one for him
 * @param {Object} user user object to check if he has the that conversation or not
 * @param {Object} conversationId the id of the conversation we want to check if the user had it or not
 * @returns {string} defines if the user has already that conversation or not
 */
async function checkExistingConversation(user, conversationId) {
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
  if (message.isSenderUser) {
    const userOne = await User.findOne({ username: message.senderUsername });
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
  if (req.body.type !== "Mentions" && req.body.type !== "Messages") {
    let err = new Error("Message type should be either Mentions or Messages");
    err.statusCode = 400;
    throw err;
  }
  if (req.body.type === "Mentions") {
    if (!req.body.postId) {
      let err = new Error("Post Id is needed when type is Mentions");
      err.statusCode = 400;
      throw err;
    }
  }
  if (req.body.type === "Messages") {
    if (!req.body.subject) {
      let err = new Error("Subject is needed when type is Messages");
      err.statusCode = 400;
      throw err;
    }
  }
  if (
    !req.body.senderUsername.includes("/") ||
    !req.body.receiverUsername.includes("/")
  ) {
    let err = new Error("Invalid sender or receiver username");
    err.statusCode = 400;
    throw err;
  }
  const senderArr = req.body.senderUsername.split("/");
  const receiverArr = req.body.receiverUsername.split("/");

  const msg = {
    text: req.body.text,
    senderUsername: senderArr[senderArr.length - 1],
    receiverUsername: receiverArr[receiverArr.length - 1],
    type: req.body.type,
  };
  if (senderArr[senderArr.length - 2] === "r" && msg.type !== "Mentions") {
    msg.isSenderUser = false;
  } else if (senderArr[senderArr.length - 2] === "u") {
    msg.isSenderUser = true;
  } else {
    let err = new Error("Invalid sender username");
    err.statusCode = 400;
    throw err;
  }

  if (receiverArr[receiverArr.length - 2] === "r" && msg.type !== "Mentions") {
    msg.isReceiverUser = false;
  } else if (receiverArr[receiverArr.length - 2] === "u") {
    msg.isReceiverUser = true;
  } else {
    let err = new Error("Invalid receiver username");
    err.statusCode = 400;
    throw err;
  }
  if (!msg.isReceiverUser && !msg.isSenderUser) {
    let err = new Error("Sender and Receiver usernames are necessary");
    err.statusCode = 400;
    throw err;
  }
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

  if (msg.isReceiverUser) {
    const receiver = await User.findOne({ username: msg.receiverUsername });
    msg.receiverId = receiver.id;
    if (!receiver) {
      let err = new Error("receiver is not found");
      err.statusCode = 400;
      throw err;
    }
  } else {
    const receiver = await Subreddit.findOne({ title: msg.receiverUsername });
    if (!receiver) {
      let err = new Error("subreddit name is not found");
      err.statusCode = 400;
      throw err;
    }
  }

  if (msg.isSenderUser) {
    const sender = await User.findOne({ username: msg.senderUsername });
    if (!sender || sender.username !== req.payload.username) {
      let err = new Error("Failed to send the message");
      err.statusCode = 400;
      throw err;
    }
  } else {
    const sender = await Subreddit.findOne({ title: msg.senderUsername });
    if (!sender) {
      let err = new Error("subreddit name is not found");
      err.statusCode = 400;
      throw err;
    }
  }
  req.msg = msg;
}
