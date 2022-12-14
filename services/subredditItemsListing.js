import Subreddit from "../models/Community.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Flair from "../models/Flair.js";
import { commentListing } from "../utils/prepareCommentListing.js";
import { postListing } from "../utils/preparePostListing.js";
import mongoose from "mongoose";

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
      limit: listingResult.limit,
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

  let children = [];

  for (const i in result[typeOfListing]) {
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
    after =
      result[typeOfListing][result[typeOfListing].length - 1]._id.toString();
    before = result[typeOfListing][0]._id.toString();
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

// eslint-disable-next-line max-statements
export async function listingSubredditComments(
  modId,
  subredditName,
  typeOfListing,
  listingParams
) {
  // Prepare Listing Parameters
  const listingResult = await commentListing(listingParams);

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
      limit: listingResult.limit,
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

  let children = [];
  for (const i in result[typeOfListing]) {
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
    after =
      result[typeOfListing][result[typeOfListing].length - 1]._id.toString();
    before = result[typeOfListing][0]._id.toString();
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
 * @param {object} subreddit Subreddit Object
 * @param {ObjectId} flairId Flair ID
 * @returns {void}
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

// eslint-disable-next-line max-statements
export async function subredditHome(user, subredditName, flair, listingParams) {
  // Prepare Listing Parameters
  const listingResult = await postListing(listingParams);

  const subreddit = await Subreddit.findOne({ title: subredditName });
  if (!subreddit || subreddit.deletedAt) {
    return {
      statusCode: 404,
      data: "Subreddit not found or deleted",
    };
  }
  listingResult.find["subredditName"] = subredditName;
  console.log(flair);
  if (flair) {
    //listingResult.find["flair.toString()"] = flair.id.toString();
  }
  const result = await Subreddit.findOne({ title: subredditName })
    .select("subredditPosts")
    .populate({
      path: "subredditPosts",
      match: listingResult.find,
      populate: {
        path: "flair",
        model: "Flair",
      },
      limit: listingResult.limit,
      options: {
        sort: listingResult.sort,
      },
    });

  let children = [];

  for (const i in result["subredditPosts"]) {
    const post = result["subredditPosts"][i];
    const postId = post.toString();
    let vote = 0,
      saved = false,
      hidden = false,
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
    }
    let postData = { id: result["subredditPosts"][i]._id.toString() };
    postData.data = {
      id: post.id.toString(),
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
      numberOfComments: post.numberOfComments,
      flair: flair,
      postedAt: post.createdAt,
      editedAt: post.editedAt,
      saved: saved,
      hidden: hidden,
      vote: vote,
      approved: post.moderation.approve.approvedBy !== undefined,
      removed: post.moderation.remove.removedBy !== undefined,
      spammed: post.moderation.spam.spammedBy !== undefined,
      lock: post.moderation.lock,
      inYourSubreddit: inYourSubreddit,
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
