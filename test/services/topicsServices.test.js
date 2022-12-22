import {
  insertTopicsIfNotExists,
  getSuggestedTopicsService,
} from "../../services/topics.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import Topics from "./../../models/Topics.js";
import Subreddit from "./../../models/Community.js";
import User from "../../models/User.js";

describe("Testing Category services", () => {
  let user = {},
    subreddit = {};
  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit = await new Subreddit({
      title: "subreddit",
      viewName: "SR",
      category: "Sports",
      type: "Public",
      nsfw: false,
      members: 9,
      owner: {
        username: user.username,
        userID: user._id,
      },
      dateOfCreation: Date.now(),
    }).save();
  });

  afterAll(async () => {
    await Topics.deleteMany({});
    await Subreddit.deleteMany({});
    await User.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have insertTopicsIfNotExists function", () => {
    expect(insertTopicsIfNotExists).toBeDefined();
  });

  it("check that topics count is 52", async () => {
    await insertTopicsIfNotExists();
    const count = await Topics.countDocuments();
    expect(count).toEqual(52);
  });

  it("try to get the suggested topics for a subreddit with no main topic or subTopics", async () => {
    const list = await getSuggestedTopicsService(subreddit);
    expect(list.data.communityTopics.length).toEqual(52);
  });

  it("try to get the suggested topics for a subreddit with main topic and without subTopics", async () => {
    subreddit.mainTopic = "Activism";
    await subreddit.save();
    const list = await getSuggestedTopicsService(subreddit);
    expect(list.data.communityTopics.length).toEqual(51);
  });

  it("try to get the suggested topics for a subreddit with no main topic and with 2 subTopics", async () => {
    subreddit.mainTopic = "";
    subreddit.subTopics = ["Travel", "World News"];
    await subreddit.save();
    const list = await getSuggestedTopicsService(subreddit);
    expect(list.data.communityTopics.length).toEqual(50);
  });

  it("try to get the suggested topics for a subreddit with main topic and with 2 subTopics", async () => {
    subreddit.mainTopic = "Art";
    subreddit.subTopics = ["Travel", "World News"];
    await subreddit.save();
    const list = await getSuggestedTopicsService(subreddit);
    expect(list.data.communityTopics.length).toEqual(49);
  });
});
