import Subreddit from "../../models/Community";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import subredditDetailsMiddleware from "../../middleware/subredditDetails.js";
import User from "../../models/User.js";
import { jest } from "@jest/globals";
describe("subreddit details middlewares", () => {
  beforeAll(async () => {
    await connectDatabase();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    closeDatabaseConnection();
  });

  describe("checkSubreddit", () => {
    it("Valid subreddit", async () => {
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const nextFunction = jest.fn();
      const req = {
        params: {
          subreddit: "title",
        },
      };
      await subredditDetailsMiddleware.checkSubreddit(req, {}, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
      await Subreddit.deleteMany({});
    });
    it("deleted subreddit", async () => {
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        deletedAt: Date.now(),
      }).save();
      const mockResponse = {
        status: () => {
          jest.fn();
          return mockResponse;
        },
        json: () => {
          jest.fn();
          return mockResponse;
        },
      };
      const nextFunction2 = jest.fn();
      const req = {
        params: {
          subreddit: "title",
        },
      };
      await subredditDetailsMiddleware.checkSubreddit(
        req,
        mockResponse,
        nextFunction2
      );
      expect(nextFunction2).not.toHaveBeenCalled();
      await Subreddit.deleteMany({});
    });
  });
});
