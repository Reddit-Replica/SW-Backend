/* eslint-disable max-len */
/* eslint-disable max-statements */
import Subreddit from "../models/Community.js";
import { subredditListing } from "../utils/prepareSubreddit.js";
import { checkOnCategory } from "./communityServices.js";
/**
 * Function that get the subreddit that we want to list
 * then sort, match, and limit them, then finally save the last id so that it can
 * be used next time to get different results.
 *
 * @param {Object} user User that we want to see the subreddits
 * @param {Object} category Category that we may list our subreddits with
 * @param {String} before Name of the first element of the list
 * @param {Object} after Name of the last element of the list
 * @param {Number} limit Number of subreddits needed
 * @param {Boolean} withCategory identifies if we will sort with category or not
 * @returns {Object} The response to that request containing [statusCode, data]
 */
// eslint-disable-next-line max-statements
export async function subredditCategoryListing(
  user,
  category,
  before,
  after,
  limit,
  withCategory
) {
  await checkOnCategory(category);
  const listingResult = await subredditListing(
    category,
    before,
    after,
    limit,
    withCategory
  );
  const result = await Subreddit.find(listingResult.query)
    .limit(listingResult.limit)
    .sort(listingResult.sort);
  let children = [];
  for (const i in result) {
    const subreddit = result[i];
    // lOOPING OVER EACH SUBREDDIT THAT WE RETURNED
    let isMember = false;

    for (const smallSubreddit of user.joinedSubreddits) {
      if (subreddit.id === smallSubreddit.subredditId.toString()) {
        isMember = true;
        break;
      }
    }
    let subredditData = { id: subreddit.id.toString() };
    // THEN WE WILL ADD DATA NEEDED TO THE MENTION
    subredditData.data = {
      title: subreddit.title,
      members: subreddit.members,
      description: subreddit.description,
      isMember: isMember,
    };
    children.push(subredditData);
  }

  let newAfter = "",
    newBefore = "";
  if (result.length) {
    newAfter = result[result.length - 1]._id.toString();
    newBefore = result[0]._id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: newAfter,
      before: newBefore,
      children: children,
    },
  };
}