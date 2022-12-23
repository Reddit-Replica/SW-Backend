import {
  validateCreateOrEditFlair,
  validateFlairType,
  prepareCreateFlairBody,
  createFlair,
  validateId,
  editFlair,
  checkFlair,
  deleteFlair,
  prepareFlairDetails,
  prepareFlairsSettings,
  prepareFlairs,
  validateFlairSettingsBody,
} from "../../services/subredditFlairs.js";
import Subreddit from "../../models/Community.js";
import Flair from "../../models/Flair.js";
import { jest } from "@jest/globals";

import { connectDatabase, closeDatabaseConnection } from "../database.js";

describe("Testing subreddit flairs services", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(() => {
    closeDatabaseConnection();
  });
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
  describe("Testing checkFlair ", () => {
    it("searching existing flair", async () => {
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const createdAt = Date.now();
      const flairObj = await new Flair({
        flairName: "Test flair",
        subreddit: subredditObject._id,
        flairOrder: 2,
        createdAt: createdAt,
      }).save();
      subredditObject.flairs.push(flairObj._id);
      await subredditObject.save();
      expect(
        await checkFlair(flairObj._id.toString(), subredditObject)
      ).toMatchObject({
        flairName: "Test flair",
      });

      await Flair.deleteMany({});
    });
    it("searching deleted flair", async () => {
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const createdAt = Date.now();
      const flairObj = await new Flair({
        flairName: "Test flair",
        subreddit: subredditObject._id,
        flairOrder: 2,
        createdAt: createdAt,
      }).save();
      flairObj.deletedAt = Date.now();
      subredditObject.flairs.push(flairObj._id);
      await subredditObject.save();
      await flairObj.save();
      await expect(
        checkFlair(flairObj._id.toString(), subredditObject)
      ).rejects.toThrow("Flair not found");
      await Flair.deleteMany({});
    });
  });

  describe("Testing deleteFlair", () => {
    it("Deleting a falir", async () => {
      const saveFunction1 = jest.fn();
      const saveFunction2 = jest.fn();
      const subreddit = {
        save: saveFunction1,
        numberOfFlairs: 2,
      };
      const flair = {
        save: saveFunction2,
      };

      await deleteFlair(flair, subreddit);
      expect(subreddit.numberOfFlairs).toEqual(1);
      expect(saveFunction1).toHaveBeenCalled();
      expect(saveFunction2).toHaveBeenCalled();
    });
  });

  describe("Testing prepareFlairDetails", () => {
    it("Details of flair without text color or backgound color", () => {
      const createdAt = Date.now();
      const flair = {
        flairName: "Test flair",
        flairOrder: 2,
      };
      expect(prepareFlairDetails(flair)).toMatchObject({
        flairName: "Test flair",
        flairOrder: 2,
      });
    });
    it("Details of flair with text color and backgound color", () => {
      const createdAt = Date.now();
      const flair = {
        flairName: "Test flair",
        flairOrder: 2,
        textColor: "red",
        backgroundColor: "blue",
      };
      expect(prepareFlairDetails(flair)).toMatchObject({
        flairName: "Test flair",
        flairOrder: 2,
        textColor: "red",
        backgroundColor: "blue",
      });
    });
  });

  describe("Testing prepareFlairsSettings", () => {
    it("subreddit falir settings", () => {
      const subreddit = {
        flairSettings: {
          enablePostFlairInThisCommunity: true,
          allowUsersToAssignTheirOwn: false,
        },
      };
      expect(prepareFlairsSettings(subreddit)).toEqual(
        expect.objectContaining({
          enablePostFlairs: true,
          allowUsers: false,
        })
      );
    });
  });

  describe("Testing prepareFlairs", () => {
    it("flairs", async () => {
      const subredditObject = await new Subreddit({
        title: "title",
        viewName: "title",
        category: "Sports",
        type: "Public",
        owner: {
          username: "zeyad",
        },
      }).save();
      const createdAt = Date.now();
      const flair1 = await new Flair({
        flairName: "Test flair",
        subreddit: subredditObject._id,
        flairOrder: 2,
        createdAt: createdAt,
      }).save();
      flair1.deletedAt = Date.now();
      const flair2 = await new Flair({
        flairName: "Test flair2",
        subreddit: subredditObject._id,
        flairOrder: 3,
        createdAt: createdAt,
      }).save();
      flair1.deletedAt = Date.now();
      subredditObject.flairs.push(flair1._id);
      subredditObject.flairs.push(flair2._id);
      await subredditObject.save();
      await flair1.save();
      const flairs = await prepareFlairs(subredditObject);
      expect(flairs.length).toBe(1);
    });
  });

  describe("Testing validateFlairSettingsBody", () => {
    it("invalid flair settings", () => {
      const req = {
        body: {},
      };
      expect(() => {
        validateFlairSettingsBody(req);
      }).toThrow("Bad request");
    });
    it("invalid flair settings", () => {
      const req = {
        body: { allowUsers: true, enablePostFlairs: false },
      };
      expect(() => {
        validateFlairSettingsBody(req);
      }).toThrow("Bad request");
    });
    it("invalid flair settings", () => {
      const req = {
        body: { allowUsers: true, enablePostFlairs: true },
      };
      expect(() => {
        validateFlairSettingsBody(req);
      }).not.toThrowError();
    });
  });
});
