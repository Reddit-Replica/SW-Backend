import Comment from "../models/Comment.js";
import Subreddit from "../models/Community.js";
import { postListing } from "../utils/preparePostListing.js";
import { commentTreeListing } from "../utils/prepareCommentListing.js";
import { filterHiddenPosts } from "./search.js";

/**
 * Search for a post in a subreddit given a query in the whole of read-it. It ensures that hidden,
 * removed, spammed, and nsfw (in case settings are set to not view nsfw content) posts are not shown to the user. The search is checked on the post title only.
 * @param {string} subreddit Subreddit name
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @param {object} user User object in case there's a logged in user
 * @returns {object} Result containing statusCode and data
 */
// eslint-disable-next-line max-statements
export async function searchForPosts(subreddit, query, listingParams, user) {
  // Prepare Listing Parameters
  let listingResult = await postListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["title"] = { $regex: regex };
  listingResult.find["moderation.remove.removedBy"] = undefined;
  listingResult.find["moderation.spam.spammedBy"] = undefined;
  user && (listingResult.find["nsfw"] = user.userSettings.nsfw);

  const checkSubreddit = await Subreddit.findOne({ title: subreddit });
  if (!checkSubreddit) {
    return {
      statusCode: 404,
      data: "Subreddit not found",
    };
  }

  let result = await Subreddit.findOne({ title: subreddit })
    .select("subredditPosts")
    .populate({
      path: "subredditPosts",
      match: listingResult.find,
      options: {
        sort: listingResult.sort,
      },
    });

  if (user) {
    result["subredditPosts"] = filterHiddenPosts(
      result["subredditPosts"],
      user
    );
  }

  let limit = listingResult.limit;

  if (
    (!listingParams.after && listingParams.before) ||
    (!listingParams.before && listingParams.after)
  ) {
    const id = listingParams.after ?? listingParams.before;
    const neededIndex = result["subredditPosts"].findIndex(
      (post) => post._id.toString() === id
    );
    if (neededIndex !== -1) {
      if (listingParams.after) {
        result["subredditPosts"] = result["subredditPosts"].slice(
          neededIndex + 1,
          result["subredditPosts"].length
        );
      } else {
        result["subredditPosts"] = result["subredditPosts"].slice(
          0,
          neededIndex
        );
      }
    }
  }

  if (limit > result["subredditPosts"].length) {
    limit = result["subredditPosts"].length;
  }

  let start = 0,
    finish = limit;

  if (listingParams.before && !listingParams.after) {
    start = result["subredditPosts"].length - limit;
    finish = result["subredditPosts"].length;
  }
  let i = start;

  let children = [];

  for (i; i < finish; i++) {
    const post = result["subredditPosts"][i];

    let postData = { id: result["subredditPosts"][i]._id.toString() };
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
  if (result["subredditPosts"].length) {
    after = result["subredditPosts"][finish - 1]._id.toString();
    before = result["subredditPosts"][start]._id.toString();
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
 * Search for a comment in a subreddit given a query in the whole of read-it. It ensures that removed
 * spammed, and nsfw (in case settings are set to not view nsfw content) comments are not shown to the user.
 * The search is checked on comment content only.
 * @param {string} subreddit Subreddit name
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @param {object} user Logged In user
 * @returns {object} Result containing statusCode and data
 */
// eslint-disable-next-line max-statements
export async function searchForComments(subreddit, query, listingParams, user) {
  // Prepare Listing Parameters
  const listingResult = await commentTreeListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["subredditName"] = subreddit;
  listingResult.find["$or"] = [
    {
      "content.ops": {
        $elemMatch: { insert: { $regex: regex } },
      },
    },
    {
      content: {
        $elemMatch: { insert: { $regex: regex } },
      },
    },
  ];
  listingResult.find["moderation.remove.removedBy"] = undefined;
  listingResult.find["moderation.spam.spammedBy"] = undefined;
  user && (listingResult.find["nsfw"] = user.userSettings.nsfw);

  const checkSubreddit = await Subreddit.findOne({ title: subreddit });
  if (!checkSubreddit) {
    return {
      statusCode: 404,
      data: "Subreddit not found",
    };
  }

  const result = await Comment.find(listingResult.find)
    .sort(listingResult.sort)
    .populate("postId");

  let limit = listingResult.limit;

  if (limit > result.length) {
    limit = result.length;
  }

  let start = 0,
    finish = limit;

  if (listingParams.before && !listingParams.after) {
    start = result.length - limit;
    finish = result.length;
  }
  let i = start;

  let children = [];

  for (i; i < finish; i++) {
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
        commentBody: comment.content,
        parent: comment.parentId.toString(),
        level: comment.level,
        commentedBy: comment.ownerUsername,
        publishTime: comment.createdAt,
        votes: comment.numberOfVotes,
      },
    };

    children.push(commentData);
  }

  let after = "",
    before = "";
  if (result.length) {
    after = result[finish - 1]._id.toString();
    before = result[start]._id.toString();
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
