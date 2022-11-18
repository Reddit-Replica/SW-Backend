import mongoose from "mongoose";
/**
 * Function to prepare the listing parameters and set the appropriate condition that will be used with mongoose later.
 * Check the sort algorithm, time interval for the results, limit of the result, and the anchor point of the slice
 * to get the previous or the next things
 *
 * @param {Object} listingParams Listing parameters sent in the request query [sort, time, before, after, limit]
 * @returns {Object} Result object containing the final results after listing [sort, time, listing, limit]
 */
// eslint-disable-next-line max-statements
export function prepareListingParameters(listingParams) {
  let result = {};

  //prepare the sorting
  if (!listingParams.sort) {
    // new
    listingParams.sort = "new";
    result.sort = { createdAt: -1 };
  } else {
    switch (listingParams.sort) {
      case "hot":
        // TODO
        result.sort = { createdAt: -1 };
        break;
      case "top":
        result.sort = null;
        break;
      default:
        result.sort = { createdAt: -1 };
        break;
    }
  }

  //prepare the time
  if (!listingParams.time) {
    result.time = null;
  } else {
    if (listingParams.sort === "top") {
      const year = new Date().setFullYear(new Date().getFullYear() - 1);
      const month = new Date().setMonth(new Date().getMonth() - 1);
      const day = new Date().setDate(new Date().getDate() - 1);
      const week = new Date().setDate(new Date().getDate() - 7);
      const hour = new Date().setHours(new Date().getHours() - 1);
      switch (listingParams.time) {
        case "hour":
          result.time = { $gt: hour };
          break;
        case "day":
          result.time = { $gt: day };
          break;
        case "week":
          result.time = { $gt: week };
          break;
        case "month":
          result.time = { $gt: month };
          break;
        case "year":
          result.time = { $gt: year };
          break;
        default:
          result.time = null;
          break;
      }
    }
  }

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
      result.listing = { $lt: listingParams.before };
    } else {
      result.listing = null;
    }
  } else if (listingParams.after && !listingParams.before) {
    if (mongoose.Types.ObjectId.isValid(listingParams.after)) {
      result.listing = { $gt: listingParams.after };
    } else {
      result.listing = null;
    }
  } else {
    result.listing = null;
  }

  return result;
}

/**
 * Function to create the exact condition that will be used by mongoose directly to list posts
 *
 * @param {Object} listingParams Result of prepareListingParameters function
 * @returns {Object} The final results that will be used by mongoose to list posts
 */
export function preparePostListing(listingParams) {
  let result = {};

  if (listingParams.time && listingParams.listing) {
    result.find = {
      createdAt: listingParams.time,
      _id: listingParams.listing,
      deletedAt: null,
    };
  } else if (listingParams.time) {
    result.find = { createdAt: listingParams.time, deletedAt: null };
  } else if (listingParams.listing) {
    result.find = { _id: listingParams.listing, deletedAt: null };
  }

  result.sort = listingParams.sort;
  result.limit = listingParams.limit;

  return result;
}
