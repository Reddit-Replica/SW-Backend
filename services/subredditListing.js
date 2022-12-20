/* eslint-disable max-depth */
/* eslint-disable max-len */
/* eslint-disable max-statements */
import Subreddit from "../models/Community.js";
import Category from "../models/Category.js";
import { subredditListing } from "../utils/prepareSubreddit.js";
import { checkOnCategory } from "./communityServices.js";
import { prepareLimit } from "../utils/prepareLimit.js";
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
  withCategory,
  isLoggedIn
) {
  if (withCategory) {
    await checkOnCategory(category);
  }
  let subreddits;
  if (withCategory) {
    subreddits = await Subreddit.find({ category: category }).sort({
      members: -1,
    });
  } else {
    subreddits = await Subreddit.find().sort({ members: -1 });
  }
  limit = await prepareLimit(limit);
  if (subreddits.length < limit) {
    limit = subreddits.length;
  }
  let start, end, secondStart;
  if (before) {
    end = subreddits.findIndex(
      (subreddit) => subreddit.id.toString() === before.toString()
    );
    start = end - limit;
  } else if (after && !before) {
    start =
      subreddits.findIndex(
        (subreddit) => subreddit.id.toString() === after.toString()
      ) + 1;
    end = start + limit;
  } else {
    start = 0;
    end = limit;
  }
  if (start < 0) {
    start = 0;
  }
  if (end > subreddits.length) {
    end = subreddits.length;
  }
  secondStart = start;
  let children = [];
  for (start; start < end; start++) {
    const subreddit = subreddits[start];
    // lOOPING OVER EACH SUBREDDIT THAT WE RETURNED
    let isMember = false;
    if (isLoggedIn) {
      for (const smallSubreddit of user.joinedSubreddits) {
        if (subreddit.id === smallSubreddit.subredditId.toString()) {
          isMember = true;
          break;
        }
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
  if (subreddits.length && secondStart < subreddits.length && end > 0) {
    newAfter = subreddits[end - 1].id.toString();
    newBefore = subreddits[secondStart].id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: newAfter,
      before: newBefore,
      length: children.length,
      children: children,
    },
  };
}

export async function twoRandomCategories(user, isLoggedIn) {
  const randomOne = Math.floor(Math.random() * 30);
  let randomTwo = Math.floor(Math.random() * 30);
  while (randomTwo === randomOne) {
    randomTwo = Math.floor(Math.random() * 30);
  }
  const categoryOne = await Category.findOne({ randomIndex: randomOne });
  const categoryTwo = await Category.findOne({ randomIndex: randomTwo });

  const resultOne = await Subreddit.find({ category: categoryOne.name })
    .sort({ members: -1 })
    .limit(5);
  const resultTwo = await Subreddit.find({ category: categoryTwo.name })
    .sort({ members: -1 })
    .limit(5);
  let childrenOne = [];
  for (const i in resultOne) {
    const subreddit = resultOne[i];
    // lOOPING OVER EACH SUBREDDIT THAT WE RETURNED
    let isMember = false;
    if (isLoggedIn) {
      for (const smallSubreddit of user.joinedSubreddits) {
        if (subreddit.id === smallSubreddit.subredditId.toString()) {
          isMember = true;
          break;
        }
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
      secondCategory: categoryTwo.name,
      firstCategoryChildren: childrenOne,
      secondCategoryChildren: childrenTwo,
    },
  };
}

export async function subredditTrendingListing(
  user,
  before,
  after,
  limit,
  isLoggedIn
) {
  const subreddits = await Subreddit.find().sort({ numberOfViews: -1 });

  limit = await prepareLimit(limit);
  if (subreddits.length < limit) {
    limit = subreddits.length;
  }
  let start, end, secondStart;
  if (before) {
    end = subreddits.findIndex(
      (subreddit) => subreddit.id.toString() === before.toString()
    );
    start = end - limit;
  } else if (after && !before) {
    start =
      subreddits.findIndex(
        (subreddit) => subreddit.id.toString() === after.toString()
      ) + 1;
    end = start + limit;
  } else {
    start = 0;
    end = limit;
  }
  if (start < 0) {
    start = 0;
  }
  if (end > subreddits.length) {
    end = subreddits.length;
  }
  secondStart = start;
  let children = [];
  for (start; start < end; start++) {
    const subreddit = subreddits[start];
    // lOOPING OVER EACH SUBREDDIT THAT WE RETURNED
    let isMember = false;
    if (isLoggedIn) {
      for (const smallSubreddit of user.joinedSubreddits) {
        if (subreddit.id === smallSubreddit.subredditId.toString()) {
          isMember = true;
          break;
        }
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
  if (subreddits.length && secondStart < subreddits.length && end > 0) {
    newAfter = subreddits[end - 1].id.toString();
    newBefore = subreddits[secondStart].id.toString();
  }
  return {
    statusCode: 200,
    data: {
      after: newAfter,
      before: newBefore,
      length: children.length,
      children: children,
    },
  };
}
