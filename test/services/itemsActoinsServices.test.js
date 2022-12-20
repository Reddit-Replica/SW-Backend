import { connectDatabase, closeDatabaseConnection } from "../database.js";
import { deleteItems } from "../../services/itemsActionsServices.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Comment from "../../models/Comment.js";
import Message from "../../models/Message.js";

// eslint-disable-next-line max-statements
describe("Testing item actions services functions", () => {
  let user = {},
    user1 = {},
    post = {},
    postComment = {},
    comment = {},
    innerComment = {},
    message = {};

  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
      createdAt: Date.now(),
    });
    await user.save();

    user1 = new User({
      username: "Morta",
      email: "morta@gmail.com",
      createdAt: Date.now(),
    });
    await user1.save();

    post = new Post({
      title: "Without subreddit post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      numberOfComments: 3,
      createdAt: Date.now(),
    });
    await post.save();

    postComment = new Comment({
      parentId: post._id,
      postId: post._id,
      parentType: "post",
      level: 1,
      content: { text: "Post first comment" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 10,
      createdAt: Date.now(),
    });
    await postComment.save();

    comment = new Comment({
      parentId: post._id,
      postId: post._id,
      parentType: "post",
      level: 1,
      content: { text: "post second comment" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 10,
      createdAt: Date.now(),
    });
    await comment.save();

    innerComment = new Comment({
      parentId: comment._id,
      postId: post._id,
      parentType: "post",
      level: 1,
      content: { text: "Inner comment" },
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 10,
      createdAt: Date.now(),
    });
    await innerComment.save();

    message = new Message({
      text: "Message from the upside down",
      createdAt: Date.now(),
      receiverId: user1,
      senderUsername: user.username,
      isSenderUser: true,
      receiverUsername: user1.username,
      isReceiverUser: true,
      subject: "Subject",
    });
    await message.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await Message.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have deleteItems function", () => {
    expect(deleteItems).toBeDefined();
  });

  it("try to delete a post with invalid id", async () => {
    try {
      await deleteItems(user._id, "lol", "post");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to delete a comment with invalid id", async () => {
    try {
      await deleteItems(user._id, "lol", "comment");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to delete a message with invalid id", async () => {
    try {
      await deleteItems(user._id, "lol", "message");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("try to delete a post with an id that dose not exist", async () => {
    try {
      await deleteItems(user._id, comment._id, "post");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to delete a comment with an id that dose not exist", async () => {
    try {
      await deleteItems(user._id, post._id, "comment");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to delete a message with an id that dose not exist", async () => {
    try {
      await deleteItems(user._id, post._id, "message");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("try to delete with an invalid type", async () => {
    try {
      await deleteItems(user._id, post._id, "lol");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("try to delete with a post of other user", async () => {
    try {
      await deleteItems(user1._id, post._id, "post");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to delete with a comment of other user", async () => {
    try {
      await deleteItems(user1._id, postComment._id, "comment");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to delete with a message of other user", async () => {
    try {
      await deleteItems(user._id, message._id, "message");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("try to delete a comment", async () => {
    const result = await deleteItems(user._id, comment._id, "comment");
    expect(result.statusCode).toEqual(200);
  });

  it("try to delete a post", async () => {
    const result = await deleteItems(user._id, post._id, "post");
    expect(result.statusCode).toEqual(200);
  });
  it("try to delete a message", async () => {
    const result = await deleteItems(user1._id, message._id, "message");
    expect(result.statusCode).toEqual(200);
  });
});
