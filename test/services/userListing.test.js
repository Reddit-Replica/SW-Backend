/* eslint-disable max-len */
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  checkBanPeriod,
  listingBannedUsers,
  getBannedUsersAfter,
  getBannedUsersBefore,
  getBannedUsersFirstTime,
  getBlockedUsersAfter,
  getBlockedUsersBefore,
  getBlockedUsersFirstTime,
  listingBlockedUsers,
} from "../../services/userListing.js";
import {
  prepareListingUsers,
  userListing,
} from "../../utils/prepareUserListing.js";
import User from "./../../models/User.js";
import Subreddit from "./../../models/Community.js";
import mongoose from "mongoose";

// eslint-disable-next-line max-statements
describe("Testing User Listing Service functions", () => {
  let user1 = {},
    user2 = {},
    user3 = {},
    user4 = {},
    subreddit = {};
  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    user1 = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    user2 = await new User({
      username: "ahmed",
      email: "ahmed@gmail.com",
      createdAt: Date.now(),
    }).save();

    user3 = await new User({
      username: "mohamed",
      email: "mohamed@gmail.com",
      createdAt: Date.now(),
    }).save();

    user4 = await new User({
      username: "ziad",
      email: "ziad@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit = await new Subreddit({
      title: "subreddit",
      viewName: "SR",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: "hamdy",
        userID: user1.id,
      },
      createdAt: Date.now(),
    }).save();

    subreddit.bannedUsers.push(
      {
        userId: user2.id,
        username: user2.username,
        bannedAt: Date.now(),
        banPeriod: 1,
      },
      {
        userId: user3.id,
        username: user3.username,
        bannedAt: Date.now(),
        banPeriod: 2,
      },
      {
        userId: user4.id,
        username: user4.username,
        bannedAt: Date.now(),
        banPeriod: 3,
      }
    );
    await subreddit.save();
    user1.blockedUsers.push(
      {
        blockedUserId: user2.id,
        blockDate: Date.now(),
      },
      {
        blockedUserId: user3.id,
        blockDate: Date.now(),
      },
      {
        blockedUserId: user4.id,
        blockDate: Date.now(),
      }
    );
    await user1.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have checkBanPeriod defined", () => {
    expect(checkBanPeriod).toBeDefined();
  });

  it("Test checkBanPeriod for a not-finished ban period", async () => {
    await checkBanPeriod(subreddit);
    subreddit = await Subreddit.findById(subreddit.id);
    expect(subreddit.bannedUsers.length).toEqual(3);
  });

  it("Test checkBanPeriod for a finished ban period", async () => {
    subreddit.bannedUsers[2].banPeriod = -1;
    await subreddit.save();
    await checkBanPeriod(subreddit);
    subreddit = await Subreddit.findById(subreddit.id);
    expect(subreddit.bannedUsers.length).toEqual(2);
  });

  it("Should have getBannedUsersFirstTime defined", () => {
    expect(getBannedUsersFirstTime).toBeDefined();
  });

  it("Test getBannedUsersFirstTime with under-limit", async () => {
    subreddit.bannedUsers.push({
      userId: user4.id,
      username: user4.username,
      bannedAt: Date.now(),
      banPeriod: 3,
    });
    await subreddit.save();
    const res = getBannedUsersFirstTime(subreddit, 2);
    expect(res.children.length).toEqual(2);
    expect(res.after.toString()).toEqual(user3.id.toString());
  });

  it("Test getBannedUsersFirstTime with over-limit", async () => {
    const res = getBannedUsersFirstTime(subreddit, 10);
    expect(res.children.length).toEqual(3);
    expect(res.after).toBeUndefined();
    expect(res.before).toBeUndefined();
  });

  it("Should have getBannedUsersBefore defined", () => {
    expect(getBannedUsersBefore).toBeDefined();
  });

  it("Test getBannedUsersBefore with invalid before", async () => {
    try {
      const invalidId = mongoose.Types.ObjectId.generate(10);
      getBannedUsersBefore(subreddit, 1, invalidId.toString());
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Invalid user id");
    }
  });

  it("Test getBannedUsersBefore with valid before & over-limit", async () => {
    const res = getBannedUsersBefore(subreddit, 8, user3.id.toString());
    expect(res.children.length).toEqual(1);
    expect(res.after.toString()).toEqual(user2.id.toString());
    expect(res.before).toBeUndefined();
  });

  it("Test getBannedUsersBefore with before & limit returning before only", async () => {
    const res = getBannedUsersBefore(subreddit, 1, user4.id.toString());
    expect(res.children.length).toEqual(1);
    expect(res.before.toString()).toEqual(user3.id.toString());
    expect(res.after).toBeUndefined();
  });

  it("Test getBannedUsersBefore with before & limit returning after only", async () => {
    const res = getBannedUsersBefore(subreddit, 1, user3.id.toString());
    expect(res.children.length).toEqual(1);
    expect(res.after.toString()).toEqual(user2.id.toString());
    expect(res.before).toBeUndefined();
  });

  it("Should have getBannedUsersAfter defined", () => {
    expect(getBannedUsersAfter).toBeDefined();
  });

  it("Test getBannedUsersAfter with invalid after", async () => {
    try {
      const invalidId = mongoose.Types.ObjectId.generate(10);
      getBannedUsersAfter(subreddit, 1, invalidId.toString());
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Invalid user id");
    }
  });

  it("Test getBannedUsersAfter with valid after & over-limit", async () => {
    const res = getBannedUsersAfter(subreddit, 10, user3.id.toString());
    expect(res.children.length).toEqual(1);
    expect(res.before.toString()).toEqual(user4.id.toString());
    expect(res.after).toBeUndefined();
  });

  it("Test getBannedUsersAfter with after & limit returning before only", async () => {
    const res = getBannedUsersAfter(subreddit, 2, user2.id.toString());
    expect(res.children.length).toEqual(2);
    expect(res.before.toString()).toEqual(user3.id.toString());
    expect(res.after).toBeUndefined();
  });

  it("Test getBannedUsersAfter with after & limit returning both after & before", async () => {
    const res = getBannedUsersAfter(subreddit, 1, user2.id.toString());
    expect(res.children.length).toEqual(1);
    expect(res.after.toString()).toEqual(user3.id.toString());
    expect(res.before.toString()).toEqual(user3.id.toString());
  });

  it("Should have listingBannedUsers defined", () => {
    expect(listingBannedUsers).toBeDefined();
  });

  it("Test listingBannedUsers with both after & before sent", async () => {
    try {
      await listingBannedUsers(
        3,
        user2.id.toString(),
        user2.id.toString(),
        subreddit
      );
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Can't set before and after");
    }
  });

  it("Test listingBannedUsers with before", async () => {
    subreddit.bannedUsers.push({
      userId: user1.id,
      username: user1.username,
      bannedAt: Date.now(),
      banPeriod: 3,
    });
    await subreddit.save();
    const res = await listingBannedUsers(
      3,
      user1.id.toString(),
      undefined,
      subreddit
    );
    expect(res.children.length).toEqual(3);
    expect(res.before).toBeUndefined();
    expect(res.after).toBeUndefined();
  });

  it("Test listingBannedUsers with after", async () => {
    const res = await listingBannedUsers(
      3,
      undefined,
      user2.id.toString(),
      subreddit
    );
    expect(res.children.length).toEqual(3);
    expect(res.before.toString()).toEqual(user3.id.toString());
    expect(res.after).toBeUndefined();
  });

  it("Should have getBlockedUsersFirstTime defined", () => {
    expect(getBlockedUsersFirstTime).toBeDefined();
  });

  it("Test getBlockedUsersFirstTime with under-limit", async () => {
    const res = getBlockedUsersFirstTime(user1, 2);
    expect(res.children.length).toEqual(2);
    expect(res.after.toString()).toEqual(user3.id.toString());
  });

  it("Test getBlockedUsersFirstTime with over-limit", async () => {
    const res = getBlockedUsersFirstTime(user1, 10);
    expect(res.children.length).toEqual(3);
    expect(res.after).toBeUndefined();
    expect(res.before).toBeUndefined();
  });

  it("Should have getBlockedUsersBefore defined", () => {
    expect(getBlockedUsersBefore).toBeDefined();
  });

  it("Test getBlockedUsersBefore with invalid before", async () => {
    try {
      const invalidId = mongoose.Types.ObjectId.generate(10);
      getBlockedUsersBefore(user1, 1, invalidId.toString());
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Invalid user id");
    }
  });

  it("Test getBlockedUsersBefore with valid before & over-limit", async () => {
    const res = getBlockedUsersBefore(user1, 8, user3.id.toString());
    expect(res.children.length).toEqual(1);
    expect(res.after.toString()).toEqual(user2.id.toString());
    expect(res.before).toBeUndefined();
  });

  it("Test getBlockedUsersBefore with before & limit returning before only", async () => {
    const res = getBlockedUsersBefore(user1, 1, user4.id.toString());
    expect(res.children.length).toEqual(1);
    expect(res.before.toString()).toEqual(user3.id.toString());
    expect(res.after).toBeUndefined();
  });

  it("Test getBlockedUsersBefore with before & limit returning after only", async () => {
    const res = getBlockedUsersBefore(user1, 1, user3.id.toString());
    expect(res.children.length).toEqual(1);
    expect(res.after.toString()).toEqual(user2.id.toString());
    expect(res.before).toBeUndefined();
  });

  it("Should have getBlockedUsersAfter defined", () => {
    expect(getBlockedUsersAfter).toBeDefined();
  });

  it("Test getBlockedUsersAfter with invalid after", async () => {
    try {
      const invalidId = mongoose.Types.ObjectId.generate(10);
      getBlockedUsersAfter(user1, 1, invalidId.toString());
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Invalid user id");
    }
  });

  it("Test getBlockedUsersAfter with valid after & over-limit", async () => {
    const res = getBlockedUsersAfter(user1, 10, user3.id.toString());
    expect(res.children.length).toEqual(1);
    expect(res.before.toString()).toEqual(user4.id.toString());
    expect(res.after).toBeUndefined();
  });

  it("Test getBlockedUsersAfter with after & limit returning before only", async () => {
    const res = getBlockedUsersAfter(user1, 2, user2.id.toString());
    expect(res.children.length).toEqual(2);
    expect(res.before.toString()).toEqual(user3.id.toString());
    expect(res.after).toBeUndefined();
  });

  it("Test getBlockedUsersAfter with after & limit returning both after & before", async () => {
    const res = getBlockedUsersAfter(user1, 1, user2.id.toString());
    expect(res.children.length).toEqual(1);
    expect(res.after.toString()).toEqual(user3.id.toString());
    expect(res.before.toString()).toEqual(user3.id.toString());
  });

  it("Should have listingBlockedUsers defined", () => {
    expect(listingBlockedUsers).toBeDefined();
  });

  it("Test listingBlockedUsers with both after & before sent", async () => {
    try {
      await listingBlockedUsers(
        3,
        user2.id.toString(),
        user2.id.toString(),
        user1
      );
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Can't set before and after");
    }
  });

  it("Test listingBlockedUsers with before", async () => {
    const res = await listingBlockedUsers(
      3,
      user4.id.toString(),
      undefined,
      user1
    );
    expect(res.children.length).toEqual(2);
    expect(res.before).toBeUndefined();
    expect(res.after).toBeUndefined();
  });

  it("Test listingBlockedUsers with after", async () => {
    const res = await listingBlockedUsers(
      3,
      undefined,
      user2.id.toString(),
      user1
    );
    expect(res.children.length).toEqual(2);
    expect(res.before.toString()).toEqual(user3.id.toString());
    expect(res.after).toBeUndefined();
  });

  it("Should have prepareListingUsers defined", () => {
    expect(prepareListingUsers).toBeDefined();
  });

  it("Test prepareListingUsers with both after & before", async () => {
    const result = await prepareListingUsers({
      limit: 10,
      after: user1.id.toString(),
      before: user2.id.toString(),
    });
    expect(result.limit).toEqual(10);
    expect(result.listing).toBeNull();
  });

  it("Test prepareListingUsers with after", async () => {
    const result = await prepareListingUsers({
      limit: 15,
      after: user1.id.toString(),
    });
    expect(result.limit).toEqual(15);
    expect(result.listing).toEqual({
      type: "_id",
      value: { $gt: user1.id.toString() },
    });
  });

  it("Test prepareListingUsers with before", async () => {
    const result = await prepareListingUsers({
      limit: 20,
      before: user1.id.toString(),
    });
    expect(result.limit).toEqual(20);
    expect(result.listing).toEqual({
      type: "_id",
      value: { $lt: user1.id.toString() },
    });
  });

  it("Test prepareListingUsers with over-limit", async () => {
    const result = await prepareListingUsers({
      limit: 200,
    });
    expect(result.limit).toEqual(100);
    expect(result.listing).toBeNull();
  });

  it("Test prepareListingUsers with under-limit", async () => {
    const result = await prepareListingUsers({
      limit: -1,
    });
    expect(result.limit).toEqual(1);
    expect(result.listing).toBeNull();
  });

  it("Should have userListing defined", () => {
    expect(userListing).toBeDefined();
  });

  it("Test userListing", async () => {
    const result = await userListing({
      limit: 30,
      after: user1.id.toString(),
    });
    expect(result.limit).toEqual(30);
    expect(result.find).toEqual({
      deletedAt: null,
      _id: { $gt: user1.id.toString() },
    });
  });
});
