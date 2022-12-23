/* eslint-disable max-len */
import { jest } from "@jest/globals";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import { checkThingMod } from "../../middleware/postModeration";
import User from "../../models/User.js";
import Subreddit from "../../models/Community.js";
import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";

// eslint-disable-next-line max-statements
describe("Testing Post Moderation middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  let user = {};
  let post = {};
  let subreddit = {};
  let comment = {};

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

    comment = new Comment({
      parentId: post._id,
      postId: post._id,
      parentType: "post",
      level: 1,
      content: [{ insert: "Comment 1" }],
      ownerId: user._id,
      ownerUsername: user.username,
      subredditName: "subreddit",
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await comment.save();
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

  it("should have checkThingMod function", () => {
    expect(checkThingMod).toBeDefined();
  });

  it("Test checkThingMod with an invalid type", async () => {
    mockRequest = {
      body: {
        id: post.id,
        type: "invalidType",
      },
      payload: {
        userId: user.id,
        username: user.username,
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
    expect(mockRequest.type).toBeUndefined();
    expect(mockRequest.comment).toBeUndefined();
  });
});
