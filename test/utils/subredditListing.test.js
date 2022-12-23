/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
  subredditListing,
  extraPostsListing,
} from "../../utils/prepareSubreddit.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Subreddit from "../../models/Community.js";
import Post from "../../models/Post.js";

// eslint-disable-next-line max-statements
describe("Testing prepare subreddit listing service functions", () => {
  let userOne = {},
    userTwo = {},
    userThree = {},
    postOne={},
    subreddit = {};
  beforeAll(async () => {
    await connectDatabase();

    userOne = await new User({
      username: "Noaman",
      email: "abdelrahmannoaman1@gmail.com",
      createdAt: Date.now(),
    }).save();

    userTwo = await new User({
      username: "Hamdy",
      email: "bodynoaman1996@gmail.com",
      createdAt: Date.now(),
    }).save();

    userThree = await new User({
      username: "Beshoy",
      email: "Bosha@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit = await new Subreddit({
      title: "noamansubreddit",
      viewName: "no3mn ygd3an",
      category: "Sports",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
    }).save();

  });

  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have subredditListing function", () => {
    expect(subredditListing).toBeDefined();
  });

  it("try subredditListing function with no before,after,limit", async () => {
    const result = await subredditListing("News", "", "", "", false);
    expect(result).toEqual({
      sort: { members: -1, title: 1 },
      query: {
        members: { $lte: subreddit.members },
      },
      limit: 25,
    });
  });

  it("try subredditListing function with no after,limit", async () => {
    const result = await subredditListing("News", subreddit.id, "", "", false);
    expect(result).toEqual({
      sort: { members: -1, title: 1 },
      query: {
        members: { $gt: subreddit.members },
      },
      limit: 25,
    });
  });

  it("try subredditListing function if the user already had the conversation", async () => {
    const result = await subredditListing("News", "", subreddit.id, "", false);
    expect(result).toEqual({
      sort: { members: -1, title: 1 },
      query: {
        members: { $lt: subreddit.members },
      },
      limit: 25,
    });
  });
  it("try subredditListing function if the user already had the conversation", async () => {
    const result = await subredditListing("News", subreddit.id, "", "", true);
    expect(result).toEqual({
      sort: { members: -1, title: 1 },
      query: {
        members: { $gt: subreddit.members },
        category: "News",
      },
      limit: 25,
    });
  });
//-------------------------------------------------------------------------------------------------------------
  it("should have extraPostsListing function", () => {
    expect(extraPostsListing).toBeDefined();
  });

  it("try extraPostsListing function with no before,after,limit,time and hot", async () => {
    try{
        await extraPostsListing("", "", "", "hot", "");
}catch(e){
    expect(e.message).toEqual('No Posts found');
    expect(e.statusCode).toEqual(404);
}
  });

  it("try extraPostsListing function with no before,after,limit,time and hot", async () => {
    postOne = await new Post({
        title: "Noaman post 1",
        ownerUsername: "Noaman",
        ownerId: userOne.id,
        createdAt: Date.now(),
        hotScore: 13652,
        bestScore: 2574,
        numberOfViews: 243,
        numberOfVotes: 1000,
        subredditName: subreddit.title,
      }).save();
    const result = await extraPostsListing("", "", "", "hot", "");
    expect(result).toEqual({
      sort : { hotScore: -1 },
      query: {
        hotScore: { $lte: postOne.hotScore },
      },
      limit: 25,
    });
  });
  it("try extraPostsListing function with no before,after,limit,time and best", async () => {
    const result = await extraPostsListing(postOne.id, "", "", "best", "");
    expect(result).toEqual({
      sort : { bestScore: -1 },
      query: {
        bestScore: { $gte: postOne.bestScore },
      },
      limit: 25,
    });
  });

  it("try extraPostsListing function with no before,after,limit,time and new", async () => {
    const result = await extraPostsListing("", postOne.id, "", "new", "");
    expect(result).toEqual({
      sort : { createdAt: -1 },
      query: {
        createdAt: { $lte: postOne.createdAt },
      },
      limit: 25,
    });
  });
  it("try extraPostsListing function with no before,after,limit,time and trending", async () => {
    const result = await extraPostsListing("","", "", "trending", "");
    expect(result).toEqual({
      sort : { numberOfViews: -1 },
      query: {
        numberOfViews: { $lte: postOne.numberOfViews },
      },
      limit: 25,
    });
  });
  it("try extraPostsListing function with no before,after,limit year and top", async () => {
    const result = await extraPostsListing("","", "", "top", "year");
    let filteringDate = new Date();
    filteringDate.setFullYear(filteringDate.getFullYear() - 1);
    expect(result).toEqual({
      sort : { numberOfVotes: -1 },
      query: {
        numberOfVotes: { $lte: postOne.numberOfVotes },
        createdAt:result.query.createdAt
      },
      limit: 25,
    });
  });
  it("try extraPostsListing function with no before,after,limit month and top", async () => {
    const result = await extraPostsListing("","", "", "top", "month");
    let filteringDate = new Date();
    filteringDate.setFullYear(
        filteringDate.getFullYear(),
        filteringDate.getMonth() - 1
      );
      expect(result).toEqual({
      sort : { numberOfVotes: -1 },
      query: {
        numberOfVotes: { $lte: postOne.numberOfVotes },
        createdAt:result.query.createdAt
      },
      limit: 25,
    });
  });
  it("try extraPostsListing function with no before,after,limit week and top", async () => {
    const result = await extraPostsListing("","", "", "top", "week");
    let filteringDate = new Date();
    filteringDate.setFullYear(
        filteringDate.getFullYear(),
        filteringDate.getMonth(),
        filteringDate.getDate() - 7
      );
      expect(result).toEqual({
      sort : { numberOfVotes: -1 },
      query: {
        numberOfVotes: { $lte: postOne.numberOfVotes },
        createdAt:result.query.createdAt
      },
      limit: 25,
    });
  });
  it("try extraPostsListing function with no before,after,limit day and top", async () => {
    const result = await extraPostsListing("","", "", "top", "day");
    let filteringDate = new Date();
    filteringDate.setFullYear(
        filteringDate.getFullYear(),
        filteringDate.getMonth(),
        filteringDate.getDate() - 7
      );
      expect(result).toEqual({
      sort : { numberOfVotes: -1 },
      query: {
        numberOfVotes: { $lte: postOne.numberOfVotes },
        createdAt:result.query.createdAt
      },
      limit: 25,
    });
  });

  it("try extraPostsListing function with no before,after,limit hour and top", async () => {
    const result = await extraPostsListing("","", "", "top", "hour");
    let filteringDate = new Date();
    filteringDate.setHours(filteringDate.getHours() - 1);
    expect(result).toEqual({
      sort : { numberOfVotes: -1 },
      query: {
        numberOfVotes: { $lte: postOne.numberOfVotes },
        createdAt:result.query.createdAt
      },
      limit: 25,
    });
  });



});
