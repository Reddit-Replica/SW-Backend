import { connectDatabase, closeDatabaseConnection } from "../database.js";
// eslint-disable-next-line max-len
import { listingUserProfileService } from "../../services/userProfileListing.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";

// eslint-disable-next-line max-statements
describe("Testing user profile listing services functions", () => {
  let user = {},
    loggedInUser = {},
    post1 = {},
    post2 = {},
    post3 = {};
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

    post2 = new Post({
      title: "Second Post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
    });
    await post2.save();

    post3 = new Post({
      title: "Third post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
    });
    await post3.save();

    user.posts.push(post1._id, post2._id, post3._id);
    await user.save();
  });
  afterAll(async () => {
    await user.remove();
    await loggedInUser.remove();
    await post1.remove();
    await post2.remove();
    await post3.remove();
    await closeDatabaseConnection();
  });

  it("should have listingUserProfileService function", () => {
    expect(listingUserProfileService).toBeDefined();
  });

  it("try to get the posts of a user who have no posts", async () => {
    const result = await listingUserProfileService(
      loggedInUser,
      user,
      "posts",
      { sort: "new" }
    );
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
});
