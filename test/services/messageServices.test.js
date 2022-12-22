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
} from "../../services/messageServices.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Message from "./../../models/Message.js";
import Conversation from "./../../models/Conversation.js";

// eslint-disable-next-line max-statements
describe("Testing message service functions", () => {
  let userOne = {},
    userTwo = {},
    userThree = {},
    existingMessage = {},
    secondMessage = {},
    ThirdMessage = {},
    existingConversation = {};
  beforeAll(async () => {
    await connectDatabase();

    userOne = await new User({
      username: "Noaman",
      email: "Noaman@gmail.com",
      createdAt: Date.now(),
    }).save();

    userTwo = await new User({
      username: "Hamdy",
      email: "Abelrahman@gmail.com",
      createdAt: Date.now(),
    }).save();

    userThree = await new User({
      username: "Beshoy",
      email: "Bosha@gmail.com",
      createdAt: Date.now(),
    }).save();

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
});
