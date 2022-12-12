/* eslint-disable max-len */
/* eslint-disable max-statements */
import { prepareLimit } from "./prepareLimit.js";
import Subreddit from "../models/Community.js";
import { searchForSubredditById } from "../services/communityServices.js";
/**
 * Function to create the exact condition that will be used by mongoose directly to list posts.
 * Used to map every listing parameter to the exact query that mongoose will use later
 *
 * @param {Object} listingParams Listing parameters sent in the request query [sort, time, before, after, limit]
 * @returns {Object} The final results that will be used by mongoose to list posts
 */
export async function subredditListing(category,before,after,limit,withCategory) {
  const result={};
  result.sort = { members: -1, title: 1 };
  result.query={};
  if (withCategory){
  result.query = { category: category };
  }
  result.limit=prepareLimit(limit);
  let splitterSubreddit;
  if (before) {
    splitterSubreddit = await searchForSubredditById(before);
    result.query.members = { $gt: splitterSubreddit.members };
  } else if (!before && after) {
    splitterSubreddit = await searchForSubredditById(after);
    result.query.members = { $lt: splitterSubreddit.members };
  } else if (!before && !after) {
    splitterSubreddit = await Subreddit.find(result.query).limit(1).sort(result.sort);
    result.query.members = { $lte: splitterSubreddit[0].members };
  }
  console.log(result.query);
  return result;

}
