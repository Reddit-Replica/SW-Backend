import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Subreddit from "./../../models/Community.js";
import { getTrafficService } from "../../services/subredditModerationServices";

// eslint-disable-next-line max-statements
describe("Testing subreddit actions services functions", () => {
  let owner = {},
    normalUser1 = {},
    normalUser2 = {},
    normalUser3 = {},
    normalUser4 = {},
    subreddit = {};
  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    owner = await new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
      createdAt: Date.now(),
    }).save();

    normalUser1 = await new User({
      username: "Normal1",
      email: "normal1@gmail.com",
      createdAt: Date.now(),
    }).save();

    normalUser2 = await new User({
      username: "Normal2",
      email: "normal2@gmail.com",
      createdAt: Date.now(),
    }).save();

    normalUser3 = await new User({
      username: "Normal3",
      email: "normal3@gmail.com",
      createdAt: Date.now(),
    }).save();

    normalUser4 = await new User({
      username: "Normal4",
      email: "normal4@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit = await new Subreddit({
      title: "Manga",
      viewName: "MangaReddit",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: owner.username,
        userID: owner._id,
      },
      moderators: [
        {
          userID: owner._id,
          dateOfModeration: Date.now(),
        },
      ],
      joinedUsers: [
        {
          userId: normalUser1._id,
          joinDate: Date.now(),
        },
        {
          userId: normalUser2._id,
          // 6 days ago
          joinDate: new Date().setDate(new Date().getDate() - 6),
        },
      ],
      leftUsers: [
        {
          userId: normalUser3._id,
          leaveDate: Date.now(),
        },
        {
          userId: normalUser4._id,
          // 8 days ago
          leaveDate: new Date().setDate(new Date().getDate() - 8),
        },
      ],
      createdAt: Date.now(),
    }).save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have getTrafficService function", () => {
    expect(getTrafficService).toBeDefined();
  });
  // eslint-disable-next-line max-len
  it("try to let normal user request traffic stats of a subreddit", async () => {
    try {
      await getTrafficService(normalUser1, subreddit);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to let the owner request traffic stats of a subreddit", async () => {
    const result = await getTrafficService(owner, subreddit);
    expect(result.data).toEqual({
      numberOfJoinedLastDay: 1,
      numberOfJoinedLastWeek: 2,
      numberOfJoinedLastMonth: 2,
      numberOfLeftLastDay: 1,
      numberOfLeftLastWeek: 1,
      numberOfLeftLastMonth: 2,
    });
  });
});
