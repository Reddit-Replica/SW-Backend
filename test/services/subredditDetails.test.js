import { getSubredditDetails } from "../../services/subredditDetails.js";
import Subreddit from "../../models/Community.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "../../models/User.js";

describe("testing subreddit details file", () => {
  describe("Testing getSubredditDetails function ", () => {
    beforeAll(async () => {
      await connectDatabase();
    });

    afterAll(() => {
      closeDatabaseConnection();
    });

    it("Tesitng without logged in user", async () => {
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();

      const details = await getSubredditDetails(subredditObject, false);

      expect(details).toMatchObject({
        title: "title",
      });
      await Subreddit.deleteMany({});
    });
    it("Tesitng with logged in user not found", async () => {
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();

      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();

      const payload = { userId: user._id.toString() };

      await User.deleteMany({});

      await expect(
        getSubredditDetails(subredditObject, true, payload)
      ).rejects.toThrow("User not found");
    });

    it("Tesitng with logged in user", async () => {
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();

      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();
      user.joinedSubreddits.push({
        subredditId: subredditObject._id,
        name: subredditObject.title,
      });
      user.favoritesSubreddits.push({
        subredditId: subredditObject._id,
        name: subredditObject.title,
      });
      subredditObject.moderators.push({
        dateOfModeration: Date.now(),
        userID: user._id,
      });

      await subredditObject.save();
      await user.save();
      const payload = { userId: user._id.toString() };
      const details = await getSubredditDetails(subredditObject, true, payload);

      expect(details).toMatchObject({
        title: "title",
      });
    });
    it("Tesitng with logged in user", async () => {
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const subredditObject2 = await new Subreddit({
        title: "titl2e",
        viewName: "title2",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();

      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();
      user.joinedSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      user.favoritesSubreddits.push({
        subredditId: subredditObject2._id,
        name: subredditObject2.title,
      });
      subredditObject.moderators.push({
        dateOfModeration: Date.now(),
        userID: user2._id,
      });

      await subredditObject.save();
      await user.save();
      const payload = { userId: user._id.toString() };
      const details = await getSubredditDetails(subredditObject, true, payload);

      expect(details).toMatchObject({
        title: "title",
      });
    });
  });
});
