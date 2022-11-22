import { prepareListingPosts, postListing } from "../../utils/prepareListing";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";

// eslint-disable-next-line max-statements
describe("Testing prepare listing functions", () => {
  let user = {},
    post1 = {};
  beforeAll(async () => {
    await connectDatabase();
    user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user.save();

    post1 = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
    });
    await post1.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have prepareListingPosts function", () => {
    expect(prepareListingPosts).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("try to send empty listing parameters to prepareListingPosts", async () => {
    const result = await prepareListingPosts({});
    expect(result).toEqual({
      limit: 25,
      listing: null,
      sort: { createdAt: -1 },
      time: null,
    });
  });

  it("try to set sort = new in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ sort: "new" });
    expect(result.sort).toEqual({ createdAt: -1 });
  });

  it("try to set sort = hot in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ sort: "hot" });
    expect(result.sort).toEqual({ score: -1 });
  });

  it("try to set sort = invalid in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ sort: "invalid" });
    expect(result.sort).toEqual({ createdAt: -1 });
  });

  // eslint-disable-next-line max-len
  it("try to set sort = top without setting time in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ sort: "top" });
    expect(result.sort).toBeNull();
  });

  // eslint-disable-next-line max-len
  it("try to set sort = top with time = hour in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ sort: "top", time: "hour" });
    expect(result.time).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("try to set sort = top with time = day in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ sort: "top", time: "day" });
    expect(result.time).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("try to set sort = top with time = week in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ sort: "top", time: "week" });
    expect(result.time).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("try to set sort = top with time = month in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ sort: "top", time: "month" });
    expect(result.time).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("try to set sort = top with time = year in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ sort: "top", time: "year" });
    expect(result.time).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("try to set sort = top with time = invalid in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ sort: "top", time: "invalid" });
    expect(result.time).toBeNull();
  });

  it("try to set limit bigger than 100 in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ limit: 150 });
    expect(result.limit).toEqual(100);
  });

  // eslint-disable-next-line max-len
  it("try to set limit smaller than or equal 0 in prepareListingPosts", async () => {
    let result = await prepareListingPosts({ limit: 0 });
    expect(result.limit).toEqual(1);
    result = await prepareListingPosts({ limit: -5 });
    expect(result.limit).toEqual(1);
  });

  it("try to set limit = 10 in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ limit: 10 });
    expect(result.limit).toEqual(10);
  });

  it("try to set before with invalid id in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ before: "invalid" });
    expect(result.listing).toBeNull();
  });

  it("try to set after with invalid id in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ after: "invalid" });
    expect(result.listing).toBeNull();
  });

  it("try to set after with valid id in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ after: post1._id });
    expect(result.listing).toEqual({
      type: "createdAt",
      value: { $lt: post1.createdAt },
    });
  });

  it("try to set before with valid id in prepareListingPosts", async () => {
    const result = await prepareListingPosts({ before: post1._id });
    expect(result.listing).toEqual({
      type: "createdAt",
      value: { $gt: post1.createdAt },
    });
  });

  // eslint-disable-next-line max-len
  it("try to set before with valid id and sort = hot in prepareListingPosts", async () => {
    const result = await prepareListingPosts({
      before: post1._id,
      sort: "hot",
    });
    expect(result.listing.type).toEqual("score");
  });

  // eslint-disable-next-line max-len
  it("try to set after with valid id and sort = hot in prepareListingPosts", async () => {
    const result = await prepareListingPosts({
      after: post1._id,
      sort: "hot",
    });
    expect(result.listing.type).toEqual("score");
  });

  it("should have postListing function", () => {
    expect(postListing).toBeDefined();
  });

  it("try to call postListing with no parameters to postListing", async () => {
    const result = await postListing({});
    expect(result).toEqual({
      find: {
        deletedAt: null,
      },
      limit: 25,
      sort: {
        createdAt: -1,
      },
    });
  });

  it("try to set sort = new in postListing", async () => {
    const result = await postListing({ sort: "new" });
    expect(result.sort).toEqual({ createdAt: -1 });
  });

  it("try to set sort = hot in postListing", async () => {
    const result = await postListing({ sort: "hot" });
    expect(result.sort).toEqual({ score: -1 });
  });

  it("try to set sort = invalid in postListing", async () => {
    const result = await postListing({ sort: "invalid" });
    expect(result.sort).toEqual({ createdAt: -1 });
  });

  it("try to set sort = top without setting time in postListing", async () => {
    const result = await postListing({ sort: "top" });
    expect(result.sort).toBeNull();
  });

  it("try to set sort = top with time = hour in postListing", async () => {
    const result = await postListing({ sort: "top", time: "hour" });
    expect(result.sort).toBeNull();
    expect(result.find.createdAt).toBeDefined();
  });

  it("try to set sort = top with time = day in postListing", async () => {
    const result = await postListing({ sort: "top", time: "day" });
    expect(result.sort).toBeNull();
    expect(result.find.createdAt).toBeDefined();
  });

  it("try to set sort = top with time = week in postListing", async () => {
    const result = await postListing({ sort: "top", time: "week" });
    expect(result.sort).toBeNull();
    expect(result.find.createdAt).toBeDefined();
  });

  it("try to set sort = top with time = month in postListing", async () => {
    const result = await postListing({ sort: "top", time: "month" });
    expect(result.sort).toBeNull();
    expect(result.find.createdAt).toBeDefined();
  });

  it("try to set sort = top with time = year in postListing", async () => {
    const result = await postListing({ sort: "top", time: "year" });
    expect(result.sort).toBeNull();
    expect(result.find.createdAt).toBeDefined();
  });

  it("try to set sort = top with time = invalid in postListing", async () => {
    const result = await postListing({ sort: "top", time: "invalid" });
    expect(result.find.createdAt).toBeUndefined();
  });

  it("try to set limit bigger than 100 in postListing", async () => {
    const result = await postListing({ limit: 150 });
    expect(result.limit).toEqual(100);
  });

  it("try to set limit smaller than or equal 0 in postListing", async () => {
    let result = await postListing({ limit: 0 });
    expect(result.limit).toEqual(1);
    result = await postListing({ limit: -5 });
    expect(result.limit).toEqual(1);
  });

  it("try to set limit = 10 in postListing", async () => {
    const result = await postListing({ limit: 10 });
    expect(result.limit).toEqual(10);
  });

  it("try to set before with invalid id in postListing", async () => {
    const result = await postListing({ before: "invalid" });
    expect(result.find).toEqual({ deletedAt: null });
  });

  it("try to set after with invalid id in postListing", async () => {
    const result = await postListing({ after: "invalid" });
    expect(result.find).toEqual({ deletedAt: null });
  });

  it("try to set after with valid id in postListing", async () => {
    const result = await postListing({ after: post1._id });
    expect(result.find).toEqual({
      createdAt: { $lt: post1.createdAt },
      deletedAt: null,
    });
  });

  it("try to set before with valid id in postListing", async () => {
    const result = await postListing({ before: post1._id });
    expect(result.find).toEqual({
      createdAt: { $gt: post1.createdAt },
      deletedAt: null,
    });
  });

  // eslint-disable-next-line max-len
  it("try to set before with valid id and sort = hot in postListing", async () => {
    const result = await postListing({
      before: post1._id,
      sort: "hot",
    });
    expect(result.find.score).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("try to set after with valid id and sort = hot in postListing", async () => {
    const result = await postListing({
      after: post1._id,
      sort: "hot",
    });
    expect(result.find.score).toBeDefined();
  });
});
