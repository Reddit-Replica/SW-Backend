import Category from "../models/Category.js";

const getAllCategories = async (req, res, next) => {
  const categories = await Category.find({})?.sort({
    randomIndex: 1,
  });
  return res.status(200).json(
    categories.map((category) => {
      return {
        id: category.id,
        name: category.name,
      };
    })
  );
};

export default {
  getAllCategories,
};
