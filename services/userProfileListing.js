import User from "../models/User.js";
import Comment from "./../models/Comment.js";
import { postListing } from "../utils/preparePostListing.js";

/**
 * Function that get the posts that we want to list from a certain user
 * then sort, match, and limit them, then finally save the last id so that it can
 * be used next time to get different results.
 * Function also check each post if it was followed or saved or spammed by the logged in user.
 *
 * @param {Object} user User that we want to list his posts
 * @param {Object} loggedInUser Logged in user that did the request
 * @param {String} typeOfListing Name of the list in the user model that we want to list
 * @param {Object} listingParams Listing parameters that was in the query of the request
 * @returns {Object} The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function listingUserProfileService(
  user,
  loggedInUser,
  typeOfListing,
  listingParams
) {
  // prepare the listing parameters
  const listingResult = await postListing(listingParams);

  const result = await User.findOne({ username: user.username })
    .select(typeOfListing)
    .populate({
      path: typeOfListing,
      match: listingResult.find,
      limit: listingResult.limit,
      options: {
        sort: listingResult.sort,
      },
    });

  let children = [];
  for (const i in result[typeOfListing]) {
    const post = result[typeOfListing][i];
    if (
      loggedInUser &&
      loggedInUser.hiddenPosts.includes(post._id) &&
      typeOfListing !== "hiddenPosts"
    ) {
      continue;
    }

    let postData = { id: result[typeOfListing][i]._id.toString() };
    postData.data = {
      kind: post.kind,
      title: post.title,
      subreddit: post.subredditName,
      link: post.link,
      images: post.images,
      video: post.video,
      content: post.content,
      nsfw: post.nsfw,
      spoiler: post.spoiler,
      sharePostId: post.sharePostId,
      flair: post.flair,
      comments: post.numberOfComments,
      votes: post.numberOfUpvotes - post.numberOfDownvotes,
      postedAt: post.createdAt,
      sendReplies: post.sendReplies,
      markedSpam: post.markedSpam,
      suggestedSort: post.suggestedSort,
      editedAt: post.editedAt,
      postedBy: post.ownerUsername,
      votingType: 0,
      saved: false,
      followed: false,
      spammed: false,
      inYourSubreddit: false,
    };

    if (loggedInUser) {
      // check voting type
      if (loggedInUser.upvotedPosts.includes(post._id)) {
        postData.data.votingType = 1;
      } else if (loggedInUser.downvotedPosts.includes(post._id)) {
        postData.data.votingType = -1;
      } else {
        postData.data.votingType = 0;
      }

      // check if the post was saved before
      if (loggedInUser.savedPosts.includes(post._id)) {
        postData.data.saved = true;
      } else {
        postData.data.saved = false;
      }

      // check if the post was followed before
      if (loggedInUser.followedPosts.includes(post._id)) {
        postData.data.followed = true;
      } else {
        postData.data.followed = false;
      }

      // check if the post was spammed before
      if (loggedInUser.spammedPosts.includes(post._id)) {
        postData.data.spammed = true;
      } else {
        postData.data.spammed = false;
      }

      // if post.subreddit in our moderated subreddits add moderation
      const found = loggedInUser.moderatedSubreddits.find(
        (subreddit) => subreddit.name === post.subredditName
      );

      if (found) {
        postData.data.inYourSubreddit = true;
        postData.data.moderation = post.moderation;
      } else {
        postData.data.inYourSubreddit = false;
      }
    }

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

/**
 * Function used to get the comments of a user to a certain post and return the data based on
 * logged in user interactions to the comments.
 *
 * @param {String} userId Id of the user
 * @param {Object} loggedInUser Logged in user object
 * @param {String} postId Id of the post
 * @returns {Array} Array of comments wrote by the user to that post
 */
