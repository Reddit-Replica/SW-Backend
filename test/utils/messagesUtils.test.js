import {
  addPostReply,
  addUserMention,
  addSentMessages,
  addReceivedMessages,
} from "../../utils/messagesUtils";
import User from "../../models/User.js";
import Message from "../../models/Message.js";
import PostReplies from "../../models/PostReplies";
import Mention from "../../models/Mention.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import mongoose from "mongoose";

describe("Testing Messages Utils file", () => {
  let user = {};
  let message = {};
  let mention = {};
  let postReply = {};
  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    message = await new Message({
      text: "Message Text",
      createdAt: Date.now(),
      senderUsername: "hamdy",
      receiverUsername: "ahmed",
      subject: "Subject",
      isSenderUser: true,
      subject: "Subject",
      isReceiverUser: true,
    }).save();

    mention = await new Mention({
      postId: mongoose.Types.ObjectId.generate(10),
      commentId: mongoose.Types.ObjectId.generate(10),
      createdAt: Date.now(),
      receiverUsername: "ahmed",
    }).save();

    postReply = await new PostReplies({
      postId: mongoose.Types.ObjectId.generate(10),
      commentId: mongoose.Types.ObjectId.generate(10),
      createdAt: Date.now(),
      receiverUsername: "ahmed",
    }).save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await Mention.deleteMany({});
    await PostReplies.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have addSentMessages method", () => {
    expect(addSentMessages).toBeDefined();
  });

  it("Test addSentMessages correctly", async () => {
    const result = await addSentMessages(user._id, message);
    expect(result).toBeTruthy();
  });

  it("Test addSentMessages for an already added message", async () => {
    user = await User.findById(user.id);
    let result;
    try {
      result = await addSentMessages(user._id, message);
    } catch (err) {
      expect(result).toBeUndefined();
      expect(err.statusCode).toEqual(400);
    }
  });

  it("should have addReceivedMessages method", () => {
    expect(addReceivedMessages).toBeDefined();
  });

  it("Test addReceivedMessages correctly", async () => {
    const result = await addReceivedMessages(user._id, message);
    expect(result).toBeTruthy();
  });

  it("Test addReceivedMessages for an already added message", async () => {
    user = await User.findById(user.id);
    let result;
    try {
      result = await addReceivedMessages(user._id, message);
    } catch (err) {
      expect(result).toBeUndefined();
      expect(err.statusCode).toEqual(400);
    }
  });

  it("should have addUserMention method", () => {
    expect(addUserMention).toBeDefined();
  });

  it("Test addUserMention correctly", async () => {
    const result = await addUserMention(user._id, mention);
    expect(result).toBeTruthy();
  });

  it("Test addUserMention for an already added mention", async () => {
    user = await User.findById(user.id);
    let result;
    try {
      result = await addUserMention(user._id, mention);
    } catch (err) {
      expect(result).toBeUndefined();
      expect(err.statusCode).toEqual(400);
    }
  });

  it("should have addPostReply method", () => {
    expect(addPostReply).toBeDefined();
  });

  it("Test addPostReply correctly", async () => {
    const result = await addPostReply(user._id, postReply);
    expect(result).toBeTruthy();
  });

  it("Test addPostReply for an already added post reply", async () => {
    user = await User.findById(user.id);
    let result;
    try {
      result = await addPostReply(user._id, postReply);
    } catch (err) {
      expect(result).toBeUndefined();
      expect(err.statusCode).toEqual(400);
    }
  });

  it("Test addPostReply with no post replies", async () => {
    let result;
    user.postReplies = undefined;
    user.usernameMentions = undefined;
    await user.save();
    try {
      result = await addPostReply(user._id, undefined);
    } catch (err) {
      expect(result).toBeUndefined();
    }
  });
});
