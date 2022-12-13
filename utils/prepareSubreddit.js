/* eslint-disable max-len */
/* eslint-disable max-statements */
import { prepareLimit } from "./prepareLimit.js";
import Subreddit from "../models/Community.js";
import Post from "../models/Post.js";
import { searchForSubredditById } from "../services/communityServices.js";
import { searchForPost } from "../services/PostActions.js";

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

export async function extraPostsListing(before, after, limit, type) {
  const result = {};
  let splitterParam;
  if (type === "hot") {
    result.sort = { hotScore: -1 };
    splitterParam = "hotScore";
  } else if (type === "best") {
    result.sort = { bestScore: -1 };
    splitterParam = "bestScore";
  } else if (type === "new") {
    result.sort = { createdAt: -1 };
    splitterParam = "createdAt";
  } else if (type === "top") {
    result.sort = { numberOfVotes: -1 };
    splitterParam = "numberOfVotes";
  } else if (type === "trending") {
    result.sort = { totalViews: -1 };
    splitterParam = "numberOfVotes";
  }
  result.query = {};
  result.limit = prepareLimit(limit);
  let splitterPost;
  if (before) {
    splitterPost = await searchForPost(before);
    result.query[splitterParam] = { $gt: splitterPost[splitterParam] };
  } else if (!before && after) {
    splitterPost = await searchForPost(after);
    result.query[splitterParam] = { $lt: splitterPost[splitterParam] };
  } else if (!before && !after) {
    splitterPost = await Post.find(result.query).limit(1).sort(result.sort);
    result.query[splitterParam] = { $lte: splitterPost[0][splitterParam] };
  }
  return result;
}
