/* eslint-disable max-len */
import {
  readPostReplies,
  readReceivedMessages,
  readUsernameMentions,
} from "../../services/readMessages.js";

import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Comment from "./../../models/Comment";
import Message from "./../../models/Message.js";
import Mention from "./../../models/Mention.js";
import PostReplies from "./../../models/PostReplies.js";
import mongoose from "mongoose";

// eslint-disable-next-line max-statements
describe("Testing Read Messages Service functions", () => {
  let senderUser = {},
    receiverUser = {},
    message = {},
    post = {},
    comment = {},
    mention1 = {},
    mention2 = {},
    postReply = {};
  beforeAll(async () => {
    await connectDatabase();

    senderUser = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    receiverUser = await new User({
      username: "ahmed",
      email: "ahmed@gmail.com",
      createdAt: Date.now(),
    }).save();

    post = new Post({
      title: "First post",
      ownerUsername: senderUser.username,
      ownerId: senderUser._id,
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
      ownerId: receiverUser.id,
      ownerUsername: receiverUser.username,
      numberOfVotes: 10,
      createdAt: Date.now(),
    }).save();

    message = await new Message({
      text: "Message1 Text",
      createdAt: Date.now(),
      senderUsername: "hamdy",
      receiverUsername: "ahmed",
      subject: "Subject",
      isSenderUser: true,
      subject: "Subject",
      isReceiverUser: true,
    }).save();

    mention1 = await new Mention({
      postId: post.id,
      commentId: comment.id,
      createdAt: Date.now(),
      receiverUsername: "ahmed",
    }).save();

    mention2 = await new Mention({
      postId: post.id,
      commentId: comment.id,
      createdAt: Date.now(),
      receiverUsername: "ahmed",
    }).save();

    postReply = await new PostReplies({
      postId: post.id,
      commentId: comment.id,
      createdAt: Date.now(),
      receiverUsername: "ahmed",
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Mention.deleteMany({});
    await PostReplies.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have readReceivedMessages defined", () => {
    expect(readReceivedMessages).toBeDefined();
  });

  it("Test receivedMessages", async () => {
    receiverUser.receivedMessages = [message.id];
    await receiverUser.save();
    await readReceivedMessages(receiverUser.id);
    receiverUser = await User.findOne({
      username: receiverUser.username,
    }).populate("receivedMessages");
    expect(receiverUser.receivedMessages[0].isRead).toBeTruthy();
  });

  it("Test receivedMessages with an invalid user ID", async () => {
    try {
      const invalidId = mongoose.Types.ObjectId.generate(10);
      await readReceivedMessages(invalidId);
    } catch (err) {
      expect(err.statusCode).toEqual(401);
      expect(err.message).toEqual("User not found");
    }
  });

  it("Should have readUsernameMentions defined", () => {
    expect(readUsernameMentions).toBeDefined();
  });

  it("Test readUsernameMentions", async () => {
    receiverUser.usernameMentions = [mention1.id, mention2.id];
    await receiverUser.save();
    await readUsernameMentions(receiverUser.id);
    receiverUser = await User.findOne({
      username: receiverUser.username,
    }).populate("usernameMentions");
    expect(receiverUser.usernameMentions[0].isRead).toBeTruthy();
    expect(receiverUser.usernameMentions[1].isRead).toBeTruthy();
  });

  it("Test readUsernameMentions with an invalid user ID", async () => {
    try {
      const invalidId = mongoose.Types.ObjectId.generate(10);
      await readUsernameMentions(invalidId);
    } catch (err) {
      expect(err.statusCode).toEqual(401);
      expect(err.message).toEqual("User not found");
    }
  });

  it("Should have readPostReplies defined", () => {
    expect(readPostReplies).toBeDefined();
  });

  it("Test Read readPostReplies", async () => {
    receiverUser.postReplies = [postReply.id];
    await receiverUser.save();
    await readPostReplies(receiverUser.id);
    receiverUser = await User.findOne({
      username: receiverUser.username,
    }).populate("postReplies");
    expect(receiverUser.postReplies[0].isRead).toBeTruthy();
  });

  it("Test readPostReplies with an invalid user ID", async () => {
    try {
      const invalidId = mongoose.Types.ObjectId.generate(10);
      await readPostReplies(invalidId);
    } catch (err) {
      expect(err.statusCode).toEqual(401);
      expect(err.message).toEqual("User not found");
    }
  });
});
