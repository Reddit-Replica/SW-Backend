import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import { prepareLimit } from "./prepareLimit.js";

/**
 * Function used to prepare the sorting object that will be used by mongoose to sort the results
 *
 * @param {String} listingSort Sorting type used to sort the wanted comments
 * @returns {Array} Array with two elements [sort, sortingType]
 */
function prepareCommentSort(listingSort) {
  let result = {},
    sortingType = {};

  if (!listingSort) {
    // best
    listingSort = "best";
    result = { numberOfVotes: -1 };
    sortingType = { type: "numberOfVotes" };
  } else {
    switch (listingSort) {
      case "new":
        result = { createdAt: -1 };
        sortingType = { type: "createdAt" };
        break;
      case "old":
        result = { createdAt: 1 };
        sortingType = { type: "createdAt" };
        break;
      case "top":
        result = null;
        break;
      default:
        result = { numberOfVotes: -1 };
        sortingType = { type: "numberOfVotes" };
        break;
    }
  }
  return [result, sortingType];
}

/**
 * Function used to prepare the anchor point of the slice that will be used by mongoose to match the results
 *
 * @param {String} before Id of the comment that we want to get the comments before it
 * @param {String} after Id of the comment that we want to get the comments after it
 * @param {String} sort Sorting type used to sort the wanted comments
 * @param {String} sortingType Sorting parameter in the comment model
 * @returns {Object} Object that will be used by mongoose to match the results
 */
// eslint-disable-next-line max-statements
async function prepareCommentBeforeAfter(before, after, sort, sortingType) {
  let result = {};
  if (!after && !before) {
    return null;
  } else if (!after && before) {
    if (mongoose.Types.ObjectId.isValid(before)) {
      // get the wanted value that we will split from
      const comment = await Comment.findById(before);
      if (!comment || comment.deletedAt) {
        return null;
      }

      if (sort) {
        let value = { $gt: comment[sortingType.type] };
        // eslint-disable-next-line max-depth
        if (sort.createdAt === 1) {
          value = { $lt: comment[sortingType.type] };
        }
        result = {
          type: sortingType.type,
          value: value,
        };
      } else {
        result = {
          type: "_id",
          value: { $lt: before },
        };
      }
    } else {
      return null;
    }
  } else if (after && !before) {
    if (mongoose.Types.ObjectId.isValid(after)) {
      // get the wanted value that we will split from
      const comment = await Comment.findById(after);
      if (!comment || comment.deletedAt) {
        return null;
      }

      if (sort) {
        let value = { $lt: comment[sortingType.type] };
        // eslint-disable-next-line max-depth
        if (sort.createdAt === 1) {
          value = { $gt: comment[sortingType.type] };
        }
        result = {
          type: sortingType.type,
          value: value,
        };
      } else {
        result = {
          type: "_id",
          value: { $gt: after },
        };
      }
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
 * Check the sort algorithm, limit of the result, and the anchor point of the slice
 * to get the previous or the next things
 *
 * @param {Object} listingParams Listing parameters sent in the request query [sort, before, after, limit]
 * @returns {Object} Result object containing the final results after listing [sort, time, listing, limit]
 */
export async function prepareListingCommentTree(listingParams) {
  let result = {},
    sortingType = {};

  //prepare the sorting
  const sortingResult = prepareCommentSort(listingParams.sort);
  result.sort = sortingResult[0];
  sortingType = sortingResult[1];

  // prepare the limit
  result.limit = prepareLimit(listingParams.limit);

  // check if after or before
  result.listing = await prepareCommentBeforeAfter(
    listingParams.before,
    listingParams.after,
    result.sort,
    sortingType
  );

  return result;
}

/**
 * Function to create the exact condition that will be used by mongoose directly to list comments.
 * Used to map every listing parameter to the exact query that mongoose will use later
 *
 * @param {Object} listingParams Listing parameters sent in the request query [sort, before, after, limit]
 * @returns {Object} The final results that will be used by mongoose to list comments
 */
export async function commentTreeListing(listingParams) {
  let result = {};
  listingParams = await prepareListingCommentTree(listingParams);

  if (listingParams.listing) {
    result.find = { deletedAt: null };
    result.find[listingParams.listing.type] = listingParams.listing.value;
  } else {
    result.find = { deletedAt: null };
  }

  result.sort = listingParams.sort;
  result.limit = listingParams.limit;

  return result;
}
