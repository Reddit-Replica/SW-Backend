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
    await Comment.deleteMany({});
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

  it("Test checkThingMod (TYPE = POST) for a deleted post", async () => {
    post.deletedAt = Date.now();
    await post.save();
    mockRequest = {
      body: {
        id: post.id,
        type: "post",
      },
      payload: {
        userId: user.id,
        username: user.username,
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    post.deletedAt = undefined;
    await post.save();
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
    expect(mockRequest.type).toBeUndefined();
    expect(mockRequest.comment).toBeUndefined();
  });

  it("Test checkThingMod (TYPE = POST) with an invalid ID", async () => {
    mockRequest = {
      body: {
        id: "invalidID",
        type: "post",
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

  it("Test checkThingMod (TYPE = POST) with an invalid subreddit name", async () => {
    post.subredditName = "invalidName";
    await post.save();
    mockRequest = {
      body: {
        id: post.id,
        type: "post",
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

  it("Test checkThingMod (TYPE = POST) with no subreddit name", async () => {
    post.subredditName = undefined;
    await post.save();
    mockRequest = {
      body: {
        id: post.id,
        type: "post",
      },
      payload: {
        userId: user.id,
        username: user.username,
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post.title).toEqual(post.title);
    expect(mockRequest.type).toEqual("post");
    expect(mockRequest.comment).toBeUndefined();
  });

  it("Test checkThingMod (TYPE = POST) with a different owner", async () => {
    mockRequest = {
      body: {
        id: post.id,
        type: "post",
      },
      payload: {
        userId: user.id,
        username: "differentOwner",
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
    expect(mockRequest.type).toBeUndefined();
    expect(mockRequest.comment).toBeUndefined();
  });

  it("Test checkThingMod (TYPE = POST) with a deleted subreddit", async () => {
    post.subredditName = "subreddit";
    subreddit.deletedAt = Date.now();
    await subreddit.save();
    await post.save();
    mockRequest = {
      body: {
        id: post.id,
        type: "post",
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

  it("Test checkThingMod (TYPE = POST) with no moderator", async () => {
    subreddit.deletedAt = undefined;
    await subreddit.save();
    mockRequest = {
      body: {
        id: post.id,
        type: "post",
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

  it("Test checkThingMod (TYPE = POST) with moderator but no permissions", async () => {
    subreddit.moderators.push({
      userID: user.id,
      dateOfModeration: Date.now(),
    });
    await subreddit.save();
    mockRequest = {
      body: {
        id: post.id,
        type: "post",
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

  it("Test checkThingMod (TYPE = POST) with all permissions", async () => {
    subreddit.moderators[0].permissions = ["Everything"];
    await subreddit.save();
    mockRequest = {
      body: {
        id: post.id,
        type: "post",
      },
      payload: {
        userId: user.id,
        username: user.username,
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post.title).toEqual(post.title);
    expect(mockRequest.type).toEqual("post");
    expect(mockRequest.comment).toBeUndefined();
  });

  it("Test checkThingMod (TYPE = POST) with moderator & manage posts permissions", async () => {
    subreddit.moderators[0].permissions = ["Manage Posts & Comments"];
    await subreddit.save();
    mockRequest = {
      body: {
        id: post.id,
        type: "post",
      },
      payload: {
        userId: user.id,
        username: user.username,
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post.title).toEqual(post.title);
    expect(mockRequest.type).toEqual("post");
    expect(mockRequest.comment).toBeUndefined();
  });

  it("Test checkThingMod (TYPE = POST) with other permissions", async () => {
    subreddit.moderators[0].permissions = ["Manage Users"];
    await subreddit.save();
    mockRequest = {
      body: {
        id: post.id,
        type: "post",
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

  it("Test checkThingMod (TYPE = COMMENT) for a deleted comment", async () => {
    comment.deletedAt = Date.now();
    await comment.save();
    mockRequest = {
      body: {
        id: comment.id,
        type: "comment",
      },
      payload: {
        userId: user.id,
        username: user.username,
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    comment.deletedAt = undefined;
    await comment.save();
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
    expect(mockRequest.type).toBeUndefined();
    expect(mockRequest.comment).toBeUndefined();
  });

  it("Test checkThingMod (TYPE = COMMENT) with an invalid ID", async () => {
    mockRequest = {
      body: {
        id: "invalidID",
        type: "comment",
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

  it("Test checkThingMod (TYPE = COMMENT) with an invalid subreddit name", async () => {
    comment.subredditName = "invalidName";
    await comment.save();
    mockRequest = {
      body: {
        id: comment.id,
        type: "comment",
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

  it("Test checkThingMod (TYPE = COMMENT) with no subreddit name", async () => {
    comment.subredditName = undefined;
    await comment.save();
    mockRequest = {
      body: {
        id: comment.id,
        type: "comment",
      },
      payload: {
        userId: user.id,
        username: user.username,
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
    expect(mockRequest.type).toEqual("comment");
    expect(mockRequest.comment.id.toString()).toEqual(comment.id.toString());
  });

  it("Test checkThingMod (TYPE = COMMENT) with a different owner", async () => {
    mockRequest = {
      body: {
        id: comment.id,
        type: "comment",
      },
      payload: {
        userId: user.id,
        username: "differentOwner",
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
    expect(mockRequest.type).toBeUndefined();
    expect(mockRequest.comment).toBeUndefined();
  });

  it("Test checkThingMod (TYPE = COMMENT) with a deleted subreddit", async () => {
    comment.subredditName = "subreddit";
    subreddit.deletedAt = Date.now();
    await subreddit.save();
    await comment.save();
    mockRequest = {
      body: {
        id: comment.id,
        type: "comment",
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

  it("Test checkThingMod (TYPE = COMMENT) with no moderator", async () => {
    subreddit.moderators.pop();
    subreddit.deletedAt = undefined;
    await subreddit.save();
    mockRequest = {
      body: {
        id: comment.id,
        type: "comment",
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

  it("Test checkThingMod (TYPE = COMMENT) with moderator but no permissions", async () => {
    subreddit.moderators.push({
      userID: user.id,
      dateOfModeration: Date.now(),
    });
    await subreddit.save();
    mockRequest = {
      body: {
        id: comment.id,
        type: "comment",
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

  it("Test checkThingMod (TYPE = COMMENT) with all permissions", async () => {
    subreddit.moderators[0].permissions = ["Everything"];
    await subreddit.save();
    mockRequest = {
      body: {
        id: comment.id,
        type: "comment",
      },
      payload: {
        userId: user.id,
        username: user.username,
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
    expect(mockRequest.type).toEqual("comment");
    expect(mockRequest.comment.id.toString()).toEqual(comment.id.toString());
  });

  it("Test checkThingMod (TYPE = COMMENT) with moderator & manage posts permissions", async () => {
    subreddit.moderators[0].permissions = ["Manage Posts & Comments"];
    await subreddit.save();
    mockRequest = {
      body: {
        id: comment.id,
        type: "comment",
      },
      payload: {
        userId: user.id,
        username: user.username,
      },
    };
    await checkThingMod(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post).toBeUndefined();
    expect(mockRequest.type).toEqual("comment");
    expect(mockRequest.comment.id.toString()).toEqual(comment.id.toString());
  });

  it("Test checkThingMod (TYPE = COMMENT) with other permissions", async () => {
    subreddit.moderators[0].permissions = ["Manage Users"];
    await subreddit.save();
    mockRequest = {
      body: {
        id: comment.id,
        type: "comment",
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
