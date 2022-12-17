/* eslint-disable max-len */
/* eslint-disable max-statements */
import Subreddit from "../models/Community.js";
import Category from "../models/Category.js";
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
  console.log(withCategory);
  if (withCategory) {
    console.log("fe category",withCategory);
    await checkOnCategory(category);
  }
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
    subredditData.data = {
      title: subreddit.title,
      members: subreddit.members,
      description: subreddit.description,
      isMember: isMember,
      picture: subreddit.picture,
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


export async function twoRandomCategories(
  user,
) {
  const randomOne=Math.floor(Math.random() * 29);
  let randomTwo=Math.floor(Math.random() * 29);
  while (randomTwo===randomOne){
    randomTwo=Math.floor(Math.random() * 29);
  }
  const categoryOne= await Category.findOne({ randomIndex:randomOne });
  const categoryTwo= await Category.findOne({ randomIndex:randomTwo });

  const resultOne=await Subreddit.find({ category:categoryOne.name }).sort({ members:-1 }).limit(5);
  const resultTwo=await Subreddit.find({ category:categoryTwo.name }).sort({ members:-1 }).limit(5);
  let childrenOne = [];
  for (const i in resultOne) {
    const subreddit = resultOne[i];
    // lOOPING OVER EACH SUBREDDIT THAT WE RETURNED
    let isMember = false;

    for (const smallSubreddit of user.joinedSubreddits) {
      if (subreddit.id === smallSubreddit.subredditId.toString()) {
        isMember = true;
        break;
      }
    }
    let subredditData = { id: subreddit.id.toString() };
    subredditData.data = {
      title: subreddit.title,
      members: subreddit.members,
      description: subreddit.description,
      isMember: isMember,
      picture: subreddit.picture,
    };
    childrenOne.push(subredditData);
  }

  let childrenTwo = [];
  for (const i in resultTwo) {
    const subreddit = resultTwo[i];
    // lOOPING OVER EACH SUBREDDIT THAT WE RETURNED
    let isMember = false;

    for (const smallSubreddit of user.joinedSubreddits) {
      if (subreddit.id === smallSubreddit.subredditId.toString()) {
        isMember = true;
        break;
      }
    }
    let subredditData = { id: subreddit.id.toString() };
    subredditData.data = {
      title: subreddit.title,
      members: subreddit.members,
      description: subreddit.description,
      isMember: isMember,
      picture: subreddit.picture,
    };
    childrenTwo.push(subredditData);
  }

  return {
    statusCode: 200,
    data: {
      firstCategory: categoryOne.name,
      secondCategory:categoryTwo.name,
      firstCategoryChildren:childrenOne,
      secondCategoryChildren:childrenTwo,
    },
  };
}
