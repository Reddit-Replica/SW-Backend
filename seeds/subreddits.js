export const subreddits = [];

import { faker } from "@faker-js/faker";
import { categories } from "./categories.js";
import { users } from "./users.js";
export function createRandomSubreddit() {
  const userIndex = Math.round(Math.random(0, 10));
  const randomDate = faker.date.past();
  console.log(randomDate);
  console.log(randomDate.toISOString());
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
