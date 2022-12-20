import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/Category.js";
import { Categories } from "../services/categories.js";
import Subreddit from "../models/Community.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
dotenv.config();
import { faker } from "@faker-js/faker";
import { categories } from "./categories.js";
import Message from "../models/Message.js";
const DB_URL = process.env.MONGO_URL_SEED.trim();

const USERS_NUMBER = 5;
const POSTS_NUMBER = 200;
const MESSAGES_NUMBER = 200;
const SUBREDDITS_NUMBER = 20;
const COMMENTS_NUMBER = 200;

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

function createRandomUser() {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
  };
}
function createUsers() {
  const users = [];
  Array.from({ length: USERS_NUMBER }).forEach(() => {
    users.push(createRandomUser());
  });
  return users;
}

async function seedUsers() {
  const users = createUsers();
  await User.deleteMany();
  const usersInserted = await User.insertMany(users);
  return usersInserted;
}

async function seedCategories() {
  await Category.deleteMany();
  const cateogries = await Category.insertMany(categories);
  return cateogries;
}

let visitedCategories = [];

function createRandomSubreddit(users) {
  const userIndex = Math.floor(Math.random() * users.length);
  const categoryIndex = Math.floor(Math.random() * Categories.length);
  if (!visitedCategories.includes(Categories[categoryIndex])) {
    visitedCategories.push(Categories[categoryIndex]);
  }
  const randomDate = faker.date.past();
  const name = faker.internet.userName();
  return {
    title: name,
    viewName: name,
    category: categories[categoryIndex].name,
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
function createSubreddits(users) {
  let subreddits = [];
  Array.from({ length: SUBREDDITS_NUMBER }).forEach(() => {
    subreddits.push(createRandomSubreddit(users));
  });

  return subreddits;
}
async function seedSubreddits(users) {
  const subreddits = createSubreddits(users);
  await Subreddit.deleteMany();
  const subredditsCreated = await Subreddit.insertMany(subreddits);
  await Category.updateMany(
    { name: { $in: visitedCategories } },
    { $set: { visited: true } }
  );
  return subredditsCreated;
}

function createRandomPost(users, subreddits) {
  const userIndex = Math.floor(Math.random() * users.length);
  const subredditIndex = Math.floor(Math.random() * subreddits.length);
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

function createPosts(users, subreddits) {
  let posts = [];
  Array.from({ length: POSTS_NUMBER }).forEach(() => {
    posts.push(createRandomPost(users, subreddits));
  });
  return posts;
}

async function seedPosts(users, subreddits) {
  const posts = createPosts(users, subreddits);
  await Post.deleteMany();
  const postsCreated = await Post.insertMany(posts);
  return postsCreated;
}

function createRandomMessage(users) {
  let i, j;
  i = Math.floor(Math.random() * users.length);
  do {
    j = Math.floor(Math.random() * users.length);
  } while (i === j);
  return {
    text: faker.lorem.paragraph(),
    createdAt: faker.date.past(),
    receiverId: users[j].id,
    senderUsername: users[i].username,
    isSenderUser: true,
    receiverUsername: users[j].username,
    isReceiverUser: true,
    subject: faker.internet.userName(),
  };
}

function createMessages(users) {
  let messages = [];
  Array.from({ length: MESSAGES_NUMBER }).forEach(() => {
    messages.push(createRandomMessage(users));
  });
  return messages;
}

async function seedMessages(users) {
  const messages = createMessages(users);
  await Message.deleteMany();
  const messagesCreated = await Message.insertMany(messages);
  return messagesCreated;
}

function createRandomComment(users, subreddits, posts) {
  const userIndex = Math.floor(Math.random() * users.length);
  const postIndex = Math.floor(Math.random() * posts.length);
  return {
    parentId: posts[postIndex]._id,
    postId: posts[postIndex]._id,
    parentType: "post",
    level: 0,
    nsfw: "false",
    content: faker.hacker.phrase() + faker.hacker.phrase(),
    ownerUsername: users[userIndex].username,
    ownerId: users[userIndex]._id,
    createdAt: faker.date.past(),
  };
}

function createComments(users, subreddits, posts) {
  let comments = [];
  Array.from({ length: COMMENTS_NUMBER }).forEach(() => {
    comments.push(createRandomComment(users, subreddits, posts));
  });
  return comments;
}

async function seedComments(users, subreddits, posts) {
  const comments = createComments(users, subreddits, posts);
  await Comment.deleteMany();
  const commentsCreated = await Comment.insertMany(comments);
  return commentsCreated;
}

(async function () {
  console.log("Entered");

  await connectDatabase();

  const users = await seedUsers();
  // users = await User.find({});
  const categories = await seedCategories();
  const subreddits = await seedSubreddits(users);
  // subreddits = await Subreddit.find({});
  const posts = await seedPosts(users, subreddits);
  const comments = await seedComments(users, subreddits, posts);
  const messages = await seedMessages(users);

  closeDatabaseConnection();
  console.log("✅ Seeds executed successfully");
})();
