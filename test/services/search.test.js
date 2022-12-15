import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  searchPosts,
  searchComments,
  searchUsers,
  searchSubreddits,
} from "../../services/search.js";
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
      viewName: "Subreddit",
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
      content: { text: "Comment 1" },
      ownerId: user._id,
      ownerUsername: user.username,
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

    comment2 = new Comment({
      parentId: post2._id,
      postId: post2._id,
      parentType: "post",
      level: 1,
      content: { text: "Comment 2" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 4,
      createdAt: Date.now(),
    });
    await comment2.save();

    comment3 = new Comment({
      parentId: post3._id,
      postId: post3._id,
      parentType: "post",
      level: 2,
      content: { text: "Comment 3" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 4,
      createdAt: Date.now(),
    });
    await comment3.save();

    user.posts.push(post1._id, post2._id, post3._id);
    user.commentedPosts.push(post1._id, post2._id, post3._id);
    await user.save();
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
});
