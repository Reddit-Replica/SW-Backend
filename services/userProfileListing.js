import User from "../models/User.js";
import {
  preparePostListing,
  prepareListingParameters,
} from "../utils/prepareListing.js";

// eslint-disable-next-line max-statements
export async function listingUserProfileService(
  username,
  loggedInUserId,
  typeOfListing,
  listingParams
) {
  // prepare the listing parameters
  const listingResult = preparePostListing(
    prepareListingParameters(listingParams)
  );

  // get the owner of the profile
  const user = await User.findOne({ username: username });
  if (!user) {
    return {
      statusCode: 404,
      data: "Didn't find a user with that username",
    };
  }

  // get the logged in user
  let loggedInUser = null;
  if (loggedInUserId) {
    loggedInUser = await User.findById(loggedInUserId);
  }

  const result = await User.findOne({ username: username }).populate({
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
      console.log(found);
      if (found) {
        postData.data.inYourSubreddit = true;
        postData.data.moderation = post.moderation;
      } else {
        postData.data.inYourSubreddit = false;
      }
    }

    children.push(postData);
  }

  let after = "";
  if (result[typeOfListing].length) {
    after =
      result[typeOfListing][result[typeOfListing].length - 1]._id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: after,
      children: children,
    },
  };
}