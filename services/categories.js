import Category from "../models/Category.js";

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
  "ourdoors",
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
