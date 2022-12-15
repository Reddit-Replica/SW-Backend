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

export async function extraPostsListing(before, after, limit, type,time) {
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
    console.log(splitterPost);
    if (splitterPost.length===0){
      let error= new Error("No Posts found");
      error.statusCode=404;
      throw error;
    }
    result.query[splitterParam] = { $lte: splitterPost[0][splitterParam] };
  }
  if (type==="top"){
    let filteringDate=new Date();
    let changed=false;
    if (time==="year"){
      filteringDate.setFullYear(filteringDate.getFullYear()-1);
      changed=true;
    } else if (time==="month"){
      filteringDate.setFullYear(filteringDate.getFullYear(),filteringDate.getMonth()-1);
      changed=true;
    } else if (time==="week"){
      filteringDate.setFullYear(filteringDate.getFullYear(),filteringDate.getMonth(),filteringDate.getDate()-7);
      changed=true;
    }  else if (time==="day"){
      filteringDate.setFullYear(filteringDate.getFullYear(),filteringDate.getMonth(),filteringDate.getDate()-1);
      changed=true;
    } else if (time==="hour"){
      filteringDate.setHours(filteringDate.getHours()-1);
      changed=true;
    }
    if (changed){
    result.query["createdAt"]={ $gte:filteringDate };
  }
}
  return result;
}
