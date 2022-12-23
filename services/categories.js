import Category from "../models/Category.js";
import Subreddit from "../models/Community.js";

export let Categories = [
  "Sports",
  "Gaming",
  "News",
  "TV",
  "Aww",
  "Memes",
  "Pics & Gifs",
  "Travel",
  "Tech",
  "Music",
  "Art & Design",
  "Beauty",
  "Books & Writing",
  "Crypto",
  "Discussion",
  "E3",
  "Fashion",
  "Finance & Business",
  "Food",
  "Health & Fitness",
  "Learning",
  "Mindblowing",
  "Outdoors",
  "parenting",
  "Photography",
  "Relationships",
  "Science",
  "Videos",
  "Vroom",
  "Wholesome",
];

/**
 * This function is used to insert a set of given categories to the database
 * if they do not already exist. The category consists of an id, name and
 * an index for randomization later on.
 *
 * @returns {void}
 */
export async function insertCategoriesIfNotExists() {
  const count = await Category.countDocuments();
  if (count === 0) {
    for (let i = 0; i < Categories.length; i++) {
      await new Category({
        name: Categories[i],
        randomIndex: i,
      }).save();
    }
  }
}

/**
 * This function gets all the categories stored in the database and
 * sorts them ascendingly with the random index. Each category object is
 * then transformed into just an id and the name displayed to be returned.
 *
 * @returns {Array} Array of category objects consisting of id and name
 */
export async function getSortedCategories() {
  const categories = await Category.find({})?.sort({
    randomIndex: 1,
  });
  return categories.map((category) => {
    return {
      id: category.id,
      name: category.name,
    };
  });
}

/**
 * This function is used to get two random categories from the array of
 * Categories we have in read-it. It returns an empty object in case there are
 * no subreddits stored or that the count of total visited categories is zero.
 * A visited category is one which has subreddits made out from it. If there is only
 * one visited category then the first and second categories returned are the same.
 *
 * @returns {object} Object containing the two random categories together as strings
 */
// eslint-disable-next-line max-statements
export async function getTwoRandomCategories() {
  const len = Categories.length;
  let firstIndex, secondIndex, visited;
  if ((await Subreddit.countDocuments({ deletedAt: null })) === 0) {
    return {};
  }
  const categoryCount = await Category.countDocuments({ visited: true });
  if (categoryCount === 0) {
    return {};
  }
  do {
    firstIndex = Math.floor(Math.random() * len);
    visited = await Category.findOne({ randomIndex: firstIndex }).select(
      "visited"
    );
  } while (!visited["visited"]);
  if (categoryCount >= 2) {
    do {
      secondIndex = Math.floor(Math.random() * len);
      visited = await Category.findOne({ randomIndex: secondIndex }).select(
        "visited"
      );
    } while (firstIndex === secondIndex || !visited["visited"]);
  } else {
    secondIndex = firstIndex;
  }
  return {
    firstCategory: Categories[firstIndex],
    secondCategory: Categories[secondIndex],
  };
}

/**
 * This function gets random subreddits from two random categories
 * that are obtained from the getTwoRandomCategories function. It then
 * sets a limit for both (max 5) and inserts them in an array with only the
 * title, numberOfMembers, subreddit picture, and an extra flag which indicates
 * whether the logged in user is a member of this subreddit or not. The array is
 * returned for the response in the controller. If both categories are the same then
 * only the first object is returned and the second is set to undefined.
 *
 * @returns {Object} An object containing both the first and second random subreddit info in
 * a separate key.
 */
// eslint-disable-next-line max-statements
export async function getRandomSubreddits(loggedInUser) {
  const { firstCategory, secondCategory } = await getTwoRandomCategories();
  if (!firstCategory && !secondCategory) {
    return {};
  }

  let subreddits = [
    await Subreddit.find({ category: firstCategory, deletedAt: null }).sort({
      members: -1,
    }),
    await Subreddit.find({ category: secondCategory, deletedAt: null }).sort({
      members: -1,
    }),
  ];
  let topSubreddits = [[], []];
  for (let i = 0; i < 2; i++) {
    let limit = 5;
    if (subreddits[i].length < 5) {
      limit = subreddits[i].length;
    }
    for (let j = 0; j < limit; j++) {
      let joined = undefined;
      if (loggedInUser) {
        // eslint-disable-next-line max-depth
        if (
          loggedInUser.joinedSubreddits.find(
            (sr) => sr.name === subreddits[i][j].title
          )
        ) {
          joined = true;
        } else {
          joined = false;
        }
      }
      topSubreddits[i].push({
        id: subreddits[i][j].id.toString(),
        data: {
          title: subreddits[i][j].title,
          picture: subreddits[i][j].picture,
          members: subreddits[i][j].members,
          isMember: joined,
        },
      });
    }
    if (firstCategory === secondCategory) {
      break;
    }
  }
  return {
    first: { category: firstCategory, subreddits: topSubreddits[0] },
    second:
      topSubreddits[1].length > 0
        ? { category: secondCategory, subreddits: topSubreddits[1] }
        : undefined,
  };
}
