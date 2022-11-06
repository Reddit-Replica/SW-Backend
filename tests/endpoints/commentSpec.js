import supertest from "supertest";
import app from "../../app.js";
import Post from "./../../models/Post.js";
import User from "../../models/User.js";
import { generateJWT } from "../../utils/generateTokens.js";

const request = supertest(app);

// eslint-disable-next-line max-statements
describe("Testing comment endpoints", () => {
  let post = {},
    user = {},
    token = "";

  beforeAll(async () => {
    user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user.save();

    token = generateJWT(user);

    post = new Post({
      title: "post title",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "text",
    });
    await post.save();
  });

  it("try to create comment without jwt in the header", async () => {
    const response = await request.post("/comment");
    expect(response.statusCode).toEqual(401);
  });

  it("try to create comment without text of the comment", async () => {
    const response = await request
      .post("/comment")
      .send({
        parentId: post._id,
        parentType: "post",
        level: 1,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(400);
  });

  it("try to create comment without parent id of the comment", async () => {
    const response = await request
      .post("/comment")
      .send({
        text: "Comment title",
        parentType: "post",
        level: 1,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(400);
  });

  it("try to create comment without parent type", async () => {
    const response = await request
      .post("/comment")
      .send({
        text: "Comment title",
        parentId: post._id,
        level: 1,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(400);
  });

  it("try to create comment without the level of the comment", async () => {
    const response = await request
      .post("/comment")
      .send({
        text: "Comment title",
        parentType: "post",
        parentId: post._id,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(400);
  });

  it("try to create comment with valid parameters", async () => {
    const response = await request
      .post("/comment")
      .send({
        text: "Comment title",
        parentType: "post",
        parentId: post._id,
        level: 1,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(201);
  });
});
