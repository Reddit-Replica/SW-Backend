/* eslint-disable max-statements */
import mongoose from "mongoose";
import Mention from "../models/Mention.js";
import Message from "../models/Message.js";
import { prepareLimit } from "./prepareLimit.js";

/**
 * Function used to prepare the anchor point of the slice that will be used by mongoose to match the results
 *
 * @param {String} before Id of the post that we want to get the messages before it
 * @param {String} after Id of the post that we want to get the messages after it
 * @returns {Object} Object that will be used by mongoose to match the results
 */
// eslint-disable-next-line max-statements
async function prepareMessageBeforeAfter(before, after) {
  let result = null;
  if (!after && !before) {
    return null;
  } else if (!after && before) {
    if (mongoose.Types.ObjectId.isValid(before)) {
      // get the wanted value that we will split from
      const message = await Message.findById(before);
      if (!message || message.deletedAt) {
        return null;
      }
      result = {
        type: "createdAt",
        value: { $gt: message["createdAt"] },
      };
    }
  } else if (after && !before) {
    if (mongoose.Types.ObjectId.isValid(after)) {
      // get the wanted value that we will split from
      const message = await Message.findById(after);
      if (!message || message.deletedAt) {
        return null;
      }
      result = {
        type: "createdAt",
        value: { $lt: message["createdAt"] },
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
  return result;
}

/**
 * Function used to prepare the anchor point of the slice that will be used by mongoose to match the results
 *
 * @param {String} before Id of the post that we want to get the messages before it
 * @param {String} after Id of the post that we want to get the messages after it
 * @returns {Object} Object that will be used by mongoose to match the results
 */
// eslint-disable-next-line max-statements
async function prepareMentionBeforeAfter(before, after) {
  let result = null;
  if (!after && !before) {
    return null;
  } else if (!after && before) {
    if (mongoose.Types.ObjectId.isValid(before)) {
      // get the wanted value that we will split from
      const mention = await Mention.findById(before);
      if (!mention || mention.deletedAt) {
        return null;
      }
      result = {
        type: "createdAt",
        value: { $gt: mention["createdAt"] },
      };
    }
  } else if (after && !before) {
    if (mongoose.Types.ObjectId.isValid(after)) {
      // get the wanted value that we will split from
      const mention = await Mention.findById(after);
      if (!mention || mention.deletedAt) {
        return null;
      }
      result = {
        type: "createdAt",
        value: { $lt: mention["createdAt"] },
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
  return result;
}

async function prepareConversationsBeforeAfter(before, after) {
  let result = null;
  if (!after && !before) {
    return null;
  } else if (!after && before) {
    if (mongoose.Types.ObjectId.isValid(before)) {
      // get the wanted value that we will split from
      const conversation = await Conversation.findById(before);
      if (!conversation) {
        return null;
      }
      result = {
        type: "latestDate",
        value: { $gt: conversation["latestDate"] },
      };
    }
  } else if (after && !before) {
    if (mongoose.Types.ObjectId.isValid(after)) {
      // get the wanted value that we will split from
      const conversation = await Conversation.findById(after);
      if (!conversation) {
        return null;
      }
      result = {
        type: "latestDate",
        value: { $lt: conversation["latestDate"] },
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
  return result;
}
/**
 * Function to prepare the listing parameters and set the appropriate condition that will be used with mongoose later.
 * Check the sort algorithm, time interval for the results, limit of the result, and the anchor point of the slice
 * to get the previous or the next things
 *
 * @param {Object} listingParams Listing parameters sent in the request query [before, after, limit]
 * @returns {Object} Result object containing the final results after listing [listing, limit]
 */
export async function prepareListingMsgs(listingParams) {
  const result = {};
  result.sort = { createdAt: -1, text: 1 };

  // prepare the limit
  result.limit = prepareLimit(listingParams.limit);
  // check if after or before
  result.listing = await prepareMessageBeforeAfter(
    listingParams.before,
    listingParams.after
  );
  return result;
}

/**
 * Function to prepare the listing parameters and set the appropriate condition that will be used with mongoose later.
 * Check the sort algorithm, time interval for the results, limit of the result, and the anchor point of the slice
 * to get the previous or the next things
 *
 * @param {Object} listingParams Listing parameters sent in the request query [before, after, limit]
 * @returns {Object} Result object containing the final results after listing [listing, limit]
 */
export async function prepareListingMentions(listingParams) {
  const result = {};
  result.sort = { createdAt: -1, text: 1 };

  // prepare the limit
  result.limit = prepareLimit(listingParams.limit);
  // check if after or before
  result.listing = await prepareMentionBeforeAfter(
    listingParams.before,
    listingParams.after
  );
  return result;
}

export async function prepareListingConversation(listingParams) {
  const result = {};
  result.sort = { createdAt: -1, text: 1 };

  // prepare the limit
  result.limit = prepareLimit(listingParams.limit);
  // check if after or before
  result.listing = await prepareConversationsBeforeAfter(
    listingParams.before,
    listingParams.after
  );
  return result;
}

/**
 * Function to create the exact condition that will be used by mongoose directly to list posts.
 * Used to map every listing parameter to the exact query that mongoose will use later
 *
 * @param {Object} listingParams Listing parameters sent in the request query [sort, time, before, after, limit]
 * @returns {Object} The final results that will be used by mongoose to list posts
 */
export async function messageListing(listingParams) {
  let result = {};
  listingParams = await prepareListingMsgs(listingParams);
  result = setResult(listingParams);
  return result;
}

/**
 * Function to create the exact condition that will be used by mongoose directly to list posts.
 * Used to map every listing parameter to the exact query that mongoose will use later
 *
 * @param {Object} listingParams Listing parameters sent in the request query [sort, time, before, after, limit]
 * @returns {Object} The final results that will be used by mongoose to list posts
 */
export async function mentionListing(listingParams) {
  let result = {};
  listingParams = await prepareListingMentions(listingParams);
  result = setResult(listingParams);
  return result;
}

/**
 * Function to create the exact condition that will be used by mongoose directly to list posts.
 * Used to map every listing parameter to the exact query that mongoose will use later
 *
 * @param {Object} listingParams Listing parameters sent in the request query [sort, time, before, after, limit]
 * @returns {Object} The final results that will be used by mongoose to list posts
 */
export async function conversationListing(listingParams) {
  let result = {};
  listingParams = await prepareListingConversation(listingParams);
  result = setResult(listingParams);
  return result;
}

function setResult(listingParams) {
  const result = {};
  result.find = { deletedAt: null };
  if (listingParams.listing === null) {
    let error = new Error("Invalid Before or After Id");
    error.statusCode = 401;
    throw error;
  }
  result.find[listingParams.listing.type] = listingParams.listing.value;
  result.limit = listingParams.limit;
  result.sort = listingParams.sort;
  return result;
}
