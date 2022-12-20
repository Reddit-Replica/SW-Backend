import { faker } from "@faker-js/faker";
import { users } from "./users.js";
import { subreddits } from "./subreddits.js";

export const posts = [];

function createRandomPost() {
  const randomUserIndex = Math.round(Math.random() * users.length);
  const randomSubredditIndex = Math.round(Math.random() * subreddits.length);
  return {
    kind: "link",
    ownerUsername: users[randomUserIndex].username,
    ownerId: users[randomUserIndex].id,
    subredditName: subreddits[randomSubredditIndex].title,
    subredditId: subreddits[randomSubredditIndex].id,
    title: faker.internet.userName(),
    link: faker.internet.url(),
    createdAt: faker.date.past(),
  };
}

Array.from({ length: 20 }).forEach(() => {
  posts.push(createRandomPost());
});
