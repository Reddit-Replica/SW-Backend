import {
  validateExistingComment,
  addToCommentFollowedUsers,
  removeFromCommentFollowedUsers,
  addToUserFollowedComments,
} from "../../services/commentActionsServices.js";
import Comment from "../../models/Comment.js";
import Post from "../../models/Post.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import { jest } from "@jest/globals";
import User from "../../models/User.js";
describe("Testing comment actions services", () => {
  beforeAll(async () => {
    await connectDatabase();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Comment.deleteMany({});
    closeDatabaseConnection();
  });
  describe("validateExistingComment", () => {
    it("Deleted comment", async () => {
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

      const comment = await new Comment({
        parentId: post.id,
        postId: post.id,
        parentType: "post",
        content: "Post Comment",
        ownerId: user.id,
        ownerUsername: user.username,
        level: 1,
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      await expect(validateExistingComment(comment._id)).rejects.toThrow(
        "Comment not found"
      );
    });
    it("Existing comment", async () => {
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

      const comment = await new Comment({
        parentId: post.id,
        postId: post.id,
        parentType: "post",
        content: "Post Comment",
        ownerId: user.id,
        ownerUsername: user.username,
        level: 1,
        createdAt: Date.now(),
      }).save();

      expect(async () => {
        await validateExistingComment(comment._id);
      }).not.toThrowError();
    });
  });

  describe("addToCommentFollowedUsers", () => {
    it("Testing addToCommentFollowedUsers", async () => {
      const saveFunction = jest.fn();
      const comment = {
        save: saveFunction,
        followingUsers: [],
      };

      await addToCommentFollowedUsers({}, comment);
      expect(saveFunction).toHaveBeenCalled();
    });
  });
  describe("removeFromCommentFollowedUsers", () => {
    it("Testing removeFromCommentFollowedUsers", async () => {
      const saveFunction = jest.fn();
      // const comment = {
      //   save: saveFunction,
      //   followingUsers: [],
      // };

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

      const comment = await new Comment({
        parentId: post.id,
        postId: post.id,
        parentType: "post",
        content: "Post Comment",
        ownerId: user.id,
        ownerUsername: user.username,
        level: 1,
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      comment.save = saveFunction;
      comment.followingUsers.push({
        username: user.username,
        userId: user._id,
      });
      await comment.save();

      await removeFromCommentFollowedUsers({ _id: user._id }, comment);
      expect(saveFunction).toHaveBeenCalled();
    });
  });

  describe("addToUserFollowedComments", () => {
    it("Adding success", async () => {
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

      const comment = await new Comment({
        parentId: post.id,
        postId: post.id,
        parentType: "post",
        content: "Post Comment",
        ownerId: user.id,
        ownerUsername: user.username,
        level: 1,
        createdAt: Date.now(),
      }).save();

      const object = await addToUserFollowedComments(user._id, comment._id);
      expect(object.comment.content).toEqual("Post Comment");
      // await expect(async () => {
      // }).not.toThrowError();
    });
    it("Adding not success", async () => {
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

      const comment = await new Comment({
        parentId: post.id,
        postId: post.id,
        parentType: "post",
        content: "Post Comment",
        ownerId: user.id,
        ownerUsername: user.username,
        level: 1,
        createdAt: Date.now(),
      }).save();

      user.followedComments.push(comment._id);
      await user.save();

      await expect(
        addToUserFollowedComments(user._id.toString(), comment._id.toString())
      ).rejects.toThrow("You are following this comment");
    });
  });
});
