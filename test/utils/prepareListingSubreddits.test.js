/* eslint-disable max-len */
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  prepareListingSubreddits,
  subredditListing,
} from "../../utils/prepareSubredditListing";
import User from "./../../models/User.js";
import Subreddit from "./../../models/Community.js";
import mongoose from "mongoose";

// eslint-disable-next-line max-statements
describe("Testing Listing Subreddits Utilities", () => {
  let subreddit1 = {},
    subreddit2 = {},
    subreddit3 = {},
    subreddit4 = {},
    user = {};
  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit1 = await new Subreddit({
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

    subreddit2 = await new Subreddit({
      title: "subreddit2",
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

    subreddit3 = await new Subreddit({
      title: "subreddit3",
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

    subreddit4 = await new Subreddit({
      title: "subreddit4",
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
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have prepareListingSubreddits defined", () => {
    expect(prepareListingSubreddits).toBeDefined();
  });

  it("Test prepareListingSubreddits with both after & before", async () => {
    const result = await prepareListingSubreddits({
      limit: 10,
      after: subreddit1.id.toString(),
      before: subreddit2.id.toString(),
    });
    expect(result.limit).toEqual(10);
    expect(result.listing).toBeNull();
  });

  it("Test prepareListingSubreddits with no after & before", async () => {
    const result = await prepareListingSubreddits({
      limit: 10,
    });
    expect(result.limit).toEqual(10);
    expect(result.listing).toBeNull();
  });

  it("Test prepareListingSubreddits with after", async () => {
    const result = await prepareListingSubreddits({
      limit: 15,
      after: subreddit1.id.toString(),
    });
    expect(result.limit).toEqual(15);
    expect(result.listing).toEqual({
      type: "_id",
      value: { $gt: subreddit1.id.toString() },
    });
  });

  it("Test prepareListingSubreddits with a not-found before id", async () => {
    const result = await prepareListingSubreddits({
      limit: 15,
      before: mongoose.Types.ObjectId.generate(10),
    });
    expect(result.limit).toEqual(15);
    expect(result.listing).toBeNull();
  });

  it("Test prepareListingSubreddits with an invalid before id", async () => {
    const result = await prepareListingSubreddits({
      limit: 15,
      before: "invalidID",
    });
    expect(result.limit).toEqual(15);
    expect(result.listing).toBeNull();
  });

  it("Test prepareListingSubreddits with an invalid after id", async () => {
    const result = await prepareListingSubreddits({
      limit: 15,
      after: "invalidID",
    });
    expect(result.limit).toEqual(15);
    expect(result.listing).toBeNull();
  });

  it("Test prepareListingSubreddits with no limit", async () => {
    const result = await prepareListingSubreddits({
      before: subreddit1.id.toString(),
    });
    expect(result.limit).toEqual(25);
  });

  it("Test prepareListingSubreddits with an invalid after id", async () => {
    const result = await prepareListingSubreddits({
      limit: 15,
      after: mongoose.Types.ObjectId.generate(10),
    });
    expect(result.limit).toEqual(15);
    expect(result.listing).toBeNull();
  });

  it("Test prepareListingSubreddits with before", async () => {
    const result = await prepareListingSubreddits({
      limit: 20,
      before: subreddit1.id.toString(),
    });
    expect(result.limit).toEqual(20);
    expect(result.listing).toEqual({
      type: "_id",
      value: { $lt: subreddit1.id.toString() },
    });
  });

  it("Test prepareListingSubreddits with over-limit", async () => {
    const result = await prepareListingSubreddits({
      limit: 200,
    });
    expect(result.limit).toEqual(100);
    expect(result.listing).toBeNull();
  });

  it("Test prepareListingSubreddits with under-limit", async () => {
    const result = await prepareListingSubreddits({
      limit: -1,
    });
    expect(result.limit).toEqual(1);
    expect(result.listing).toBeNull();
  });

  it("Should have subredditListing defined", () => {
    expect(subredditListing).toBeDefined();
  });

  it("Test subredditListing", async () => {
    const result = await subredditListing({
      limit: 30,
      after: subreddit1.id.toString(),
    });
    expect(result.limit).toEqual(30);
    expect(result.find).toEqual({
      deletedAt: null,
      _id: { $gt: subreddit1.id.toString() },
    });
  });

  it("Test subredditListing with no listing", async () => {
    const result = await subredditListing({
      limit: 30,
    });
    expect(result.limit).toEqual(30);
    expect(result.find).toEqual({
      deletedAt: null,
    });
  });
});
