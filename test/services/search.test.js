import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  searchPosts,
  searchComments,
  searchUsers,
  searchSubreddits,
  getLoggedInUser,
  filterHiddenPosts,
} from "../../services/search.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Subreddit from "./../../models/Community.js";
import Comment from "./../../models/Comment.js";
import mongoose from "mongoose";

// eslint-disable-next-line max-statements
describe("Testing Search Service functions", () => {
  let user1 = {},
    user2 = {},
    subreddit1 = {},
    subreddit2 = {},
    post1 = {},
    comment1 = {},
    comment2 = {},
    comment3 = {},
    post2 = {},
    post3 = {};
  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    user1 = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    user2 = await new User({
      username: "ahmed",
      displayName: "HAMDY",
      email: "ahmed@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit1 = await new Subreddit({
      title: "subreddit1",
      viewName: "SR",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: "hamdy",
        userID: user1.id,
      },
      createdAt: Date.now(),
    }).save();

    subreddit2 = await new Subreddit({
      title: "subreddit2",
      viewName: "SRVIEW",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: "hamdy",
        userID: user1.id,
      },
      createdAt: Date.now(),
    }).save();

    post1 = new Post({
      title: "First post",
      ownerUsername: user1.username,
      ownerId: user1._id,
      subredditName: "subreddit1",
      kind: "hybrid",
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await post1.save();

    comment1 = new Comment({
      parentId: post1._id,
      postId: post1._id,
      parentType: "post",
      level: 1,
      content: [{ insert: "Comment 1" }],
      ownerId: user1._id,
      ownerUsername: user1.username,
      subredditName: "subreddit1",
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await comment1.save();

    post2 = new Post({
      title: "Second Post",
      ownerUsername: user1.username,
      ownerId: user1._id,
      subredditName: "subreddit1",
      kind: "hybrid",
      numberOfVotes: 3,
      createdAt: Date.now() + 10,
    });
    await post2.save();

    // user post
    post3 = new Post({
      title: "Third post",
      ownerUsername: user1.username,
      ownerId: user1._id,
      kind: "hybrid",
      numberOfVotes: 1,
      createdAt: Date.now() + 20,
    });
    await post3.save();

    comment2 = new Comment({
      parentId: post2._id,
      postId: post2._id,
      parentType: "post",
      level: 1,
      content: [{ insert: "Comment 2" }],
      ownerId: user1._id,
      ownerUsername: user1.username,
      subredditName: "subreddit1",
      numberOfVotes: 4,
      createdAt: Date.now() + 10,
    });
    await comment2.save();

    comment3 = new Comment({
      parentId: post3._id,
      postId: post3._id,
      parentType: "post",
      level: 2,
      content: [{ insert: "Comment 3" }],
      ownerId: user1._id,
      ownerUsername: user1.username,
      numberOfVotes: 4,
      createdAt: Date.now() + 20,
    });
    await comment3.save();

    user1.posts.push(post1._id, post2._id, post3._id);
    user1.commentedPosts.push(post1._id, post2._id, post3._id);
    await user1.save();
    await user2.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Comment.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have searchPosts defined", () => {
    expect(searchPosts).toBeDefined();
  });

  it("Search for posts with an invalid query", async () => {
    const query = "not-found";
    const result = await searchPosts(query, { sort: "new" });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  it("Search for posts with a valid query returning 1 post", async () => {
    const query = "first";
    const result = await searchPosts(query, { sort: "new" });
    expect(result.data.before).toEqual(post1.id.toString());
    expect(result.data.after).toEqual(post1.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Search for posts with a valid query returning > 1 post", async () => {
    const query = "post";
    const result = await searchPosts(query, { sort: "new" });
    expect(result.data.before).toEqual(post3.id.toString());
    expect(result.data.after).toEqual(post1.id.toString());
    expect(result.data.children.length).toEqual(3);
  });

  it("Search for posts with after", async () => {
    const query = "post";
    const result = await searchPosts(query, {
      sort: "new",
      after: post2.id.toString(),
    });
    expect(result.data.before).toEqual(post1.id.toString());
    expect(result.data.after).toEqual(post1.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Search for posts with before", async () => {
    const query = "post";
    const result = await searchPosts(query, {
      sort: "new",
      before: post1.id.toString(),
    });
    expect(result.data.before).toEqual(post3.id.toString());
    expect(result.data.after).toEqual(post2.id.toString());
    expect(result.data.children.length).toEqual(2);
  });

  it("Search for posts with old sort", async () => {
    const query = "post";
    const result = await searchPosts(query, {
      sort: "old",
      after: post1.id.toString(),
    });
    expect(result.data.before).toEqual(post2.id.toString());
    expect(result.data.after).toEqual(post3.id.toString());
    expect(result.data.children.length).toEqual(2);
  });

  it("Should have searchComments defined", () => {
    expect(searchComments).toBeDefined();
  });

  it("Search for comments with an invalid query", async () => {
    const query = "not-found";
    const result = await searchComments(query, { sort: "new" });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  it("Search for comments with a valid query", async () => {
    const query = "comm";
    const result = await searchComments(query, { sort: "new" });
    expect(result.data.before).toEqual(comment3.id.toString());
    expect(result.data.after).toEqual(comment1.id.toString());
    expect(result.data.children.length).toEqual(3);
  });

  it("Search for comments with a valid query returning 1 comment", async () => {
    const query = "comment 1";
    const result = await searchComments(query, { sort: "new" });
    expect(result.data.before).toEqual(comment1.id.toString());
    expect(result.data.after).toEqual(comment1.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Search for comments with a valid query with after", async () => {
    const query = "comment";
    const result = await searchComments(query, {
      sort: "new",
      after: comment2.id.toString(),
    });
    expect(result.data.before).toEqual(comment1.id.toString());
    expect(result.data.after).toEqual(comment1.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Search for comments with a valid query with before", async () => {
    const query = "comment";
    const result = await searchComments(query, {
      sort: "new",
      before: comment1.id.toString(),
    });
    expect(result.data.before).toEqual(comment3.id.toString());
    expect(result.data.after).toEqual(comment2.id.toString());
    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("Search for comments with a valid query with both before & after & limit", async () => {
    const query = "comment";
    const result = await searchComments(query, {
      sort: "new",
      before: comment1.id.toString(),
      after: comment3.id.toString(),
      limit: 2,
    });
    expect(result.data.before).toEqual(comment3.id.toString());
    expect(result.data.after).toEqual(comment2.id.toString());
    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("Search for comments with a valid query with both before & limit", async () => {
    const query = "comment";
    const result = await searchComments(query, {
      sort: "new",
      before: comment1.id.toString(),
      limit: 1,
    });
    expect(result.data.before).toEqual(comment2.id.toString());
    expect(result.data.after).toEqual(comment2.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Should have searchUsers defined", () => {
    expect(searchUsers).toBeDefined();
  });

  it("Search for users with an invalid query", async () => {
    const query = "not-found";
    const result = await searchUsers(query, { limit: 3 });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  it("Search for users with a valid query", async () => {
    const query = "hamdy";
    const result = await searchUsers(query, { limit: 3 });
    expect(result.data.before).toEqual(user1.id.toString());
    expect(result.data.after).toEqual(user2.id.toString());
    expect(result.data.children.length).toEqual(2);
  });

  it("Search for users with a valid query returning 1 user", async () => {
    const query = "ahmed";
    const result = await searchUsers(query, { limit: 3 });
    expect(result.data.before).toEqual(user2.id.toString());
    expect(result.data.after).toEqual(user2.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  // eslint-disable-next-line max-len
  it("Search for users with a valid query with after & over-limit", async () => {
    const query = "DY";
    const result = await searchUsers(query, {
      after: user1.id.toString(),
      limit: 3,
    });
    expect(result.data.before).toEqual(user2.id.toString());
    expect(result.data.after).toEqual(user2.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Search for users with a valid query with before", async () => {
    const query = "H";
    const result = await searchUsers(query, {
      before: user1.id.toString(),
    });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  // eslint-disable-next-line max-len
  it("Search for users with a valid query with both before & limit", async () => {
    const query = "ham";
    const result = await searchUsers(query, {
      before: user2.id.toString(),
      limit: 1,
    });
    expect(result.data.before).toEqual(user1.id.toString());
    expect(result.data.after).toEqual(user1.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Should have searchSubreddits defined", () => {
    expect(searchSubreddits).toBeDefined();
  });

  it("Search for subreddits with an invalid query", async () => {
    const query = "not-found";
    const result = await searchSubreddits(query, { limit: 3 });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  it("Search for subreddits with a valid query", async () => {
    const query = "sr";
    const result = await searchSubreddits(query, { limit: 3 });
    expect(result.data.before).toEqual(subreddit1.id.toString());
    expect(result.data.after).toEqual(subreddit2.id.toString());
    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("Search for subreddits with a valid query returning 1 subreddit", async () => {
    const query = "view";
    const result = await searchSubreddits(query, { limit: 2 });
    expect(result.data.before).toEqual(subreddit2.id.toString());
    expect(result.data.after).toEqual(subreddit2.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  // eslint-disable-next-line max-len
  it("Search for subreddits with a valid query with after & over-limit", async () => {
    const query = "subreddit";
    const result = await searchSubreddits(query, {
      after: subreddit1.id.toString(),
      limit: 3,
    });
    expect(result.data.before).toEqual(subreddit2.id.toString());
    expect(result.data.after).toEqual(subreddit2.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Search for subreddits with a valid query with before", async () => {
    const query = "subreddit";
    const result = await searchSubreddits(query, {
      before: subreddit1.id.toString(),
    });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  // eslint-disable-next-line max-len
  it("Search for subreddits with a valid query with both before & limit", async () => {
    const query = "SR";
    const result = await searchSubreddits(query, {
      before: subreddit2.id.toString(),
      limit: 1,
    });
    expect(result.data.before).toEqual(subreddit1.id.toString());
    expect(result.data.after).toEqual(subreddit1.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Should have getLoggedInUser defined", () => {
    expect(getLoggedInUser).toBeDefined();
  });

  it("Get a logged in user given an ID", async () => {
    const userId = user1.id.toString();
    const result = await getLoggedInUser(userId);
    expect(result).toBeTruthy();
  });

  it("Get a not-found user", async () => {
    // eslint-disable-next-line new-cap
    const userId = mongoose.Types.ObjectId("569ed8269353e9f4c51617aa");
    const result = await getLoggedInUser(userId);
    expect(result).toBeFalsy();
  });

  it("Test filterHiddenPosts", async () => {
    user1.hiddenPosts.push(post1.id);
    await user1.save();
    let result = [post1, post2, post3];
    result = filterHiddenPosts(result, user1);
    expect(result.length).toEqual(2);
  });
});
