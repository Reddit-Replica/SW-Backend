/* eslint-disable max-len */
import { jest } from "@jest/globals";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  checkPinnedPosts,
  checkUnpinnedPosts,
} from "../../middleware/pinnedPosts.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";

// eslint-disable-next-line max-statements
describe("Testing Pinned posts middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  let user = {};
  let post1 = {};
  let post2 = {};
  let post3 = {};
  let post4 = {};
  let post5 = {};

  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    post1 = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      numberOfVotes: 5,
      hotScore: 10,
      numberOfViews: 10,
      createdAt: Date.now(),
    });
    await post1.save();

    post2 = new Post({
      title: "Second Post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      numberOfVotes: 3,
      hotScore: 10,
      numberOfViews: 20,
      createdAt: Date.now() + 100,
    });
    await post2.save();

    post3 = new Post({
      title: "Third post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      numberOfVotes: 3,
      hotScore: 10,
      numberOfViews: 30,
      createdAt: Date.now() + 200,
    });
    await post3.save();

    post4 = new Post({
      title: "Fourth post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      numberOfVotes: 3,
      hotScore: 10,
      numberOfViews: 30,
      createdAt: Date.now() + 200,
    });
    await post4.save();

    post5 = new Post({
      title: "Fifth post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      numberOfVotes: 3,
      hotScore: 10,
      numberOfViews: 30,
      createdAt: Date.now() + 200,
    });
    await post5.save();

    user.pinnedPosts.push(post1.id, post2.id, post3.id);
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
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

  it("should have checkPinnedPosts function", () => {
    expect(checkPinnedPosts).toBeDefined();
  });

  it("Test checkPinnedPosts with a deleted user", async () => {
    user.deletedAt = Date.now();
    await user.save();
    mockRequest = {
      body: {
        pin: true,
        id: post1.id,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPinnedPosts(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
    expect(mockRequest.postId).toBeUndefined();
  });

  it("Test checkPinnedPosts with an invalid ID", async () => {
    user.deletedAt = undefined;
    await user.save();
    mockRequest = {
      body: {
        pin: true,
        id: post1.id,
      },
      payload: {
        userId: "invalidID",
      },
    };
    await checkPinnedPosts(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
    expect(mockRequest.postId).toBeUndefined();
  });

  it("Test checkPinnedPosts with an already pinned post", async () => {
    user.deletedAt = undefined;
    await user.save();
    mockRequest = {
      body: {
        pin: true,
        id: post1.id,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPinnedPosts(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
    expect(mockRequest.postId).toBeUndefined();
  });

  it("Test checkPinnedPosts with a false pin parameter", async () => {
    mockRequest = {
      body: {
        pin: false,
        id: post1.id,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPinnedPosts(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.postId).toBeDefined();
  });

  it("Test checkPinnedPosts with a max limit of 4", async () => {
    user.pinnedPosts.push(post4.id);
    await user.save();
    mockRequest = {
      body: {
        pin: true,
        id: post5.id,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPinnedPosts(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
    expect(mockRequest.postId).toBeUndefined();
  });

  it("Test checkPinnedPosts with the post not pinned", async () => {
    user.pinnedPosts = user.pinnedPosts.filter(
      (postId) => !(postId.toString() === post4.id.toString())
    );
    await user.save();
    mockRequest = {
      body: {
        pin: true,
        id: post4.id,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPinnedPosts(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user.username).toEqual(user.username);
    expect(mockRequest.postId.toString()).toEqual(post4.id.toString());
  });

  it("should have checkUnpinnedPosts function", () => {
    expect(checkUnpinnedPosts).toBeDefined();
  });

  it("Test checkUnpinnedPosts with true pin", async () => {
    mockRequest = {
      body: {
        pin: true,
        id: post1.id,
      },
    };
    await checkUnpinnedPosts(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
    expect(mockRequest.postId).toBeUndefined();
  });

  it("Test checkUnpinnedPosts with false pin", async () => {
    mockRequest = {
      body: {
        pin: false,
      },
      user: user,
      postId: post4.id.toString(),
    };
    await checkUnpinnedPosts(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkUnpinnedPosts with server error", async () => {
    user.pinnedPosts = undefined;
    await user.save();
    mockRequest = {
      body: {
        pin: false,
      },
      user: user,
      postId: post4.id.toString(),
    };
    await checkUnpinnedPosts(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
