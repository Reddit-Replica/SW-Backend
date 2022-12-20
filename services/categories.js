import Category from "../models/Category.js";
import Subreddit from "../models/Community.js";

let Categories = [
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
 * then transformed into just an id and the name displayed.
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
 * Categories we have in read-it
 *
 * @returns {object} Object containing the two random categories together
 */
// eslint-disable-next-line max-statements
export async function getTwoRandomCategories() {
  const len = Categories.length;
  let firstIndex, secondIndex, visited;
  if ((await Subreddit.countDocuments({})) === 0) {
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
 * from, sets a limit for both and inserts them in an array with only the
 * title and number of members to be displayed
 *
 * @returns {Array} Array of objects containing random subreddits
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
        id: subreddits[i][j].id,
        title: subreddits[i][j].title,
        members: subreddits[i][j].members,
        joined: joined,
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
