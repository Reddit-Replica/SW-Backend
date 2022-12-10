import mongoose from "mongoose";
import Post from "../models/Post.js";
import { prepareLimit } from "./prepareLimit.js";

/**W
 * Function used to prepare the sorting object that will be used by mongoose to sort the results
 *
 * @param {String} listingSort Sorting type used to sort the wanted posts
 * @returns {Array} Array with two elements [sort, sortingType]
 */
function preparePostSort(listingSort) {
  let result = null,
    sortingType = null;

  if (!listingSort) {
    // new
    listingSort = "new";
    result = { createdAt: -1 };
    sortingType = { type: "createdAt" };
  } else {
    switch (listingSort) {
      case "hot":
        // TODO
        result = { score: -1 };
        sortingType = { type: "score" };
        break;
      case "top":
        result = null;
        break;
      case "old":
        result = { createdAt: 1 };
        sortingType = { type: "createdAt" };
        break;
      default:
        result = { createdAt: -1 };
        sortingType = { type: "createdAt" };
        break;
    }
  }
  return [result, sortingType];
}

/**
 * Function used to prepare the time interval that will be used by mongoose to match the results
 *
 * @param {String} listingTime Time interval that we want to get the post in
 * @param {String} sort Sorting type
 * @returns {Object} Object that will be used by mongoose to match the results
 */
function preparePostTime(listingTime, sort) {
  let result = null;
  if (!listingTime) {
    return null;
  } else {
    if (sort === "top") {
      const year = new Date().setFullYear(new Date().getFullYear() - 1);
      const month = new Date().setMonth(new Date().getMonth() - 1);
      const day = new Date().setDate(new Date().getDate() - 1);
      const week = new Date().setDate(new Date().getDate() - 7);
      const hour = new Date().setHours(new Date().getHours() - 1);
      switch (listingTime) {
        case "hour":
          result = { $gt: hour };
          break;
        case "day":
          result = { $gt: day };
          break;
        case "week":
          result = { $gt: week };
          break;
        case "month":
          result = { $gt: month };
          break;
        case "year":
          result = { $gt: year };
          break;
        default:
          result = null;
          break;
      }
    }
  }
  return result;
}

/**
 * Function used to prepare the anchor point of the slice that will be used by mongoose to match the results
 *
 * @param {String} before Id of the post that we want to get the posts before it
 * @param {String} after Id of the post that we want to get the posts after it
 * @param {String} sort Sorting type used to sort the wanted posts
 * @param {String} sortingType Sorting parameter in the post model
 * @returns {Object} Object that will be used by mongoose to match the results
 */
// eslint-disable-next-line max-statements
async function preparePostBeforeAfter(before, after, sort, sortingType) {
  let result = null;
  if (!after && !before) {
    return null;
  } else if (!after && before) {
    if (mongoose.Types.ObjectId.isValid(before)) {
      // get the wanted value that we will split from
      const post = await Post.findById(before);
      if (!post || post.deletedAt) {
        return null;
      }

      if (sort) {
        let value = { $gt: post[sortingType.type] };
        // eslint-disable-next-line max-depth
        if (sort.createdAt === 1) {
          value = { $lt: post[sortingType.type] };
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
      const post = await Post.findById(after);
      if (!post || post.deletedAt) {
        return null;
      }

      if (sort) {
        let value = { $lt: post[sortingType.type] };
        // eslint-disable-next-line max-depth
        if (sort.createdAt === 1) {
          value = { $gt: post[sortingType.type] };
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
 * Check the sort algorithm, time interval for the results, limit of the result, and the anchor point of the slice
 * to get the previous or the next things
 *
 * @param {Object} listingParams Listing parameters sent in the request query [sort, time, before, after, limit]
 * @returns {Object} Result object containing the final results after listing [sort, time, listing, limit]
 */
export async function prepareListingPosts(listingParams) {
  let result = {},
    sortingType = {};

  //prepare the sorting
  const sortingResult = preparePostSort(listingParams.sort);
  result.sort = sortingResult[0];
  sortingType = sortingResult[1];

  //prepare the time
  result.time = preparePostTime(listingParams.time, listingParams.sort);

  // prepare the limit
  result.limit = prepareLimit(listingParams.limit);

  // check if after or before
  result.listing = await preparePostBeforeAfter(
    listingParams.before,
    listingParams.after,
    result.sort,
    sortingType
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
export async function postListing(listingParams) {
  let result = {};
  listingParams = await prepareListingPosts(listingParams);

  if (listingParams.time && listingParams.listing) {
    result.find = {
      createdAt: listingParams.time,
      deletedAt: null,
    };
    result.find[listingParams.listing.type] = listingParams.listing.value;
  } else if (listingParams.time) {
    result.find = { createdAt: listingParams.time, deletedAt: null };
  } else if (listingParams.listing) {
    result.find = { deletedAt: null };
    result.find[listingParams.listing.type] = listingParams.listing.value;
  } else {
    result.find = { deletedAt: null };
  }

  result.sort = listingParams.sort;
  result.limit = listingParams.limit;

  return result;
}
