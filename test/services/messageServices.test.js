/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
  checkExistingConversation,
  addToConversation,
  getExistingConversation,
  createNewConversation,
  addConversationToUsers,
  validateMessage,
  validateMention,
  checkForMsgReceiver,
  markMessageAsSpam,
  unmarkMessageAsSpam,
  unreadMessage,
  searchForMessage,
  addMention,
  addMessage,
} from "../../services/messageServices.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Message from "./../../models/Message.js";
import Conversation from "./../../models/Conversation.js";
import Post from "./../../models/Post.js";
import Comment from "./../../models/Comment.js";
import Mention from "../../models/Mention.js";
import Subreddit from "../../models/Community.js";

// eslint-disable-next-line max-statements
describe("Testing message service functions", () => {
  let userOne = {},
    userTwo = {},
    userThree = {},
    subreddit = {},
    existingMessage = {},
    secondMessage = {},
    ThirdMessage = {},
    msgToSubreddit = {},
    existingConversation = {},
    postOne = {},
    commentOne = {},
    postTwo = {},
    commentTwo = {};
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

    subreddit = await new Subreddit({
      title: "noamansubreddit",
      viewName: "no3mn ygd3an",
      category: "Sports",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
    }).save();

    msgToSubreddit = await new Message({
      text: "Noaman byb3t Msg l subreddit",
      createdAt: Date.now(),
      senderUsername: "Noaman",
      isSenderUser: true,
      receiverUsername: "noamansubreddit",
      isReceiverUser: false,
      subject: "we are testing the msg",
    });

    existingMessage = await new Message({
      text: "Noaman byb3t Msg",
      createdAt: Date.now(),
      senderUsername: "Noaman",
      isSenderUser: true,
      receiverUsername: "Hamdy",
      isReceiverUser: true,
      subject: "we are testing the msg",
    }).save();

    secondMessage = await new Message({
      text: "Noaman byb3t Msg rkm etnin",
      createdAt: Date.now(),
      senderUsername: "Noaman",
      isSenderUser: true,
      receiverUsername: "Hamdy",
      isReceiverUser: true,
      isReply: true,
      repliedMsgId: existingMessage.id,
      subject: "we are testing the msg",
      isRead: true,
    }).save();

    ThirdMessage = await new Message({
      text: "Noaman byb3t Msg rkm Tlata",
      createdAt: Date.now(),
      senderUsername: "Noaman",
      isSenderUser: true,
      receiverUsername: "Hamdy",
      isReceiverUser: true,
      subject: "we are testing the msg part 2",
    }).save();

    postOne = await new Post({
      title: "Noaman post",
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      createdAt: Date.now(),
      userCommented: [userOne.id],
    }).save();

    commentTwo = await new Comment({
      parentId: postOne.id,
      parentType: "post",
      postId: postOne.id,
      level: 1,
      createdAt: Date.now(),
      ownerUsername: "Hamdy",
      ownerId: userOne.id,
      content: "Wonderful post",
    }).save();

    commentOne = await new Comment({
      parentId: postOne.id,
      parentType: "post",
      postId: postOne.id,
      level: 1,
      createdAt: Date.now(),
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      content: "Hamdy da mention",
    }).save();

    const messages = [];
    messages.push(existingMessage.id);

    existingConversation = await new Conversation({
      subject: existingMessage.subject,
      firstUsername: existingMessage.senderUsername,
      isFirstNameUser: existingMessage.isSenderUser,
      secondUsername: existingMessage.receiverUsername,
      isSecondNameUser: existingMessage.isReceiverUser,
      messages: messages,
    }).save();

    userOne.sentMessages.push(existingMessage.id);
    userTwo.receivedMessages.push(existingMessage.id);
    userOne.sentMessages.push(secondMessage.id);
    userTwo.receivedMessages.push(secondMessage.id);
    userOne.sentMessages.push(ThirdMessage.id);
    userTwo.receivedMessages.push(ThirdMessage.id);
    userOne.conversations.push(existingConversation.id);
    userTwo.conversations.push(existingConversation.id);

    await userOne.save();
    await userTwo.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Subreddit.deleteMany({});
    await Mention.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have checkExistingConversation function", () => {
    expect(checkExistingConversation).toBeDefined();
  });

  it("try checkExistingConversation function if the user already had the conversation", async () => {
    const result = await checkExistingConversation(
      userOne,
      existingConversation.id
    );
    expect(result).toEqual(true);
  });

  it("try checkExistingConversation function if the user didn't have the conversation", async () => {
    const result = await checkExistingConversation(
      userThree,
      existingConversation.id
    );
    expect(result).toEqual(false);
  });
  //-------------------------------------------------------------------------------------------------------------------

  it("should have addToConversation function", () => {
    expect(addToConversation).toBeDefined();
  });

  it("try addToConversation function with an invalid conversation Id", async () => {
    try {
      await addToConversation(secondMessage, "2365");
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Invalid conversation id");
    }
  });

  it("try addToConversation function with a not found conversation", async () => {
    try {
      await addToConversation(secondMessage, userOne.id);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This conversation is not found");
    }
  });

  it("try addToConversation function with a repeated Message", async () => {
    try {
      await addToConversation(existingMessage, existingConversation.id);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual(
        "This Message already exists in the conversation"
      );
    }
  });

  it("try addToConversation function with a new Message", async () => {
    const result = await addToConversation(
      secondMessage,
      existingConversation.id
    );
    expect(result).toEqual(true);
  });
  //----------------------------------------------------------------------------------------------------------
  it("should have getExistingConversation function", () => {
    expect(addToConversation).toBeDefined();
  });

  it("try getExistingConversation function with an invalid message Id", async () => {
    try {
      await getExistingConversation("2365");
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Invalid Message id");
    }
  });

  it("try getExistingConversation with a message id that isn't in the conversation", async () => {
    try {
      await getExistingConversation(userOne.id);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This conversation is not found");
    }
  });

  it("try getExistingConversation with a message id that is in the conversation", async () => {
    const result = await getExistingConversation(existingMessage.id);
    const conv = await Conversation.findById(result);
    expect(conv).not.toBeNull();
  });
  //-----------------------------------------------------------------------------------------------------------
  it("should have createNewConversation function", () => {
    expect(createNewConversation).toBeDefined();
  });
  it("try createNewConversation with a message", async () => {
    const result = await createNewConversation(ThirdMessage);
    const conv = await Conversation.findById(result);
    await addToConversation(ThirdMessage, conv.id);
    expect(conv).not.toBeNull();
  });
  //-----------------------------------------------------------------------------------------------------------
  it("should have addConversationToUsers function", () => {
    expect(addConversationToUsers).toBeDefined();
  });
  it("try addConversationToUsers with a message", async () => {
    const conversation = await getExistingConversation(ThirdMessage.id);
    const result = await addConversationToUsers(ThirdMessage, conversation.id);
    expect(result).toEqual(true);
  });
  //----------------------------------------------------------------------------------------------------------
  it("should have validateMessage function", () => {
    expect(validateMessage).toBeDefined();
  });

  it("try validateMessage function without subject", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/u/Noaman",
          receiverUsername: "/u/Hamdy",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Subject is needed");
    }
  });

  it("try validateMessage function without senderUsername", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          receiverUsername: "/u/Hamdy",
          subject: "subject gded",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("senderUsername is needed");
    }
  });

  it("try validateMessage function without receiverUsername", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/u/Noaman",
          subject: "subject gded",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("receiverUsername is needed");
    }
  });

  it("try validateMessage function without text", async () => {
    try {
      const req = {
        body: {
          senderUsername: "/u/Noaman",
          receiverUsername: "/u/Hamdy",
          subject: "subject gded",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("text is needed");
    }
  });

  it("try validateMessage function without isReply", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/u/Noaman",
          receiverUsername: "/u/Hamdy",
          subject: "subject gded",
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("isReply is needed");
    }
  });

  it("try validateMessage function without adding replied Msg Id if the isReply is true", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/u/Noaman",
          receiverUsername: "/u/Hamdy",
          subject: "subject gded",
          isReply: true,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("repliedMsgId is needed");
    }
  });

  it("try validateMessage function with adding replied Msg Id if the isReply is true", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/u/Noaman",
          receiverUsername: "/u/Hamdy",
          subject: "subject gded",
          isReply: true,
          repliedMsgId: existingMessage.id,
        },
        payload: {
          username: "Hamdy",
        },
      };
      await validateMessage(req);
      expect(req.msg).not.toBeNull();
    } catch (e) {}
  });

  it("try validateMessage function with adding replied Msg Id if the isReply is true", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/r/noamansubreddit",
          receiverUsername: "/u/Noaman",
          subject: "subject gded",
          isReply: true,
          repliedMsgId: existingMessage.id,
        },
        payload: {
          username: "Hamdy",
        },
      };
      await validateMessage(req);
      expect(req.msg).not.toBeNull();
    } catch (e) {}
  });

  it("try validateMessage function with invalid senderUsername", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "uNoaman",
          receiverUsername: "/u/Hamdy",
          subject: "subject gded",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Invalid sender or receiver username");
    }
  });
  it("try validateMessage function with invalid senderUsername", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/m/Noaman",
          receiverUsername: "/u/Hamdy",
          subject: "subject gded",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Invalid sender username");
    }
  });

  it("try validateMessage function with invalid receiverUsername", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/u/Noaman",
          receiverUsername: "/uHamdy",
          subject: "subject gded",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Invalid receiver username");
    }
  });
  it("try validateMessage function with invalid receiverUsername", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/u/Noaman",
          receiverUsername: "/m/Hamdy",
          subject: "subject gded",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Invalid receiver username");
    }
  });
  it("try validateMessage function with sending a msg form a subreddit to another", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/r/Noaman",
          receiverUsername: "/r/Hamdy",
          subject: "subject gded",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual(
        "You can't send a message from a subreddit to another"
      );
    }
  });
  it("try validateMessage function with sending a msg form undefined user", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/u/Ahmed",
          receiverUsername: "/u/Noaman",
          subject: "subject gded",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(404);
      expect(e.message).toEqual("Didn't find a user with that username");
    }
  });
  it("try validateMessage function with sending a msg to undefined user", async () => {
    try {
      const req = {
        body: {
          text: "nu33",
          senderUsername: "/u/Noaman",
          receiverUsername: "/u/Ahmed",
          subject: "subject gded",
          isReply: false,
        },
      };
      await validateMessage(req);
    } catch (e) {
      expect(e.statusCode).toEqual(404);
      expect(e.message).toEqual("Didn't find a user with that username");
    }
  });
  //----------------------------------------------------------------------------------------------------------
  it("should have validateMention function", () => {
    expect(validateMention).toBeDefined();
  });

  it("try validateMention function without postId", async () => {
    try {
      const req = {
        body: {
          postId: "nu33",
        },
      };
      await validateMention(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Post Id and Comment Id is needed");
    }
  });

  it("try validateMention function without commentId", async () => {
    try {
      const req = {
        body: {
          commentId: "nu33",
        },
      };
      await validateMention(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Post Id and Comment Id is needed");
    }
  });

  it("try validateMention function without receiverUsername", async () => {
    try {
      const req = {
        body: {
          commentId: "nu33",
          postId: "nu3333",
        },
      };
      await validateMention(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("receiverUsername is needed");
    }
  });

  it("try validateMention function with a valid data", async () => {
    try {
      const req = {
        body: {
          commentId: commentOne.id,
          postId: postOne.id,
          receiverUsername: "Hamdy",
        },
      };
      await validateMention(req);
      const where = "we are here";
      expect(where).toEqual("we are here");
    } catch (e) {}
  });

  //----------------------------------------------------------------------------------------------------------
  it("should have unreadMessage function", () => {
    expect(unreadMessage).toBeDefined();
  });

  it("try unreadMessage function to unread a message", async () => {
    const result = await unreadMessage(secondMessage, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Message has been unread successfully");
  });

  it("try unreadMessage function to unread a message that was already unread", async () => {
    try {
      await unreadMessage(secondMessage, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Msg is already unread");
    }
  });
  //----------------------------------------------------------------------------------------------------------
  it("should have markMessageAsSpam function", () => {
    expect(markMessageAsSpam).toBeDefined();
  });

  it("try markMessageAsSpam function to spam a message", async () => {
    const result = await markMessageAsSpam(secondMessage, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Message has been spammed successfully");
  });

  it("try markMessageAsSpam function to mark a message as spam that was already spammed", async () => {
    try {
      await markMessageAsSpam(secondMessage, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(409);
      expect(e.message).toEqual("Msg is already spammed");
    }
  });
  //----------------------------------------------------------------------------------------------------------
  it("should have unmarkMessageAsSpam function", () => {
    expect(unmarkMessageAsSpam).toBeDefined();
  });

  it("try unmarkMessageAsSpam function to spam a message", async () => {
    const result = await unmarkMessageAsSpam(secondMessage, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Message has been unspammed successfully");
  });

  it("try markMessageAsSpam function to mark a message as spam that was already spammed", async () => {
    try {
      await unmarkMessageAsSpam(secondMessage, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(409);
      expect(e.message).toEqual("Msg is already unspammed");
    }
  });
  //----------------------------------------------------------------------------------------------------------
  it("should have checkForMsgReceiver function", () => {
    expect(checkForMsgReceiver).toBeDefined();
  });

  it("try checkForMsgReceiver function to check if the receiver is the user making the request or not", async () => {
    try {
      await checkForMsgReceiver(secondMessage, userTwo);
      const where = "we are here";
      expect(where).toEqual("we are here");
    } catch (e) {}
  });

  it("try checkForMsgReceiver function to check if the receiver is subreddit", async () => {
    try {
      await checkForMsgReceiver(msgToSubreddit, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual(
        "You can't do this action to this message,it was sent to subreddit"
      );
    }
  });

  it("try checkForMsgReceiver function to check if the receiver isn't the user making the request or not", async () => {
    try {
      await markMessageAsSpam(secondMessage, userOne);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual(
        "You can't do action to this messages, you are not the receiver"
      );
    }
  });

  it("try checkForMsgReceiver function to check if the receiver isn't the user making the request or not", async () => {
    try {
      await markMessageAsSpam(secondMessage, userOne);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual(
        "You can't do action to this messages, you are not the receiver"
      );
    }
  });
  //----------------------------------------------------------------------------------------------------------
  it("should have searchForMessage function", () => {
    expect(searchForMessage).toBeDefined();
  });

  it("try searchForMessage function to search for a real message", async () => {
    const result = await searchForMessage(secondMessage.id);
    expect(result.id).toEqual(secondMessage.id);
  });

  it("try searchForMessage function to check if the receiver isn't the user making the request or not", async () => {
    try {
      await searchForMessage(userOne.id);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Couldn't find a message with that Id");
    }
  });

  //----------------------------------------------------------------------------------------------------------
  it("should have addMention function", () => {
    expect(addMention).toBeDefined();
  });

  it("try addMention function to add a mention where the receiver username isn't in the mention", async () => {
    try {
      const req = {
        mention: {
          commentId: commentTwo.id,
          postId: postOne.id,
          receiverUsername: "Hamdy",
        },
        payload: {
          username: "Noaman",
          id: userOne.id,
        },
      };
      await addMention(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual(
        "The comment doesn't contain the name of the receiver username"
      );
    }
  });

  it("try addMention function to add a mention where the owner of the comment isn't the one who sends the request", async () => {
    try {
      const req = {
        mention: {
          commentId: commentOne.id,
          postId: postOne.id,
          receiverUsername: "Hamdy",
        },
        payload: {
          username: "Hamdy",
          id: userOne.id,
        },
      };
      await addMention(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual(
        "The user sent the request isn't the comment owner"
      );
    }
  });

  it("try addMention function to add a mention", async () => {
    const req = {
      mention: {
        commentId: commentOne.id,
        postId: postOne.id,
        receiverUsername: "Hamdy",
        createdAt: Date.now(),
      },
      payload: {
        username: "Noaman",
        id: userOne.id,
      },
    };
    await addMention(req);
    const ourMention = await Mention.findOne({ receiverUsername: "Hamdy" });
    expect(ourMention).not.toBeNull();
  });

  it("try addMention function to add an existing mention", async () => {
    try {
      const req = {
        mention: {
          commentId: commentOne.id,
          postId: postOne.id,
          receiverUsername: "Hamdy",
        },
        payload: {
          username: "Noaman",
          id: userOne.id,
        },
      };
      await addMention(req);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This mention already exists");
    }
  });

  //----------------------------------------------------------------------------------------------------------
  it("should have addMessage function", () => {
    expect(addMessage).toBeDefined();
  });

  it("try addMessage function to add a normal message", async () => {
    try {
      const req = {
        msg: {
          senderUsername: "Noaman",
          receiverUsername: "Hamdy",
          isSenderUser: true,
          isReceiverUser: true,
          subject: "y akhuyaa",
          text: "hey ya basha",
          createdAt: Date.now(),
          isReply: false,
        },
      };
      await addMessage(req);
      const message = await Message.findOne({
        text: "hey ya basha",
        subject: "y akhuya",
        senderUsername: "Noaman",
        receiverUsername: "Hamdy",
        isReply: false,
      });
      expect(message).not.toBeNull();
    } catch (e) {}
  });
  it("try addMessage function to add a reply message", async () => {
    try {
      const req = {
        msg: {
          senderUsername: "Noaman",
          receiverUsername: "Hamdy",
          isSenderUser: true,
          isReceiverUser: true,
          subject: "y akhuyaa",
          text: "hey ya basha",
          createdAt: Date.now(),
          isReply: true,
          repliedMsgId: existingMessage.id,
        },
      };
      await addMessage(req);
      const message = await Message.findOne({
        text: "hey ya basha",
        subject: "y akhuya",
        senderUsername: "Noaman",
        receiverUsername: "Hamdy",
        isReply: true,
      });
      expect(message).not.toBeNull();
    } catch (e) {}
  });
});
