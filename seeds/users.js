import { faker } from "@faker-js/faker";

export const users = [];
function createRandomUser() {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
  };
}

Array.from({ length: 10 }).forEach(() => {
  users.push(createRandomUser());
});
