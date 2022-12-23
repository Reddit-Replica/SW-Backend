import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  checkPostId,
  checkCommentId,
  checkloggedInUser,
  createCommentService,
  commentTreeListingService,
  commentTreeOfCommentListingService,
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
    privateSubreddit = {},
    privatePost = {},
    post = {},
    post1 = {},
    post2 = {},
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
      createdAt: Date.now(),
    });
    await user.save();

    loggedInUser = new User({
      username: "LoggedInUser",
      email: "sad@gmail.com",
      createdAt: Date.now(),
    });
    await loggedInUser.save();

    post = new Post({
      title: "Without subreddit post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      createdAt: Date.now(),
    });
    await post.save();

    post1 = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      createdAt: Date.now(),
    });
    await post1.save();

    post2 = new Post({
      title: "Second post",
      ownerUsername: loggedInUser.username,
      ownerId: loggedInUser._id,
      kind: "hybrid",
      createdAt: Date.now(),
    });
    await post2.save();

    privatePost = new Post({
      title: "Private post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      subredditName: "privateSR",
      createdAt: Date.now(),
    });
    await privatePost.save();

    subreddit = new Subreddit({
      type: "public",
      title: "subreddit",
      category: "fun",
      viewName: "LOL",
      owner: {
        username: user.username,
        userID: user._id,
      },
      createdAt: Date.now(),
    });
    await subreddit.save();

    privateSubreddit = new Subreddit({
      type: "Private",
      title: "privateSR",
      category: "fun",
      viewName: "LOL",
      owner: {
        username: user.username,
        userID: user._id,
      },
      approvedUsers: [
        {
          userID: user._id,
          dateOfApprove: Date.now(),
        },
      ],
      createdAt: Date.now(),
    });
    await privateSubreddit.save();

    firstLevelComment1 = new Comment({
      parentId: post1._id,
      postId: post1._id,
      parentType: "post",
      level: 1,
      content: { text: "Comment 1" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 10,
      createdAt: Date.now(),
    });
    await firstLevelComment1.save();

    firstLevelComment2 = new Comment({
      parentId: post1._id,
      postId: post1._id,
      parentType: "post",
      level: 1,
      content: { text: "Comment 2" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await firstLevelComment2.save();

    firstLevelComment3 = new Comment({
      parentId: post1._id,
      postId: post1._id,
      parentType: "post",
      level: 1,
      content: { text: "Comment 3" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 1,
      createdAt: Date.now(),
    });
    await firstLevelComment3.save();

    secondLevelComment1 = new Comment({
      parentId: firstLevelComment1._id,
      postId: post1._id,
      parentType: "comment",
      level: 2,
      content: { text: "Comment 2/1" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 10,
      createdAt: Date.now(),
    });
    await secondLevelComment1.save();

    secondLevelComment2 = new Comment({
      parentId: firstLevelComment1._id,
      postId: post1._id,
      parentType: "comment",
      level: 2,
      content: { text: "Comment 2/2" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await secondLevelComment2.save();

    secondLevelComment3 = new Comment({
      parentId: firstLevelComment1._id,
      postId: post1._id,
      parentType: "comment",
      level: 2,
      content: { text: "Comment 2/3" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 1,
      createdAt: Date.now(),
    });
    await secondLevelComment3.save();

    user.commentedPosts.push(post1._id);
    await user.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Comment.deleteMany({});
    await Post.deleteMany({});
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

  it("try to use checkPostId function with deleted post id", async () => {
    try {
      post1.deletedAt = Date.now();
      await post1.save();
      await checkPostId(post1._id);
    } catch (error) {
      expect(error).toBeDefined();
      post1.deletedAt = null;
      await post1.save();
    }
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
    expect(result.content).toEqual({ text: "Comment 1" });
  });

  it("try to use checkCommentId function with deleted comment id", async () => {
    try {
      firstLevelComment1.deletedAt = Date.now();
      await firstLevelComment1.save();
      await checkCommentId(firstLevelComment1._id);
    } catch (error) {
      expect(error).toBeDefined();
      firstLevelComment1.deletedAt = null;
      await firstLevelComment1.save();
    }
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
          content: { text: "Comment for testing" },
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
          content: { text: "Comment for testing" },
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
          content: { text: "Comment for testing" },
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
  it("try to create comment with a user that does not exist", async () => {
    try {
      user.deletedAt = Date.now();
      await user.save();

      await createCommentService(
        {
          content: { text: "Comment for testing" },
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
    } catch (error) {
      expect(error).toBeDefined();
      user.deletedAt = null;
      await user.save();
    }
  });

  it("try to create comment with invalid subreddit name", async () => {
    try {
      await createCommentService(
        {
          content: { text: "Comment for testing" },
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

  it("try to create comment to locked post", async () => {
    try {
      post1.moderation.lock = true;
      await post1.save();

      await createCommentService(
        {
          content: { text: "Comment for testing" },
          parentId: post1._id,
          postId: post1._id,
          parentType: "post",
          level: 1,
          haveSubreddit: true,
          subredditName: "subreddit",
          username: user.username,
          userId: user._id,
        },
        post1
      );
    } catch (error) {
      expect(error).toBeDefined();
      post1.moderation.lock = false;
      await post1.save();
    }
  });

  it("try to create comment to locked comment", async () => {
    try {
      firstLevelComment1.moderation.lock = true;
      await firstLevelComment1.save();

      await createCommentService(
        {
          content: { text: "Comment for testing" },
          parentId: firstLevelComment1._id,
          postId: post1._id,
          parentType: "comment",
          level: 2,
          haveSubreddit: true,
          subredditName: "subreddit",
          username: user.username,
          userId: user._id,
        },
        post1
      );
    } catch (error) {
      expect(error).toBeDefined();
      firstLevelComment1.moderation.lock = false;
      await firstLevelComment1.save();
    }
  });

  // eslint-disable-next-line max-len
  it("try to create comment with all valid parameters and without subreddit", async () => {
    const result = await createCommentService(
      {
        content: { text: "Comment for testing" },
        parentId: post._id,
        postId: post._id,
        parentType: "post",
        level: 1,
        haveSubreddit: false,
        username: user.username,
        userId: user._id,
      },
      post
    );
    expect(result.statusCode).toEqual(201);
    await Comment.deleteOne({ content: { text: "Comment for testing" } });
  });

  // eslint-disable-next-line max-len
  it("try to create comment with all valid parameters and with subreddit", async () => {
    const result = await createCommentService(
      {
        content: { text: "Comment for testing" },
        parentId: post1._id,
        postId: post1._id,
        parentType: "post",
        level: 1,
        haveSubreddit: true,
        subredditName: "subreddit",
        username: user.username,
        userId: user._id,
      },
      post1
    );
    expect(result.statusCode).toEqual(201);
    await Comment.deleteOne({ content: { text: "Comment for testing" } });
  });

  // eslint-disable-next-line max-len
  it("try to create comment to post in a deleted subreddit", async () => {
    try {
      subreddit.deletedAt = Date.now();
      await subreddit.save();

      await createCommentService(
        {
          content: { text: "Comment for testing" },
          parentId: post1._id,
          postId: post1._id,
          parentType: "post",
          level: 1,
          haveSubreddit: true,
          subredditName: "subreddit",
          username: user.username,
          userId: user._id,
        },
        post1
      );
    } catch (error) {
      expect(error).toBeDefined();
      subreddit.deletedAt = null;
      await subreddit.save();
    }
  });

  // eslint-disable-next-line max-len
  it("try to create comment without subreddit to post with subreddit", async () => {
    try {
      await createCommentService(
        {
          content: { text: "Comment for testing" },
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
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  // eslint-disable-next-line max-len
  it("try to create comment to private subreddit", async () => {
    try {
      await createCommentService(
        {
          content: { text: "Comment for testing" },
          parentId: privatePost._id,
          postId: privatePost._id,
          parentType: "post",
          level: 1,
          haveSubreddit: true,
          subredditName: "privateSR",
          username: loggedInUser.username,
          userId: loggedInUser._id,
        },
        privatePost
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  // eslint-disable-next-line max-len
  it("try to create comment to another comment with all valid parameters and with subreddit", async () => {
    const result = await createCommentService(
      {
        content: { text: "Comment for testing" },
        parentId: firstLevelComment1._id,
        postId: post1._id,
        parentType: "comment",
        level: 2,
        haveSubreddit: true,
        subredditName: "subreddit",
        username: user.username,
        userId: user._id,
      },
      post1
    );
    expect(result.statusCode).toEqual(201);
    await Comment.deleteOne({ content: { text: "Comment for testing" } });
  });

  // eslint-disable-next-line max-len
  it("try to create comment with all valid parameters and without subreddit to post of other user", async () => {
    const result = await createCommentService(
      {
        content: { text: "Comment for testing" },
        parentId: post2._id,
        postId: post2._id,
        parentType: "post",
        level: 1,
        haveSubreddit: false,
        username: user.username,
        userId: user._id,
      },
      post2
    );
    expect(result.statusCode).toEqual(201);
    await Comment.deleteOne({ content: { text: "Comment for testing" } });
  });

  it("should have commentTreeListingService function", () => {
    expect(commentTreeListingService).toBeDefined();
  });

  it("try to get the comments of a post with no comments", async () => {
    const result = await commentTreeListingService(loggedInUser, post2, {});
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  it("try to get the comments of a post with 3 comments", async () => {
    const result = await commentTreeListingService(loggedInUser, post1, {});
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(3);
  });

  // eslint-disable-next-line max-len
  it("try to use after parameter with commentTreeListingService function", async () => {
    const result = await commentTreeListingService(loggedInUser, post1, {
      after: firstLevelComment1._id,
      sort: "best",
    });
    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("try to use before parameter with commentTreeListingService function", async () => {
    const result = await commentTreeListingService(loggedInUser, post1, {
      before: firstLevelComment3._id,
      sort: "best",
    });
    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("try to use limit parameter with commentTreeListingService function", async () => {
    const result = await commentTreeListingService(loggedInUser, post1, {
      sort: "best",
      limit: 1,
    });
    expect(result.data.children.length).toEqual(1);
  });

  // eslint-disable-next-line max-len
  it("try to the comments of a post and let other user upvote them", async () => {
    loggedInUser.upvotedComments.push(firstLevelComment1._id);
    await loggedInUser.save();

    const result = await commentTreeListingService(loggedInUser, post1, {
      sort: "best",
      limit: 1,
    });
    expect(result.data.children[0].vote).toEqual(1);
  });

  // eslint-disable-next-line max-len
  it("try to the comments of a post and let other user downvote them", async () => {
    loggedInUser.downvotedComments.push(firstLevelComment2._id);
    await loggedInUser.save();

    const result = await commentTreeListingService(loggedInUser, post1, {
      sort: "best",
      after: firstLevelComment1._id,
      limit: 1,
    });
    expect(result.data.children[0].vote).toEqual(-1);
  });

  // eslint-disable-next-line max-len
  it("try to the comments of a post and let other user save them", async () => {
    loggedInUser.savedComments.push(firstLevelComment1._id);
    await loggedInUser.save();

    const result = await commentTreeListingService(loggedInUser, post1, {
      sort: "best",
      limit: 1,
    });
    expect(result.data.children[0].saved).toEqual(true);
  });

  // eslint-disable-next-line max-len
  it("try to get the comments of a post and let other user follow them", async () => {
    loggedInUser.followedComments.push(firstLevelComment1._id);
    await loggedInUser.save();

    const result = await commentTreeListingService(loggedInUser, post1, {
      sort: "best",
      limit: 1,
    });
    expect(result.data.children[0].followed).toEqual(true);
  });

  it("should have commentTreeOfCommentListingService function", () => {
    expect(commentTreeOfCommentListingService).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("try to get the comments of a parent comment with no comments", async () => {
    const result = await commentTreeOfCommentListingService(
      loggedInUser,
      post1,
      firstLevelComment3,
      {}
    );
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  // eslint-disable-next-line max-len
  it("try to get the comments of a parent comment with 3 comments", async () => {
    const result = await commentTreeOfCommentListingService(
      loggedInUser,
      post1,
      firstLevelComment1,
      {}
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(3);
  });

  // eslint-disable-next-line max-len
  it("try to use after parameter with commentTreeOfCommentListingService function", async () => {
    const result = await commentTreeOfCommentListingService(
      loggedInUser,
      post1,
      firstLevelComment1,
      {
        after: secondLevelComment1._id,
        sort: "best",
      }
    );
    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("try to use before parameter with commentTreeOfCommentListingService function", async () => {
    const result = await commentTreeOfCommentListingService(
      loggedInUser,
      post1,
      firstLevelComment1,
      {
        before: secondLevelComment3._id,
        sort: "best",
      }
    );
    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("try to use limit parameter with commentTreeOfCommentListingService function", async () => {
    const result = await commentTreeOfCommentListingService(
      loggedInUser,
      post1,
      firstLevelComment1,
      {
        sort: "best",
        limit: 1,
      }
    );
    expect(result.data.children.length).toEqual(1);
  });

  // eslint-disable-next-line max-len
  it("try to the comments of a post and let other user upvote them", async () => {
    loggedInUser.upvotedComments.push(secondLevelComment1._id);
    await loggedInUser.save();

    const result = await commentTreeOfCommentListingService(
      loggedInUser,
      post1,
      firstLevelComment1,
      {
        sort: "best",
        limit: 1,
      }
    );
    expect(result.data.children[0].vote).toEqual(1);
  });

  // eslint-disable-next-line max-len
  it("try to the comments of a post and let other user downvote them", async () => {
    loggedInUser.downvotedComments.push(secondLevelComment2._id);
    await loggedInUser.save();

    const result = await commentTreeOfCommentListingService(
      loggedInUser,
      post1,
      firstLevelComment1,
      {
        sort: "best",
        after: secondLevelComment1._id,
        limit: 1,
      }
    );
    expect(result.data.children[0].vote).toEqual(-1);
  });

  // eslint-disable-next-line max-len
  it("try to the comments of a post and let other user save them", async () => {
    loggedInUser.savedComments.push(secondLevelComment1._id);
    await loggedInUser.save();

    const result = await commentTreeOfCommentListingService(
      loggedInUser,
      post1,
      firstLevelComment1,
      {
        sort: "best",
        limit: 1,
      }
    );
    expect(result.data.children[0].saved).toEqual(true);
  });

  // eslint-disable-next-line max-len
  it("try to get the comments of a post and let other user follow them", async () => {
    loggedInUser.followedComments.push(secondLevelComment1._id);
    await loggedInUser.save();

    const result = await commentTreeOfCommentListingService(
      loggedInUser,
      post1,
      firstLevelComment1,
      {
        sort: "best",
        limit: 1,
      }
    );
    expect(result.data.children[0].followed).toEqual(true);
  });
});
