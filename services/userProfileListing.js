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

  let result = await User.findOne({ username: user.username })
    .select(typeOfListing)
    .populate({
      path: typeOfListing,
      match: listingResult.find,
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
    const neededIndex = result[typeOfListing].findIndex(
      (post) => post._id.toString() === id.toString()
    );
    if (neededIndex !== -1) {
      if (listingParams.after) {
        result[typeOfListing] = result[typeOfListing].slice(
          neededIndex + 1,
          result[typeOfListing].length
        );
      } else {
        result[typeOfListing] = result[typeOfListing].slice(0, neededIndex);
      }
    }
  }

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
      votes: post.numberOfVotes,
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
        // check if post is created by logged in user [post have no subreddit]
        const found = loggedInUser.posts.find(
          (ele) => ele._id.toString() === post._id.toString()
        );

        if (found) {
          postData.data.inYourSubreddit = true;
          postData.data.moderation = post.moderation;
        } else {
          postData.data.inYourSubreddit = false;
        }
      }
    }

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
 * Function used to get the comments of a user to a certain post and return the data based on
 * logged in user interactions to the comments.
 *
 * @param {String} user User object
 * @param {Object} loggedInUser Logged in user object
 * @param {String} postId Id of the post
 * @param {String} typeOfListing Used to know if the listing for normal overview or saved overview
 * @param {Boolean} requestComments Flag used to know that comments will not have a parent object
 * @returns {Array} Array of comments wrote by the user to that post
 */
// eslint-disable-next-line max-statements
async function getPostComments(
  user,
  loggedInUser,
  postId,
  typeOfListing,
  requestComments
) {
  // get all the comments of the post that was written by the user
  const comments = await Comment.find({
    postId: postId,
    ownerId: user._id,
    deletedAt: null,
  });
  let readyComments = [];

  // resort comments so that children come after parent comment
  let preprocessedList = [];
  for (let i = 0; i < comments.length; i++) {
    if (!preprocessedList.includes(comments[i])) {
      preprocessedList.push(comments[i]);
    }

    for (let j = i + 1; j < comments.length; j++) {
      // eslint-disable-next-line max-depth
      if (comments[i].children.includes(comments[j]._id)) {
        preprocessedList.push(comments[j]);
      }
    }
  }

  for (const i in preprocessedList) {
    const comment = preprocessedList[i];
    const saved = user.savedComments.includes(comment._id);
    // check if the comment is saved if the listing is savedPosts
    if (typeOfListing === "savedPosts") {
      if (!saved) {
        continue;
      }
    }

    let data = {
      commentId: comment._id,
      commentedBy: comment.ownerUsername,
      commentBody: comment.content,
      points: comment.numberOfVotes,
      publishTime: comment.createdAt,
      editTime: comment.editedAt,
      parent: comment.parentId,
      level: comment.level,
      inYourSubreddit: false,
      saved: saved,
    };

    // add parent data
    if (!requestComments && comment.parentType === "comment") {
      const index = preprocessedList.findIndex(
        (ele) => ele._id.toString() === comment.parentId.toString()
      );
      if (index === -1) {
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
    }

    if (loggedInUser) {
      // check if comment was written by the logged in user
      if (comment.ownerId.toString() === loggedInUser._id.toString()) {
        data.inYourSubreddit = true;
        data.moderation = comment.moderation;
      } else {
        // if comment.subreddit in our moderated subreddits add moderation
        const found = loggedInUser.moderatedSubreddits.find(
          (subreddit) => subreddit.name === comment.subredditName
        );

        // eslint-disable-next-line max-depth
        if (found) {
          data.inYourSubreddit = true;
          data.moderation = comment.moderation;
        }
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
 * @param {Boolean} requestComments Flag used to know that posts will only be with type = summaryPost
 * @param {Object} listingParams Listing parameters that was in the query of the request
 * @returns {Object} The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function listingUserOverview(
  user,
  loggedInUser,
  typeOfListing,
  requestComments,
  listingParams
) {
  // prepare the listing parameters
  const listingResult = await postListing(listingParams);

  const result = await User.findOne({
    username: user.username,
    deletedAt: null,
  })
    .select(typeOfListing)
    .populate({
      path: typeOfListing,
      match: listingResult.find,
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
    const neededIndex = result[typeOfListing].findIndex(
      (post) => post._id.toString() === id.toString()
    );
    if (neededIndex !== -1) {
      if (listingParams.after) {
        result[typeOfListing] = result[typeOfListing].slice(
          neededIndex + 1,
          result[typeOfListing].length
        );
      } else {
        result[typeOfListing] = result[typeOfListing].slice(0, neededIndex);
      }
    }
  }

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
    const hiddenPost = loggedInUser.hiddenPosts.includes(post._id);
    if (typeOfListing !== "savedPosts") {
      // hidden posts can be displayed in saved posts and comments page
      if (loggedInUser && hiddenPost) {
        continue;
      }
    }

    // if request comments only, then need to check if there is any comments at all
    const comments = await getPostComments(
      user,
      loggedInUser,
      post._id,
      typeOfListing,
      requestComments
    );
    if (requestComments && comments.length === 0) {
      continue;
    }

    let postData = {
      id: result[typeOfListing][i]._id.toString(),
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
          hidden: hiddenPost,
          inYourSubreddit: false,
        },
        comments: [],
      },
    };

    // for saved overview if post was in savedPostsOnly and savedPosts => postAndComment
    // if was in savedPostsOnly => post
    // if was in savedPosts and not in savedPostsOnly => comment
    if (typeOfListing === "savedPosts") {
      const postSaved = loggedInUser.savedPostsOnly.includes(post._id);
      const postAndCommentSaved = loggedInUser.savedPosts.includes(post._id);
      if (postSaved && comments.length !== 0) {
        postData.type = "postAndComment";
      } else if (postSaved && comments.length === 0) {
        postData.type = "post";
      } else if (!postSaved && postAndCommentSaved) {
        postData.type = "comment";
      }
    } else {
      // overview
      let type = "summaryPost";
      if (user.posts.includes(post._id)) {
        type = "fullPost";
      }
      if (!requestComments) {
        postData.type = type;
      }
    }

    postData.data.comments = comments;

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
      if (loggedInUser.savedPostsOnly.includes(post._id)) {
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

      // check if post belongs to the logged in user
      if (post.ownerId.toString() === loggedInUser._id.toString()) {
        postData.data.post.inYourSubreddit = true;
        postData.data.post.moderation = post.moderation;
      } else {
        // if post.subreddit in our moderated subreddits add moderation
        const found = loggedInUser.moderatedSubreddits.find(
          (subreddit) => subreddit.name === post.subredditName
        );

        if (found) {
          postData.data.post.inYourSubreddit = true;
          postData.data.post.moderation = post.moderation;
        }
      }
    }

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
