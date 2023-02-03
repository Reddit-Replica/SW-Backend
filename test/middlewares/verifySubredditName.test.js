/* eslint-disable max-len */
import { jest } from "@jest/globals";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "../../models/User.js";
import Subreddit from "../../models/Community.js";
import Token from "../../models/VerifyToken.js";
import crypto from "crypto";
import { hashPassword } from "../../utils/passwordUtils.js";
import { checkDuplicateSubredditTitle } from "../../middleware/NverifySubredditName.js";

// eslint-disable-next-line max-statements
describe("Testing verifySubredditName middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  let user2 = {};
  let subreddit1 = {};
  let verifyToken = {};
  beforeAll(async () => {
    await connectDatabase();

    user2 = await new User({
      username: "Hamdy",
      email: "Hamdy@gmail.com",
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
      moderators: [
        {
          userID: user2.id,
          dateOfModeration: Date.now(),
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
  it("should have checkDuplicateSubredditTitle function", () => {
    expect(checkDuplicateSubredditTitle).toBeDefined();
  });
  //----------------------------------------------------------------------
  it("Test checkDuplicateSubredditTitle without req.body", async () => {
    mockRequest = {};
    await checkDuplicateSubredditTitle(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkDuplicateSubredditTitle with a repeated subreddit name", async () => {
    mockRequest = {
      body: {
        subredditName: subreddit1.title,
      },
    };
    await checkDuplicateSubredditTitle(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });
  it("Test checkDuplicateSubredditTitle with a moderator user", async () => {
    mockRequest = {
      body: {
        subredditName: "no3manYgd3an",
      },
    };
    await checkDuplicateSubredditTitle(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
