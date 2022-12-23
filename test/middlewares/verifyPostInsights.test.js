import { jest } from "@jest/globals";
import { verifyPostInsights } from "../../middleware/verifyPostActions";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Subreddit from "./../../models/Community.js";
import mongoose from "mongoose";

// eslint-disable-next-line max-statements
describe("Testing verifyPostInsights middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  let user = {},
    user1 = {},
    post = {},
    subreddit = {},
    post1 = {};
  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    user1 = await new User({
      username: "beshoy",
      email: "besho@gmail.com",
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
      dateOfCreation: Date.now(),
    }).save();

    post = await new Post({
      title: "My post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      createdAt: Date.now(),
    }).save();

    post1 = await new Post({
      title: "Another post",
      ownerUsername: user1.username,
      ownerId: user1._id,
      kind: "hybrid",
      createdAt: Date.now(),
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

  it("should have verifyPostInsights function", () => {
    expect(verifyPostInsights).toBeDefined();
  });

  it("Test verifyPostInsights with an invalid ID format", async () => {
    mockRequest = {
      query: {
        id: "invalidID",
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test verifyPostInsights with an invalid ID", async () => {
    mockRequest = {
      query: {
        id: mongoose.Types.ObjectId.generate(10),
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
  });

  it("Test verifyPostInsights with a deleted post", async () => {
    post.deletedAt = Date.now();
    await post.save();
    mockRequest = {
      query: {
        id: post.id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test verifyPostInsights with a user post of a different owner", async () => {
    post.subredditName = undefined;
    post.deletedAt = undefined;
    post.ownerId = user1.id;
    await post.save();
    mockRequest = {
      query: {
        id: post.id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test verifyPostInsights with a user post of the same owner", async () => {
    post.ownerId = user._id;
    await post.save();
    mockRequest = {
      query: {
        id: post.id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post.title).toEqual(post.title);
  });

  it("Test verifyPostInsights with an invalid subreddit name", async () => {
    post.subredditName = "invalidName";
    post.deletedAt = undefined;
    subreddit.deletedAt = undefined;
    await post.save();
    await subreddit.save();
    mockRequest = {
      query: {
        id: post._id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
  });

  it("Test verifyPostInsights with a deleted subreddit", async () => {
    post.subredditName = subreddit.title;
    subreddit.deletedAt = Date.now();
    await subreddit.save();
    await post.save();
    mockRequest = {
      query: {
        id: post._id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
  });

  it("Test verifyPostInsights with subreddit post where the user is not the owner", async () => {
    subreddit.deletedAt = undefined;
    post.ownerId = user1._id;
    await subreddit.save();
    await post.save();
    mockRequest = {
      query: {
        id: post._id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
  });

  it("Test verifyPostInsights with subreddit post where the user is the owner but not a mod", async () => {
    post.ownerId = user.id;
    await post.save();
    mockRequest = {
      query: {
        id: post.id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post.title).toEqual(post.title);
  });

  it("Test verifyPostInsights with subreddit post where the user is not the owner or mod", async () => {
    post.ownerId = user1.id;
    await post.save();
    mockRequest = {
      query: {
        id: post.id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
  });

  it("Test verifyPostInsights with subreddit post where the user not the owner but a mod", async () => {
    post.ownerId = user1.id;
    subreddit.moderators.push({
      userID: user.id,
      dateOfModeration: Date.now(),
    });
    await subreddit.save();
    await post.save();
    mockRequest = {
      query: {
        id: post.id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostInsights(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post.title).toEqual(post.title);
  });

  it("Test verifyPostInsights for a server error", async () => {
    await verifyPostInsights(undefined, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
  });
});
