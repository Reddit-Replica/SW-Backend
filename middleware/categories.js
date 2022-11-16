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
 * Middleware used to insert a set of given categories to the database
 * if they do not already exist. The category consists of an id, name and
 * an index for randomization later on.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function insertCategoriesIfNotExists(req, res, next) {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      for (let i = 0; i < Categories.length; i++) {
        await new Category({
          name: Categories[i],
          randomIndex: i,
        }).save();
      }
    }
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}
