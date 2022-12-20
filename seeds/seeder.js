import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/Category.js";
dotenv.config();
import { users } from "./users.js";
import { categories } from "./categories.js";

const DB_URL = process.env.MONGO_URL_SEED.trim();

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
  await User.insertMany(users);
}

async function seedCategories() {
  await Category.deleteMany();
  await Category.insertMany(categories);
}

(async function () {
  console.log("Entered");

  await connectDatabase();

  await seedUsers();
  await seedCategories();

  closeDatabaseConnection();
  console.log("✅ Seeds executed successfully");
})();
