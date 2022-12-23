/* eslint-disable max-len */
import { jest } from "@jest/globals";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  checkPostExistence,
  setPostActions,
  getPostDetails,
} from "../../middleware/postDetails.js";
import User from "../../models/User.js";
import Subreddit from "../../models/Community.js";
import Post from "../../models/Post.js";

// eslint-disable-next-line max-statements
describe("Testing Post Details middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  let user = {};
  let post = {};
  let subreddit = {};

  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    post = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      numberOfVotes: 5,
      subredditName: "subreddit",
      hotScore: 10,
      numberOfViews: 10,
      createdAt: Date.now(),
    });
    await post.save();

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
      dateOfCreation: Date.now(),
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Subreddit.deleteMany({});
    await closeDatabaseConnection();
  });

  beforeEach(() => {
    nextFunction = jest.fn();
    mockRequest = {};
    mockResponse = {
      status: () => {
        jest.fn();
        return mockResponse;
      },
      json: () => {
        jest.fn();
        return mockResponse;
      },
    };
  });

  it("should have checkPostExistence function", () => {
    expect(checkPostExistence).toBeDefined();
  });

  it("Test checkPostExistence with an invalid id", async () => {
    mockRequest = {
      query: {
        id: "invalidID",
      },
    };
    await checkPostExistence(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
  });

  it("Test checkPostExistence with a deleted post", async () => {
    post.deletedAt = Date.now();
    await post.save();
    mockRequest = {
      query: {
        id: post.id,
      },
    };
    await checkPostExistence(mockRequest, mockResponse, nextFunction);
    post.deletedAt = undefined;
    await post.save();
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
  });

  it("Test checkPostExistence with an existing post", async () => {
    mockRequest = {
      query: {
        id: post.id,
      },
    };
    await checkPostExistence(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post.id.toString()).toEqual(post.id.toString());
  });

  it("should have setPostActions function", () => {
    expect(setPostActions).toBeDefined();
  });

  it("Test setPostActions for a logged out user", async () => {
    mockRequest = {
      loggedIn: false,
      query: {},
    };
    await setPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.saved).toBeFalsy();
  });

  it("Test setPostActions for an invalid user ID", async () => {
    mockRequest = {
      loggedIn: true,
      query: {},
      userId: "invalidID",
    };
    await setPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test setPostActions for a deleted user", async () => {
    user.deletedAt = Date.now();
    await user.save();
    mockRequest = {
      loggedIn: true,
      query: {},
      userId: user.id,
    };
    await setPostActions(mockRequest, mockResponse, nextFunction);
    user.deletedAt = undefined;
    await user.save();
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test setPostActions for a server error", async () => {
    mockRequest = {
      userId: user.id,
      loggedIn: true,
    };
    await setPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test setPostActions with no flags set", async () => {
    user.historyPosts = [post.id];
    await user.save();
    mockRequest = {
      query: {
        id: post.id.toString(),
      },
      post: post,
      userId: user.id,
      loggedIn: true,
    };
    await setPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("Test setPostActions with all flags set", async () => {
    user.historyPosts = [];
    user.savedPosts.push(post.id);
    user.followedPosts.push(post.id);
    user.hiddenPosts.push(post.id);
    user.upvotedPosts.push(post.id);
    user.downvotedPosts.push(post.id);
    user.spammedPosts.push(post.id);
    user.savedPosts.push(post.id);
    user.moderatedSubreddits.push({
      subredditId: subreddit.id,
      name: subreddit.title,
    });
    await user.save();
    mockRequest = {
      loggedIn: true,
      query: {
        id: post.id.toString(),
      },
      post: post,
      userId: user.id,
    };
    await setPostActions(mockRequest, mockResponse, nextFunction);
    user = await User.findById(user.id);
    expect(nextFunction).toHaveBeenCalled();
    expect(user.historyPosts.length).toEqual(1);
    expect(mockRequest.saved).toBeTruthy();
    expect(mockRequest.hidden).toBeTruthy();
    expect(mockRequest.votingType).toEqual(-1);
    expect(mockRequest.followed).toBeTruthy();
    expect(mockRequest.inYourSubreddit).toBeTruthy();
  });

  it("should have getPostDetails function", () => {
    expect(getPostDetails).toBeDefined();
  });

  it("Test getPostDetails", async () => {
    mockRequest = {
      post: post,
    };
    await getPostDetails(mockRequest, mockResponse, nextFunction);
    expect(mockRequest.postObj).toBeDefined;
    expect(mockRequest.postObj.title).toEqual(post.title);
  });
});
