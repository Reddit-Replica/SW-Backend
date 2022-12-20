import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Subreddit from "../models/Community.js";
dotenv.config();
import { users } from "./users.js";
import { categories } from "./categories.js";
import { subreddits } from "./subreddits.js";
const DB_URL = process.env.MONGO_URL_SEED.trim();

export let userIds;
export let subredditsId;

async function connectDatabase() {
  try {
    await mongoose.connect(DB_URL, { useNewUrlParser: true });
  } catch (err) {
    console.log(err);
  }
}

function closeDatabaseConnection() {
  mongoose.connection.close();
}

async function seedUsers() {
  await User.deleteMany();
  const usersInserted = await User.insertMany(users);
  userIds = usersInserted.map((d) => d._id);
  // console.log(userIds);
  return userIds;
}

async function seedCategories() {
  await Category.deleteMany();
  await Category.insertMany(categories);
}

async function seedSubreddits() {
  await Subreddit.deleteMany();
  await Subreddit.insertMany(subreddits);
}

(async function () {
  console.log("Entered");

  await connectDatabase();

  await seedUsers();
  await seedCategories();
  await seedSubreddits();

  closeDatabaseConnection();
  console.log("✅ Seeds executed successfully");
})();
