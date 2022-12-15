/* eslint-disable max-len */
import {
  readPostReplies,
  readReceivedMessages,
  readUsernameMentions,
} from "../../services/readMessages";

import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Message from "./../../models/Message.js";
import Mention from "./../../models/Mention";

// eslint-disable-next-line max-statements
describe("Testing Read Messages Service functions", () => {
  let senderUser = {},
    receiverUser = {},
    message = {},
    mention = {},
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

    message = await new Message({
      text: "Message1 Text",
      createdAt: Date.now(),
      senderUsername: "hamdy",
      receiverUsername: "ahmed",
      isSenderUser: true,
      isReceiverUser: true,
      type: "Message",
    }).save();

    mention = await new Message({
      text: "Message Text",
      createdAt: Date.now(),
      senderUsername: "hamdy",
      receiverUsername: "ahmed",
      isSenderUser: true,
      isReceiverUser: true,
      type: "Message",
    }).save();

    // postReply = await new Message({
    //   text: "Message Text",
    //   createdAt: Date.now(),
    //   senderUsername: "hamdy",
    //   receiverUsername: "ahmed",
    //   isSenderUser: true,
    //   isReceiverUser: true,
    //   type: "Message",
    // }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await Mention.deleteMany({});
    // await PostReply.deleteMany({});
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
});
