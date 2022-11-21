import mongoose from "mongoose";

// eslint-disable-next-line new-cap
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  randomIndex: {
    type: Number,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
