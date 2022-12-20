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
export async function getTwoRandomCategories() {
  const len = Categories.length;
  let firstIndex, secondIndex, count;
  do {
    firstIndex = Math.floor(Math.random() * len);
    count = await Subreddit.countDocuments({
      category: Categories[firstIndex],
    });
  } while (count === 0);
  do {
    secondIndex = Math.floor(Math.random() * len);
    count = await Subreddit.countDocuments({
      category: Categories[secondIndex],
    });
  } while (firstIndex === secondIndex || count === 0);
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
export async function getRandomSubreddits() {
  const { firstCategory, secondCategory } = await getTwoRandomCategories();

  let subreddits = [
    await Subreddit.find({ category: firstCategory }),
    await Subreddit.find({ category: secondCategory }),
  ];
  let randomSubreddits = [];
  for (let i = 0; i < 2; i++) {
    let limit = 25;
    if (subreddits[i].length < 25) {
      limit = subreddits[i].length;
    }
    while (limit--) {
      const randIndex = Math.floor(Math.random() * subreddits[i].length);
      randomSubreddits.push({
        title: subreddits[i][randIndex].title,
        members: subreddits[i][randIndex].members,
      });
      subreddits[i].splice(randIndex, 1);
    }
  }
  return randomSubreddits;
}
