/* eslint-disable max-len */
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  searchForComments,
  searchForPosts,
} from "../../services/searchInSubreddit";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Subreddit from "./../../models/Community.js";
import Comment from "./../../models/Comment.js";

// eslint-disable-next-line max-statements
describe("Testing Search Service functions", () => {
  let user = {},
    subreddit = {},
    post1 = {},
    comment1 = {},
    comment2 = {},
    comment3 = {},
    post4 = {},
    post2 = {},
    post3 = {};
  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit = await new Subreddit({
      title: "subreddit",
      viewName: "SR",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: "hamdy",
        userID: user.id,
      },
      createdAt: Date.now(),
    }).save();

    post1 = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
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
      ownerId: user._id,
      ownerUsername: user.username,
      subredditName: "subreddit",
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await comment1.save();

    post2 = new Post({
      title: "Second Post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 3,
      createdAt: Date.now(),
    });
    await post2.save();

    // user post
    post3 = new Post({
      title: "Third post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      numberOfVotes: 1,
      createdAt: Date.now(),
    });
    await post3.save();

    post4 = new Post({
      title: "Fourth Post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 3,
      createdAt: Date.now(),
    });
    await post4.save();

    comment2 = new Comment({
      parentId: post2._id,
      postId: post2._id,
      parentType: "post",
      level: 1,
      content: [{ insert: "Comment 2" }],
      ownerId: user._id,
      ownerUsername: user.username,
      subredditName: "subreddit",
      numberOfVotes: 4,
      createdAt: Date.now(),
    });
    await comment2.save();

    // user comment
    comment3 = new Comment({
      parentId: post3._id,
      postId: post3._id,
      parentType: "post",
      level: 1,
      content: [{ insert: "Comment 3" }],
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 4,
      createdAt: Date.now(),
    });
    await comment2.save();

    user.posts.push(post1._id, post2._id, post3._id);
    user.commentedPosts.push(post1._id, post2._id, post3._id);
    subreddit.subredditPosts.push(post1.id, post2.id, post4.id);
    await user.save();
    await subreddit.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Comment.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have searchForPosts defined", () => {
    expect(searchForPosts).toBeDefined();
  });

  it("Search for posts in a subreddit with an invalid query", async () => {
    const query = "not-found";
    const result = await searchForPosts(subreddit.title, query, {
      sort: "new",
    });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  it("Search for posts in a subreddit with a valid query & after", async () => {
    const query = "post";
    const result = await searchForPosts(subreddit.title, query, {
      sort: "old",
      after: post2.id.toString(),
    });
    expect(result.data.before).toEqual(post4.id.toString());
    expect(result.data.after).toEqual(post4.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Search for posts in a subreddit with a valid query & over-limit", async () => {
    const query = "post";
    const result = await searchForPosts(subreddit.title, query, { limit: 5 });
    expect(result.data.before).toEqual(post4.id.toString());
    expect(result.data.after).toEqual(post1.id.toString());
    expect(result.data.children.length).toEqual(3);
  });

  it("Search for posts in a subreddit & the user post shouldn't be returned", async () => {
    const query = "third";
    const result = await searchForPosts(subreddit.title, query, {
      sort: "new",
    });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  it("Search for posts in a subreddit with before & limit", async () => {
    const query = "post";
    const result = await searchForPosts(subreddit.title, query, {
      sort: "new",
      before: post1.id.toString(),
      limit: 1,
    });
    expect(result.data.before).toEqual(post2.id.toString());
    expect(result.data.after).toEqual(post2.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Search for posts in a subreddit with both after & before", async () => {
    const query = "post";
    const result = await searchForPosts(subreddit.title, query, {
      sort: "old",
      after: post1.id.toString(),
      before: post4.id.toString(),
    });
    expect(result.data.before).toEqual(post1.id.toString());
    expect(result.data.after).toEqual(post4.id.toString());
    expect(result.data.children.length).toEqual(3);
  });

  it("Should have searchForComments defined", () => {
    expect(searchForComments).toBeDefined();
  });

  it("Search for comments in a subreddit with an invalid query", async () => {
    const query = "not-found";
    const result = await searchForComments(subreddit.title, query, {
      sort: "new",
    });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  it("Search for comments in a subreddit with a valid query", async () => {
    const query = "comm";
    const result = await searchForComments(subreddit.title, query, {
      sort: "new",
    });
    expect(result.data.before).toEqual(comment2.id.toString());
    expect(result.data.after).toEqual(comment1.id.toString());
    expect(result.data.children.length).toEqual(2);
  });

  it("Search for comments in a subreddit with a valid query returning 1 comment", async () => {
    const query = "comment 1";
    const result = await searchForComments(subreddit.title, query, {
      sort: "new",
    });
    expect(result.data.before).toEqual(comment1.id.toString());
    expect(result.data.after).toEqual(comment1.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Search for comments in a subreddit with a valid query & after", async () => {
    const query = "comment";
    const result = await searchForComments(subreddit.title, query, {
      sort: "new",
      after: comment2.id.toString(),
    });
    expect(result.data.before).toEqual(comment1.id.toString());
    expect(result.data.after).toEqual(comment1.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  it("Search for comments in a subreddit with a valid query & before", async () => {
    const query = "comment";
    const result = await searchForComments(subreddit.title, query, {
      sort: "new",
      before: comment1.id.toString(),
    });
    expect(result.data.before).toEqual(comment2.id.toString());
    expect(result.data.after).toEqual(comment2.id.toString());
    expect(result.data.children.length).toEqual(1);
  });

  // eslint-disable-next-line max-len
  it("Search for comments in a subreddit with a valid query with both before & after & limit", async () => {
    const query = "comment";
    const result = await searchForComments(subreddit.title, query, {
      sort: "new",
      before: comment1.id.toString(),
      after: comment2.id.toString(),
      limit: 2,
    });
    expect(result.data.before).toEqual(comment2.id.toString());
    expect(result.data.after).toEqual(comment1.id.toString());
    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("Search for comments with a valid query with both before & limit returning empty results", async () => {
    const query = "comment";
    const result = await searchForComments(subreddit.title, query, {
      sort: "new",
      before: comment2.id.toString(),
      limit: 1,
    });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });
});
