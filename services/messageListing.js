/* eslint-disable max-len */
/* eslint-disable max-statements */
import User from "../models/User.js";
import {
  messageListing,
  mentionListing,
} from "../utils/prepareMessageListing.js";
import { searchForComment, searchForPost } from "./PostActions.js";

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
    if (isUnread) {
      if (message.isRead) {
        continue;
      }
    }
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
/*
export async function userConversationListing(user, typeOfListing, listingParams) {
  // GETTING FIND LIMIT SORT THAT WE NEED TO RETURN VALUES
  const listingResult = await conversationListing(listingParams);
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
    const conversation = result[typeOfListing][i];
    let messages=conversation.select("messages").populate({
      path: "messages",
      match: { deletedAt: null },
      limit: listingResult.limit,
      options: {
        sort: listingResult.sort,
    });

    // AS THIS MENTION IS RETURNED THEN IT SHOULD BE MARKED AS READ
    mention.isRead = true;
    await mention.save();
    const post = await searchForPost(mention.postId);
    const comment = await searchForComment(mention.commentId);
    // GETTING THE DATA THAT WE NEED TO RETURN TO THE USERS , FIRST WE WILL ADD THE ID OF EACH MENTION
    let mentionData = { id: result[typeOfListing][i]._id.toString() };
    // THEN WE WILL ADD DATA NEEDED TO THE MENTION
    mentionData.data = {
      text: comment.text,
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
*/
