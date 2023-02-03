import {
  checkSameUserEditing,
  editPostService,
} from "../../services/postServices.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Subreddit from "../../models/Community.js";
import Notification from "../../models/Notification.js";
import { jest } from "@jest/globals";
describe("Testing postServices file", () => {
  beforeAll(async () => {
    await connectDatabase();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Subreddit.deleteMany({});
    await Notification.deleteMany({});
    closeDatabaseConnection();
  });
  describe("Testing checkSameUserEditing function", () => {
    it("testing deleted post", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();

      const post = await new Post({
        title: "Without subreddit post",
        ownerUsername: user.username,
        ownerId: user._id,
        kind: "hybrid",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      await expect(
        checkSameUserEditing(post._id.toString(), user._id.toString())
      ).rejects.toThrow("Post is not found");
    });
    it("testing now owner post", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();

      const post = await new Post({
        title: "Without subreddit post",
        ownerUsername: user2.username,
        ownerId: user2._id,
        kind: "hybrid",
        createdAt: Date.now(),
      }).save();

      await expect(
        checkSameUserEditing(post._id.toString(), user._id.toString())
      ).rejects.toThrow("User not allowed to edit this post");
    });
    it("testing now hyprid post", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const post = await new Post({
        title: "Without subreddit post",
        ownerUsername: user.username,
        ownerId: user._id,
        kind: "link",
        createdAt: Date.now(),
      }).save();

      await expect(
        checkSameUserEditing(post._id.toString(), user._id.toString())
      ).rejects.toThrow("Not allowed to edit this post");
    });
    it("testing hyprid post", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const post = await new Post({
        title: "Without subreddit post",
        ownerUsername: user.username,
        ownerId: user._id,
        kind: "hybrid",
        createdAt: Date.now(),
      }).save();

      const neededPost = await checkSameUserEditing(
        post._id.toString(),
        user._id.toString()
      );
      expect(neededPost).toMatchObject({ ownerUsername: "zeyad" });
    });
  });

  describe("Testing editPostService", () => {
    it("deleted subreddit", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
      }).save();
      const post = await new Post({
        title: "Without subreddit post",
        ownerUsername: user.username,
        ownerId: user._id,
        kind: "hybrid",
        createdAt: Date.now(),
        subredditName: "random",
      }).save();

      await expect(editPostService(post, "user._id.toString")).rejects.toThrow(
        "Subreddit not found!"
      );
    });
    it("existing subreddit", async () => {
      const saveFunction = jest.fn();
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
      const post = await new Post({
        title: "Without subreddit post",
        ownerUsername: user.username,
        ownerId: user._id,
        kind: "hybrid",
        createdAt: Date.now(),
        subredditName: "title",
      }).save();

      post.save = saveFunction;
      await editPostService(post, "user._id.toString");
      expect(saveFunction).toHaveBeenCalled();
    });
    it("existing subreddit edited before", async () => {
      const saveFunction = jest.fn();
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
      const post = await new Post({
        title: "Without subreddit post",
        ownerUsername: user.username,
        ownerId: user._id,
        kind: "hybrid",
        createdAt: Date.now(),
        subredditName: "title",
      }).save();

      subredditObject.editedPosts.push(post._id);
      await subredditObject.save();
      post.save = saveFunction;
      await editPostService(post, "user._id.toString");
      expect(saveFunction).toHaveBeenCalled();
    });
  });
});
