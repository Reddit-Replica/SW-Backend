import Subreddit from "../models/Community.js";
import User from "../models/User.js";
import { postListing } from "../utils/prepareListing.js";

// eslint-disable-next-line max-statements
export async function listingSubredditPosts(
  subredditName,
  loggedInUserId,
  typeOfListing,
  listingParams
) {
  // prepare the listing parameters
  const listingResult = await postListing(listingParams);

  // get the owner of the profile
  const subreddit = await Subreddit.findOne({ title: subredditName });
  if (!subreddit) {
    return {
      statusCode: 404,
      data: "Subreddit not found",
    };
  }

  const result = await subreddit.select(typeOfListing).populate({
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
