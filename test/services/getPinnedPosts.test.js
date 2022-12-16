/* eslint-disable max-len */
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  checkUserPinnedPosts,
  setPinnedPostsFlags,
  getPinnedPostDetails,
} from "../../services/getPinnedPosts.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Subreddit from "./../../models/Community.js";

// eslint-disable-next-line max-statements
describe("Testing Pinned Posts Service functions", () => {
  let loggedInUser = {},
    user = {},
    subreddit = {},
    post1 = {},
    post4 = {},
    post2 = {},
    post3 = {};
  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    loggedInUser = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    user = await new User({
      username: "ahmed",
      email: "ahmed@gmail.com",
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
        userID: loggedInUser.id,
      },
      createdAt: Date.now(),
    }).save();

    post1 = new Post({
      title: "First post",
      ownerUsername: loggedInUser.username,
      ownerId: loggedInUser._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await post1.save();

    post2 = new Post({
      title: "Second Post",
      ownerUsername: loggedInUser.username,
      ownerId: loggedInUser._id,
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

    user.posts.push(post1._id, post2._id, post3._id);
    loggedInUser.posts.push(post4._id);

    loggedInUser.pinnedPosts.push(post1._id, post2._id, post4._id);
    user.pinnedPosts.push(post3._id);
    await user.save();
    await loggedInUser.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have checkUserPinnedPosts defined", () => {
    expect(checkUserPinnedPosts).toBeDefined();
  });

  it("Test checkUserPinnedPosts for same loggedIn user & user", async () => {});
});
