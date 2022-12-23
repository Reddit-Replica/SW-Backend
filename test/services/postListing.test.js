/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
  homePostsListing,
  prepareFiltering,
} from "../../services/PostListing.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "../../models/User.js";
import Subreddit from "../../models/Community.js";
import Post from "../../models/Post.js";

// eslint-disable-next-line max-statements
describe("Testing subreddit service functions", () => {
  let userOne = {},
    userTwo = {},
    userThree = {},
    postOne = {},
    postTwo = {},
    postThree = {},
    postFour = {},
    subredditOne = {};
  beforeAll(async () => {
    await connectDatabase();

    userOne = await new User({
      username: "Noaman",
      email: "abdelrahmannoaman1@gmail.com",
      createdAt: Date.now(),
    }).save();

    userThree = await new User({
      username: "Beshoy",
      email: "Bosha@gmail.com",
      createdAt: Date.now(),
    }).save();

    subredditOne = await new Subreddit({
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
    }).save();

    postOne = await new Post({
      title: "Noaman post 1",
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      createdAt: Date.now(),
      usersCommented: [userOne.id],
      hotScore: 13652,
      bestScore: 2574,
      numberOfViews: 243,
      numberOfVotes: 1000,
      subredditName: subredditOne.title,
    }).save();

    postTwo = await new Post({
      title: "Noaman post 2",
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      createdAt: Date.now(),
      usersCommented: [userOne.id],
      hotScore: 23652,
      bestScore: 3574,
      numberOfViews: 343,
      numberOfVotes: 2000,
      subredditName: subredditOne.title,
    }).save();

    postThree = await new Post({
      title: "Beshoy post 1",
      ownerUsername: "Beshoy",
      ownerId: userThree.id,
      createdAt: Date.now(),
      usersCommented: [userOne.id],
      hotScore: 33652,
      bestScore: 4574,
      numberOfViews: 543,
      numberOfVotes: 6000,
    }).save();

    postFour = await new Post({
      title: "Beshoy post 2",
      ownerUsername: "Beshoy",
      ownerId: userThree.id,
      createdAt: Date.now(),
      usersCommented: [userOne.id],
      hotScore: 43652,
      bestScore: 5574,
      numberOfViews: 643,
      numberOfVotes: 7000,
    }).save();

    userTwo = await new User({
      username: "Hamdy",
      email: "bodynoaman1996@gmail.com",
      createdAt: Date.now(),
      joinedSubreddits: [
        {
          subredditId: subredditOne._id,
          name: subredditOne.title,
        },
      ],
      followedUsers: [userOne._id],
      moderatedSubreddits: [
        {
          subredditId: subredditOne._id,
          name: subredditOne.title,
        },
      ],
      savedPosts: [postOne._id],
      upvotedPosts: [postOne._id],
      downvotedPosts: [postTwo._id],
      spammedPosts: [postThree._id],
      hiddenPosts: [postFour._id],
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have homePostsListing function", () => {
    expect(homePostsListing).toBeDefined();
  });

  it("try homePostsListing function if the user already had the conversation", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "",
      },
      "new",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });

  it("try homePostsListing function with hot", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "",
      },
      "hot",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });

  it("try homePostsListing function with best", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "",
      },
      "best",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });

  it("try homePostsListing function with trending", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "",
      },
      "trending",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });

  it("try homePostsListing function with top", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });

  it("try homePostsListing function with top year", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "year",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });
  it("try homePostsListing function with top year and not loggedIn", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "year",
      },
      "top",
      false
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(4);
  });

  it("try homePostsListing function with top", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "month",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });

  it("try homePostsListing function with top", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "week",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });

  it("try homePostsListing function with top", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "day",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });

  it("try homePostsListing function with top", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "hour",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });

  it("try homePostsListing function with top", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: "",
        time: "day",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });

  it("try homePostsListing function with top", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        after: 1,
        limit: "",
        time: "day",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(2);
  });
  it("try homePostsListing function with top", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        before: 5,
        limit: "",
        time: "day",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(3);
  });
  it("try homePostsListing function with top", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        limit: 1,
        time: "day",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(1);
  });
  it("try homePostsListing function with top", async () => {
    const result = await homePostsListing(
      userTwo,
      {
        after: 20,
        limit: "",
        time: "day",
      },
      "top",
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(0);
  });

  it("should have prepareFiltering function", () => {
    expect(prepareFiltering).toBeDefined();
  });

  it("try prepareFiltering function if the user already had the conversation", async () => {
    const result = await prepareFiltering(
      userTwo,
      {
        after: -1,
        time: "",
      },
      "new",
      true
    );
    expect(result.skip).toEqual(0);
  });
  it("try prepareFiltering function if the user already had the conversation", async () => {
    const result = await prepareFiltering(
      userTwo,
      {
        before: -1,
        limit: 50,
        time: "",
      },
      "new",
      true
    );
    expect(result.skip).toEqual(0);
  });
});
