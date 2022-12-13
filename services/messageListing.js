/* eslint-disable max-len */
/* eslint-disable max-statements */
import User from "../models/User.js";
import {
  messageListing,
  mentionListing,
  conversationListing,
  inboxListing,
  splitterOnType,
} from "../utils/prepareMessageListing.js";
import { searchForComment, searchForPost } from "./PostActions.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { prepareLimit } from "../utils/prepareLimit.js";

/**
 * Function that get the posts that we want to list from a certain user
 * then sort, match, and limit them, then finally save the last id so that it can
 * be used next time to get different results.
 * Function also check each post if it was followed or saved or spammed by the logged in user.
 *
 * @param {Object} user User that we want to list his posts
 * @param {Object} loggedInUser Logged in user that did the request
 * @param {String} typeOfListing Name of the list in the user model that we want to list
 * @param {Object} listingParams Listing parameters that was in the query of the request
 * @returns {Object} The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function userMessageListing(
  user,
  typeOfListing,
  listingParams,
  isUnread
) {
  // prepare the listing parameters
  const listingResult = await messageListing(listingParams);
  if (isUnread) {
    listingResult.find.isRead = false;
  }
  const result = await User.findOne({ username: user.username })
    .select(typeOfListing)
    .populate({
      path: typeOfListing,
      match: listingResult.find,
      limit: listingResult.limit,
      options: {
        sort: listingResult.sort,
      },
    });
  let children = [];
  for (const i in result[typeOfListing]) {
    const message = result[typeOfListing][i];
    message.isRead = true;
    await message.save();

    let messageData = { id: result[typeOfListing][i]._id.toString() };
    messageData.data = {
      text: message.text,
      subredditName: message.subredditName,
      senderUsername: message.senderUsername,
      receiverUsername: message.receiverUsername,
      sendAt: message.createdAt,
      subject: message.subject,
      isSenderUser: message.isSenderUser,
      isReceiverUser: message.isReceiverUser,
    };
    children.push(messageData);
  }

  let after = "",
    before = "";
  if (result[typeOfListing].length) {
    after =
      result[typeOfListing][result[typeOfListing].length - 1]._id.toString();
    before = result[typeOfListing][0]._id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      before: before,
      children: children,
    },
  };
}

export async function userMentionsListing(user, typeOfListing, listingParams) {
  // GETTING FIND LIMIT SORT THAT WE NEED TO RETURN VALUES
  const listingResult = await mentionListing(listingParams);
  // GETTING THE DESIRED FIELD THAT WE WOULD GET DATA FROM
  const result = await User.findOne({ username: user.username })
    .select(typeOfListing)
    .populate({
      path: typeOfListing,
      match: listingResult.find,
      limit: listingResult.limit,
      options: {
        sort: listingResult.sort,
      },
    });
  // CHILDREN THAT WE WILL CONTAIN THE DESIRED DATA
  let children = [];
  for (const i in result[typeOfListing]) {
    // lOOPING OVER EACH MENTION OF THAT THE USER HAD RECEIVED
    const mention = result[typeOfListing][i];
    // AS THIS MENTION IS RETURNED THEN IT SHOULD BE MARKED AS READ
    mention.isRead = true;
    await mention.save();
    const post = await searchForPost(mention.postId);
    const comment = await searchForComment(mention.commentId);
    // GETTING THE DATA THAT WE NEED TO RETURN TO THE USERS , FIRST WE WILL ADD THE ID OF EACH MENTION
    let mentionData = { id: result[typeOfListing][i]._id.toString() };
    // THEN WE WILL ADD DATA NEEDED TO THE MENTION
    mentionData.data = {
      text: comment.content,
      senderUsername: post.ownerUsername,
      receiverUsername: mention.receiverUsername,
      sendAt: comment.createdAt,
      subredditName: post.subredditName,
      postTitle: post.title,
      postId: mention.postId,
      commentId: mention.commentId,
      numOfComments: post.numberOfComments,
    };
    children.push(mentionData);
  }

  let after = "",
    before = "";
  if (result[typeOfListing].length) {
    after =
      result[typeOfListing][result[typeOfListing].length - 1]._id.toString();
    before = result[typeOfListing][0]._id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      before: before,
      children: children,
    },
  };
}

function compareMsgs(msg1, msg2) {
  if (msg1.sendAt < msg2.sendAt) {
    return 1;
  }
  if (msg1.sendAt > msg2.sendAt) {
    return -1;
  }
  return 0;
}

function compareMsgs2(msg1, msg2) {
  if (msg1.createdAt < msg2.createdAt) {
    return 1;
  }
  if (msg1.createdAt > msg2.createdAt) {
    return -1;
  }
  return 0;
}

export async function userConversationListing(
  user,
  typeOfListing,
  listingParams
) {
  // GETTING FIND LIMIT SORT THAT WE NEED TO RETURN VALUES
  const listingResult = await conversationListing(listingParams);
  // GETTING THE DESIRED FIELD THAT WE WOULD GET DATA FROM
  const result = await User.findOne({ username: user.username })
    .select(typeOfListing)
    .populate({
      path: typeOfListing,
      match: listingResult.query,
      limit: listingResult.limit,
      options: {
        sort: listingResult.sort,
      },
    });
  // CHILDREN THAT WE WILL CONTAIN THE DESIRED DATA
  let children = [];
  for (const i in result[typeOfListing]) {
    // lOOPING OVER EACH MENTION OF THAT THE USER HAD RECEIVED
    const conversation = result[typeOfListing][i];
    const messages = [];
    for (const smallMessage of conversation.messages) {
      const message = await Message.findById(smallMessage);
      const messageData = {
        msgID: message.id.toString(),
        text: message.text,
        subredditName: message.subredditName,
        senderUsername: message.senderUsername,
        receiverUsername: message.receiverUsername,
        sendAt: message.createdAt,
        subject: message.subject,
        isSenderUser: message.isSenderUser,
        isReceiverUser: message.isReceiverUser,
      };
      messages.push(messageData);
    }
    messages.sort(compareMsgs);
    // GETTING THE DATA THAT WE NEED TO RETURN TO THE USERS , FIRST WE WILL ADD THE ID OF EACH MENTION
    let ConversationData = { id: result[typeOfListing][i]._id.toString() };
    // THEN WE WILL ADD DATA NEEDED TO THE MENTION
    let subjectTitle, isUser;
    if (user.username === conversation.firstUsername) {
      subjectTitle = conversation.secondUsername;
      isUser = conversation.isSecondNameUser;
    } else if (user.username === conversation.secondUsername) {
      subjectTitle = conversation.firstUsername;
      isUser = conversation.isFirstNameUser;
    }
    ConversationData.data = {
      subjectTitle: subjectTitle,
      subjectContent: conversation.subject,
      isUser: isUser,
      messages: messages,
    };
    children.push(ConversationData);
  }
  let after = "",
    before = "";
  if (result[typeOfListing].length) {
    after =
      result[typeOfListing][result[typeOfListing].length - 1]._id.toString();
    before = result[typeOfListing][0]._id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      before: before,
      children: children,
    },
  };
}

export async function userInboxListing(user, listingParams) {
  //GETTING SENT MESSAGES
  const { sentMessages } = await User.findOne({ username: user.username })
    .select("sentMessages")
    .populate({
      path: "sentMessages",
    });
  //GETTING RECEIVED MESSAGES
  const { receivedMessages } = await User.findOne({ username: user.username })
    .select("receivedMessages")
    .populate({ path: "receivedMessages" });
  //GETTING USERNAME MENTIONS
  const { usernameMentions } = await User.findOne({ username: user.username })
    .select("usernameMentions")
    .populate({ path: "usernameMentions" });
  //GETTING POST REPLIES
  const { postReplies } = await User.findOne({ username: user.username })
    .select("postReplies")
    .populate({ path: "postReplies" });
  //MERGING ALL OF THEM TOGETHER
  let totalInbox = [
    ...sentMessages,
    ...receivedMessages,
    ...usernameMentions,
    ...postReplies,
  ];
  //SORTING ALL OF THE MESSAGES THAT WE HAD BASED ON SENT TIME
  totalInbox.sort(compareMsgs2);
  let isBefore = false;
  //FILTERING THE TOTAL INBOX ARRAY THAT WE MADE WITH BEFORE W AFTER LIMITS
  //IN CASE OF BEFORE WE NEED TO GET THE LIMIT ELEMENTS BEFORE THE SELECTED ITEM
  //THEN WE NEED TO CHANGE THE VALUES OF STARTING AND ENDING INDICES OF THE TOTAL INBOX ARRAY
  if (listingParams.before) {
    //HERE WE GET OUR SPLITTER
    const splitter = await splitterOnType(listingParams.before);
    isBefore = true;
    totalInbox = totalInbox.filter((msg) => {
      return msg.createdAt > splitter.createdAt;
    });
    //THIS IS THE CASE OF AFTER THEN WE WILL DEAL NORMALLY WITHOUT ANY CHANGES IN THE FOR LOOP BOUNDARIES
  } else if (listingParams.after && !listingParams.before) {
    const splitter = await splitterOnType(listingParams.after);
    totalInbox = totalInbox.filter(function (msg) {
      return msg.createdAt < splitter.createdAt;
    });
  }
  //THEN WE WILL GET OUR LIMIT
  let limit = await prepareLimit(listingParams.limit);
  //IF THE LIMIT IS GREATER THAN THE LENGTH OF THE TOTAL INBOX ARRAY THEN WE MUST MAKE IT THE SAME LENGTH
  if (limit > totalInbox.length) {
    limit = totalInbox.length;
  }
  //INITIALLY WE WILL START FROM 0 UNTIL THE LIMIT
  let startingIndex = 0,
    finishIndex = limit;
  //IN CASE OF BEFORE THEN WE WILL START FROM BEFORE INDEX-LIMIT TO THE BEFORE INDEX
  if (isBefore) {
    startingIndex = totalInbox.length - limit;
    finishIndex = totalInbox.length;
  }
  if (startingIndex < 0) {
    startingIndex = 0;
  }
  //OUR CHILDREN ARRAY THAT WE WILL SEND AS RESPONSE
  const children = [];
  for (startingIndex; startingIndex < finishIndex; startingIndex++) {
    //EACH ELEMENT THAT IS RETURNED MUST BE MARKED AS READ
    totalInbox[startingIndex].isRead = true;
    await totalInbox[startingIndex].save();
    //GETTING THE ID OF THE ELEMENT THAT WILL BE SENT
    const messageData = { id: totalInbox[startingIndex].id };
    //DEPENDING ON THE TYPE OF ELEMENT WE WILL SEND DIFFERENT DATA
    if (totalInbox[startingIndex].type === "Mention") {
      const post = await searchForPost(totalInbox[startingIndex].postId);
      const comment = await searchForComment(
        totalInbox[startingIndex].commentId
      );
      messageData.data = {
        text: comment.content,
        senderUsername: post.ownerUsername,
        receiverUsername: totalInbox[startingIndex].receiverUsername,
        sendAt: comment.createdAt,
        subredditName: post.subredditName,
        postTitle: post.title,
        postId: totalInbox[startingIndex].postId,
        commentId: totalInbox[startingIndex].commentId,
        numOfComments: post.numberOfComments,
        type: "Mentions",
      };
    } else if (totalInbox[startingIndex].type === "Message") {
      messageData.data = {
        text: totalInbox[startingIndex].text,
        subredditName: totalInbox[startingIndex].subredditName,
        senderUsername: totalInbox[startingIndex].senderUsername,
        receiverUsername: totalInbox[startingIndex].receiverUsername,
        sendAt: totalInbox[startingIndex].createdAt,
        subject: totalInbox[startingIndex].subject,
        isSenderUser: totalInbox[startingIndex].isSenderUser,
        isReceiverUser: totalInbox[startingIndex].isReceiverUser,
        type: "Messages",
      };
    }
    children.push(messageData);
  }

  let after = "",
    before = "";
  if (totalInbox.length) {
    if (isBefore) {
      after = totalInbox[totalInbox.length - 1]._id.toString();
      before = totalInbox[totalInbox.length - limit]._id.toString();
    } else {
      after = totalInbox[limit - 1]._id.toString();
      before = totalInbox[0]._id.toString();
    }
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      before: before,
      children: children,
    },
  };
}
