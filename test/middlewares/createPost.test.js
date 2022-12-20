/* eslint-disable max-len */
import { jest } from "@jest/globals";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  checkPostSubreddit,
  checkPostFlair,
  checkImagesAndVideos,
  checkHybridPost,
  sharePost,
  addPost,
  postSubmission,
} from "../../middleware/createPost.js";
import Subreddit from "../../models/Community.js";
import Post from "../../models/Post.js";
import User from "../../models/User.js";
import Flair from "../../models/Flair.js";
import mongoose from "mongoose";

// eslint-disable-next-line max-statements
describe("Testing createPost middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  let subreddit = {};
  let user = {};
  let post = {};
  let post2 = {};
  let flair = {};
  beforeAll(async () => {
    await connectDatabase();

    subreddit = await new Subreddit({
      title: "subreddit",
      viewName: "SR",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: "hamdy",
      },

      dateOfCreation: Date.now(),
    }).save();

    flair = await new Flair({
      flairName: "flair",
      subreddit: subreddit.id,
      flairOrder: 1,
      createdAt: Date.now(),
    }).save();

    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
      joinedSubreddits: [
        {
          subredditId: subreddit.id,
          name: subreddit.title,
        },
      ],
    }).save();

    post = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 5,
      hotScore: 10,
      numberOfViews: 10,
      createdAt: Date.now(),
    });
    await post.save();

    post2 = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "post",
      sharePostId: post.id,
      numberOfVotes: 5,
      hotScore: 10,
      numberOfViews: 10,
      createdAt: Date.now(),
    });
    await post2.save();
  });

  afterAll(async () => {
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
    await Flair.deleteMany({});
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

  it("should have checkPostSubreddit function", () => {
    expect(checkPostSubreddit).toBeDefined();
  });

  it("Test checkPostSubreddit with an invalid userId", async () => {
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: "invalidId",
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostSubreddit without subreddit", async () => {
    mockRequest = {
      body: {
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostSubreddit with a deleted user", async () => {
    user.deletedAt = Date.now();
    await user.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    user.deletedAt = undefined;
    await user.save();
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostSubreddit with an invalid subreddit name", async () => {
    mockRequest = {
      body: {
        subreddit: "invalidSR",
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostSubreddit with a deleted subreddit", async () => {
    subreddit.deletedAt = Date.now();
    await subreddit.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    subreddit.deletedAt = undefined;
    await subreddit.save();
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostSubreddit correctly", async () => {
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.subreddit.title).toEqual(subreddit.name);
    expect(mockRequest.subredditId.toString()).toEqual(subreddit.id.toString());
    expect(mockRequest.user.id.toString()).toEqual(user.id.toString());
  });

  it("Test checkPostSubreddit for a banned user in the subreddit", async () => {
    subreddit.bannedUsers.push({
      username: user.username,
      userId: user.id,
      bannedAt: Date.now(),
      banPeriod: 5,
    });
    await subreddit.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    subreddit.bannedUsers.pop();
    await subreddit.save();
  });

  it("Test checkPostSubreddit for a muted user in the subreddit", async () => {
    subreddit.mutedUsers.push({
      userID: user.id,
      dateOfMute: Date.now(),
    });
    await subreddit.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    subreddit.mutedUsers.pop();
    await subreddit.save();
  });

  it("Test checkPostSubreddit with no joined subreddits", async () => {
    user.joinedSubreddits.pop();
    await user.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    user.joinedSubreddits.push({
      subredditId: subreddit.id,
      name: subreddit.title,
    });
    await user.save();
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostSubreddit with spoiler enabled", async () => {
    subreddit.subredditPostSettings.enableSpoiler = true;
    await subreddit.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
        spoiler: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("Test checkPostSubreddit with spoiler disabled", async () => {
    subreddit.subredditPostSettings.enableSpoiler = false;
    await subreddit.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
        spoiler: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostSubreddit with suggested sort of the subreddit", async () => {
    subreddit.subredditPostSettings.suggestedSort = "best";
    await subreddit.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.suggestedSort).toEqual("best");
  });

  it("Test checkPostSubreddit with subreddit type = Private (User not approved)", async () => {
    subreddit.type = "Private";
    await subreddit.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostSubreddit with subreddit type = Private (User approved)", async () => {
    subreddit.approvedUsers.push({
      userID: user.id,
      dateOfApprove: Date.now(),
    });
    await subreddit.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("Test checkPostSubreddit with subreddit type = Restricted (User approved)", async () => {
    subreddit.type = "Restricted";
    await subreddit.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("Test checkPostSubreddit with subreddit type = Restricted & no permission to post", async () => {
    subreddit.subredditSettings.approvedUsersHaveTheAbilityTo = "Comment only";
    await subreddit.save();
    mockRequest = {
      body: {
        subreddit: subreddit.title,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostSubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should have checkPostFlair function", () => {
    expect(checkPostFlair).toBeDefined();
  });

  it("Test checkPostFlair with an empty subreddit", async () => {
    mockRequest = {
      body: {
        flairId: flair.id,
        inSubreddit: true,
      },
      payload: {
        userId: user.id,
      },
    };
    await checkPostFlair(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostFlair with an invalid subreddit name", async () => {
    mockRequest = {
      body: {
        flairId: flair.id,
        inSubreddit: true,
      },
      subreddit: "invalidSR",
      payload: {
        userId: user.id,
      },
    };
    await checkPostFlair(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostFlair with an invalid Flair ID", async () => {
    mockRequest = {
      body: {
        flairId: "invalidFlairID",
        inSubreddit: true,
      },
      subreddit: subreddit.title,
      payload: {
        userId: user.id,
      },
    };
    await checkPostFlair(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostFlair with a deleted flair", async () => {
    flair.deletedAt = Date.now();
    await flair.save();
    mockRequest = {
      body: {
        flairId: flair.id,
        inSubreddit: true,
      },
      subreddit: subreddit.title,
      payload: {
        userId: user.id,
      },
    };
    await checkPostFlair(mockRequest, mockResponse, nextFunction);
    flair.deletedAt = undefined;
    await flair.save();
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostFlair with a flair subreddit different from the given", async () => {
    flair.subreddit = mongoose.Types.ObjectId.generate(10);
    await flair.save();
    mockRequest = {
      body: {
        flairId: flair.id,
        inSubreddit: true,
      },
      subreddit: subreddit.title,
      payload: {
        userId: user.id,
      },
    };
    await checkPostFlair(mockRequest, mockResponse, nextFunction);
    flair.subreddit = subreddit.id;
    await flair.save();
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostFlair with an invalid flair but correct id format", async () => {
    mockRequest = {
      body: {
        flairId: mongoose.Types.ObjectId.generate(10),
        inSubreddit: true,
      },
      subreddit: subreddit.title,
      payload: {
        userId: user.id,
      },
    };
    await checkPostFlair(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Test checkPostFlair correctly", async () => {
    mockRequest = {
      body: {
        flairId: flair.id,
        inSubreddit: true,
      },
      subreddit: subreddit.title,
      payload: {
        userId: user.id,
      },
    };
    await checkPostFlair(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should have checkHybridPost function", () => {
    expect(checkHybridPost).toBeDefined();
  });

  it("Test checkHybridPost with kind = hybrid", async () => {
    mockRequest = {
      body: {
        kind: "hybrid",
        content: "content",
      },
      payload: {
        userId: user.id,
      },
    };
    await checkHybridPost(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.content).toEqual("content");
  });

  it("Test checkHybridPost with kind != hybrid", async () => {
    mockRequest = {
      body: {
        kind: "post",
        content: "content",
      },
      payload: {
        userId: user.id,
      },
    };
    await checkHybridPost(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.content).toBeUndefined();
  });

  it("should have checkImagesAndVideos function", () => {
    expect(checkImagesAndVideos).toBeDefined();
  });

  it("Test checkImagesAndVideos with kind != image or video", async () => {
    mockRequest = {
      body: {
        kind: "hybrid",
        content: "content",
      },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.images).toBeUndefined();
    expect(mockRequest.video).toBeUndefined();
  });

  it("Test checkImagesAndVideos with kind = image & no image files", async () => {
    mockRequest = {
      body: {
        kind: "image",
        imageCaptions: ["caption1", "caption2"],
        imageLinks: ["link1", "link2"],
      },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.images).toBeUndefined();
  });

  it("Test checkImagesAndVideos with kind = image correctly", async () => {
    mockRequest = {
      body: {
        kind: "image",
        imageCaptions: ["caption1", "caption2"],
        imageLinks: ["link1", "link2"],
      },
      files: { images: [{ path: "image1" }, { path: "image2" }] },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.images).toBeDefined();
  });

  it("Test checkImagesAndVideos with kind = image (captions < links)", async () => {
    mockRequest = {
      body: {
        kind: "image",
        imageCaptions: ["caption1"],
        imageLinks: ["link1", "link2"],
      },
      files: { images: [{ path: "image1" }, { path: "image2" }] },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.images).toBeUndefined();
  });

  it("Test checkImagesAndVideos with kind = image (captions > links)", async () => {
    mockRequest = {
      body: {
        kind: "image",
        imageCaptions: ["caption1", "caption2", "caption3"],
        imageLinks: ["link1", "link2"],
      },
      files: { images: [{ path: "image1" }, { path: "image2" }] },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.images).toBeUndefined();
  });

  it("Test checkImagesAndVideos with kind = image (files < captions & links)", async () => {
    mockRequest = {
      body: {
        kind: "image",
        imageCaptions: ["caption1", "caption2", "caption3"],
        imageLinks: ["link1", "link2"],
      },
      files: { images: [{ path: "image1" }] },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.images).toBeUndefined();
  });

  it("Test checkImagesAndVideos with kind = image (No captions)", async () => {
    mockRequest = {
      body: {
        kind: "image",
        imageLinks: ["link1", "link2"],
      },
      files: { images: [{ path: "image1" }] },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.images).toBeUndefined();
  });

  it("Test checkImagesAndVideos with kind = image (No links)", async () => {
    mockRequest = {
      body: {
        kind: "image",
        imageCaptions: ["caption1", "caption2", "caption3"],
      },
      files: { images: [{ path: "image1" }] },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.images).toBeUndefined();
  });

  it("Test checkImagesAndVideos with kind = image correctly with strings", async () => {
    mockRequest = {
      body: {
        kind: "image",
        imageCaptions: "caption1",
        imageLinks: "link1",
      },
      files: { images: [{ path: "image1" }] },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.images).toBeDefined();
  });

  it("Test checkImagesAndVideos with kind = video (No video files)", async () => {
    mockRequest = {
      body: {
        kind: "video",
      },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.video).toBeUndefined();
  });

  it("Test checkImagesAndVideos with kind = video correctly", async () => {
    mockRequest = {
      body: {
        kind: "video",
      },
      files: { video: [{ path: "video1" }] },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.video).toBeDefined();
  });

  it("Test checkImagesAndVideos with kind = video (More than one video)", async () => {
    mockRequest = {
      body: {
        kind: "video",
      },
      files: { video: [{ path: "video1" }, { path: "video2" }] },
      payload: {
        userId: user.id,
      },
    };
    await checkImagesAndVideos(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.video).toBeUndefined();
  });

  it("should have sharePost function", () => {
    expect(sharePost).toBeDefined();
  });

  it("Test sharePost with kind != post", async () => {
    mockRequest = {
      body: {
        kind: "hybrid",
        content: "content",
      },
      payload: {
        userId: user.id,
      },
    };
    await sharePost(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.sharePostId).toBeUndefined();
  });

  it("Test sharePost with kind = post (No sharePostId)", async () => {
    mockRequest = {
      body: {
        kind: "post",
      },
      payload: {
        userId: user.id,
      },
    };
    await sharePost(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.sharePostId).toBeUndefined();
  });

  it("Test sharePost with sharePostId but kind != post", async () => {
    mockRequest = {
      body: {
        kind: "image",
        sharePostId: post.id,
      },
      payload: {
        userId: user.id,
      },
    };
    await sharePost(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.sharePostId).toBeUndefined();
  });

  it("Test sharePost with kind = post correctly", async () => {
    mockRequest = {
      body: {
        kind: "post",
        sharePostId: post.id,
      },
      payload: {
        userId: user.id,
      },
    };
    await sharePost(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.sharePostId.toString()).toEqual(post.id.toString());
  });

  it("Test sharePost with a deleted shared post", async () => {
    post.deletedAt = Date.now();
    await post.save();
    mockRequest = {
      body: {
        kind: "post",
        sharePostId: post.id,
      },
      payload: {
        userId: user.id,
      },
    };
    await sharePost(mockRequest, mockResponse, nextFunction);
    post.deletedAt = undefined;
    await post.save();
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.sharePostId).toBeUndefined();
  });

  it("Test sharePost with a secondary shared post", async () => {
    mockRequest = {
      body: {
        kind: "post",
        sharePostId: post2.id,
      },
      payload: {
        userId: user.id,
      },
    };
    await sharePost(mockRequest, mockResponse, nextFunction);
    post = await Post.findById(post.id);
    expect(post.insights.totalShares).toEqual(2);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.sharePostId).toEqual(post.id.toString());
  });

  it("Test sharePost with a deleted secondary shared post", async () => {
    post.deletedAt = Date.now();
    await post.save();
    mockRequest = {
      body: {
        kind: "post",
        sharePostId: post2.id,
      },
      payload: {
        userId: user.id,
      },
    };
    await sharePost(mockRequest, mockResponse, nextFunction);
    post.deletedAt = undefined;
    await post.save();
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.sharePostId).toBeUndefined();
  });

  it("should have postSubmission function", () => {
    expect(postSubmission).toBeDefined();
  });

  it("Test postSubmission", async () => {
    mockRequest = {
      body: {
        kind: "hybrid",
        title: "New Post",
      },
      content: "content",
      subreddit: subreddit,
      subredditId: subreddit.id,
      suggestedSort: "new",
      user: {
        id: user.id,
        username: user.username,
      },
    };
    await postSubmission(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post.title).toEqual("New Post");
  });

  it("should have addPost function", () => {
    expect(addPost).toBeDefined();
  });

  it("Test addPost", async () => {
    mockRequest = {
      body: {
        kind: "hybrid",
        title: "New Post",
      },
      user: user,
      post: post,
    };
    await addPost(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.post.numberOfVotes).toEqual(1);
  });
});
