import { jest } from "@jest/globals";
import { verifyPostActions } from "../../middleware/verifyPostActions";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";

// eslint-disable-next-line max-statements
describe("Testing verifyPostActions middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction = jest.fn();

  let user = {},
    user1 = {},
    post = {},
    post1 = {};
  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "Beshoy",
      email: "besho@gmail.com",
      createdAt: Date.now(),
    }).save();

    user1 = await new User({
      username: "Morta",
      email: "morta@gmail.com",
      createdAt: Date.now(),
    }).save();

    post = await new Post({
      title: "Beshoy's post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      createdAt: Date.now(),
    }).save();

    post1 = await new Post({
      title: "Morta's post",
      ownerUsername: user1.username,
      ownerId: user1._id,
      kind: "hybrid",
      createdAt: Date.now(),
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await closeDatabaseConnection();
  });

  beforeEach(() => {
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

  it("should have verifyPostActions function", () => {
    expect(verifyPostActions).toBeDefined();
  });

  it("try to send an invalid id in the query", () => {
    mockRequest = {
      query: {
        id: "lol",
      },
      body: {},
      payload: {
        userId: user._id,
      },
    };
    verifyPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("try to send an invalid id in the body", () => {
    mockRequest = {
      query: {},
      body: {
        id: "lol",
      },
      payload: {
        userId: user._id,
      },
    };
    verifyPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("try to send an id that does not exit in the body", () => {
    mockRequest = {
      query: {},
      body: {
        id: "6398e23a159be70e26e54dd5",
      },
      payload: {
        userId: user._id,
      },
    };
    verifyPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("try to send an id that does not exit in the query", () => {
    mockRequest = {
      query: {
        id: "6398e23a159be70e26e54dd5",
      },
      body: {},
      payload: {
        userId: user._id,
      },
    };
    verifyPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("try to send an id of other user's post in the query", () => {
    mockRequest = {
      query: {
        id: post1._id,
      },
      body: {},
      payload: {
        userId: user._id,
      },
    };
    verifyPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("try to send an id of other user's post in the body", () => {
    mockRequest = {
      query: {},
      body: {
        id: post1._id,
      },
      payload: {
        userId: user._id,
      },
    };
    verifyPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("try to send an id of user's right post in the body", async () => {
    mockRequest = {
      query: {},
      body: {
        id: post._id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("try to send an id of user's right post in the query", async () => {
    mockRequest = {
      query: {},
      body: {
        id: post._id,
      },
      payload: {
        userId: user._id,
      },
    };
    await verifyPostActions(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
