/* eslint-disable max-len */
/* eslint-disable max-statements */
import User from "../models/User.js";
import {
  messageListing,
  mentionListing,
  conversationListing,
} from "../utils/prepareMessageListing.js";
import { searchForComment, searchForPost } from "./PostActions.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

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

function compareMsgs(msg1,msg2) {
  if ( msg1.sendAt < msg2.sendAt ){
    return 1;
  }
  if ( msg1.sendAt > msg2.sendAt ){
    return -1;
  }
  return 0;
}
function compareConv(conv1,conv2) {
  if ( conv1.latestDate < conv2.latestDate ){
    return 1;
  }
  if ( conv1.latestDate > conv2.latestDate ){
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
  const listingResult = await conversationListing(listingParams, user);
  console.log(listingResult);
  // GETTING THE DESIRED FIELD THAT WE WOULD GET DATA FROM
  const result = await User.findOne({ username: user.username }).select(typeOfListing).populate({
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
    const messages=[];
    for (const smallMessage of conversation.messages) {
      const message=await Message.findById(smallMessage);
      const messageData = {
        msgID:message.id.toString(),
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
    let subjectTitle,isUser;
    if (user.username===conversation.firstUsername){
    subjectTitle=conversation.secondUsername;
    isUser=conversation.isSecondNameUser;
    } else if (user.username===conversation.secondUsername){
    subjectTitle=conversation.firstUsername;
    isUser=conversation.isFirstNameUser;
    }
    ConversationData.data = {
      subjectTitle:subjectTitle,
      subjectContent:conversation.subject,
      isUser:isUser,
      messages:messages,
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
