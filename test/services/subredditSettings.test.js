import {
  validateSubredditSettings,
  prepareSubredditSettings,
  updateSubredditSettings,
} from "../../services/subredditSettings.js";

import { jest } from "@jest/globals";

describe("Testing subreddit settings Service functions", () => {
  describe("Testing validateSubredditSettings function all cases", () => {
    it("shold have validateSubredditSettings function", () => {
      expect(validateSubredditSettings).toBeDefined();
    });

    it("Private subreddit without acceptingRequestsToJoin", () => {
      expect(() => {
        const settings = {
          Type: "Private",
        };
        validateSubredditSettings(settings);
      }).toThrow("acceptingRequestsToJoin is required");
    });

    it("Restricted subreddit without acceptingRequestsToPost", () => {
      expect(() => {
        const settings = {
          Type: "Restricted",
          approvedUsersHaveTheAbilityTo: false,
        };
        validateSubredditSettings(settings);
      }).toThrow(
        "acceptingRequestsToPost and approvedUsersHaveTheAbilityTo is required"
      );
    });

    it("Restricted subreddit without approvedUsersHaveTheAbilityTo", () => {
      expect(() => {
        const settings = {
          Type: "Restricted",
          acceptingRequestsToPost: false,
        };
        validateSubredditSettings(settings);
      }).toThrow(
        "acceptingRequestsToPost and approvedUsersHaveTheAbilityTo is required"
      );
    });

    it("sendWelcomeMessage without message", () => {
      expect(() => {
        const settings = {
          sendWelcomeMessage: true,
        };
        validateSubredditSettings(settings);
      }).toThrow("welcomeMessage is required");
    });
    it("sendWelcomeMessage without message", () => {
      expect(() => {
        const settings = {
          sendWelcomeMessage: "true",
        };
        validateSubredditSettings(settings);
      }).toThrow("welcomeMessage is required");
    });
  });

  describe("Testing prepareSubredditSettings function all cases", () => {
    it("Public subreddit", () => {
      const subreddit = {
        viewName: "View Name",
        description: "Description",
        type: "Public",
        nsfw: false,
        mainTopic: "Sport",
        subTopics: "Art",
        subredditSettings: {
          sendWelcomeMessage: true,
          language: "English",
          region: "Egypt",
          welcomeMessage: "Welcome to my subreddit",
        },
      };
      expect(prepareSubredditSettings(subreddit)).toEqual(
        expect.objectContaining({
          communityName: "View Name",
          communityDescription: "Description",
          sendWelcomeMessage: true,
          language: "English",
          type: "Public",
          region: "Egypt",
          NSFW: false,
          mainTopic: "Sport",
          subTopics: "Art",
          welcomeMessage: "Welcome to my subreddit",
        })
      );
    });
    it("Private subreddit", () => {
      const subreddit = {
        viewName: "View Name",
        description: "Description",
        type: "Private",
        nsfw: false,
        mainTopic: "Sport",
        subTopics: "Art",
        subredditSettings: {
          sendWelcomeMessage: true,
          language: "English",
          region: "Egypt",
          welcomeMessage: "Welcome to my subreddit",
          acceptingRequestsToJoin: false,
        },
      };
      expect(prepareSubredditSettings(subreddit)).toEqual(
        expect.objectContaining({
          communityName: "View Name",
          communityDescription: "Description",
          sendWelcomeMessage: true,
          language: "English",
          type: "Private",
          region: "Egypt",
          NSFW: false,
          mainTopic: "Sport",
          subTopics: "Art",
          welcomeMessage: "Welcome to my subreddit",
          acceptingRequestsToJoin: false,
        })
      );
    });
    it("Restricted subreddit", () => {
      const subreddit = {
        viewName: "View Name",
        description: "Description",
        type: "Restricted",
        nsfw: false,
        mainTopic: "Sport",
        subTopics: "Art",
        subredditSettings: {
          sendWelcomeMessage: true,
          language: "English",
          region: "Egypt",
          welcomeMessage: "Welcome to my subreddit",
          acceptingRequestsToPost: false,
          approvedUsersHaveTheAbilityTo: "Post only",
        },
      };
      expect(prepareSubredditSettings(subreddit)).toEqual(
        expect.objectContaining({
          communityName: "View Name",
          communityDescription: "Description",
          sendWelcomeMessage: true,
          language: "English",
          type: "Restricted",
          region: "Egypt",
          NSFW: false,
          mainTopic: "Sport",
          subTopics: "Art",
          welcomeMessage: "Welcome to my subreddit",
          acceptingRequestsToPost: false,
          approvedUsersHaveTheAbilityTo: "Post only",
        })
      );
    });
  });

  describe("Testing updateSubredditSettings function all cases", () => {
    it("update settings without description", async () => {
      const subreddit = {};
      const settings = { noDescription: "Hello" };
      await expect(
        updateSubredditSettings(subreddit, settings)
      ).rejects.toThrow("communityDescription is required");
    });
    it("update settings public subreddit", () => {
      const saveFunction = jest.fn();

      const settings = {
        communityName: "View Name",
        communityDescription: "Description",
        sendWelcomeMessage: true,
        language: "English",
        Type: "Public",
        Region: "Egypt",
        NSFW: false,
        mainTopic: "Sport",
        subTopics: "Art",
        welcomeMessage: "Welcome to my subreddit",
      };
      const subreddit = {
        save: saveFunction,
        subredditSettings: {},
      };
      updateSubredditSettings(subreddit, settings);
      expect(saveFunction).toHaveBeenCalled();
    });
    it("update settings private subreddit", () => {
      const saveFunction = jest.fn();

      const settings = {
        communityName: "View Name",
        communityDescription: "Description",
        sendWelcomeMessage: true,
        language: "English",
        Type: "Private",
        Region: "Egypt",
        NSFW: false,
        mainTopic: "Sport",
        subTopics: "Art",
        welcomeMessage: "Welcome to my subreddit",
        acceptingRequestsToJoin: false,
      };
      const subreddit = {
        save: saveFunction,
        subredditSettings: {},
      };
      updateSubredditSettings(subreddit, settings);
      expect(saveFunction).toHaveBeenCalled();
    });
    it("update settings Restricted subreddit", () => {
      const saveFunction = jest.fn();

      const settings = {
        communityName: "View Name",
        communityDescription: "Description",
        sendWelcomeMessage: true,
        language: "English",
        Type: "Restricted",
        Region: "Egypt",
        NSFW: false,
        mainTopic: "Sport",
        subTopics: "Art",
        welcomeMessage: "Welcome to my subreddit",
        acceptingRequestsToPost: false,
        approvedUsersHaveTheAbilityTo: "Post only",
      };
      const subreddit = {
        save: saveFunction,
        subredditSettings: {},
      };
      updateSubredditSettings(subreddit, settings);
      expect(saveFunction).toHaveBeenCalled();
    });
    it("update settings Restricted subreddit", () => {
      const saveFunction = jest.fn();

      const settings = {
        communityName: "View Name",
        communityDescription: "Description",
        sendWelcomeMessage: "true",
        language: "English",
        Type: "Restricted",
        Region: "Egypt",
        NSFW: false,
        mainTopic: "Sport",
        subTopics: "Art",
        welcomeMessage: "Welcome to my subreddit",
        acceptingRequestsToPost: false,
        approvedUsersHaveTheAbilityTo: "Post only",
      };
      const subreddit = {
        save: saveFunction,
        subredditSettings: {},
      };
      updateSubredditSettings(subreddit, settings);
      expect(saveFunction).toHaveBeenCalled();
    });
    it("update settings Restricted subreddit", () => {
      const saveFunction = jest.fn();

      const settings = {
        communityName: "View Name",
        communityDescription: "Description",
        sendWelcomeMessage: false,
        language: "English",
        Type: "Restricted",
        NSFW: false,
        mainTopic: "Sport",
        subTopics: "Art",
        welcomeMessage: "Welcome to my subreddit",
        acceptingRequestsToPost: false,
        approvedUsersHaveTheAbilityTo: "Post only",
      };
      const subreddit = {
        save: saveFunction,
        subredditSettings: {},
      };
      updateSubredditSettings(subreddit, settings);
      expect(saveFunction).toHaveBeenCalled();
    });
  });
});
