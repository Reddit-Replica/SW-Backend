export const posts = [];
let users, subreddits;

import { faker } from "@faker-js/faker";
import User from "../models/User.js";
import Subreddit from "../models/Community.js";

(async function () {
  users = await User.find({});
  subreddits = await Subreddit.find({});
})();

async function createRandomPost() {
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

Array.from({ length: 20 }).forEach(async () => {
  posts.push(await createRandomPost());
});
