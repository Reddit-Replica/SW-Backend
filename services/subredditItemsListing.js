import Subreddit from "../models/Community.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Flair from "../models/Flair.js";
import { commentTreeListing } from "../utils/prepareCommentListing.js";
import { postListing } from "../utils/preparePostListing.js";
import { hpostListing } from "../utils/HpreparePostsListing.js";
import mongoose from "mongoose";
import { filterHiddenPosts } from "./search.js";

/**
 * This function returns the subreddit's typeOfListing posts with a given
 * sort and according to a certain limit with either after or before in the
 * listing params. It returns post data with additional flags for frontend.
 *
 * @param {string} modId User ID
 * @param {string} subredditName Subreddit Name
 * @param {string} typeOfListing Type of posts to be listed
 * @param {object} listingParams Listing parameters (After/before/sort/limit)
 * @returns {object} Result containing statusCode and data
 */
// eslint-disable-next-line max-statements
export async function listingSubredditPosts(
  modId,
  subredditName,
  typeOfListing,
  listingParams
) {
  // Prepare Listing Parameters
  const listingResult = await postListing(listingParams);

  const subreddit = await Subreddit.findOne({ title: subredditName });
  if (!subreddit || subreddit.deletedAt) {
    return {
      statusCode: 404,
      data: "Subreddit not found or deleted",
    };
  }

  const result = await Subreddit.findOne({ title: subredditName })
    .select(typeOfListing)
    .populate({
      path: typeOfListing,
      match: listingResult.find,
      options: {
        sort: listingResult.sort,
      },
    });

  const mod = await User.findById(modId);
  if (!mod || mod.deletedAt) {
    return {
      statusCode: 404,
      data: "User not found or deleted",
    };
  }

  let limit = listingResult.limit;

  if (limit > result[typeOfListing].length) {
    limit = result[typeOfListing].length;
  }

  let start = 0,
    finish = limit;

  if (listingParams.before && !listingParams.after) {
    start = result[typeOfListing].length - limit;
    finish = result[typeOfListing].length;
    if (start < 0) {
      start = 0;
    }
  }
  let i = start;
  let children = [];

  for (i; i < finish; i++) {
    const post = result[typeOfListing][i];
    let saved = false,
      vote;
    if (
      mod.upvotedPosts.find(
        (postId) => post.id.toString() === postId.toString()
      )
    ) {
      vote = 1;
    } else if (
      mod.downvotedPosts.find(
        (postId) => post.id.toString() === postId.toString()
      )
    ) {
      vote = -1;
    } else {
      vote = 0;
    }
    if (
      mod.savedPosts.find((postId) => postId.toString() === post.id.toString())
    ) {
      saved = true;
    }
    let postData = { id: result[typeOfListing][i]._id.toString() };
    postData.data = {
      id: post.id.toString(),
      subreddit: post.subredditName,
      postedBy: post.ownerUsername,
      title: post.title,
      link: post.link,
      content: typeOfListing === "unmoderatedPosts" ? post.content : undefined,
      images: typeOfListing === "unmoderatedPosts" ? post.images : undefined,
      video: typeOfListing === "unmoderatedPosts" ? post.video : undefined,
      nsfw: post.nsfw,
      spoiler: post.spoiler,
      votes: post.numberOfVotes,
      numberOfComments: post.numberOfComments,
      flair: post.flair,
      postedAt: post.createdAt,
      editedAt: post.editedAt,
      spammedAt:
        typeOfListing === "spammedPosts"
          ? post.moderation.spam.spammedDate
          : undefined,
      saved: saved,
      vote: vote,
    };

    children.push(postData);
  }

  let after = "",
    before = "";
  if (result[typeOfListing].length) {
    after = result[typeOfListing][finish - 1]._id.toString();
    before = result[typeOfListing][start]._id.toString();
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
 * This function returns the subreddit's typeOfListing comments with a given
 * sort and according to a certain limit with either after or before in the
 * listing params. It returns comment data and post title with additional flags for frontend.
 *
 * @param {string} modId User ID
 * @param {string} subredditName Subreddit Name
 * @param {string} typeOfListing Type of posts to be listed
 * @param {object} listingParams Listing parameters (After/before/sort/limit)
 * @returns {object} Result containing statusCode and data
 */
// eslint-disable-next-line max-statements
export async function listingSubredditComments(
  modId,
  subredditName,
  typeOfListing,
  listingParams
) {
  // Prepare Listing Parameters
  const listingResult = await commentTreeListing(listingParams);

  const subreddit = await Subreddit.findOne({ title: subredditName });
  if (!subreddit || subreddit.deletedAt) {
    return {
      statusCode: 404,
      data: "Subreddit not found",
    };
  }

  const result = await Subreddit.findOne({ title: subredditName })
    .select(typeOfListing)
    .populate({
      path: typeOfListing,
      match: listingResult.find,
      options: {
        sort: listingResult.sort,
      },
    });

  const mod = await User.findById(modId);
  if (!mod || mod.deletedAt) {
    return {
      statusCode: 404,
      data: "User not found or deleted",
    };
  }

  let limit = listingResult.limit;

  if (limit > result[typeOfListing].length) {
    limit = result[typeOfListing].length;
  }

  let start = 0,
    finish = limit;

  if (listingParams.before && !listingParams.after) {
    start = result[typeOfListing].length - limit;
    finish = result[typeOfListing].length;
    if (start < 0) {
      start = 0;
    }
  }
  let i = start;

  let children = [];
  for (i; i < finish; i++) {
    const comment = result[typeOfListing][i];
    const post = await Post.findById(comment.postId);
    let saved = false,
      vote;
    if (
      mod.upvotedComments.find(
        (commentId) => comment.id.toString() === commentId.toString()
      )
    ) {
      vote = 1;
    } else if (
      mod.downvotedComments.find(
        (commentId) => comment.id.toString() === commentId.toString()
      )
    ) {
      vote = -1;
    } else {
      vote = 0;
    }
    if (
      mod.savedComments.find(
        (commentId) => commentId.toString() === comment.id.toString()
      )
    ) {
      saved = true;
    }
    let commentData = { id: result[typeOfListing][i]._id.toString() };
    commentData.data = {
      postId: post.id.toString(),
      postTitle: post.title,
      comment: {
        id: comment.id.toString(),
        subreddit: comment.subredditName,
        commentedBy: comment.ownerUsername,
        commentedAt: comment.createdAt,
        editedAt: comment.editedAt,
        spammedAt:
          typeOfListing === "spammedComments"
            ? comment.moderation.spam.spammedDate
            : undefined,
        votes: comment.numberOfVotes,
        saved: saved,
        vote: vote,
      },
    };

    children.push(commentData);
  }

  let after = "",
    before = "";
  if (result[typeOfListing].length) {
    after = result[typeOfListing][finish - 1]._id.toString();
    before = result[typeOfListing][start]._id.toString();
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
 * This function checks for the given flair Id if it exists and whether
 * it belongs to the given subreddit or not.
 *
 * @param {string} subreddit Subreddit Name
 * @param {ObjectId} flairId Flair ID
 * @returns {object} Flair object returned
 */
// eslint-disable-next-line max-statements
export async function checkSubredditFlair(subreddit, flairId) {
  if (flairId) {
    if (!mongoose.Types.ObjectId.isValid(flairId)) {
      const error = new Error("Invalid Flair ID (Incorrect ObjectId format)");
      error.statusCode = 400;
      throw error;
    }
    const flair = await Flair.findById(flairId);
    if (!flair || flair.deletedAt) {
      const error = new Error("Flair not found or may be deleted");
      error.statusCode = 404;
      throw error;
    }
    const flairSubreddit = await Subreddit.findById(flair.subreddit);
    if (flairSubreddit.title !== subreddit) {
      const error = new Error("Flair doesn't belong to this subreddit");
      error.statusCode = 400;
      throw error;
    }
    return flair;
  }
  return undefined;
}

/**
 * This function returns all the subreddit's posts with a certain limit
 * and either after or before to cut form. It can also filter according to
 * a given flair.
 *
 * @param {object} user User Object
 * @param {string} subredditName Subreddit Name
 * @param {object} flair Flair Object
 * @param {object} listingParams Listing parameters (After/before/sort/limit)
 * @returns {object} Result containing statusCode and data
 */
// eslint-disable-next-line max-statements
export async function subredditHome(user, subredditName, flair, listingParams) {
  // Prepare Listing Parameters
  let listingResult = hpostListing(listingParams);

  // Check whether the subreddit exists & not deleted or not
  const subreddit = await Subreddit.findOne({ title: subredditName });
  if (!subreddit || subreddit.deletedAt) {
    return {
      statusCode: 404,
      data: "Subreddit not found or deleted",
    };
  }

  // Set subreddit name filter
  listingResult.find["subredditName"] = subredditName;

  // Check for flair and set it if given
  if (flair) {
    listingResult.find["flair"] = flair.id;
  }

  // Filter Hidden Posts
  if (user) {
    listingResult.find["_id"] = { $nin: user.hiddenPosts };
  }

  // Get results
  let result;
  if (listingParams.after !== undefined) {
    let after = listingParams.after;
    result = await Post.find(listingResult.find)
      .sort(listingResult.sort)
      .skip(after)
      .limit(listingResult.limit);
  } else if (listingParams.before !== undefined) {
    let before = listingParams.before;
    let limit = listingParams.limit;
    if (before < 0) {
      before = 0;
    }
    let skip = before - limit;
    if (before - limit < 0) {
      skip = 0;
      limit = before;
    }
    result = await Post.find(listingResult.find)
      .sort(listingResult.sort)
      .skip(skip)
      .limit(limit);
  }

  let children = [];

  for (let i = 0; i < result.length; i++) {
    const post = result[i];
    post.numberOfViews += 1;
    await post.save();
    const postId = post.id.toString();
    let vote = 0,
      saved = false,
      hidden = false,
      spammed = false,
      inYourSubreddit = false;
    if (user) {
      if (user.savedPosts?.find((id) => id.toString() === postId)) {
        saved = true;
      }
      if (user.hiddenPosts?.find((id) => id.toString() === postId)) {
        hidden = true;
      }
      if (user.upvotedPosts?.find((id) => id.toString() === postId)) {
        vote = 1;
      }
      if (user.downvotedPosts?.find((id) => id.toString() === postId)) {
        vote = -1;
      }
      if (user.moderatedSubreddits?.find((sr) => sr.name === subredditName)) {
        inYourSubreddit = true;
      }
      if (user.spammedPosts?.find((id) => id.toString() === postId)) {
        spammed = true;
      }
    }
    let postData = { id: result[i]._id.toString() };
    postData.data = {
      id: post.id.toString(),
      kind: post.kind,
      subreddit: post.subredditName,
      postedBy: post.ownerUsername,
      title: post.title,
      link: post.link,
      content: post.content,
      images: post.images,
      video: post.video,
      nsfw: post.nsfw,
      spoiler: post.spoiler,
      votes: post.numberOfVotes,
      comments: post.numberOfComments,
      flair: post.flair,
      postedAt: post.createdAt,
      editedAt: post.editedAt,
      sharePostId: post.sharePostId,
      sendReplies: post.sendReplies,
      saved: saved,
      hidden: hidden,
      votingType: vote,
      moderation: post.moderation,
      markedSpam: post.markedSpam,
      inYourSubreddit: inYourSubreddit,
      spammed: spammed,
    };

    children.push(postData);
  }

  let newAfter = 0,
    newBefore = 0;
  if (children.length > 0) {
    if (listingParams.after !== undefined) {
      newAfter = parseInt(listingParams.after) + result.length;
      newBefore = parseInt(listingParams.after);
    } else if (listingParams.before !== undefined) {
      newAfter = parseInt(listingParams.before);
      newBefore = parseInt(listingParams.before) - listingParams.limit;
      if (newBefore < 0) {
        newBefore = 0;
      }
    }
  }
  return {
    statusCode: 200,
    data: {
      after: newAfter,
      before: newBefore,
      children: children,
    },
  };
}
