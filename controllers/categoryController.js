import {
  getSortedCategories,
  insertCategoriesIfNotExists,
  getRandomSubreddits,
} from "../services/categories.js";
import { getLoggedInUser } from "../services/search.js";

const getAllCategories = async (req, res) => {
  try {
    await insertCategoriesIfNotExists();
    const categories = await getSortedCategories();
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
};

const getSubredditsFromRandomCategories = async (req, res) => {
  try {
    let loggedInUser = undefined;
    if (req.loggedIn) {
      const user = await getLoggedInUser(req.userId);
      if (user) {
        loggedInUser = user;
      }
    }
    const result = await getRandomSubreddits(loggedInUser);
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
