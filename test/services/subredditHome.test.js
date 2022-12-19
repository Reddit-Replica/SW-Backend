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
      flair: flair.id,
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
      numberOfViews: 20,
      createdAt: Date.now() + 100,
    });
    await post2.save();

    post3 = new Post({
      title: "Third post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 3,
      flair: flair.id,
      hotScore: 10,
      numberOfViews: 30,
      createdAt: Date.now() + 200,
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
      createdAt: Date.now() + 300,
    });
    await post4.save();

    post5 = new Post({
      title: "Fifth post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "link",
      numberOfVotes: 0,
      flair: flair.id,
      hotScore: 15,
      numberOfViews: 0,
      createdAt: Date.now() + 400,
    });
    await post5.save();

    post6 = new Post({
      title: "Sixth post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "link",
      numberOfVotes: 100,
      flair: flair.id,
      hotScore: 20,
      numberOfViews: 100,
      createdAt: Date.now() + 500,
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
    await Flair.deleteMany({});
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

  it("Test checkSubredditFlair with no flair ID", async () => {
    const result = await checkSubredditFlair(subreddit.title);
    expect(result).toBeUndefined();
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

  it("Test subredditHome for an invalid subreddit name", async () => {
    const result = await subredditHome(user, "invalidSR", undefined, {});
    expect(result.statusCode).toEqual(404);
    expect(result.data).toEqual("Subreddit not found or deleted");
  });

  it("Test subredditHome with limit", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      limit: 3,
    });
    expect(result.data.children.length).toEqual(3);
    expect(result.data.after.toString()).toEqual(post4.id.toString());
    expect(result.data.before.toString()).toEqual(post6.id.toString());
  });

  it("Test subredditHome with after only", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      after: post4.id.toString(),
    });
    expect(result.data.children.length).toEqual(3);
    expect(result.data.after.toString()).toEqual(post1.id.toString());
    expect(result.data.before.toString()).toEqual(post3.id.toString());
  });

  it("Test subredditHome with before only", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      before: post4.id.toString(),
    });
    expect(result.data.children.length).toEqual(2);
    expect(result.data.after.toString()).toEqual(post5.id.toString());
    expect(result.data.before.toString()).toEqual(post6.id.toString());
  });

  it("Test subredditHome with before, after, and limit", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      before: post3.id.toString(),
      after: post3.id.toString(),
    });
    expect(result.data.children.length).toEqual(6);
    expect(result.data.after.toString()).toEqual(post1.id.toString());
    expect(result.data.before.toString()).toEqual(post6.id.toString());
  });

  it("Test subredditHome with before & limit", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      before: post2.id.toString(),
      limit: 4,
    });
    expect(result.data.children.length).toEqual(4);
    expect(result.data.after.toString()).toEqual(post3.id.toString());
    expect(result.data.before.toString()).toEqual(post6.id.toString());
  });

  it("Test subredditHome with after & limit", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      after: post6.id.toString(),
      limit: 2,
    });
    expect(result.data.children.length).toEqual(2);
    expect(result.data.after.toString()).toEqual(post4.id.toString());
    expect(result.data.before.toString()).toEqual(post5.id.toString());
  });

  it("Test subredditHome with sort = new", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      after: post6.id.toString(),
      sort: "new",
    });
    expect(result.data.children.length).toEqual(5);
    expect(result.data.after.toString()).toEqual(post1.id.toString());
    expect(result.data.before.toString()).toEqual(post5.id.toString());
  });

  it("Test subredditHome with sort = hot only", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      sort: "hot",
    });
    expect(result.data.children.length).toEqual(6);
    expect(result.data.children[0].id).toEqual(post6.id.toString());
    expect(result.data.before.toString()).toEqual(post6.id.toString());
    expect(result.data.after).toBeDefined();
  });

  it("Test subredditHome with sort = hot & after", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      sort: "hot",
      after: post1.id.toString(),
      limit: 3,
    });
    expect(result.data.children.length).toEqual(3);
    expect(result.data.children[2].id).toEqual(post4.id.toString());
  });

  it("Test subredditHome with sort = hot & before", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      sort: "hot",
      before: post1.id.toString(),
      limit: 3,
    });
    expect(result.data.children.length).toEqual(2);
    expect(result.data.children[0].id).toEqual(post6.id.toString());
  });

  it("Test subredditHome with sort = top only", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      sort: "top",
    });
    expect(result.data.children.length).toEqual(6);
    expect(result.data.children[0].id).toEqual(post6.id.toString());
  });

  it("Test subredditHome with sort = top (time = month) & after", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      sort: "top",
      time: "month",
      after: post4.id.toString(),
      limit: 4,
    });
    expect(result.data.children.length).toEqual(4);
    expect(result.data.children[3].id).toEqual(post5.id.toString());
  });

  it("Test subredditHome with sort = top (time = week) & after returning no results", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      sort: "top",
      time: "week",
      after: post5.id.toString(),
      limit: 4,
    });
    expect(result.data.children.length).toEqual(0);
    expect(result.data.before).toEqual("");
    expect(result.data.after).toEqual("");
  });

  it("Test subredditHome with sort = top (time = year) & before", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      sort: "top",
      time: "year",
      before: post5.id.toString(),
    });
    expect(result.data.children.length).toEqual(5);
    expect(result.data.children[4].data.votes).toEqual(3);
    expect(result.data.children[3].data.votes).toEqual(3);
    expect(result.data.children[2].data.votes).toEqual(5);
    expect(result.data.children[1].data.votes).toEqual(7);
    expect(result.data.children[0].id).toEqual(post6.id.toString());
  });

  it("Test subredditHome with sort = trending", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      sort: "trending",
    });
    expect(result.data.children.length).toEqual(6);
    expect(result.data.children[0].id).toEqual(post6.id.toString());
    expect(result.data.children[5].id).toEqual(post5.id.toString());
  });

  it("Test subredditHome with sort = trending & after", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      after: post6.id.toString(),
      sort: "trending",
    });
    expect(result.data.children.length).toEqual(5);
    expect(result.data.children[0].id).toEqual(post4.id.toString());
    expect(result.data.children[4].id).toEqual(post5.id.toString());
  });

  it("Test subredditHome with sort = trending & before", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      before: post4.id.toString(),
      sort: "trending",
    });
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(post6.id.toString());
    expect(result.data.after.toString()).toEqual(post6.id.toString());
  });

  it("Test subredditHome with sort = trending returning no posts", async () => {
    const result = await subredditHome(user, subreddit.title, undefined, {
      after: post5.id.toString(),
      sort: "trending",
    });
    expect(result.data.children.length).toEqual(0);
  });

  it("Test subredditHome with Flair", async () => {
    const result = await subredditHome(user, subreddit.title, flair, {});
    expect(result.data.children.length).toEqual(4);
    expect(result.data.before.toString()).toEqual(post6.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("Test subredditHome with flags set", async () => {
    user.savedPosts.push(post1.id);
    user.upvotedPosts.push(post1.id);
    user.downvotedPosts.push(post1.id);
    user.spammedPosts.push(post1.id);
    user.hiddenPosts.push(post4.id, post5.id, post6.id);
    user.moderatedSubreddits.push({
      subredditId: subreddit.id,
      name: subreddit.title,
    });
    await user.save();
    const result = await subredditHome(user, subreddit.title, undefined, {});
    expect(result.data.children.length).toEqual(3);
    expect(result.data.children[2].data.inYourSubreddit).toBeTruthy();
    expect(result.data.children[2].data.votingType).toEqual(-1);
    expect(result.data.children[2].data.saved).toBeTruthy();
    expect(result.data.children[2].data.spammed).toBeTruthy();
  });
});
