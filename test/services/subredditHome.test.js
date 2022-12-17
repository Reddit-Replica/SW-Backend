/* eslint-disable max-len */
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  checkSubredditFlair,
  subredditHome,
} from "../../services/subredditItemsListing.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Subreddit from "./../../models/Community.js";
import Flair from "./../../models/Flair.js";
import Comment from "./../../models/Comment.js";

// eslint-disable-next-line max-statements
describe("Testing Subreddit Posts Listing Service functions", () => {
  let user = {},
    subreddit = {},
    flair = {},
    post1 = {},
    post2 = {},
    post3 = {},
    post4 = {},
    post5 = {},
    post6 = {};
  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
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
        userID: user.id,
      },
      createdAt: Date.now(),
    }).save();

    flair = await new Flair({
      flairName: "flair",
      subreddit: subreddit.id,
      flairOrder: 1,
      createdAt: Date.now(),
    }).save();

    post1 = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 5,
      hotScore: 10,
      numberOfViews: 10,
      createdAt: Date.now(),
    });
    await post1.save();

    post2 = new Post({
      title: "Second Post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 3,
      hotScore: 10,
      numberOfViews: 10,
      createdAt: Date.now() + 10,
    });
    await post2.save();

    post3 = new Post({
      title: "Third post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 3,
      hotScore: 10,
      numberOfViews: 30,
      createdAt: Date.now() + 20,
    });
    await post3.save();

    post4 = new Post({
      title: "Fourth post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "link",
      numberOfVotes: 7,
      hotScore: 5,
      numberOfViews: 40,
      createdAt: Date.now() + 30,
    });
    await post4.save();

    post5 = new Post({
      title: "Fifth post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "link",
      numberOfVotes: 0,
      hotScore: 15,
      numberOfViews: 0,
      createdAt: Date.now() + 40,
    });
    await post5.save();

    post6 = new Post({
      title: "Sixth post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "link",
      numberOfVotes: 100,
      hotScore: 20,
      numberOfViews: 100,
      createdAt: Date.now() + 50,
    });
    await post6.save();

    subreddit.subredditPosts.push(
      post1.id,
      post2.id,
      post3.id,
      post4.id,
      post5.id,
      post6.id
    );
    await subreddit.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have checkSubredditFlair defined", () => {
    expect(checkSubredditFlair).toBeDefined();
  });

  it("Test checkSubredditFlair with invalid Flair ID", async () => {
    try {
      await checkSubredditFlair(subreddit.title, "invalidID");
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual(
        "Invalid Flair ID (Incorrect ObjectId format)"
      );
    }
  });

  it("Test checkSubredditFlair with a deleted Flair", async () => {
    try {
      flair.deletedAt = Date.now();
      await flair.save();
      await checkSubredditFlair(subreddit.title, flair.id);
    } catch (err) {
      expect(err.statusCode).toEqual(404);
      expect(err.message).toEqual("Flair not found or may be deleted");
    }
  });

  it("Test checkSubredditFlair with a Flair in another subreddit", async () => {
    try {
      flair.deletedAt = undefined;
      await flair.save();
      await checkSubredditFlair("invalidSR", flair.id);
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Flair doesn't belong to this subreddit");
    }
  });

  it("Test checkSubredditFlair correctly", async () => {
    try {
      const result = await checkSubredditFlair(subreddit.title, flair.id);
      expect(result).toBeDefined();
      expect(result.id.toString()).toEqual(flair.id.toString());
    } catch (err) {
      console.log(err);
    }
  });

  it("Should have subredditHome defined", () => {
    expect(subredditHome).toBeDefined();
  });

  it("Test subredditHome with no after/before/limit/sort/flair", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {});
    expect(result.data.children.length).toEqual(6);
    expect(result.data.after.toString()).toEqual(post1.id.toString());
    expect(result.data.before.toString()).toEqual(post6.id.toString());
  });
});
