import Subreddit from "../../models/Community";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "../../models/User.js";
import subredditRulesMiddleware from "../../middleware/subredditRules.js";
import { jest } from "@jest/globals";

describe("subredditRulesMiddleware", () => {
  beforeAll(async () => {
    await connectDatabase();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    closeDatabaseConnection();
  });
  describe("validateRuleId", () => {
    it("Invalid ruleid", () => {
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
      const nextFunction = jest.fn();
      const req = {
        params: {
          ruleId: "2",
        },
      };
      subredditRulesMiddleware.validateRuleId(req, mockResponse, nextFunction);
      expect(nextFunction).not.toHaveBeenCalled();
    });
    it("Valid ruleid", () => {
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
          ruleId: "551137c2f9e1fac808a5f572",
        },
      };
      subredditRulesMiddleware.validateRuleId(req, mockResponse, nextFunction2);
      expect(nextFunction2).toHaveBeenCalled();
    });
  });
  describe("checkRule", () => {
    it("existing rule", async () => {
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

      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        rules: [
          {
            ruleTitle: "Test rule",
            ruleOrder: 0,
            createdAt: Date.now(),
            appliesTo: "Posts",
          },
        ],
      }).save();

      const nextFunction3 = jest.fn();
      const req = {
        params: {
          ruleId: subredditObject.rules[0]._id.toString(),
        },
        subreddit: subredditObject,
      };
      subredditRulesMiddleware.checkRule(req, mockResponse, nextFunction3);
      expect(nextFunction3).toHaveBeenCalled();
    });
    it("Deleted rule", async () => {
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
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
        rules: [
          {
            ruleTitle: "Test rule",
            ruleOrder: 0,
            createdAt: Date.now(),
            deletedAt: Date.now(),
            appliesTo: "Posts",
          },
        ],
      }).save();
      const nextFunction4 = jest.fn();
      const req = {
        params: {
          ruleId: subredditObject.rules[0]._id.toString(),
        },
        subreddit: subredditObject,
      };
      subredditRulesMiddleware.checkRule(req, mockResponse, nextFunction4);
      expect(nextFunction4).not.toHaveBeenCalled();
    });
  });
});
