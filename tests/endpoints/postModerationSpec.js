import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Subreddit from "../../models/Community.js";
import { generateJWT } from "../../utils/generateTokens.js";
import { hashPassword } from "../../utils/passwordUtils.js";
const request = supertest(app);

// eslint-disable-next-line max-statements
fdescribe("Testing Post Moderation endpoints", () => {
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
  });

  let user, subreddit, token, post;
  beforeAll(async () => {
    user = await new User({
      username: "Hamdy",
      email: "abdelrahmanhamdy49@gmail.com",
      password: hashPassword("12345678"),
    }).save();
    const owner = {
      username: user.username,
      userId: user.id,
    };
    subreddit = await new Subreddit({
      title: "TestSW",
      category: "Software",
      type: "private",
      owner: owner,
    }).save();
    subreddit.moderators = [
      {
        username: user.username,
        userId: user.id,
      },
    ];
    await subreddit.save();
    post = await new Post({
      kind: "text",
      title: "Post Title",
      subredditName: subreddit.title,
      ownerId: user.id,
      ownerUsername: user.username,
    }).save();
    token = generateJWT(user);
  });

  it("Approve a post with an invalid id", async () => {
    const approveSubmission = {
      id: "63681e743f50c82c938abf97",
      type: "post",
    };
    const response = await request
      .post("/approve")
      .send(approveSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual("Post not found");
  });

  it("Approve a post with an invalid token", async () => {
    const approveSubmission = {
      id: post.id.toString(),
      type: "post",
    };
    const response = await request
      .post("/approve")
      .send(approveSubmission)
      .set("Authorization", "Bearer " + "invalidToken");

    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual("Invalid Token");
  });

  it("Approve a post from a user who isn't a mod", async () => {
    const testUser = await new User({
      username: "Ahmed",
    }).save();
    const testToken = generateJWT(testUser);
    const approveSubmission = {
      id: post.id.toString(),
      type: "post",
    };
    const response = await request
      .post("/approve")
      .send(approveSubmission)
      .set("Authorization", "Bearer " + testToken);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual("User is not a mod in this subreddit");
  });

  it("Approve a post with missing type", async () => {
    const approveSubmission = {
      id: post.id.toString(),
    };
    const response = await request
      .post("/approve")
      .send(approveSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });

  it("Approve a post correctly", async () => {
    const approveSubmission = {
      id: post.id.toString(),
      type: "post",
    };

    const response = await request
      .post("/approve")
      .send(approveSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
  });

  it("Approve an already approved post", async () => {
    const approveSubmission = {
      id: post.id.toString(),
      type: "post",
    };

    const response = await request
      .post("/approve")
      .send(approveSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual("Post is already approved");
  });
});
