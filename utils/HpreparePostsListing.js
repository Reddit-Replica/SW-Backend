import mongoose from "mongoose";
import Post from "../models/Post.js";
import { prepareLimit } from "./prepareLimit.js";
import { preparePostTime } from "./preparePostListing.js";

/**
 * Function used to prepare the sorting object that will be used by mongoose to sort the results
 *
 * @param {String} sort Sorting type used to sort the wanted posts
 * @returns {object} Object containing the sort
 */
function prepareSort(sort) {
  let result = null;
  if (!sort) {
    sort = "new";
  }
  switch (sort) {
    case "hot":
      result = { hotScore: -1 };
      break;
    case "best":
      result = { bestScore: -1 };
      break;
    case "top":
      result = { numberOfVotes: -1 };
      break;
    case "old":
      result = { createdAt: 1 };
      break;
    case "trending":
      result = { numberOfViews: -1 };
      break;
    default:
      result = { createdAt: -1 };
      break;
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
export function hpostListing(listingParams) {
  let result = {};

  result.sort = prepareSort(listingParams.sort);

  result.limit = prepareLimit(listingParams.limit);

  result.find = { deletedAt: null };

  const time = preparePostTime(listingParams.time, listingParams.sort);

  if (time) {
    result.find["createdAt"] = time;
  }

  return result;
}
