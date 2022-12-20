/* eslint-disable max-len */
import {
  markPostAsModerated,
  addToSpammedComments,
  addToApprovedUsers,
  addToMutedUsers,
  removeFromApprovedUsers,
  removeFromMutedUsers,
  removeFromSpammedComments,
  checkUserInSubreddit,
} from "../../services/postsModeration";

import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Subreddit from "./../../models/Community.js";
import Post from "./../../models/Post.js";
import Comment from "./../../models/Comment.js";

// eslint-disable-next-line max-statements
describe("Testing Posts Moderation Service functions", () => {
  let user = {},
    mod = {},
    subreddit = {},
    post = {},
    comment = {};
  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    mod = await new User({
      username: "mod",
      email: "mod@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit = await new Subreddit({
      title: "subreddit",
      viewName: "Subreddit",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: "hamdy",
        userID: user.id,
      },
      createdAt: Date.now(),
    }).save();

    post = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await post.save();

    comment = await new Comment({
      parentId: post._id,
      postId: post._id,
      parentType: "post",
      level: 1,
      content: { text: "Comment 1" },
      ownerId: user.id,
      ownerUsername: user.username,
      subredditName: "subreddit",
      numberOfVotes: 10,
      createdAt: Date.now(),
    }).save();

    subreddit.posts = [post.id];
    subreddit.unmoderatedPosts = [post.id];
    await subreddit.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have markPostAsModerated defined", () => {
    expect(markPostAsModerated).toBeDefined();
  });

  it("Test markPostAsModerated without spammedPosts (APPROVE)", async () => {
    await markPostAsModerated(post.id, post.subredditName, "approve");
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(subreddit.spammedPosts.length).toEqual(0);
    expect(subreddit.unmoderatedPosts.length).toEqual(0);
  });

  it("Test markPostAsModerated with spammedPosts (APPROVE)", async () => {
    subreddit.spammedPosts = [post.id];
    await subreddit.save();
    await markPostAsModerated(post.id, post.subredditName, "approve");
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(subreddit.spammedPosts.length).toEqual(0);
    expect(subreddit.unmoderatedPosts.length).toEqual(0);
  });

  it("Test markPostAsModerated with spammedPosts (REMOVE)", async () => {
    subreddit.spammedPosts = [post.id];
    subreddit.unmoderatedPosts = [post.id];
    await subreddit.save();
    await markPostAsModerated(post.id, post.subredditName, "remove");
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(subreddit.spammedPosts.length).toEqual(1);
    expect(subreddit.unmoderatedPosts.length).toEqual(0);
  });

  it("Test markPostAsModerated (SPAM)", async () => {
    subreddit.spammedPosts = [];
    subreddit.unmoderatedPosts = [post.id];
    await subreddit.save();
    await markPostAsModerated(post.id, post.subredditName, "spam");
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(subreddit.spammedPosts.length).toEqual(1);
    expect(subreddit.unmoderatedPosts.length).toEqual(0);
  });

  it("Should have addToSpammedComments defined", () => {
    expect(addToSpammedComments).toBeDefined();
  });

  it("Test addToSpammedComments", async () => {
    subreddit.spammedPosts = [post.id];
    await subreddit.save();
    await addToSpammedComments(comment.id, comment.subredditName);
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(subreddit.spammedComments.length).toEqual(1);
  });

  it("Should have removeFromSpammedComments defined", () => {
    expect(removeFromSpammedComments).toBeDefined();
  });

  it("Test removeFromSpammedComments", async () => {
    subreddit.spammedComments = [comment.id];
    await subreddit.save();
    await removeFromSpammedComments(comment.id, comment.subredditName);
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(subreddit.spammedComments.length).toEqual(0);
  });

  it("Should have addToApprovedUsers defined", () => {
    expect(addToApprovedUsers).toBeDefined();
  });

  it("Test addToApprovedUsers with no joined subreddits & no approved users", async () => {
    await addToApprovedUsers(subreddit, user, mod);
    user = await User.findOne({ username: user.username });
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(user.joinedSubreddits.length).toEqual(1);
    expect(subreddit.joinedUsers.length).toEqual(1);
    expect(subreddit.approvedUsers.length).toEqual(1);
  });

  it("Test addToApprovedUsers with the same already approved user", async () => {
    try {
      subreddit.joinedUsers = [];
      await subreddit.save();
      await user.save();
      await addToApprovedUsers(subreddit, user, mod);
      user = await User.findOne({ username: user.username });
      subreddit = await Subreddit.findOne({ title: subreddit.title });
    } catch (err) {
      expect(err.message).toEqual("This user is already approved");
    }
  });

  it("Test addToApprovedUsers with the same joined subreddit", async () => {
    subreddit.approvedUsers = [];
    await subreddit.save();
    await addToApprovedUsers(subreddit, user, mod);
    user = await User.findOne({ username: user.username });
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(user.joinedSubreddits.length).toEqual(1);
    expect(subreddit.joinedUsers.length).toEqual(1);
    expect(subreddit.approvedUsers.length).toEqual(1);
  });

  it("Should have removeFromApprovedUsers defined", () => {
    expect(removeFromApprovedUsers).toBeDefined();
  });

  it("Test removeFromApprovedUsers with type PUBLIC", async () => {
    await removeFromApprovedUsers(subreddit, user);
    user = await User.findOne({ username: user.username });
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(user.joinedSubreddits.length).toEqual(1);
    expect(subreddit.joinedUsers.length).toEqual(1);
    expect(subreddit.approvedUsers.length).toEqual(0);
  });

  it("Test removeFromApprovedUsers with type PRIVATE", async () => {
    subreddit.type = "Private";
    subreddit.approvedUsers = [
      {
        userID: user.id,
        dateOfApprove: Date.now(),
      },
    ];
    await subreddit.save();
    await removeFromApprovedUsers(subreddit, user);
    user = await User.findOne({ username: user.username });
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(user.joinedSubreddits.length).toEqual(0);
    expect(subreddit.joinedUsers.length).toEqual(0);
    expect(subreddit.approvedUsers.length).toEqual(0);
  });

  it("Test removeFromApprovedUsers with type RESTRICTED", async () => {
    subreddit.type = "Restricted";
    subreddit.joinedUsers = [
      {
        userId: user.id,
        joinDate: Date.now(),
      },
    ];
    user.joinedSubreddits = [
      {
        subredditId: subreddit.id,
        name: subreddit.title,
      },
    ];
    subreddit.approvedUsers = [
      {
        userID: user.id,
        dateOfApprove: Date.now(),
      },
    ];
    await user.save();
    await subreddit.save();
    await removeFromApprovedUsers(subreddit, user);
    user = await User.findOne({ username: user.username });
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(user.joinedSubreddits.length).toEqual(1);
    expect(subreddit.joinedUsers.length).toEqual(1);
    expect(subreddit.approvedUsers.length).toEqual(0);
  });

  it("Test removeFromApprovedUsers an already removed user", async () => {
    try {
      subreddit.type = "Public";
      await subreddit.save();
      await removeFromApprovedUsers(subreddit, user);
    } catch (err) {
      expect(err.statusCode).toEqual(400);
    }
  });

  it("Should have addToMutedUsers defined", () => {
    expect(addToMutedUsers).toBeDefined();
  });

  it("Test addToMutedUsers ", async () => {
    await addToMutedUsers(subreddit, user, "Mute reason");
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(subreddit.mutedUsers.length).toEqual(1);
  });

  it("Test addToMutedUsers with an already muted user", async () => {
    try {
      await addToMutedUsers(subreddit, user, "Mute reason");
    } catch (err) {
      expect(err.statusCode).toEqual(400);
    }
  });

  it("Should have removeFromMutedUsers defined", () => {
    expect(removeFromMutedUsers).toBeDefined();
  });

  it("Test removeFromMutedUsers ", async () => {
    await removeFromMutedUsers(subreddit, user);
    subreddit = await Subreddit.findOne({ title: subreddit.title });
    expect(subreddit.mutedUsers.length).toEqual(0);
  });

  it("Test removeFromMutedUsers with an already removed muted user", async () => {
    try {
      await removeFromMutedUsers(subreddit, user, "Mute reason");
    } catch (err) {
      expect(err.statusCode).toEqual(400);
    }
  });

  it("Should have checkUserInSubreddit defined", () => {
    expect(checkUserInSubreddit).toBeDefined();
  });

  it("Test checkUserInSubreddit ", async () => {
    user.joinedSubreddits = [];
    await user.save();
    try {
      checkUserInSubreddit(subreddit, user);
    } catch (err) {
      expect(err.statusCode).toEqual(400);
    }
  });
});
