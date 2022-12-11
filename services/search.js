import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Subreddit from "../models/Community.js";
import { postListing } from "../utils/preparePostListing.js";
import { commentListing } from "../utils/prepareCommentListing.js";
import { userListing } from "../utils/prepareUserListing.js";
import { subredditListing } from "../utils/prepareSubredditListing.js";

/**
 * Search for a post given a query in the whole of read-it
 *
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function searchPosts(query, listingParams) {
  // Prepare Listing Parameters
  const listingResult = await postListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["title"] = { $regex: regex };

  const result = await Post.find(listingResult.find)
    .limit(listingResult.limit)
    .sort(listingResult.sort);

  let children = [];

  for (const i in result) {
    const post = result[i];

    let postData = { id: result[i]._id.toString() };
    postData.data = {
      id: post.id.toString(),
      kind: post.kind,
      subreddit: post.subredditName,
      link: post.link,
      images: post.images,
      video: post.video,
      content: post.content,
      nsfw: post.nsfw,
      spoiler: post.spoiler,
      title: post.title,
      sharePostId: post.sharePostId,
      flair: {
        id: post.flair?._id,
        flairName: post.flair?.flairName,
        order: post.flair?.order,
        backgroundColor: post.flair?.backgroundColor,
        textColor: post.flair?.textColor,
      },
      comments: post.numberOfComments,
      votes: post.numberOfVotes,
      postedAt: post.createdAt,
      postedBy: post.ownerUsername,
    };

    children.push(postData);
  }

  let after = "",
    before = "";
  if (result.length) {
    after = result[result.length - 1]._id.toString();
    before = result[0]._id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      before: before,
      children: children,
    },
  };
}

/**
 * Search for a comment given a query in the whole of read-it
 *
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function searchComments(query, listingParams) {
  // Prepare Listing Parameters
  const listingResult = await commentListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["content.ops"] = {
    $elemMatch: { insert: { $regex: regex } },
  };
  console.log(listingResult.find);

  const result = await Comment.find(listingResult.find)
    .limit(listingResult.limit)
    .sort(listingResult.sort)
    .populate("postId");

  let children = [];

  for (const i in result) {
    const comment = result[i];
    let commentData = { id: result[i]._id.toString() };
    commentData.data = {
      post: {
        id: comment.postId.id.toString(),
        kind: comment.postId.kind,
        subreddit: comment.postId.subredditName,
        nsfw: comment.postId.nsfw,
        spoiler: comment.postId.spoiler,
        title: comment.postId.title,
        comments: comment.postId.numberOfComments,
        votes: comment.postId.numberOfVotes,
        postedAt: comment.postId.createdAt,
        postedBy: comment.postId.ownerUsername,
      },
      comment: {
        id: comment.id.toString(),
        content: comment.content,
        parentId: comment.parentId.toString(),
        level: comment.level,
        username: comment.ownerUsername,
        createdAt: comment.createdAt,
        votes: comment.numberOfVotes,
      },
    };

    children.push(commentData);
  }

  let after = "",
    before = "";
  if (result.length) {
    after = result[result.length - 1]._id.toString();
    before = result[0]._id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      before: before,
      children: children,
    },
  };
}

/**
 * Search for a user given a query in the whole of read-it
 *
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @returns {void}
 */
export async function searchUsers(query, listingParams) {
  // Prepare Listing Parameters
  const listingResult = await userListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["$or"] = [
    { username: { $regex: regex } },
    { displayName: { $regex: regex } },
  ];

  const result = await User.find(listingResult.find)
    .limit(listingResult.limit)
    .sort(listingResult.sort);

  let children = [];

  for (const i in result) {
    const user = result[i];

    let userData = { id: result[i]._id.toString() };
    userData.data = {
      id: user.id.toString(),
      karma: user.karma,
      username: user.username,
      avatar: user.avatar,
    };

    children.push(userData);
  }

  let after = "",
    before = "";
  if (result.length) {
    after = result[result.length - 1]._id.toString();
    before = result[0]._id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      before: before,
      children: children,
    },
  };
}

/**
 * Search for a subreddit given a query in the whole of read-it
 *
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function searchSubreddits(query, listingParams) {
  // Prepare Listing Parameters
  const listingResult = await subredditListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["$or"] = [
    { title: { $regex: regex } },
    { viewName: { $regex: regex } },
  ];
  listingResult.find["type"] = {
    $not: { $regex: "(?i)\\bprivate\\b" },
  };

  const result = await Subreddit.find(listingResult.find)
    .limit(listingResult.limit)
    .sort(listingResult.sort);

  let children = [];

  for (const i in result) {
    const subreddit = result[i];

    let subredditData = { id: result[i]._id.toString() };
    subredditData.data = {
      id: subreddit.id.toString(),
      subredditName: subreddit.title,
      numberOfMembers: subreddit.members,
      description: subreddit.description,
    };

    children.push(subredditData);
  }

  let after = "",
    before = "";
  if (result.length) {
    after = result[result.length - 1]._id.toString();
    before = result[0]._id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      before: before,
      children: children,
    },
  };
}
