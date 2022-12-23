import {
  verifyAuthToken,
  verifyAuthTokenModerator,
  verifyAuthTokenModeratorManageSettings,
  verifyAuthTokenModeratorManageUsers,
  verifyAuthTokenModeratorManageFlairs,
  verifyAuthTokenModeratorManageEverything,
  verifyAuthTokenModeratorManagePostsAndComments,
} from "../../middleware/verifyToken.js";
import { generateJWT } from "../../utils/generateTokens.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import Subreddit from "../../models/Community.js";
import User from "../../models/User.js";
import { jest } from "@jest/globals";
describe("Verify Token file", () => {
  let mockRequest;
  let mockResponse;
  const nextFunction = jest.fn();
  const statusFunction = jest.fn();
  const jsonFunction = jest.fn();
  beforeAll(async () => {
    await connectDatabase();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    closeDatabaseConnection();
  });

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: () => {
        jest.fn();
        return mockResponse;
      },
      json: () => {
        jest.fn();
        return mockResponse;
      },
    };
  });

  describe("Testing verifyAuthToken middleware", () => {
    it("Valid token", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);
      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
      };

      verifyAuthToken(mockRequest, {}, nextFunction);
      expect(nextFunction).toHaveBeenCalled();

      await User.deleteMany({});
    });
    it("Invalid token", async () => {
      mockRequest = {
        headers: {
          authorization: `Bearar noToken!`,
        },
      };
      const newNextFunction = jest.fn();
      verifyAuthToken(mockRequest, mockResponse, newNextFunction);
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
    });
  });

  describe("Testing verifyAuthTokenModerator middleware", () => {
    it("Valid moderator", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };

      verifyAuthTokenModerator(mockRequest, {}, nextFunction);
      expect(nextFunction).toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModerator(mockRequest, mockResponse, newNextFunction);
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
  });

  describe("Testing verifyAuthTokenModeratorManageSettings middleware", () => {
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModeratorManageSettings(
        mockRequest,
        mockResponse,
        newNextFunction
      );
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Valid moderator", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
            permissions: ["Everything"],
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };

      verifyAuthTokenModeratorManageSettings(mockRequest, {}, nextFunction);
      expect(nextFunction).toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
            permissions: ["notvalid"],
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModeratorManageSettings(
        mockRequest,
        mockResponse,
        newNextFunction
      );
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
  });
  describe("Testing verifyAuthTokenModeratorManageUsers middleware", () => {
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModeratorManageUsers(
        mockRequest,
        mockResponse,
        newNextFunction
      );
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Valid moderator", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
            permissions: ["Everything"],
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };

      verifyAuthTokenModeratorManageUsers(mockRequest, {}, nextFunction);
      expect(nextFunction).toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
            permissions: ["notvalid"],
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModeratorManageUsers(
        mockRequest,
        mockResponse,
        newNextFunction
      );
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
  });
  describe("Testing verifyAuthTokenModeratorManageFlairs middleware", () => {
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModeratorManageFlairs(
        mockRequest,
        mockResponse,
        newNextFunction
      );
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Valid moderator", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
            permissions: ["Everything"],
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };

      verifyAuthTokenModeratorManageFlairs(mockRequest, {}, nextFunction);
      expect(nextFunction).toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
            permissions: ["notvalid"],
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModeratorManageFlairs(
        mockRequest,
        mockResponse,
        newNextFunction
      );
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
  });
  describe("Testing verifyAuthTokenModeratorManagePostsAndComments middleware", () => {
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModeratorManagePostsAndComments(
        mockRequest,
        mockResponse,
        newNextFunction
      );
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Valid moderator", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
            permissions: ["Everything"],
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };

      verifyAuthTokenModeratorManagePostsAndComments(
        mockRequest,
        {},
        nextFunction
      );
      expect(nextFunction).toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
            permissions: ["notvalid"],
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModeratorManagePostsAndComments(
        mockRequest,
        mockResponse,
        newNextFunction
      );
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
  });
  describe("Testing verifyAuthTokenModeratorManageEverything middleware", () => {
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();
      const user2 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user2._id,
            dateOfModeration: Date.now(),
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModeratorManageEverything(
        mockRequest,
        mockResponse,
        newNextFunction
      );
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Valid moderator", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
            permissions: ["Everything"],
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };

      verifyAuthTokenModeratorManageEverything(mockRequest, {}, nextFunction);
      expect(nextFunction).toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
    it("Invalid moderator", async () => {
      const user = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      const token = generateJWT(user);

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        moderators: [
          {
            userID: user._id,
            dateOfModeration: Date.now(),
            permissions: ["notvalid"],
          },
        ],
      }).save();

      mockRequest = {
        headers: {
          authorization: `Bearar ${token}`,
        },
        subreddit: subredditObject,
        payload: { userId: user._id.toString() },
      };
      const newNextFunction = jest.fn();
      verifyAuthTokenModeratorManageEverything(
        mockRequest,
        mockResponse,
        newNextFunction
      );
      expect(newNextFunction).not.toHaveBeenCalled();

      await User.deleteMany({});
      await Subreddit.deleteMany({});
    });
  });
});
