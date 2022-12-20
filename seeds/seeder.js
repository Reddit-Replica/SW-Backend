import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Subreddit from "../models/Community.js";
import Post from "../models/Post.js";
dotenv.config();
import { faker } from "@faker-js/faker";
import { categories } from "./categories.js";
const DB_URL = process.env.MONGO_URL_SEED.trim();

export let userIds;
export let subredditsId;
let users = [];

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

let subreddits = [];

function createRandomSubreddit() {
  const userIndex = Math.round(Math.random(0, 10));
  const randomDate = faker.date.past();
  const name = faker.internet.userName();
  return {
    title: name,
    viewName: name,
    category: categories[Math.round(Math.random(0, 5))].name,
    type: "Public",
    nsfw: "false",
    owner: {
      userID: users[userIndex]._id,
      username: users[userIndex].username,
    },
    dateOfCreation: randomDate,
    joinedUsers: [{ joinDate: randomDate, userID: users[userIndex]._id }],
    approvedUsers: [
      { dateOfApprove: randomDate, userID: users[userIndex]._id },
    ],
  };
}

Array.from({ length: 5 }).forEach(() => {
  subreddits.push(createRandomSubreddit());
});

async function seedSubreddits() {
  await Subreddit.deleteMany();
  await Subreddit.insertMany(subreddits);
}

async function createRandomPost() {
  const userIndex = Math.round(Math.random(0, 10));
  const subredditIndex = Math.round(Math.random(0, 5));
  return {
    kind: "link",
    ownerUsername: users[userIndex].username,
    ownerId: users[userIndex]._id,
    subredditName: subreddits[subredditIndex].title,
    subredditId: subreddits[subredditIndex]._id,
    title: faker.internet.userName(),
    link: faker.internet.url(),
    createdAt: faker.date.past(),
  };
}
let posts = [];

Array.from({ length: 20 }).forEach(async () => {
  posts.push(await createRandomPost());
});

async function seedPosts() {
  await Post.deleteMany();
  await Post.insertMany(posts);
}

(async function () {
  console.log("Entered");

  await connectDatabase();

  await seedUsers();
  users = await User.find({});
  await seedCategories();
  await seedSubreddits();
  subreddits = await Subreddit.find({});
  await seedPosts();

  closeDatabaseConnection();
  console.log("✅ Seeds executed successfully");
})();
