/* eslint-disable max-len */
import { jest } from "@jest/globals";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import { checkJoinedBefore } from "../../middleware/NJoiningValidation.js";
import { optionalToken } from "../../middleware/optionalToken.js";
import { generateJWT } from "../../utils/generateTokens.js";
import User from "../../models/User.js";
import Subreddit from "../../models/Community.js";
import Token from "../../models/VerifyToken.js";
import crypto from "crypto";
import { hashPassword } from "../../utils/passwordUtils.js";

// eslint-disable-next-line max-statements
describe("Testing Joining validation middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  let user1 = {};
  let user2 = {};
  let user3 = {};
  let subreddit1 = {};
  let subreddit2 = {};
  let verifyToken = {};
  beforeAll(async () => {
    await connectDatabase();

    user2 = await new User({
      username: "Hamdy",
      email: "Hamdy@gmail.com",
      createdAt: Date.now(),
      password: hashPassword("87654321"),
    }).save();

    user3 = await new User({
      username: "Beshoy",
      email: "Beshoy@gmail.com",
      createdAt: Date.now(),
      password: hashPassword("87654321"),
    }).save();

    subreddit1 = await new Subreddit({
      title: "SportsSubreddit",
      viewName: "Ahly",
      category: "Sports",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 20,
      numberOfViews: 63,
      waitedUsers: [
        {
          username: user2.username,
          userID: user2.id,
        },
      ],
    }).save();

    user1 = await new User({
      username: "Noaman",
      email: "abdelrahman@gmail.com",
      createdAt: Date.now(),
      password: hashPassword("12345678"),
      joinedSubreddits: [
        {
          subredditId: subreddit1._id,
          name: subreddit1.title,
        },
      ],
    }).save();

    verifyToken = await new Token({
      userId: user2._id,
      token: crypto.randomBytes(32).toString("hex"),
      type: "forgetPassword",
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
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
  //--------------------------------------------------------------------
  it("should have checkJoinedBefore function", () => {
    expect(checkJoinedBefore).toBeDefined();
  });
  //----------------------------------------------------------------------
  it("Test checkJoinedBefore with an already joined user", async () => {
    mockRequest = {
      payload: {
        username: user1.username,
        userId: user1.id,
      },
      body: {
        subredditId: subreddit1.id,
      },
    };
    await checkJoinedBefore(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkJoinedBefore with an already waited user", async () => {
    mockRequest = {
      payload: {
        username: user2.username,
        userId: user2.id,
      },
      body: {
        subredditId: subreddit1.id,
      },
    };
    await checkJoinedBefore(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });
  it("Test checkJoinedBefore with no req.body", async () => {
    mockRequest = {
      payload: {
        username: user2.username,
        userId: user2.id,
      },
    };
    await checkJoinedBefore(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkJoinedBefore with a normal user", async () => {
    mockRequest = {
      payload: {
        username: user3.username,
        userId: user3.id,
      },
      body: {
        subredditId: subreddit1.id,
      },
    };
    await checkJoinedBefore(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
