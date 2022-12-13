/* eslint-disable max-len */
/* eslint-disable max-statements */
import { prepareLimit } from "./prepareLimit.js";
import Subreddit from "../models/Community.js";
import { searchForSubredditById } from "../services/communityServices.js";

export async function subredditListing(
  category,
  before,
  after,
  limit,
  withCategory
) {
  const result = {};
  result.sort = { members: -1, title: 1 };
  result.query = {};
  if (withCategory) {
    result.query = { category: category };
  }
  result.limit = prepareLimit(limit);
  let splitterSubreddit;
  if (before) {
    splitterSubreddit = await searchForSubredditById(before);
    result.query.members = { $gt: splitterSubreddit.members };
  } else if (!before && after) {
    splitterSubreddit = await searchForSubredditById(after);
    result.query.members = { $lt: splitterSubreddit.members };
  } else if (!before && !after) {
    splitterSubreddit = await Subreddit.find(result.query)
      .limit(1)
      .sort(result.sort);
    result.query.members = { $lte: splitterSubreddit[0].members };
  }
  return result;
}
