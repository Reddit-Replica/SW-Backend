import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Subreddit from "../models/Community.js";
import { postListing } from "../utils/preparePostListing.js";
import { commentTreeListing } from "../utils/prepareCommentListing.js";
import { userListing } from "../utils/prepareUserListing.js";
import { subredditListing } from "../utils/prepareSubredditListing.js";

/**
 * This function is used to remove hidden posts from the listing
 * that will be viewed by a logged in user.
 *
 * @param {Array} result Search query
 * @param {object} user Logged in user object
 * @returns {Array} Contains the new filtered listing results
 */
// eslint-disable-next-line max-statements
export function filterHiddenPosts(result, user) {
  result = result.filter(
    (post) =>
      !user.hiddenPosts.find(
        (hiddenPostId) => hiddenPostId.toString() === post.id.toString()
      )
  );
  return result;
}

/**
 * Search for a post given a query in the whole of read-it. It ensures that hidden, removed, spammed,
 * and nsfw (in case settings are set to not view nsfw content) posts are not shown to the user. The search
 * is checked on the post title only.
 *
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @param {object} user User object in case there's a logged in user
 * @returns {object} Result containing statusCode and data. The data consists of
 * the new after & before and children which hold search results.
 */
// eslint-disable-next-line max-statements
export async function searchPosts(query, listingParams, user) {
  // Prepare Listing Parameters
  let listingResult = await postListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["title"] = { $regex: regex };
  listingResult.find["moderation.remove.removedBy"] = undefined;
  listingResult.find["moderation.spam.spammedBy"] = undefined;
  user && (listingResult.find["nsfw"] = user.userSettings.nsfw);
  let result = await Post.find(listingResult.find).sort(listingResult.sort);

  let limit = listingResult.limit;

  if (user) {
    result = filterHiddenPosts(result, user);
  }

  if (
    (!listingParams.after && listingParams.before) ||
    (!listingParams.before && listingParams.after)
  ) {
    const id = listingParams.after ?? listingParams.before;
    const neededIndex = result.findIndex((post) => post._id.toString() === id);
    if (neededIndex !== -1) {
      if (listingParams.after) {
        result = result.slice(neededIndex + 1, result.length);
      } else {
        result = result.slice(0, neededIndex);
      }
    }
  }

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

/**
 * Search for a comment given a query in the whole of read-it. It ensures that removed, spammed,
 * and nsfw (in case settings are set to not view nsfw content) comments are not shown to the user.
 * The search is checked on comment content only.
 *
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @param {object} user Logged in user object
 * @returns {object} Result containing statusCode and data. The data consists of
 * the new after & before and children which hold search results.
 */
// eslint-disable-next-line max-statements
export async function searchComments(query, listingParams, user) {
  // Prepare Listing Parameters
  const listingResult = await commentTreeListing(listingParams);

  const regex = new RegExp(query, "i");
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

/**
 * Search for a user by the username or display name given a query in the whole of read-it. It filters
 * out if there are any blocked users as well.
 *
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @param {object} loggedInUser User object in case there's a logged in user
 * @returns {object} Result containing statusCode and data
 */
// eslint-disable-next-line max-statements
export async function searchUsers(query, listingParams, loggedInUser) {
  // Prepare Listing Parameters
  const listingResult = await userListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["$or"] = [
    { username: { $regex: regex } },
    { displayName: { $regex: regex } },
  ];
  if (loggedInUser) {
    listingResult.find["username"] = {
      $ne: loggedInUser.username,
    };
  }

  let result = await User.find(listingResult.find).sort(listingResult.sort);
  if (loggedInUser) {
    result = result.filter(
      (user) =>
        !loggedInUser.blockedUsers.find(
          (blockedUser) =>
            blockedUser.blockedUserId.toString() === user.id.toString()
        )
    );
  }

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
    const user = result[i];
    let following = undefined;
    if (loggedInUser) {
      if (
        user.followers.find(
          (userId) => userId.toString() === loggedInUser.id.toString()
        )
      ) {
        following = true;
      } else {
        following = false;
      }
    }
    let userData = { id: result[i]._id.toString() };
    userData.data = {
      id: user.id.toString(),
      karma: user.karma,
      username: user.username,
      nsfw: user.userSettings.nsfw,
      joinDate: user.createdAt,
      avatar: user.avatar,
      following: following,
    };

    children.push(userData);
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

/**
 * Search for a subreddit using the title or view name given a query in the whole of read-it.
 * Private subreddits do not appear in search and nsfw subreddits are also not shown in case
 * the user settings are set not to view nsfw content.
 *
 * @param {string} query Search query
 * @param {object} listingParams Listing parameters for listing
 * @param {object} loggedInUser Logged in user
 * @returns {object} Result containing statusCode and data
 */
// eslint-disable-next-line max-statements
export async function searchSubreddits(query, listingParams, loggedInUser) {
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

  if (loggedInUser) {
    listingResult.find["nsfw"] = loggedInUser.userSettings.nsfw;
  }

  const result = await Subreddit.find(listingResult.find).sort(
    listingResult.sort
  );

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
    const subreddit = result[i];
    let joined = undefined;
    if (loggedInUser) {
      if (
        loggedInUser.joinedSubreddits.find((sr) => sr.name === subreddit.title)
      ) {
        joined = true;
      } else {
        joined = false;
      }
    }

    let subredditData = { id: result[i]._id.toString() };
    subredditData.data = {
      id: subreddit.id.toString(),
      subredditName: subreddit.title,
      numberOfMembers: subreddit.members,
      description: subreddit.description,
      picture: subreddit.picture,
      nsfw: subreddit.nsfw,
      joined: joined,
    };

    children.push(subredditData);
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

/**
 * This service function return the logged in user if there is a token
 * sent with the request.
 *
 * @param {string} userId User ID
 * @returns {object} The user object
 */
export async function getLoggedInUser(userId) {
  const user = await User.findById(userId);
  if (!user || user.deletedAt) {
    return false;
  }
  return user;
}
