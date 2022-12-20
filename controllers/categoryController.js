import {
  getSortedCategories,
  insertCategoriesIfNotExists,
  getRandomSubreddits,
} from "../services/categories.js";

const getAllCategories = async (_req, res) => {
  try {
    await insertCategoriesIfNotExists();
    const categories = await getSortedCategories();
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
};

const getSubredditsFromRandomCategories = async (_req, res) => {
  try {
    const result = await getRandomSubreddits();
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      if (error.statusCode === 400) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(error.statusCode).json(error.message);
      }
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

export default {
  getAllCategories,
  getSubredditsFromRandomCategories,
};
