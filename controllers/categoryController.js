import {
  getSortedCategories,
  insertCategoriesIfNotExists,
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

export default {
  getAllCategories,
};
