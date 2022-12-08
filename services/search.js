import Post from "../models/Post.js";
import { postListing } from "../utils/preparePostListing.js";
import {
  prepareListingComments,
  commentListing,
} from "../utils/prepareCommentListing.js";
import {
  prepareListingUsers,
  userListing,
} from "../utils/prepareUserListing.js";

/**
 * Search
 *
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function searchPosts(query, listingParams) {
  // Prepare Listing Parameters
  const listingResult = await postListing(listingParams);

  const regex = new RegExp(query, "i");
  listingResult.find["title"] = { $regex: regex };

  const result = await Post.find(listingResult.find)
    .limit(listingResult.limit)
    .sort(listingResult.sort);

  let children = [];

  for (const i in result) {
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

/**
 * Search
 *
 * @returns {void}
 */
export async function searchComments(query, listingParams) {
  // TODO
}

/**
 * Search
 *
 * @returns {void}
 */
export async function searchUsers(query, listingParams) {
  // TODO
}

/**
 * Search
 *
 * @returns {void}
 */
export async function searchSubreddits(query, listingParams) {
  // TODO
}
