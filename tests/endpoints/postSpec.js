import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Subreddit from "../../models/Community.js";
import { generateJWT } from "../../utils/generateTokens.js";
import { hashPassword } from "../../utils/passwordUtils.js";
const request = supertest(app);

// eslint-disable-next-line max-statements
describe("Testing Post endpoints", () => {
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
  });

  let user, subreddit, token;
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
      createdAt: Date.now(),
    }).save();
    user.joinedSubreddits.push({
      subredditId: subreddit.id,
      name: subreddit.title,
    });
    await user.save();
  });

  it("Create post with invalid subreddit name", async () => {
    token = generateJWT(user);
    const postSubmission = {
      kind: "link",
      content: "reddit.com",
      title: "Second post (Test)",
      subreddit: "InvalidSubredditName",
      inSubreddit: true,
    };
    const response = await request
      .post("/submit")
      .send(postSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(404);
  });

  it("Create post with a missing kind (required parameter)", async () => {
    const postSubmission = {
      content: "reddit.com",
      title: "Third post (Test)",
      subreddit: subreddit.title,
      inSubreddit: true,
    };
    const response = await request
      .post("/submit")
      .send(postSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });

  it("Create post with an invalid token", async () => {
    const postSubmission = {
      kind: "link",
      content: "reddit.com",
      title: "Fourth post (Test)",
      subreddit: subreddit.title,
      inSubreddit: true,
    };
    const response = await request
      .post("/submit")
      .send(postSubmission)
      .set("Authorization", "Bearer " + "invalidToken");

    expect(response.status).toEqual(401);
  });

  it("Create post in an invalid subreddit", async () => {
    const postSubmission = {
      kind: "link",
      content: "reddit.com",
      title: "Fourth post (Test)",
      subreddit: "SR Not Found",
      inSubreddit: true,
    };
    const response = await request
      .post("/submit")
      .send(postSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(404);
  });

  it("Normally create a post with text content", async () => {
    const postSubmission = {
      kind: "hybrid",
      texts: [
        { text: "Post text", index: 0 },
        { text: "Another text", index: 1 },
      ],
      links: [
        { link: { title: "facebook", url: "https://facebook.com" }, index: 2 },
      ],
      title: "First post (Test)",
      subreddit: subreddit.title,
      inSubreddit: true,
    };
    const response = await request
      .post("/submit")
      .send(postSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(201);

    user = await User.findById(user.id);
    expect(user.posts.length).toEqual(1);
  });

  it("Normally create a post in the user account", async () => {
    const postSubmission = {
      kind: "hybrid",
      texts: [
        { text: "Post text", index: 0 },
        { text: "Another text", index: 1 },
        { text: "One more text", index: 2 },
      ],
      title: "User post (Test)",
      inSubreddit: false,
    };
    const response = await request
      .post("/submit")
      .send(postSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(201);

    user = await User.findById(user.id);
    expect(user.posts.length).toEqual(2);
  });

  it("Share a post without sharePostId", async () => {
    await Post.findOne({
      title: "First post (Test)",
    });
    const postSubmission = {
      kind: "post",
      title: "Second post (Test)",
      subreddit: subreddit.title,
      inSubreddit: true,
    };
    const response = await request
      .post("/submit")
      .send(postSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });

  it("Share a post without setting kind = post", async () => {
    let post = await Post.findOne({
      title: "First post (Test)",
    });
    const postSubmission = {
      kind: "hybrid",
      sharePostId: post.id.toString(),
      title: "Second post (Test)",
      subreddit: subreddit.title,
      inSubreddit: true,
    };
    const response = await request
      .post("/submit")
      .send(postSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });

  it("Share a post", async () => {
    let post = await Post.findOne({
      title: "First post (Test)",
    });
    const postSubmission = {
      kind: "post",
      sharePostId: post.id.toString(),
      title: "Second post (Test)",
      subreddit: subreddit.title,
      inSubreddit: true,
    };
    const response = await request
      .post("/submit")
      .send(postSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(201);
    post = await Post.findOne({
      title: "First post (Test)",
    });
    expect(post.insights.totalShares).toBeGreaterThan(0);
  });

  it("Pin a post with invalid ID", async () => {
    const response = await request
      .post("/pin-post")
      .send({
        id: "6369bd49355a4370412a212d",
        pin: true,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(404);
  });

  let post;
  it("Pin a post with invalid token", async () => {
    post = await Post.findOne({
      title: "First post (Test)",
    });
    const response = await request
      .post("/pin-post")
      .send({
        id: post.id.toString(),
        pin: true,
      })
      .set("Authorization", "Bearer " + "invalidToken");

    expect(response.status).toEqual(401);
  });

  it("Pin a post that a user doesn't own", async () => {
    post.ownerId = "6369bd49355a4370412a212d";
    await post.save();
    const response = await request
      .post("/pin-post")
      .send({
        id: post.id.toString(),
        pin: true,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(401);
  });

  it("Pin a post normally", async () => {
    post.ownerId = user.id;
    await post.save();
    const response = await request
      .post("/pin-post")
      .send({
        id: post.id.toString(),
        pin: true,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    const testUser = await User.findById(user.id);
    expect(
      testUser.pinnedPosts.find((postId) => postId.toString() === post.id)
    ).toBeTruthy();
  });

  it("Get pinned posts", async () => {
    const response = await request
      .get("/pinned-posts")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
  });

  it("Pin a post that has already been pinned", async () => {
    const response = await request
      .post("/pin-post")
      .send({
        id: post.id.toString(),
        pin: true,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(409);
  });

  it("Unpin a post", async () => {
    const response = await request
      .post("/pin-post")
      .send({
        id: post.id.toString(),
        pin: false,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    const testUser = await User.findById(user.id);
    expect(
      testUser.pinnedPosts.find((postId) => postId.toString() === post.id)
    ).toBeFalsy();
  });

  it("Unpin a post that has already been unpinned", async () => {
    const response = await request
      .post("/pin-post")
      .send({
        id: post.id.toString(),
        pin: false,
      })
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(409);
  });

  it("Get post insights by an unauthorized user", async () => {
    const response = await request
      .get("/post-insights")
      .send({
        id: post.id.toString(),
      })
      .set("Authorization", "Bearer " + "invalidUser");

    expect(response.status).toEqual(401);
  });

  it("Get post insights of a not-found post", async () => {
    const response = await request
      .get("/post-insights?id=6369bd49355a4370412a212d")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(404);
  });

  it("Get post insights normally", async () => {
    const response = await request
      .get("/post-insights?id=" + post.id.toString())
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
  });

  it("Get post details with an optional token", async () => {
    const response = await request
      .get("/post-details?id=" + post.id.toString())
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
  });

  it("Get post details without an optional token", async () => {
    const response = await request.get(
      "/post-details?id=" + post.id.toString()
    );

    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
  });

  it("Get post details of an invalid post id", async () => {
    const response = await request
      .get("/post-details?id=6369bd49355a4370412a212d")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(404);
  });

  it("Get post details without a post id", async () => {
    const response = await request
      .get("/post-details")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });
});
