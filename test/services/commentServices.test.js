import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  checkPostId,
  checkCommentId,
  checkloggedInUser,
  createCommentService,
} from "../../services/commentServices";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Comment from "../../models/Comment.js";
import Subreddit from "../../models/Community.js";

// eslint-disable-next-line max-statements
describe("Testing comment services functions", () => {
  let user = {},
    loggedInUser = {},
    subreddit = {},
    post1 = {},
    firstLevelComment1 = {},
    firstLevelComment2 = {},
    firstLevelComment3 = {},
    secondLevelComment1 = {},
    secondLevelComment2 = {},
    secondLevelComment3 = {};

  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user.save();

    loggedInUser = new User({
      username: "LoggedInUser",
      email: "sad@gmail.com",
    });
    await loggedInUser.save();

    post1 = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
    });
    await post1.save();

    subreddit = new Subreddit({
      type: "public",
      title: "funny",
      category: "fun",
      viewName: "LOL",
      owner: {
        username: user.username,
        userID: user._id,
      },
    });
    await subreddit.save();

    firstLevelComment1 = new Comment({
      parentId: post1._id,
      postId: post1._id,
      parentType: "post",
      level: 1,
      content: "Comment 1",
      ownerId: user._id,
      ownerUsername: user.username,
    });
    await firstLevelComment1.save();

    firstLevelComment2 = new Comment({
      parentId: post1._id,
      postId: post1._id,
      parentType: "post",
      level: 1,
      content: "Comment 2",
      ownerId: user._id,
      ownerUsername: user.username,
    });
    await firstLevelComment2.save();

    firstLevelComment3 = new Comment({
      parentId: post1._id,
      postId: post1._id,
      parentType: "post",
      level: 1,
      content: "Comment 3",
      ownerId: user._id,
      ownerUsername: user.username,
    });
    await firstLevelComment3.save();

    secondLevelComment1 = new Comment({
      parentId: firstLevelComment1._id,
      postId: post1._id,
      parentType: "comment",
      level: 2,
      content: "Comment 2/1",
      ownerId: user._id,
      ownerUsername: user.username,
    });
    await secondLevelComment1.save();

    secondLevelComment2 = new Comment({
      parentId: firstLevelComment1._id,
      postId: post1._id,
      parentType: "comment",
      level: 2,
      content: "Comment 2/2",
      ownerId: user._id,
      ownerUsername: user.username,
    });
    await secondLevelComment2.save();

    secondLevelComment3 = new Comment({
      parentId: firstLevelComment1._id,
      postId: post1._id,
      parentType: "comment",
      level: 2,
      content: "Comment 2/3",
      ownerId: user._id,
      ownerUsername: user.username,
    });
    await secondLevelComment3.save();
  });
  afterAll(async () => {
    await user.remove();
    await loggedInUser.remove();
    await post1.remove();
    await subreddit.remove();
    await firstLevelComment1.remove();
    await firstLevelComment2.remove();
    await firstLevelComment3.remove();
    await secondLevelComment1.remove();
    await secondLevelComment2.remove();
    await secondLevelComment3.remove();
    await closeDatabaseConnection();
  });

  it("should have checkPostId function", () => {
    expect(checkPostId).toBeDefined();
  });

  it("try to use checkPostId function with invalid post id", async () => {
    try {
      await checkPostId("invalid");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("try to use checkPostId function with valid post id", async () => {
    const result = await checkPostId(post1._id);
    expect(result.title).toEqual("First post");
  });

  it("should have checkCommentId function", () => {
    expect(checkCommentId).toBeDefined();
  });

  it("try to use checkCommentId function with invalid comment id", async () => {
    try {
      await checkCommentId("invalid");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("try to use checkCommentId function with valid comment id", async () => {
    const result = await checkCommentId(firstLevelComment1._id);
    expect(result.content).toEqual("Comment 1");
  });

  it("should have checkloggedInUser function", () => {
    expect(checkloggedInUser).toBeDefined();
  });

  it("try to use checkloggedInUser function with invalid user id", async () => {
    try {
      await checkloggedInUser("invalid");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("try to use checkloggedInUser function with null", async () => {
    const result = await checkloggedInUser(null);
    expect(result).toEqual(null);
  });

  it("try to use checkloggedInUser function with valid user id", async () => {
    const result = await checkloggedInUser(user._id);
    expect(result).toBeDefined();
  });

  it("should have createCommentService function", () => {
    expect(createCommentService).toBeDefined();
  });

  it("try to create comment with invalid parent type", async () => {
    try {
      await createCommentService(
        {
          text: "Comment for test",
          parentId: post1._id,
          postId: post1._id,
          parentType: "invalid",
          level: 1,
          haveSubreddit: false,
          username: user.username,
          userId: user._id,
        },
        post1
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("try to create comment with invalid parent id", async () => {
    try {
      await createCommentService(
        {
          text: "Comment for test",
          parentId: "invalid",
          postId: post1._id,
          parentType: "post",
          level: 1,
          haveSubreddit: false,
          username: user.username,
          userId: user._id,
        },
        post1
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to create comment with invalid user id", async () => {
    try {
      await createCommentService(
        {
          text: "Comment for test",
          parentId: post1._id,
          postId: post1._id,
          parentType: "post",
          level: 1,
          haveSubreddit: false,
          username: user.username,
          userId: "invalid",
        },
        post1
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("try to create comment with invalid subreddit name", async () => {
    try {
      await createCommentService(
        {
          text: "Comment for test",
          parentId: post1._id,
          postId: post1._id,
          parentType: "post",
          level: 1,
          haveSubreddit: true,
          subredditName: "invalid",
          username: user.username,
          userId: user._id,
        },
        post1
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  // eslint-disable-next-line max-len
  it("try to create comment with all valid parameters and without subreddit", async () => {
    const result = await createCommentService(
      {
        text: "Comment for test",
        parentId: post1._id,
        postId: post1._id,
        parentType: "post",
        level: 1,
        haveSubreddit: false,
        username: user.username,
        userId: user._id,
      },
      post1
    );
    expect(result.statusCode).toEqual(201);
    await Comment.deleteOne({ content: "Comment for test" });
  });

  // eslint-disable-next-line max-len
  it("try to create comment with all valid parameters and with subreddit", async () => {
    const result = await createCommentService(
      {
        text: "Comment for test",
        parentId: post1._id,
        postId: post1._id,
        parentType: "post",
        level: 1,
        haveSubreddit: true,
        subredditName: "funny",
        username: user.username,
        userId: user._id,
      },
      post1
    );
    expect(result.statusCode).toEqual(201);
    await Comment.deleteOne({ content: "Comment for test" });
  });
});
