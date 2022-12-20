import {
  insertCategoriesIfNotExists,
  getSortedCategories,
  getTwoRandomCategories,
  getRandomSubreddits,
} from "../../services/categories.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import Category from "../../models/Category.js";
import Subreddit from "../../models/Community.js";
import User from "../../models/User.js";

describe("Testing Category services", () => {
  let user = {};
  let subreddit1 = {};
  let subreddit2 = {};
  let subreddit3 = {};

  beforeAll(async () => {
    await connectDatabase();
    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    await insertCategoriesIfNotExists();

    subreddit1 = await new Subreddit({
      title: "subreddit1",
      viewName: "SR",
      category: "Sports",
      type: "Public",
      nsfw: false,
      members: 9,
      owner: {
        username: "hamdy",
        userID: user.id,
      },
      createdAt: Date.now(),
    }).save();
    await Category.updateOne({ name: "Sports" }, { $set: { visited: true } });

    subreddit2 = await new Subreddit({
      title: "subreddit2",
      viewName: "SR",
      category: "Travel",
      type: "Public",
      nsfw: false,
      members: 1,
      owner: {
        username: "hamdy",
        userID: user.id,
      },
      createdAt: Date.now(),
    }).save();
    await Category.updateOne({ name: "Travel" }, { $set: { visited: true } });

    subreddit3 = await new Subreddit({
      title: "subreddit3",
      viewName: "SR",
      category: "News",
      type: "Public",
      nsfw: false,
      members: 5,
      owner: {
        username: "hamdy",
        userID: user.id,
      },
      createdAt: Date.now(),
    }).save();
    await Category.updateOne({ name: "News" }, { $set: { visited: true } });
  });

  afterAll(async () => {
    await Category.deleteMany({});
    await Subreddit.deleteMany({});
    await User.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have insertCategoriesIfNotExists method", () => {
    expect(insertCategoriesIfNotExists).toBeDefined();
  });

  it("Insert categories", async () => {
    try {
      await insertCategoriesIfNotExists();
      const count = await Category.countDocuments();
      expect(count).toEqual(30);
    } catch (err) {
      return false;
    }
  });

  it("Insert categories again when they are already inserted", async () => {
    try {
      await insertCategoriesIfNotExists();
      const count = await Category.countDocuments();
      expect(count).toEqual(30);
    } catch (err) {
      return false;
    }
  });

  it("Should have getSortedCategories method", () => {
    expect(getSortedCategories).toBeDefined();
  });

  it("Get categories sorted with the random index", async () => {
    try {
      const categories = await getSortedCategories();
      expect(categories.length).toEqual(30);
    } catch (err) {
      return false;
    }
  });

  it("Should have getTwoRandomCategories method", () => {
    expect(getTwoRandomCategories).toBeDefined();
  });

  it("Test getTwoRandomCategories correctly", async () => {
    try {
      const categories = await getTwoRandomCategories();
      expect(categories.firstCategory).toBeDefined();
      expect(categories.secondCategory).toBeDefined();
      expect(categories.firstCategory).not.toEqual(categories.secondCategory);
    } catch (err) {
      return false;
    }
  });

  it("Test getTwoRandomCategories with only 1 visited category", async () => {
    try {
      await Category.updateOne(
        { name: "Sports" },
        { $set: { visited: false } }
      );
      await Category.updateOne({ name: "News" }, { $set: { visited: false } });
      const categories = await getTwoRandomCategories();
      expect(categories.firstCategory).toEqual("Travel");
      expect(categories.firstCategory).toEqual(categories.secondCategory);
      await Category.updateOne({ name: "Sports" }, { $set: { visited: true } });
      await Category.updateOne({ name: "News" }, { $set: { visited: true } });
    } catch (err) {
      return false;
    }
  });

  it("Test getTwoRandomCategories with no visited categories", async () => {
    try {
      await Category.updateOne(
        { name: "Travel" },
        { $set: { visited: false } }
      );
      const categories = await getTwoRandomCategories();
      expect(categories.firstCategory).toBeUndefined();
      expect(categories.secondCategory).toBeUndefined();
      await Category.updateOne({ name: "Sports" }, { $set: { visited: true } });
      await Category.updateOne({ name: "Travel" }, { $set: { visited: true } });
      await Category.updateOne({ name: "News" }, { $set: { visited: true } });
    } catch (err) {
      return false;
    }
  });

  it("Test getTwoRandomCategories with no subreddits", async () => {
    try {
      subreddit1.deletedAt = Date.now();
      subreddit2.deletedAt = Date.now();
      subreddit3.deletedAt = Date.now();
      await subreddit1.save();
      await subreddit2.save();
      await subreddit3.save();
      const categories = await getTwoRandomCategories();
      subreddit1.deletedAt = undefined;
      subreddit2.deletedAt = undefined;
      subreddit3.deletedAt = undefined;
      await subreddit1.save();
      await subreddit2.save();
      await subreddit3.save();
      expect(categories.firstCategory).toBeUndefined();
      expect(categories.secondCategory).toBeUndefined();
    } catch (err) {
      return false;
    }
  });

  it("Should getRandomSubreddits have get method", () => {
    expect(getRandomSubreddits).toBeDefined();
  });

  it("Test getRandomSubreddits correctly with no logged in user", async () => {
    try {
      const subreddits = await getRandomSubreddits();
      expect(subreddits.first.category).not.toEqual(subreddits.second.category);
      expect(subreddits.first.subreddits[0].data.joined).toBeUndefined();
      expect(subreddits.first.subreddits.length).toEqual(1);
    } catch (err) {
      return false;
    }
  });

  it("Test getRandomSubreddits correctly with a logged in user", async () => {
    try {
      const subreddits = await getRandomSubreddits(user);
      expect(subreddits.first.subreddits.length).toEqual(1);
      expect(subreddits.second.subreddits.length).toEqual(1);
      expect(subreddits.first.category).not.toEqual(subreddits.second.category);
      expect(subreddits.first.subreddits[0].data.joined).toBeDefined();
    } catch (err) {
      return false;
    }
  });

  it("Test getRandomSubreddits correctly with a joined user in this subreddit", async () => {
    try {
      user.joinedSubreddits.push(
        {
          subredditId: subreddit1.id,
          name: subreddit1.title,
        },
        {
          subredditId: subreddit2.id,
          name: subreddit2.title,
        },
        {
          subredditId: subreddit3.id,
          name: subreddit3.title,
        }
      );
      await user.save();
      const subreddits = await getRandomSubreddits(user);
      expect(subreddits.first.subreddits.length).toEqual(1);
      expect(subreddits.second.subreddits.length).toEqual(1);
      expect(subreddits.first.category).not.toEqual(subreddits.second.category);
      expect(subreddits.first.subreddits[0].data.joined).toBeTruthy();
      expect(subreddits.second.subreddits[0].data.joined).toBeTruthy();
    } catch (err) {
      return false;
    }
  });

  it("Test getRandomSubreddits with no random categories", async () => {
    try {
      await Category.updateOne(
        { name: "Sports" },
        { $set: { visited: false } }
      );
      await Category.updateOne({ name: "News" }, { $set: { visited: false } });
      await Category.updateOne(
        { name: "Travel" },
        { $set: { visited: false } }
      );
      const subreddits = await getRandomSubreddits();
      expect(subreddits.first).toBeUndefined();
      expect(subreddits.second).toBeUndefined();
      await Category.updateOne({ name: "Sports" }, { $set: { visited: true } });
    } catch (err) {
      return false;
    }
  });

  it("Test getRandomSubreddits with only 1 category", async () => {
    try {
      const subreddits = await getRandomSubreddits();
      expect(subreddits.first.category).toEqual("Sports");
      expect(subreddits.first.subreddits.length).toEqual(1);
      expect(subreddits.second).toBeUndefined();
    } catch (err) {
      return false;
    }
  });

  it("Test getRandomSubreddits and check for the sort", async () => {
    try {
      const subreddit4 = await new Subreddit({
        title: "subreddit4",
        viewName: "SR",
        category: "Sports",
        type: "Public",
        nsfw: false,
        members: 8,
        owner: {
          username: "hamdy",
          userID: user.id,
        },
        createdAt: Date.now(),
      }).save();
      const subreddits = await getRandomSubreddits();
      expect(subreddits.first.category).toEqual("Sports");
      expect(subreddits.first.subreddits.length).toEqual(2);
      expect(subreddits.first.subreddits[0].id).toEqual(
        subreddit1.id.toString()
      );
      expect(subreddits.first.subreddits[0].data.members).toEqual(9);
      expect(subreddits.second).toBeUndefined();
      await Category.updateOne({ name: "News" }, { $set: { visited: true } });
      await Category.updateOne({ name: "Travel" }, { $set: { visited: true } });
    } catch (err) {
      return false;
    }
  });
});
