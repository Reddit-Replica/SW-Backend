import mongoose from "mongoose";
import Subreddit from "../models/Community.js";

/**
 * Function to prepare the listing parameters for subreddits and set the appropriate condition that will be used with mongoose later.
 * Check the limit of the result, and the anchor point of the slice to get the previous or next things
 *
 * @param {Object} listingParams Listing parameters sent in the request query [before, after, limit]
 * @returns {Object} Result object containing the final results after listing [listing, limit]
 */
// eslint-disable-next-line max-statements
export async function prepareListingSubreddits(listingParams) {
  let result = {};

  // prepare the limit
  if (!listingParams.limit) {
    result.limit = 25;
  } else {
    listingParams.limit = parseInt(listingParams.limit);
    if (listingParams.limit > 100) {
      result.limit = 100;
    } else if (listingParams.limit <= 0) {
      result.limit = 1;
    } else {
      result.limit = listingParams.limit;
    }
  }

  // check if after or before
  if (!listingParams.after && !listingParams.before) {
    result.listing = null;
  } else if (!listingParams.after && listingParams.before) {
    if (mongoose.Types.ObjectId.isValid(listingParams.before)) {
      // get the wanted value that we will split from
      const subreddit = await Subreddit.findById(listingParams.before);
      if (!subreddit) {
        result.listing = null;
      } else {
        result.listing = {
          type: "_id",
          value: { $lt: listingParams.before },
        };
      }
    } else {
      result.listing = null;
    }
  } else if (listingParams.after && !listingParams.before) {
    if (mongoose.Types.ObjectId.isValid(listingParams.after)) {
      // get the wanted value that we will split from
      const subreddit = await Subreddit.findById(listingParams.after);
      if (!subreddit) {
        result.listing = null;
      } else {
        result.listing = {
          type: "_id",
          value: { $gt: listingParams.after },
        };
      }
    } else {
      result.listing = null;
    }
  } else {
    result.listing = null;
  }

  return result;
}

/**
 * Function to create the exact condition that will be used by mongoose directly to list subreddits.
 * Used to map every listing parameter to the exact query that mongoose will use later
 *
 * @param {Object} listingParams Listing parameters sent in the request query [before, after, limit]
 * @returns {Object} The final results that will be used by mongoose to list posts
 */
export async function subredditListing(listingParams) {
  let result = {};
  listingParams = await prepareListingSubreddits(listingParams);
  if (listingParams.listing) {
    result.find = { deletedAt: null };
    result.find[listingParams.listing.type] = listingParams.listing.value;
  } else {
    result.find = { deletedAt: null };
  }

  result.limit = listingParams.limit;

  return result;
}
