import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import { generateJWT } from "../../utils/generateTokens.js";

const request = supertest(app);

// eslint-disable-next-line max-statements
describe("Testing user actions endpoints", () => {
  let user1 = {},
    user2 = {},
    token1 = "";
  beforeAll(async () => {
    user1 = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user1.save();
    token1 = generateJWT(user1);

    user2 = new User({
      username: "Besho",
      email: "beshoy@gmail.com",
    });
    await user2.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("try to block user without token in the header", async () => {
    const response = await request.post("/block-user").send({
      block: true,
      username: "Besho",
    });
    expect(response.statusCode).toEqual(401);
  });
  it("try to follow user without token in the header", async () => {
    const response = await request.post("/follow-user").send({
      follow: true,
      username: "Besho",
    });
    expect(response.statusCode).toEqual(401);
  });

  it("try to block a user that does not exist", async () => {
    const response = await request
      .post("/block-user")
      .send({
        block: true,
        username: "Philip",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(404);
  });
  it("try to follow a user that does not exist", async () => {
    const response = await request
      .post("/follow-user")
      .send({
        follow: true,
        username: "Philip",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(404);
  });

  it("try to let the user block himself", async () => {
    const response = await request
      .post("/block-user")
      .send({
        block: true,
        username: "Beshoy",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });
  it("try to let the user follow himself", async () => {
    const response = await request
      .post("/follow-user")
      .send({
        follow: true,
        username: "Beshoy",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });

  it("try to block user without username in body", async () => {
    const response = await request
      .post("/block-user")
      .send({
        block: true,
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });
  it("try to block user without block boolean in body", async () => {
    const response = await request
      .post("/block-user")
      .send({
        username: "Beshoy",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });

  it("try to follow user without username in body", async () => {
    const response = await request
      .post("/follow-user")
      .send({
        follow: true,
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });
  it("try to follow user without follow boolean in body", async () => {
    const response = await request
      .post("/follow-user")
      .send({
        username: "Beshoy",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });

  it("try to block user with all valid parameters", async () => {
    const response = await request
      .post("/block-user")
      .send({
        block: true,
        username: "Besho",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(200);
  });
  it("try to unblock user with all valid parameters", async () => {
    const response = await request
      .post("/block-user")
      .send({
        block: false,
        username: "Besho",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(200);
  });

  it("try to follow user with all valid parameters", async () => {
    const response = await request
      .post("/follow-user")
      .send({
        follow: true,
        username: "Besho",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(200);
  });
  it("try to unfollow user with all valid parameters", async () => {
    const response = await request
      .post("/follow-user")
      .send({
        follow: false,
        username: "Besho",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(200);
  });
});
