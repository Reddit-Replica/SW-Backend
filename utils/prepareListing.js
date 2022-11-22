import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "./../models/Post.js";
/**
 * Function to prepare the listing parameters and set the appropriate condition that will be used with mongoose later.
 * Check the sort algorithm, time interval for the results, limit of the result, and the anchor point of the slice
 * to get the previous or the next things
 *
 * @param {Object} listingParams Listing parameters sent in the request query [sort, time, before, after, limit]
 * @returns {Object} Result object containing the final results after listing [sort, time, listing, limit]
 */
// eslint-disable-next-line max-statements
export async function prepareListingPosts(listingParams) {
  let result = {};

  //prepare the sorting
  if (!listingParams.sort) {
    // new
    listingParams.sort = "new";
    result.sort = { createdAt: -1 };
    result.sortingType = { type: "createdAt" };
  } else {
    switch (listingParams.sort) {
      case "hot":
        // TODO
        result.sort = { score: -1 };
        result.sortingType = { type: "score" };
        break;
      case "top":
        result.sort = null;
        break;
      case "old":
        result.sort = { createdAt: 1 };
        result.sortingType = { type: "createdAt" };
        break;
      default:
        result.sort = { createdAt: -1 };
        result.sortingType = { type: "createdAt" };
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
      // get the wanted value that we will split from
      const post = await Post.findById(listingParams.before);
      if (!post) {
        result.listing = null;
      } else {
        if (result.sort) {
          result.listing = {
            type: result.sortingType.type,
            value: { $gt: post[result.sortingType.type] },
          };
        } else {
          result.listing = {
            type: "_id",
            value: { $lt: listingParams.before },
          };
        }
      }
    } else {
      result.listing = null;
    }
  } else if (listingParams.after && !listingParams.before) {
    if (mongoose.Types.ObjectId.isValid(listingParams.after)) {
      // get the wanted value that we will split from
      const post = await Post.findById(listingParams.after);
      if (!post) {
        result.listing = null;
      } else {
        if (result.sort) {
          result.listing = {
            type: result.sortingType.type,
            value: { $lt: post[result.sortingType.type] },
          };
        } else {
          result.listing = {
            type: "_id",
            value: { $gt: listingParams.after },
          };
        }
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
 * Function to prepare the listing parameters and set the appropriate condition that will be used with mongoose later.
 * Check the sort algorithm, time interval for the results, limit of the result, and the anchor point of the slice
 * to get the previous or the next things
 *
 * @param {Object} listingParams Listing parameters sent in the request query [sort, time, before, after, limit]
 * @returns {Object} Result object containing the final results after listing [sort, time, listing, limit]
 */
// eslint-disable-next-line max-statements
export async function prepareListingComments(listingParams) {
  let result = {};

  //prepare the sorting
  if (!listingParams.sort) {
    // new
    listingParams.sort = "new";
    result.sort = { createdAt: -1 };
    result.sortingType = { type: "createdAt" };
  } else {
    switch (listingParams.sort) {
      case "hot":
        // TODO
        result.sort = { score: -1 };
        result.sortingType = { type: "score" };
        break;
      case "top":
        result.sort = null;
        break;
      case "old":
        result.sort = { createdAt: 1 };
        result.sortingType = { type: "createdAt" };
        break;
      default:
        result.sort = { createdAt: -1 };
        result.sortingType = { type: "createdAt" };
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
      // get the wanted value that we will split from
      const comment = await Comment.findById(listingParams.before);
      if (!comment) {
        result.listing = null;
      } else {
        if (result.sort) {
          result.listing = {
            type: result.sortingType.type,
            value: { $gt: comment[result.sortingType.type] },
          };
        } else {
          result.listing = {
            type: "_id",
            value: { $lt: listingParams.before },
          };
        }
      }
    } else {
      result.listing = null;
    }
  } else if (listingParams.after && !listingParams.before) {
    if (mongoose.Types.ObjectId.isValid(listingParams.after)) {
      // get the wanted value that we will split from
      const comment = await Comment.findById(listingParams.after);
      if (!comment) {
        result.listing = null;
      } else {
        if (result.sort) {
          result.listing = {
            type: result.sortingType.type,
            value: { $lt: comment[result.sortingType.type] },
          };
        } else {
          result.listing = {
            type: "_id",
            value: { $gt: listingParams.after },
          };
        }
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
 * Function to prepare the listing parameters for users and set the appropriate condition that will be used with mongoose later.
 * Check the limit of the result, and the anchor point of the slice to get the previous or next things
 *
 * @param {Object} listingParams Listing parameters sent in the request query [before, after, limit]
 * @returns {Object} Result object containing the final results after listing [listing, limit]
 */
// eslint-disable-next-line max-statements
export async function prepareListingUsers(listingParams) {
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
      const user = await User.findById(listingParams.before);
      if (!user) {
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
      const user = await User.findById(listingParams.after);
      if (!user) {
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
 * Function to create the exact condition that will be used by mongoose directly to list posts.
 * Used to map every listing parameter to the exact query that mongoose will use later
 *
 * @param {Object} listingParams Result of prepareListingParameters function
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

/**
 * Function to create the exact condition that will be used by mongoose directly to list comments.
 * Used to map every listing parameter to the exact query that mongoose will use later
 *
 * @param {Object} listingParams Result of prepareListingParameters function
 * @returns {Object} The final results that will be used by mongoose to list posts
 */
export async function commentListing(listingParams) {
  let result = {};
  listingParams = await prepareListingComments(listingParams);

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

/**
 * Function to create the exact condition that will be used by mongoose directly to list users.
 * Used to map every listing parameter to the exact query that mongoose will use later
 *
 * @param {Object} listingParams Result of prepareListingParameters function
 * @returns {Object} The final results that will be used by mongoose to list posts
 */
export async function userListing(listingParams) {
  let result = {};
  listingParams = await prepareListingUsers(listingParams);
  if (listingParams.listing) {
    result.find = { deletedAt: null };
    result.find[listingParams.listing.type] = listingParams.listing.value;
  } else {
    result.find = { deletedAt: null };
  }

  result.limit = listingParams.limit;

  return result;
}
