export const posts = [];

import { faker } from "@faker-js/faker";
import User from "../models/User.js";
import Subreddit from "../models/Community.js";

async function createRandomPost() {
  const users = await User.find({});
  const subreddits = await Subreddit.find({});
  const userIndex = Math.round(Math.random(0, users.length));
  const subredditIndex = Math.round(Math.random(0, subreddits.length));
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

Array.from({ length: 3 }).forEach(async () => {
  posts.push(await createRandomPost());
});
