/* eslint-disable max-len */
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  checkUserPinnedPosts,
  setPinnedPostsFlags,
  getPinnedPostDetails,
} from "../../services/getPinnedPosts.js";
import mongoose from "mongoose";
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
      dateOfCreation: Date.now(),
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

  it("Test checkUserPinnedPosts with no loggedIn user & username", async () => {
    try {
      await checkUserPinnedPosts(false);
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Username is needed");
    }
  });

  it("Test checkUserPinnedPosts with only a loggedIn user", async () => {
    const users = await checkUserPinnedPosts(true, loggedInUser.id.toString());
    expect(users.loggedInUser).toEqual(users.user);
  });

  it("Test checkUserPinnedPosts with the same loggedIn user & same username", async () => {
    const users = await checkUserPinnedPosts(
      true,
      loggedInUser.id.toString(),
      loggedInUser.username
    );
    expect(users.loggedInUser).toEqual(users.user);
  });

  it("Test checkUserPinnedPosts with the a loggedIn user & a different username", async () => {
    const users = await checkUserPinnedPosts(
      true,
      loggedInUser.id.toString(),
      user.username
    );
    expect(users.loggedInUser.username).toEqual(loggedInUser.username);
    expect(users.user.username).toEqual(user.username);
  });

  it("Test checkUserPinnedPosts with the a deleted LoggedIn user", async () => {
    try {
      loggedInUser.deletedAt = Date.now();
      await loggedInUser.save();
      await checkUserPinnedPosts(
        true,
        loggedInUser.id.toString(),
        loggedInUser.username
      );
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("User not found or may be deleted");
    }
  });

  it("Test checkUserPinnedPosts with the not-found visting user & loggedIn user ", async () => {
    try {
      loggedInUser.deletedAt = undefined;
      await loggedInUser.save();
      await checkUserPinnedPosts(
        true,
        loggedInUser.id.toString(),
        "invalidUsername"
      );
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("User not found or may be deleted");
    }
  });

  it("Test checkUserPinnedPosts with a not-found user", async () => {
    try {
      const invalidId = mongoose.Types.ObjectId.generate(10);
      await checkUserPinnedPosts(true, invalidId);
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("User not found or may be deleted");
    }
  });

  it("Test checkUserPinnedPosts with no loggedIn user but an invalid username given ", async () => {
    try {
      loggedInUser.deletedAt = undefined;
      await loggedInUser.save();
      await checkUserPinnedPosts(false, undefined, "invalidUsername");
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("User not found or may be deleted");
    }
  });

  it("Test checkUserPinnedPosts with no loggedIn user but a valid username given ", async () => {
    const result = await checkUserPinnedPosts(false, undefined, user.username);
    expect(result.loggedInUser.username).toEqual(user.username);
    expect(result.user.username).toEqual(user.username);
  });

  it("Should have setPinnedPostsFlags defined", () => {
    expect(setPinnedPostsFlags).toBeDefined();
  });

  it("Test setPinnedPostsFlags with another owner's post", async () => {
    const { vote, yourPost, inYourSubreddit } = setPinnedPostsFlags(
      loggedInUser,
      post1
    );
    expect(vote).toEqual(0);
    expect(yourPost).toEqual(false);
    expect(inYourSubreddit).toEqual(false);
  });

  it("Test setPinnedPostsFlags with my post", async () => {
    const { vote, yourPost, inYourSubreddit } = setPinnedPostsFlags(
      user,
      post1
    );
    expect(vote).toEqual(0);
    expect(yourPost).toEqual(true);
    expect(inYourSubreddit).toEqual(false);
  });

  it("Test setPinnedPostsFlags with my post & mod in subreddit", async () => {
    user.moderatedSubreddits.push({
      subredditId: subreddit.id,
      name: subreddit.title,
    });
    await user.save();
    const { vote, yourPost, inYourSubreddit } = setPinnedPostsFlags(
      user,
      post1
    );
    expect(vote).toEqual(0);
    expect(yourPost).toEqual(true);
    expect(inYourSubreddit).toEqual(true);
  });

  it("Test setPinnedPostsFlags with an upvoted post & my post", async () => {
    user.upvotedPosts.push(post2.id);
    await user.save();
    const { vote, yourPost, inYourSubreddit } = setPinnedPostsFlags(
      user,
      post2
    );
    expect(vote).toEqual(1);
    expect(yourPost).toEqual(true);
    expect(inYourSubreddit).toEqual(true);
  });

  it("Test setPinnedPostsFlags with a different downvoted post", async () => {
    loggedInUser.downvotedPosts.push(post2.id);
    await user.save();
    const { vote, yourPost, inYourSubreddit } = setPinnedPostsFlags(
      loggedInUser,
      post2
    );
    expect(vote).toEqual(-1);
    expect(yourPost).toEqual(false);
    expect(inYourSubreddit).toEqual(false);
  });

  it("Should have getPinnedPostDetails defined", () => {
    expect(getPinnedPostDetails).toBeDefined();
  });

  it("Test getPinnedPostDetails", async () => {
    const postObj = getPinnedPostDetails(post1, {
      vote: 0,
      yourPost: true,
      inYourSubreddit: true,
    });
    expect(postObj).toBeDefined();
    expect(postObj.title).toEqual(post1.title);
    expect(postObj.postedBy).toEqual(post1.ownerUsername);
  });
});