// eslint-disable-next-line max-statements
async function getPostComments(userId, loggedInUser, postId) {
  // get all the comments of the post that was written by the user
  const comments = await Comment.find({ postId: postId, ownerId: userId });
  let readyComments = [];

  for (const i in comments) {
    const comment = comments[i];
    let data = {
      commentId: comment._id,
      commentedBy: comment.ownerUsername,
      commentBody: comment.content,
      points: comment.numberOfVotes,
      publishTime: comment.createdAt,
      editTime: comment.editedAt,
      level: comment.level,
      inYourSubreddit: false,
    };

    // add parent data
    if (comment.parentType === "comment") {
      const parent = await Comment.findById(comment.parentId);
      data.parent = {
        commentId: parent._id,
        commentedBy: parent.ownerUsername,
        commentBody: parent.content,
        points: parent.numberOfVotes,
        publishTime: parent.createdAt,
        editTime: parent.editedAt,
      };
    }

    if (loggedInUser) {
      // if comment.subreddit in our moderated subreddits add moderation
      const found = loggedInUser.moderatedSubreddits.find(
        (subreddit) => subreddit.name === comment.subredditName
      );

      if (found) {
        data.inYourSubreddit = true;
        data.moderation = comment.moderation;
      }
    }
    readyComments.push(data);
  }

  return readyComments;
}

/**
 * Function that get the posts and there comments that we want to list from a certain user
 * then sort, match, and limit them, then finally save the last id so that it can
 * be used next time to get different results.
 * Function also check each post if it was followed or saved or spammed by the logged in user.
 * Also will check each comment if it was in the subreddit of the logged in user.
 *
 * @param {Object} user User that we want to list his posts + comments
 * @param {Object} loggedInUser Logged in user that did the request
 * @param {String} typeOfListing Name of the list in the user model that we want to list
 * @param {Object} listingParams Listing parameters that was in the query of the request
 * @returns {Object} The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function listingUserOverview(
  user,
  loggedInUser,
  typeOfListing,
  listingParams
) {
  // prepare the listing parameters
  const listingResult = await postListing(listingParams);

  const result = await User.findOne({ username: user.username })
    .select(typeOfListing)
    .populate({
      path: typeOfListing,
      match: listingResult.find,
      limit: listingResult.limit,
      options: {
        sort: listingResult.sort,
      },
    });

  let children = [];
  for (const i in result[typeOfListing]) {
    const post = result[typeOfListing][i];
    if (loggedInUser && loggedInUser.hiddenPosts.includes(post._id)) {
      continue;
    }

    let type = "summaryPost";
    if (user.posts.includes(post._id)) {
      type = "fullPost";
    }
    let postData = {
      id: result[typeOfListing][i]._id.toString(),
      type,
      data: {
        post: {
          kind: post.kind,
          title: post.title,
          subreddit: post.subredditName,
          link: post.link,
          images: post.images,
          video: post.video,
          content: post.content,
          nsfw: post.nsfw,
          spoiler: post.spoiler,
          sharePostId: post.sharePostId,
          flair: post.flair,
          comments: post.numberOfComments,
          votes: post.numberOfUpvotes - post.numberOfDownvotes,
          postedAt: post.createdAt,
          sendReplies: post.sendReplies,
          markedSpam: post.markedSpam,
          suggestedSort: post.suggestedSort,
          editedAt: post.editedAt,
          postedBy: post.ownerUsername,
          votingType: 0,
          saved: false,
          followed: false,
          spammed: false,
          inYourSubreddit: false,
        },
        comments: [],
      },
    };

    if (loggedInUser) {
      // check voting type
      if (loggedInUser.upvotedPosts.includes(post._id)) {
        postData.data.post.votingType = 1;
      } else if (loggedInUser.downvotedPosts.includes(post._id)) {
        postData.data.post.votingType = -1;
      } else {
        postData.data.post.votingType = 0;
      }

      // check if the post was saved before
      if (loggedInUser.savedPosts.includes(post._id)) {
        postData.data.post.saved = true;
      } else {
        postData.data.post.saved = false;
      }

      // check if the post was followed before
      if (loggedInUser.followedPosts.includes(post._id)) {
        postData.data.post.followed = true;
      } else {
        postData.data.post.followed = false;
      }

      // check if the post was spammed before
      if (loggedInUser.spammedPosts.includes(post._id)) {
        postData.data.post.spammed = true;
      } else {
        postData.data.post.spammed = false;
      }

      // if post.subreddit in our moderated subreddits add moderation
      const found = loggedInUser.moderatedSubreddits.find(
        (subreddit) => subreddit.name === post.subredditName
      );

      if (found) {
        postData.data.post.inYourSubreddit = true;
        postData.data.post.moderation = post.moderation;
      } else {
        postData.data.post.inYourSubreddit = false;
      }
    }

    postData.data.comments = await getPostComments(
      user._id,
      loggedInUser,
      post._id
    );

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
