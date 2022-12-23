import {
  validateCreateOrEditFlair,
  validateFlairType,
  prepareCreateFlairBody,
  createFlair,
  validateId,
  editFlair,
} from "../../services/subredditFlairs.js";
import Subreddit from "../../models/Community.js";
import Flair from "../../models/Flair.js";
import { jest } from "@jest/globals";

import { connectDatabase, closeDatabaseConnection } from "../database.js";

describe("Testing subreddit flairs services", () => {
  describe("testing validateCreateOrEditFlair method", () => {
    it("validateCreateOrEditFlair method should exist", () => {
      expect(validateCreateOrEditFlair).toBeDefined();
    });

    it("validateFlairType method should throw error Missing parameters", () => {
      const req = {
        body: {
          flairName: "Zeyad",
        },
      };
      expect(() => {
        validateCreateOrEditFlair(req);
      }).toThrow("Missing parameters");
    });

    it("validateFlairType method should throw error Bad request modOnly and allowUser edits", () => {
      const req = {
        body: {
          flairName: "Zeyad",
          settings: {
            modOnly: true,
            allowUserEdits: true,
          },
        },
      };
      expect(() => {
        validateCreateOrEditFlair(req);
      }).toThrow("Bad request");
    });
    it("validateFlairType method should throw error Bad request Invalid emojis limit", () => {
      const req = {
        body: {
          flairName: "Zeyad",
          settings: {
            emojisLimit: 0,
          },
        },
      };
      expect(() => {
        validateCreateOrEditFlair(req);
      }).toThrow("Bad request");
    });

    it("validateFlairType method should throw error Bad request", () => {
      const req = {
        body: {
          flairName: "Zeyad",
          settings: {
            allowUserEdits: true,
          },
        },
      };
      expect(() => {
        validateCreateOrEditFlair(req);
      }).toThrow("Missing parameters");
    });

    it("validateFlairType method shouldn't throw error", () => {
      const req = {
        body: {
          flairName: "Zeyad",
          settings: {},
        },
      };
      expect(() => {
        validateCreateOrEditFlair(req);
      }).not.toThrowError();
    });
  });
  describe("Testing validateFlairType method", () => {
    it("Testing invalid flair type", () => {
      expect(() => {
        validateFlairType("Invalid type");
      }).toThrow("Bad request");
    });
    it("Testing valid flair type", () => {
      expect(() => {
        validateFlairType("Text and emojis");
      }).not.toThrowError();
    });
  });

  describe("Testing prepareCreateFlairBody method", () => {
    it("Testing valid body", () => {
      const req = {
        body: {
          flairName: "Test flair",
          backgroundColor: "blue",
          settings: {
            modOnly: true,
          },
        },
        subreddit: {
          _id: 1,
          numberOfFlairs: 2,
        },
      };
      expect(prepareCreateFlairBody(req)).toMatchObject({
        flairName: "Test flair",
        backgroundColor: "blue",
        flairSettings: { allowUserEdits: false, modOnly: true },
        subreddit: 1,
        flairOrder: 2,
      });
    });
    it("Testing valid body", () => {
      const req = {
        body: {
          flairName: "Test flair",
          settings: {
            modOnly: true,
          },
        },
        subreddit: {
          _id: 1,
          numberOfFlairs: 2,
        },
      };
      expect(prepareCreateFlairBody(req)).toMatchObject({
        flairName: "Test flair",
        flairSettings: { allowUserEdits: false, modOnly: true },
        subreddit: 1,
        flairOrder: 2,
      });
    });

    it("Testing valid body", () => {
      const req = {
        body: {
          flairName: "Test flair",
          backgroundColor: "blue",
          settings: {
            modOnly: false,
            flairType: "Text only",
            emojisLimit: 3,
          },
        },
        subreddit: {
          _id: 1,
          numberOfFlairs: 2,
        },
      };
      expect(prepareCreateFlairBody(req)).toMatchObject({
        flairName: "Test flair",
        backgroundColor: "blue",
        flairSettings: {
          allowUserEdits: true,
          modOnly: false,
          flairType: "Text only",
          emojisLimit: 3,
        },
        subreddit: 1,
        flairOrder: 2,
      });
    });
  });

  describe("Testing create flair function", () => {
    it("Create a valid flair", async () => {
      await connectDatabase();
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const saveFunction = jest.fn();
      const flair = {
        flairName: "Test flair",
        backgroundColor: "blue",
        flairSettings: {
          allowUserEdits: true,
          modOnly: false,
          flairType: "Text only",
          emojisLimit: 3,
        },
        subreddit: subredditObject._id,
        flairOrder: 2,
        createdAt: Date.now(),
      };

      const subreddit = {
        flairs: [],
        numberOfFlairs: 0,
        save: saveFunction,
      };

      await createFlair(flair, subreddit);
      expect(saveFunction).toHaveBeenCalled();
      await Subreddit.deleteMany({});
      await Flair.deleteMany({});
      await closeDatabaseConnection();
    });
  });

  describe("Testing validate id ", () => {
    it("Valid it", () => {
      expect(() => {
        validateId("63a369a66b86de91f5534d3f");
      }).not.toThrowError();
    });

    it("Invalid id", () => {
      expect(() => {
        validateId("1");
      }).toThrow("Invalid id");
    });
  });
  describe("Testing editFlair ", () => {
    it("background and text", async () => {
      const saveFunction = jest.fn();
      const flair = {
        save: saveFunction,
      };
      const flairObj = {
        backgroundColor: "test",
        textColor: "test",
      };
      await editFlair(flairObj, flair);
      expect(saveFunction).toHaveBeenCalled();
    });
    it("no backghround and no text", async () => {
      const saveFunction = jest.fn();
      const flair = {
        save: saveFunction,
      };
      const flairObj = {};
      await editFlair(flairObj, flair);
      expect(saveFunction).toHaveBeenCalled();
    });
  });
});
