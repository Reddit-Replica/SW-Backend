import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Subreddit from "../models/Community.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
dotenv.config();
import { faker } from "@faker-js/faker";
import { categories } from "./categories.js";
import Message from "../models/Message.js";
const DB_URL = process.env.MONGO_URL_SEED.trim();

export let userIds;
export let subredditsId;
// let users = [];

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
  Array.from({ length: 10 }).forEach(() => {
    users.push(createRandomUser());
  });
  return users;
}

async function seedUsers() {
  const users = createUsers();
  await User.deleteMany();
  const usersInserted = await User.insertMany(users);
  //  usersInserted.map((d) => d._id);
  // console.log(userIds);
  return usersInserted;
}

async function seedCategories() {
  await Category.deleteMany();
  const cateogries = await Category.insertMany(categories);
  return cateogries;
}

// let subreddits = [];

function createRandomSubreddit(users) {
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
function createSubreddits(users) {
  let subreddits = [];
  Array.from({ length: 5 }).forEach(() => {
    subreddits.push(createRandomSubreddit(users));
  });

  return subreddits;
}
async function seedSubreddits(users) {
  const subreddits = createSubreddits(users);
  await Subreddit.deleteMany();
  const subredditsCreated = await Subreddit.insertMany(subreddits);
  return subredditsCreated;
}

function createRandomPost(users, subreddits) {
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

function createPosts(users, subreddits) {
  let posts = [];
  Array.from({ length: 200 }).forEach(() => {
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
  i = Math.round(Math.random(0, users.length));
  do {
    j = Math.round(Math.random(0, users.length));
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
  Array.from({ length: 20 }).forEach(() => {
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
  const userIndex = Math.round(Math.random(0, users.length));
  const subredditIndex = Math.round(Math.random(0, subreddits.length));
  const postIndex = Math.round(Math.random(0, posts.length));
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
  Array.from({ length: 20 }).forEach(() => {
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
