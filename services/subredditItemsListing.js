import Subreddit from "../models/Community.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Flair from "../models/Flair.js";
import { commentTreeListing } from "../utils/prepareCommentListing.js";
import { postListing } from "../utils/preparePostListing.js";
import mongoose from "mongoose";

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
 * This function fixes the sort according to it's type. It means that it includes
 * the parameter which is going to be used as a condition in the find key as an
 * "or equal" behaviour
 *
 * @param {object} listingResult Listing Result to be filtered
 * @param {string} listingParams Listing Parameters (after, before, sort, time)
 * @returns {object} New listing results
 */
// eslint-disable-next-line max-statements
export async function fixSort(listingResult, listingParams) {
  if (listingResult.find.hotScore) {
    const score = listingParams.after
      ? { $lte: listingResult.find.hotScore["$lt"] }
      : { $gte: listingResult.find.hotScore["$gt"] };
    listingResult.find["$or"] = [
      {
        hotScore: listingResult.find.hotScore,
      },
      {
        hotScore: score,
      },
    ];
    delete listingResult.find.hotScore;
  } else if (listingResult.find.numberOfVotes) {
    const score = listingParams.after
      ? { $lte: listingResult.find.numberOfVotes["$lt"] }
      : { $gte: listingResult.find.numberOfVotes["$gt"] };
    listingResult.find["$or"] = [
      {
        numberOfVotes: listingResult.find.numberOfVotes,
      },
      {
        numberOfVotes: score,
      },
    ];
    delete listingResult.find.numberOfVotes;
  } else if (listingParams.sort === "trending") {
    listingResult.sort = { numberOfViews: -1 };
    if (listingParams.after || listingParams.before) {
      const id = listingParams.after ?? listingParams.before;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid ID");
        error.statusCode = 400;
        throw error;
      }
      const post = await Post.findById(id);
      if (!post) {
        const error = new Error("Invalid ID");
        error.statusCode = 400;
        throw error;
      }
      if (listingParams.after) {
        listingResult.find = { $lte: post.numberOfViews };
      } else if (listingParams.before) {
        listingResult.find = { $gte: post.numberOfViews };
      }
      delete listingResult.find.createdAt;
    }
  }
  return listingResult;
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
  let listingResult = await postListing(listingParams);
  listingResult = await fixSort(listingResult, listingParams);

  const subreddit = await Subreddit.findOne({ title: subredditName });
  if (!subreddit || subreddit.deletedAt) {
    return {
      statusCode: 404,
      data: "Subreddit not found or deleted",
    };
  }
  listingResult.find["subredditName"] = subredditName;

  if (flair) {
    listingResult.find["flair"] = flair.id;
  }
  let result = await Subreddit.findOne({ title: subredditName })
    .select("subredditPosts")
    .populate({
      path: "subredditPosts",
      match: listingResult.find,
      populate: {
        path: "flair",
        model: "Flair",
      },
      options: {
        sort: listingResult.sort,
      },
    });

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
    if (start < 0) {
      start = 0;
    }
  }
  let i = start;

  let children = [];

  for (i; i < finish; i++) {
    const post = result["subredditPosts"][i];
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
