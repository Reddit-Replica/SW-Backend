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
 * Function used to prepare the sorting object that will be used by mongoose to sort the results
 *
 * @param {String} sort Sorting type used to sort the wanted posts
 * @returns {object} Object containing the sort
 */
function prepareListing(after, before, limit) {
  let skip = 0;
  if (after !== undefined && before !== undefined) {
    before = undefined;
  }
  if (after !== undefined) {
    after = parseInt(after);
    after = after < 0 ? 0 : after;
    skip = after;
  } else if (before !== undefined) {
    before = parseInt(before);
    before = before < 0 ? 0 : before;
    skip = before - limit;
    if (before - limit < 0) {
      skip = 0;
      limit = before;
      if (limit === 0) {
        limit = 1;
      }
    }
  }

  return [after, before, skip, limit];
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

  const listing = prepareListing(
    listingParams.after,
    listingParams.before,
    result.limit
  );
  result.after = listing[0];
  result.before = listing[1];
  result.skip = listing[2];
  result.limit = listing[3];

  return result;
}
