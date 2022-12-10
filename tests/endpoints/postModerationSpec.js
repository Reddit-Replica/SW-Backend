import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Subreddit from "../../models/Community.js";
import { generateJWT } from "../../utils/generateTokens.js";
import { hashPassword } from "../../utils/passwordUtils.js";
import Comment from "../../models/Comment.js";
const request = supertest(app);

// eslint-disable-next-line max-statements
describe("Testing Post Moderation endpoints", () => {
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
  });

  let user, subreddit, token, post, comment;
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
    comment = await new Comment({
      parentId: post.id,
      parentType: "post",
      content: "Post Comment",
      ownerId: user.id,
      ownerUsername: user.username,
      level: 1,
      createdAt: Date.now(),
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
    const testPost = await Post.findById(post.id);
    expect(testPost.moderation.approve.approvedBy).toEqual(user.username);
    expect(testPost.moderation.remove.removedBy).toBeUndefined();
  });

  it("Approve a user comment correctly", async () => {
    const approveSubmission = {
      id: comment.id.toString(),
      type: "comment",
    };

    const response = await request
      .post("/approve")
      .send(approveSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    const testComment = await Comment.findById(comment.id);
    expect(testComment.moderation.approve.approvedBy).toEqual(user.username);
    expect(testComment.moderation.remove.removedBy).toBeUndefined();
  });

  it("Approve a comment in a subreddit correctly", async () => {
    const subredditComment = await new Comment({
      parentId: post.id,
      parentType: "post",
      subredditName: "TestSW",
      content: "Post Comment",
      ownerId: user.id,
      ownerUsername: user.username,
      level: 2,
      createdAt: Date.now(),
    }).save();
    const approveSubmission = {
      id: subredditComment.id.toString(),
      type: "comment",
    };

    const response = await request
      .post("/approve")
      .send(approveSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    const testComment = await Comment.findById(subredditComment.id);
    expect(testComment.moderation.approve.approvedBy).toEqual(user.username);
    expect(testComment.moderation.remove.removedBy).toBeUndefined();
  });

  it("Approve a post in a user account (not subreddit)", async () => {
    const userPost = await new Post({
      kind: "text",
      title: "User Post Title",
      ownerId: user.id,
      ownerUsername: user.username,
    }).save();
    const approveSubmission = {
      id: userPost.id.toString(),
      type: "post",
    };

    const response = await request
      .post("/approve")
      .send(approveSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    const testPost = await Post.findById(userPost.id);
    expect(testPost.moderation.approve.approvedBy).toEqual(user.username);
    expect(testPost.moderation.remove.removedBy).toBeUndefined();
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

  it("Remove a post correctly", async () => {
    const removeSubmission = {
      id: post.id.toString(),
      type: "post",
    };

    const response = await request
      .post("/remove")
      .send(removeSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    const testPost = await Post.findById(post.id);
    expect(testPost.moderation.remove.removedBy).toEqual(user.username);
    expect(testPost.moderation.approve.approvedBy).toBeUndefined();
  });

  it("Remove an already removed post", async () => {
    const removeSubmission = {
      id: post.id.toString(),
      type: "post",
    };

    const response = await request
      .post("/remove")
      .send(removeSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual("Post is already removed");
  });

  it("Lock a post correctly", async () => {
    const lockSubmission = {
      id: post.id.toString(),
      type: "post",
    };

    const response = await request
      .post("/lock")
      .send(lockSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    const testPost = await Post.findById(post.id);
    expect(testPost.moderation.lock).toEqual(true);
  });

  it("Lock an already locked post", async () => {
    const lockSubmission = {
      id: post.id.toString(),
      type: "post",
    };

    const response = await request
      .post("/lock")
      .send(lockSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual("Post is already locked");
  });

  it("Unlock a post correctly", async () => {
    const unlockSubmission = {
      id: post.id.toString(),
      type: "post",
    };

    const response = await request
      .post("/unlock")
      .send(unlockSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    const testPost = await Post.findById(post.id);
    expect(testPost.moderation.lock).toEqual(false);
  });

  it("Unlock an already unlocked post", async () => {
    const unlockSubmission = {
      id: post.id.toString(),
      type: "post",
    };

    const response = await request
      .post("/unlock")
      .send(unlockSubmission)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual("Post is already unlocked");
  });
});
