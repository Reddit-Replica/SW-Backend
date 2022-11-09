import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
const request = supertest(app);

// eslint-disable-next-line max-statements
describe("Testing Generating random usernames", () => {
  it("Generate random username", async () => {
    const response = await request.get("/random-username");
    const username1 = response.body.username;
    const response2 = await request.get("/random-username");
    const username2 = response2.body.username;
    expect(username1).not.toEqual(username2);
  });
});
