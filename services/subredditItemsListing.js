import Subreddit from "../models/Community.js";
import Post from "../models/Post.js";
import { postListing, commentListing } from "../utils/prepareListing.js";

// eslint-disable-next-line max-statements
export async function listingSubredditPosts(
  subredditName,
  typeOfListing,
  listingParams
) {
  // Prepare Listing Parameters
  const listingResult = await postListing(listingParams);

  const subreddit = await Subreddit.findOne({ title: subredditName });
  if (!subreddit) {
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

  let children = [];

  for (const i in result[typeOfListing]) {
    const post = result[typeOfListing][i];

    let postData = { id: result[typeOfListing][i]._id.toString() };
    postData.data = {
      kind: post.kind,
      subreddit: post.subredditName,
      nsfw: post.nsfw,
      spoiler: post.spoiler,
      title: post.title,
      flair: post.flair,
      comments: post.numberOfComments,
      votes: post.numberOfUpvotes - post.numberOfDownvotes,
      postedAt: post.createdAt,
      editedAt: post.editedAt,
      postedBy: post.ownerUsername,
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
  subredditName,
  typeOfListing,
  listingParams
) {
  // Prepare Listing Parameters
  const listingResult = await commentListing(listingParams);

  const subreddit = await Subreddit.findOne({ title: subredditName });
  if (!subreddit) {
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

  let children = [];
  for (const i in result[typeOfListing]) {
    const comment = result[typeOfListing][i];
    const post = await Post.findById(comment.postId);

    let commentData = { id: result[typeOfListing][i]._id.toString() };
    commentData.data = {
      kind: post.kind,
      subreddit: post.subredditName,
      nsfw: post.nsfw,
      spoiler: post.spoiler,
      title: post.title,
      flair: post.flair,
      comments: post.numberOfComments,
      votes: post.numberOfUpvotes - post.numberOfDownvotes,
      postedAt: post.createdAt,
      editedAt: post.editedAt,
      postedBy: post.ownerUsername,
      ownerUsername: comment.ownerUsername,
      votes: comment.numberOfVotes,
      content: comment.content,
      commentedAt: comment.createdAt,
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
