import User from "../models/User.js";
import { postListing } from "../utils/prepareListing.js";

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
      subreddit: post.subredditName,
      content: post.content,
      images: post.images,
      nsfw: post.nsfw,
      spoiler: post.spoiler,
      title: post.title,
      sharePostId: post.sharePostId,
      flair: post.flair,
      comments: post.numberOfComments,
      votes: post.numberOfUpvotes - post.numberOfDownvotes,
      postedAt: post.createdAt,
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
