import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Subreddit from "../models/Community.js";
import { postListing } from "../utils/preparePostListing.js";
import { commentListing } from "../utils/prepareCommentListing.js";
/**
 * Search for a post given a query in a subreddit
 *
 * @param {string} subreddit Subreddit name
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function searchForPosts(subreddit, query, listingParams) {
  // Prepare Listing Parameters
  const listingResult = await postListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["title"] = { $regex: regex };

  const checkSubreddit = await Subreddit.findOne({ title: subreddit });
  if (!checkSubreddit) {
    return {
      statusCode: 404,
      data: "Subreddit not found",
    };
  }
  console.log(listingResult.find);
  console.log(listingResult.sort);
  const result = await Subreddit.findOne({ title: subreddit })
    .select("subredditPosts")
    .populate({
      path: "subredditPosts",
      match: listingResult.find,
      limit: listingResult.limit,
      options: {
        sort: listingResult.sort,
      },
    });

  let children = [];

  for (const i in result["subredditPosts"]) {
    const post = result["subredditPosts"][i];

    let postData = { id: result["subredditPosts"][i]._id.toString() };
    postData.data = {
      id: post.id.toString(),
      kind: post.kind,
      subreddit: post.subredditName,
      link: post.link,
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
    after =
      result["subredditPosts"][
        result["subredditPosts"].length - 1
      ]._id.toString();
    before = result["subredditPosts"][0]._id.toString();
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
 * Search for a comment given a query in a subreddit
 *
 * @param {string} subreddit Subreddit name
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function searchForComments(subreddit, query, listingParams) {
  // Prepare Listing Parameters
  const listingResult = await commentListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["subredditName"] = subreddit;
  listingResult.find["content.ops"] = {
    $elemMatch: { insert: { $regex: regex } },
  };

  const checkSubreddit = await Subreddit.findOne({ title: subreddit });
  if (!checkSubreddit) {
    return {
      statusCode: 404,
      data: "Subreddit not found",
    };
  }
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
