import supertest from "supertest";
import app from "../../app.js";
import Post from "./../../models/Post.js";
import User from "../../models/User.js";
import Comment from "../../models/Comment.js";
import Subreddit from "../../models/Community.js";
import { generateJWT } from "../../utils/generateTokens.js";

const request = supertest(app);

// eslint-disable-next-line max-statements
describe("Testing comment endpoints", () => {
  let post = {},
    user = {},
    subreddit = {},
    token = "";

  beforeAll(async () => {
    user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
      createdAt: Date.now(),
    });
    await user.save();

    token = generateJWT(user);

    post = new Post({
      title: "post title",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      createdAt: Date.now(),
    });
    await post.save();

    subreddit = new Subreddit({
      type: "public",
      title: "funny",
      category: "fun",
      viewName: "LOL",
      owner: {
        username: user.username,
        userID: user._id,
      },
      createdAt: Date.now(),
    });
    await subreddit.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
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
        subredditName: "funny",
        haveSubreddit: true,
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
        subredditName: "funny",
        haveSubreddit: true,
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
        subredditName: "funny",
        haveSubreddit: true,
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
        subredditName: "funny",
        haveSubreddit: true,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(400);
  });

  it("try to create comment without haveSubreddit bool in body", async () => {
    const response = await request
      .post("/comment")
      .send({
        text: "Comment title",
        parentType: "post",
        parentId: post._id,
        level: 1,
        subredditName: "funny",
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(400);
  });

  it("try to create comment with invalid parent type", async () => {
    const response = await request
      .post("/comment")
      .send({
        text: "Comment title",
        parentType: "invalid",
        parentId: post._id,
        level: 1,
        subredditName: "funny",
        haveSubreddit: true,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(400);
  });

  it("try to create comment with subreddit dose not exist", async () => {
    const response = await request
      .post("/comment")
      .send({
        text: "Comment title",
        parentType: "post",
        parentId: post._id,
        level: 1,
        subredditName: "invalid",
        haveSubreddit: true,
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
        postId: post._id,
        level: 1,
        subredditName: "funny",
        haveSubreddit: true,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(201);
  });

  it("try to create comment to post without subreddit", async () => {
    const response = await request
      .post("/comment")
      .send({
        text: "Comment title",
        parentType: "post",
        parentId: post._id,
        postId: post._id,
        level: 1,
        haveSubreddit: false,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(201);
  });
});
