import { connectDatabase, closeDatabaseConnection } from "../database.js";
// eslint-disable-next-line max-len
import {
  listingUserProfileService,
  listingUserOverview,
} from "../../services/userProfileListing.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Comment from "./../../models/Comment.js";
import Subreddit from "../../models/Community.js";

// eslint-disable-next-line max-statements
describe("Testing user profile listing services functions", () => {
  let user = {},
    loggedInUser = {},
    post1 = {},
    comment1 = {},
    comment2 = {},
    post2 = {},
    post3 = {},
    subreddit = {};
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

    post1 = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await post1.save();

    comment1 = new Comment({
      parentId: post1._id,
      postId: post1._id,
      parentType: "post",
      subredditName: "subreddit",
      level: 1,
      content: { text: "Comment 1" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await comment1.save();

    comment2 = new Comment({
      parentId: comment1._id,
      postId: post1._id,
      parentType: "comment",
      subredditName: "subreddit",
      level: 2,
      content: { text: "Inner Comment 1" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 4,
      createdAt: Date.now(),
    });
    await comment2.save();

    post2 = new Post({
      title: "Second Post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 3,
      createdAt: Date.now(),
    });
    await post2.save();

    // user post
    post3 = new Post({
      title: "Third post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      numberOfVotes: 1,
      createdAt: Date.now(),
    });
    await post3.save();

    subreddit = await new Subreddit({
      title: "subreddit",
      viewName: "MangaReddit",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: user.username,
        userID: user._id,
      },
    }).save();

    user.posts.push(post1._id, post2._id, post3._id);
    user.commentedPosts.push(post1._id, post2._id, post3._id);
    await user.save();

    loggedInUser.posts.push(post3._id);
    loggedInUser.moderatedSubreddits.push({
      subredditId: subreddit._id,
      name: subreddit.title,
    });
    loggedInUser.savedPostsOnly.push(post1._id);
    await loggedInUser.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await Subreddit.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have listingUserProfileService function", () => {
    expect(listingUserProfileService).toBeDefined();
  });

  it("try to get the posts of a user who have no posts", async () => {
    const noPostsUser = new User({
      username: "noPosts",
      email: "noposts@gmail.com",
      createdAt: Date.now(),
    });
    await noPostsUser.save();
    const result = await listingUserProfileService(noPostsUser, user, "posts", {
      sort: "new",
    });
    expect(result).toEqual({
      statusCode: 200,
      data: { before: "", after: "", children: [] },
    });
  });

  it("try to get the posts of a user who have 3 posts", async () => {
    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "posts",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(3);
  });

  // eslint-disable-next-line max-len
  it("try to use after parameter with listingUserProfileService function", async () => {
    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "posts",
      { sort: "top", after: post1._id }
    );
    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("try to use before parameter with listingUserProfileService function", async () => {
    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "posts",
      { sort: "top", before: post3._id }
    );
    expect(result.data.children.length).toEqual(2);
  });

  it("try to get the upvoted posts of a user who have 1 post", async () => {
    user.upvotedPosts.push(post1._id);
    await user.save();

    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "upvotedPosts",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(1);
  });

  it("try to get the downvoted posts of a user who have 1 post", async () => {
    user.downvotedPosts.push(post1._id);
    await user.save();

    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "downvotedPosts",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(1);
  });

  it("try to get the hidden posts of a user who have 1 post", async () => {
    user.hiddenPosts.push(post1._id);
    await user.save();

    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "hiddenPosts",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(1);
  });

  it("try to get the history posts of a user who have 1 post", async () => {
    user.historyPosts.push(post1._id);
    await user.save();

    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "historyPosts",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(1);
  });

  // eslint-disable-next-line max-len
  it("try to get the posts of a user and let other users follow it", async () => {
    loggedInUser.followedPosts.push(post1._id);
    await loggedInUser.save();

    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "posts",
      { sort: "top" }
    );
    expect(result.data.children[0].data.followed).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  it("try to get the posts of a user and let other users up vote it", async () => {
    loggedInUser.upvotedPosts.push(post1._id);
    await loggedInUser.save();

    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "posts",
      { sort: "top" }
    );
    expect(result.data.children[0].data.votingType).toEqual(1);
  });

  // eslint-disable-next-line max-len
  it("try to get the posts of a user and let other users down vote it", async () => {
    loggedInUser.upvotedPosts = [];
    loggedInUser.downvotedPosts.push(post1._id);
    await loggedInUser.save();

    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "posts",
      { sort: "top" }
    );
    expect(result.data.children[0].data.votingType).toEqual(-1);
  });

  // eslint-disable-next-line max-len
  it("try to get the posts of a user and let other users save it", async () => {
    loggedInUser.savedPosts.push(post1._id);
    await loggedInUser.save();

    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "posts",
      { sort: "top" }
    );
    expect(result.data.children[0].data.saved).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  it("try to get the posts of a user and let other users spam it", async () => {
    loggedInUser.spammedPosts.push(post1._id);
    await loggedInUser.save();

    const result = await listingUserProfileService(
      user,
      loggedInUser,
      "posts",
      { sort: "top" }
    );
    expect(result.data.children[0].data.spammed).toBeTruthy();
  });

  it("should have listingUserOverview function", () => {
    expect(listingUserOverview).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("try to get the overview of a user who have no posts and no comments", async () => {
    const result = await listingUserOverview(
      loggedInUser,
      user,
      "commentedPosts",
      false,
      { sort: "top" }
    );

    expect(result).toEqual({
      statusCode: 200,
      data: { after: "", before: "", children: [] },
    });
  });

  // eslint-disable-next-line max-len
  it("try to get the overview of a user who have 3 posts with 2 comments", async () => {
    const result = await listingUserOverview(
      user,
      loggedInUser,
      "commentedPosts",
      false,
      { sort: "top" }
    );

    expect(result.data.children.length).toEqual(3);
    expect(result.data.children[0].data.comments.length).toEqual(2);
    expect(result.data.children[1].data.comments.length).toEqual(0);
    expect(result.data.children[2].data.comments.length).toEqual(0);
  });

  // eslint-disable-next-line max-len
  it("try to use after parameter with listingUserOverview function", async () => {
    const result = await listingUserOverview(
      user,
      loggedInUser,
      "commentedPosts",
      false,
      { sort: "top", after: post1._id }
    );

    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("try to use before parameter with listingUserOverview function", async () => {
    const result = await listingUserOverview(
      user,
      loggedInUser,
      "commentedPosts",
      false,
      { sort: "top", before: post3._id }
    );

    expect(result.data.children.length).toEqual(2);
  });

  // eslint-disable-next-line max-len
  it("check if post and comments in our subreddit when listing by a different user", async () => {
    const result = await listingUserOverview(
      user,
      loggedInUser,
      "commentedPosts",
      false,
      { sort: "top" }
    );

    expect(result.data.children[0].data.post.inYourSubreddit).toBeTruthy();
    expect(
      result.data.children[0].data.comments[0].inYourSubreddit
    ).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  it("check if post and comments in our subreddit when listing by the same user", async () => {
    user.hiddenPosts = [];
    await user.save();

    const result = await listingUserOverview(
      user,
      user,
      "commentedPosts",
      false,
      { sort: "top" }
    );
    expect(result.data.children[0].data.post.inYourSubreddit).toBeTruthy();
    expect(
      result.data.children[0].data.comments[0].inYourSubreddit
    ).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  it("try to get the saved comments and posts for user with no saved posts or comments", async () => {
    const result = await listingUserOverview(user, user, "savedPosts", false, {
      sort: "top",
    });

    expect(result).toEqual({
      statusCode: 200,
      data: { after: "", before: "", children: [] },
    });
  });

  // eslint-disable-next-line max-len
  it("try to get the saved comments and posts for user with 1 saved posts and 1 saved comments", async () => {
    user.savedPosts.push(post1._id);
    user.savedComments.push(comment1._id);
    await user.save();

    const result = await listingUserOverview(user, user, "savedPosts", false, {
      sort: "top",
    });
    expect(result.data.children[0].data.comments.length).toEqual(1);
  });

  // eslint-disable-next-line max-len
  it("try to get the comments for user no comments", async () => {
    const result = await listingUserOverview(
      loggedInUser,
      user,
      "commentedPosts",
      true,
      {
        sort: "top",
      }
    );
    expect(result.data.children.length).toEqual(0);
  });

  // eslint-disable-next-line max-len
  it("try to get the comments for user with 2 comments", async () => {
    const result = await listingUserOverview(
      user,
      loggedInUser,
      "commentedPosts",
      true,
      {
        sort: "top",
      }
    );
    expect(result.data.children[0].data.comments.length).toEqual(2);
  });
});
