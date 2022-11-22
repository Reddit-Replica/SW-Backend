import Category from "../models/Category.js";
import {
  getSortedCategories,
  insertCategoriesIfNotExists,
} from "../services/categories.js";

const getAllCategories = async (req, res, next) => {
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
