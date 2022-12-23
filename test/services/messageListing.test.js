/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
  userMessageListing,
  userMentionsListing,
  userInboxListing,
  userConversationListing,
  compareMsgs,
  compareMsgs2,
} from "../../services/messageListing.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";
import Message from "../../models/Message.js";
import PostReplies from "../../models/PostReplies.js";
import Mention from "../../models/Mention.js";

import {
  addMessage,
  getExistingConversation,
} from "../../services/messageServices.js";

// eslint-disable-next-line max-statements
describe("Testing message listing functions", () => {
  let userOne = {},
    userTwo = {},
    userThree = {},
    postOne = {},
    postTwo = {},
    postThree = {},
    CommentOne = {},
    CommentTwo = {},
    CommentThree = {},
    CommentFour = {},
    MessageOne = {},
    MessageTwo = {},
    MessageThree = {},
    MessageFour = {},
    MentionOne = {},
    MentionTwo = {},
    MentionThree = {},
    MentionFour = {},
    PostReplyOne = {},
    PostReplyTwo = {};
  beforeAll(async () => {
    await connectDatabase();

    userOne = await new User({
      username: "Noaman",
      email: "abdelrahmannoaman1@gmail.com",
      createdAt: Date.now(),
    }).save();

    userTwo = await new User({
      username: "Hamdy",
      email: "bodynoaman1996@gmail.com",
      createdAt: Date.now(),
    }).save();

    userThree = await new User({
      username: "Beshoy",
      email: "Bosha@gmail.com",
      createdAt: Date.now(),
    }).save();

    const req1 = {
      msg: {
        senderUsername: "Noaman",
        receiverUsername: "Hamdy",
        isSenderUser: true,
        isReceiverUser: true,
        subject: "y akhuyaa",
        text: "hey ya basha 1",
        createdAt: Date.now(),
        isReply: false,
      },
    };
    await addMessage(req1);
    const date = new Date();
    date.setHours(date.getHours() - 2);
    const req3 = {
      msg: {
        senderUsername: "Noaman",
        receiverUsername: "Hamdy",
        isSenderUser: true,
        isReceiverUser: true,
        subject: "y akhuyaa",
        text: "hey ya basha 2",
        createdAt: date,
        isReply: false,
      },
    };
    await addMessage(req3);

    const req4 = {
      msg: {
        senderUsername: "Hamdy",
        receiverUsername: "Noaman",
        isSenderUser: true,
        isReceiverUser: true,
        subject: "y akhuyaa",
        text: "hey ya king 2",
        createdAt: date,
        isReply: false,
      },
    };
    await addMessage(req4);

    const req2 = {
      msg: {
        senderUsername: "Hamdy",
        receiverUsername: "Noaman",
        isSenderUser: true,
        isReceiverUser: true,
        subject: "y akhuyaa",
        text: "hey ya king",
        createdAt: date.setHours(date.getHours() + 9),
        isReply: false,
      },
    };
    await addMessage(req2);

    MessageOne = await Message.findOne({
      senderUsername: "Hamdy",
      receiverUsername: "Noaman",
      text: "hey ya king 1",
    });
    MessageFour = await Message.findOne({
      senderUsername: "Hamdy",
      receiverUsername: "Noaman",
      text: "hey ya king 2",
    });
    MessageTwo = await Message.findOne({
      senderUsername: "Noaman",
      receiverUsername: "Hamdy",
      text: "hey ya basha 1",
    });
    MessageThree = await Message.findOne({
      senderUsername: "Noaman",
      receiverUsername: "Hamdy",
      text: "hey ya basha 2",
    });

    postOne = await new Post({
      title: "Noaman post2",
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      createdAt: Date.now(),
      usersCommented: [userOne.id],
    }).save();

    CommentTwo = await new Comment({
      parentId: postOne.id,
      parentType: "post",
      postId: postOne.id,
      level: 1,
      createdAt: Date.now(),
      ownerUsername: "Hamdy",
      ownerId: userOne.id,
      content: "Wonderful post",
    }).save();

    CommentOne = await new Comment({
      parentId: postOne.id,
      parentType: "post",
      postId: postOne.id,
      level: 1,
      createdAt: Date.now(),
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      content: "Hamdy da mention",
    }).save();

    CommentThree = await new Comment({
      parentId: postOne.id,
      parentType: "post",
      postId: postOne.id,
      level: 1,
      createdAt: Date.now(),
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      content: "Hamdy da mention tany",
    }).save();

    CommentFour = await new Comment({
      parentId: postOne.id,
      parentType: "post",
      postId: postOne.id,
      level: 1,
      createdAt: Date.now(),
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      content: "Hamdy da mention talt",
    }).save();

    MentionOne = await new Mention({
      postId: postOne.id,
      commentId: CommentOne.id,
      receiverUsername: "Hamdy",
      createdAt: date,
    }).save();

    MentionTwo = await new Mention({
      postId: postOne.id,
      commentId: CommentThree.id,
      receiverUsername: "Hamdy",
      createdAt: date.setHours(date.getHours() - 3),
    }).save();

    MentionThree = await new Mention({
      postId: postOne.id,
      commentId: CommentFour.id,
      receiverUsername: "Hamdy",
      createdAt: date.setHours(date.getHours() - 6),
    }).save();

    MentionFour = await new Mention({
      postId: userOne.id,
      commentId: CommentFour.id,
      receiverUsername: "Hamdy",
      createdAt: date.setHours(date.getHours() - 6),
    }).save();

    PostReplyOne = await new PostReplies({
      postId: postOne.id,
      commentId: CommentOne.id,
      receiverUsername: "Noaman",
      createdAt: date.setHours(date.getHours() - 5),
    }).save();

    userTwo.usernameMentions.push(MentionOne);
    userTwo.usernameMentions.push(MentionTwo);
    userTwo.usernameMentions.push(MentionThree);
    userTwo.upvotedComments.push(CommentOne);
    userTwo.downvotedComments.push(CommentThree);
    userOne.postReplies.push(PostReplyOne);

    await userTwo.save();
    await userOne.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await PostReplies.deleteMany({});
    await Mention.deleteMany({});
    await PostReplies.deleteMany({});
    await Comment.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have userMessageListing function", () => {
    expect(userMessageListing).toBeDefined();
  });

  it("try userMessageListing function ", async () => {
    const result = await userMessageListing(
      userTwo,
      "sentMessages",
      { before: "", after: "", limit: "" },
      false
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(1);
  });

  it("try userMessageListing function ", async () => {
    const result = await userMessageListing(
      userTwo,
      "receivedMessages",
      { before: "", after: "", limit: "" },
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(2);
  });

  it("try userMessageListing function ", async () => {
    const result = await userMessageListing(
      userTwo,
      "receivedMessages",
      { before: MessageThree._id, after: "", limit: "" },
      false
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(1);
  });

  it("try userMessageListing function ", async () => {
    const result = await userMessageListing(
      userTwo,
      "receivedMessages",
      { after: MessageTwo._id, before: "", limit: "" },
      false
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(1);
  });

  it("should have userMentionsListing function", () => {
    expect(userMentionsListing).toBeDefined();
  });

  it("try userMentionsListing function ", async () => {
    const result = await userMentionsListing(
      userTwo,
      "usernameMentions",
      { before: "", after: "", limit: 3 },
      false
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(3);
  });

  it("try userMentionsListing function ", async () => {
    const result = await userMentionsListing(
      userTwo,
      "usernameMentions",
      { before: MentionTwo.id, after: "", limit: 5 },
      false
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(1);
  });

  it("try userMentionsListing function ", async () => {
    const result = await userMentionsListing(
      userTwo,
      "usernameMentions",
      { before: "", after: MentionOne.id, limit: 2 },
      false
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(2);
  });

  it("try userMentionsListing function ", async () => {
    const result = await userMentionsListing(
      userTwo,
      "postReplies",
      { before: "", after: "", limit: "" },
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(0);
  });

  it("should have userConversationListing function", () => {
    expect(userConversationListing).toBeDefined();
  });

  it("try userConversationListing function ", async () => {
    const result = await userConversationListing(userTwo, "conversations", {
      before: "",
      after: "",
      limit: "",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(3);
  });

  it("try userConversationListing function ", async () => {
    const conversation = await getExistingConversation(MessageTwo.id);
    const result = await userConversationListing(userTwo, "conversations", {
      before: conversation,
      after: "",
      limit: 5,
    });
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(2);
  });

  it("try userConversationListing function ", async () => {
    const conversation = await getExistingConversation(MessageTwo.id);
    const result = await userConversationListing(userTwo, "conversations", {
      before: "",
      after: conversation,
      limit: 5,
    });
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(0);
  });

  it("should have compareMsgs function", () => {
    expect(compareMsgs).toBeDefined();
  });
  it("try compareMsgs function ", async () => {
    const newDate = new Date();
    let msg1 = { sendAt: newDate.setHours(newDate.getHours() - 5) };
    let msg2 = { sendAt: newDate.setHours(newDate.getHours() + 20) };
    const result = compareMsgs(msg1, msg2);
    expect(result).toEqual(1);
  });
  it("try compareMsgs function ", async () => {
    const newDate = new Date();
    let msg1 = { sendAt: newDate.setHours(newDate.getHours() - 5) };
    let msg2 = { sendAt: newDate.setHours(newDate.getHours() - 20) };
    const result = compareMsgs(msg1, msg2);
    expect(result).toEqual(-1);
  });
  it("try compareMsgs function ", async () => {
    const newDate = new Date();
    let msg1 = { sendAt: newDate.setHours(newDate.getHours()) };
    let msg2 = { sendAt: newDate.setHours(newDate.getHours()) };
    const result = compareMsgs(msg1, msg2);
    expect(result).toEqual(0);
  });
  it("should have compareMsgs2 function", () => {
    expect(compareMsgs2).toBeDefined();
  });
  it("try compareMsgs2 function ", async () => {
    const newDate = new Date();
    let msg1 = { createdAt: newDate.setHours(newDate.getHours() - 5) };
    let msg2 = { createdAt: newDate.setHours(newDate.getHours() + 20) };
    const result = compareMsgs2(msg1, msg2);
    expect(result).toEqual(1);
  });
  it("try compareMsgs2 function ", async () => {
    const newDate = new Date();
    let msg1 = { createdAt: newDate.setHours(newDate.getHours() - 5) };
    let msg2 = { createdAt: newDate.setHours(newDate.getHours() - 20) };
    const result = compareMsgs2(msg1, msg2);
    expect(result).toEqual(-1);
  });
  it("try compareMsgs2 function ", async () => {
    const newDate = new Date();
    let msg1 = { createdAt: newDate.setHours(newDate.getHours()) };
    let msg2 = { createdAt: newDate.setHours(newDate.getHours()) };
    const result = compareMsgs2(msg1, msg2);
    expect(result).toEqual(0);
  });

  it("should have userInboxListing function", () => {
    expect(userInboxListing).toBeDefined();
  });

  it("try userInboxListing function ", async () => {
    const result = await userInboxListing(userTwo, {
      before: "",
      after: "",
      limit: "",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.data.children.length).toEqual(5);
  });
});
