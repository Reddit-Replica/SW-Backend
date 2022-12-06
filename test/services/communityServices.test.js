/* eslint-disable max-len */
import {
  searchForSubreddit,
  addUserToWaitingList,
  addToDescription,
  addToSubtopics,
  addToMainTopic,
  searchForSubredditById,
  addSubreddit,
  moderateSubreddit,
} from "../../services/communityServices.js";

import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Subreddit from "./../../models/Community.js";

// eslint-disable-next-line max-statements
describe("Testing community service functions", () => {
  let normalUser = {},
    secondNormalUser = {},
    deletedUser = {},
    subreddit = {},
    moderatorUser = {},
    deletedSubreddit = {};
  beforeAll(async () => {
    await connectDatabase();

    normalUser = await new User({
      username: "NormalUser",
      email: "Noaman@gmail.com",
    }).save();

    secondNormalUser = await new User({
      username: "SecondNormalUser",
      email: "Ahmed@gmail.com",
    }).save();

    moderatorUser = await new User({
      username: "Moderator",
      email: "Abelrahman@gmail.com",
    }).save();

    deletedUser = await new User({
      username: "DeletedUser",
      email: "Hamouda@gmail.com",
      deletedAt: "10 June 2015",
    }).save();

    deletedSubreddit = await new Subreddit({
      title: "DeletedSubreddit",
      viewName: "DeletedSubreddit",
      category: "Art",
      type: "Public",
      nsfw: false,
      deletedAt: "10 May 2001",
      owner: {
        username: "Noaman",
        userID: normalUser.Id,
      },
    }).save();
  });

  afterAll(async () => {
    await normalUser.remove();
    await moderatorUser.remove();
    await secondNormalUser.remove();
    await deletedUser.remove();
    await deletedSubreddit.remove();
    subreddit = await searchForSubreddit("Hunter");
    await subreddit.remove();
    await closeDatabaseConnection();
  });

  it("should have addSubreddit function", () => {
    expect(addSubreddit).toBeDefined();
  });

  it("try addSubreddit function with valid req data", async () => {
    const req = {
      body: {
        subredditName: "Hunter",
        type: "Private",
        category: "Sports",
        nsfw: false,
      },
    };
    const authPayload = {
      username: "Moderator",
      userId: moderatorUser.Id,
    };
    const result = await addSubreddit(req, authPayload);
    expect(result.statusCode).toEqual(201);
    expect(result.message).toEqual(
      "The subreddit has been successfully created"
    );
  });

  it("try addSubreddit function with an invalid username", async () => {
    try {
      const req = {
        body: {
          subredditName: "Hunter",
          type: "Private",
          category: "Sports",
          nsfw: false,
        },
      };
      const authPayload = {
        username: "AnonymousUser",
        userId: moderatorUser.Id,
      };
      await addSubreddit(req, authPayload);
    } catch (e) {
      expect(e.statusCode).toEqual(404);
      expect(e.message).toEqual("Didn't find a user with that username");
    }
  });

  it("should have moderateSubreddit function", () => {
    expect(moderateSubreddit).toBeDefined();
  });

  it("try moderateSubreddit to make a user moderator in a subreddit", async () => {
    const result = await moderateSubreddit("NormalUser", "Hunter");
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual(
      "NormalUser has been moderator to Hunter successfuly"
    );
  });

  it("try moderateSubreddit to make an invalid user moderator in a subreddit", async () => {
    try {
      await moderateSubreddit("AnonymousUser", "Hunter");
    } catch (error) {
      expect(error.statusCode).toEqual(404);
      expect(error.message).toEqual("Didn't find a user with that username");
    }
  });

  it("try moderateSubreddit to make a deleted user moderator in a subreddit", async () => {
    try {
      await moderateSubreddit("DeletedUser", "Hunter");
    } catch (error) {
      expect(error.statusCode).toEqual(404);
      expect(error.message).toEqual("Didn't find a user with that username");
    }
  });

  it("try moderateSubreddit to make a user moderator in a subreddit while he is a moderator", async () => {
    try {
      await moderateSubreddit("Moderator", "Hunter");
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Moderator is already a moderator");
    }
  });

  it("try moderateSubreddit to make a user moderator in a not found subredditName", async () => {
    try {
      await moderateSubreddit("NormalUser", "Ahmed");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit isn't found");
    }
  });

  it("try moderateSubreddit to make a user moderator in a deleted subredditName", async () => {
    try {
      await searchForSubreddit("DeletedSubreddit", "Mahmoud");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit is deleted");
    }
  });

  it("should have searchForSubreddit function", () => {
    expect(searchForSubreddit).toBeDefined();
  });

  it("try searchForSubreddit function with a valid subredditName", async () => {
    const result = await searchForSubreddit("Hunter");
    expect(result.title).toEqual("Hunter");
    expect(result.type).toEqual("Private");
    expect(result.category).toEqual("Sports");
  });

  it("try searchForSubreddit with a not found subredditName", async () => {
    try {
      await searchForSubreddit("AnonymousSubreddit");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit isn't found");
    }
  });

  it("try searchForSubreddit with a deleted subredditName", async () => {
    try {
      await searchForSubreddit("DeletedSubreddit");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit is deleted");
    }
  });

  it("should have searchForSubredditById function", () => {
    expect(searchForSubredditById).toBeDefined();
  });

  it("try searchForSubredditById function with a valid subredditName", async () => {
    subreddit = await searchForSubreddit("Hunter");
    const result = await searchForSubredditById(subreddit.id);
    expect(result.title).toEqual("Hunter");
    expect(result.type).toEqual("Private");
    expect(result.category).toEqual("Sports");
  });

  it("try searchForSubredditById with a not found subredditName", async () => {
    try {
      await searchForSubredditById("AnonymousSubreddit");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This is not a valid subreddit id");
    }
  });

  it("try searchForSubredditById with a deleted subredditName", async () => {
    try {
      subreddit = await searchForSubreddit("DeletedSubreddit");
      await searchForSubredditById(subreddit.id);
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit is deleted");
    }
  });
  it("should have  addUserToWaitingList function", () => {
    expect(addUserToWaitingList).toBeDefined();
  });

  it("try addUserToWaitingList function with a valid data", async () => {
    subreddit = await searchForSubreddit("Hunter");
    const result = await addUserToWaitingList(
      subreddit,
      "SecondNormalUser",
      "Please let me in"
    );
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Your request is sent successfully");
  });

  it("try addUserToWaitingList function with a invalid User data", async () => {
    try {
      subreddit = await searchForSubreddit("Hunter");
      await addUserToWaitingList(
        subreddit,
        "AnonymousUser",
        "Please let me in"
      );
    } catch (error) {
      expect(error.statusCode).toEqual(404);
      expect(error.message).toEqual("Didn't find a user with that username");
    }
  });

  it("try addUserToWaitingList function with a deleted User data", async () => {
    try {
      subreddit = await searchForSubreddit("Hunter");
      await addUserToWaitingList(subreddit, "DeletedUser", "Please let me in");
    } catch (error) {
      expect(error.statusCode).toEqual(404);
      expect(error.message).toEqual("Didn't find a user with that username");
    }
  });

  it("should have addToDescription function", () => {
    expect(addToDescription).toBeDefined();
  });

  it("try addToDescription to a valid subreddit", async () => {
    const result = await addToDescription("Hunter", "Good Description");
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("description is submitted successfully");
  });

  it("try addToDescription to an invalid subreddit", async () => {
    try {
      await addToDescription("AnonymousSubreddit", "Good Description");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit isn't found");
    }
  });

  it("try addToDescription to a deleted subreddit", async () => {
    try {
      await addToDescription("DeletedSubreddit", "Good Description");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit is deleted");
    }
  });

  it("should have addToMainTopic function", () => {
    expect(addToDescription).toBeDefined();
  });

  it("try addToMainTopic to a valid subreddit", async () => {
    const result = await addToMainTopic("Hunter", "Sports");
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Successfully updated primary topic!");
  });

  it("try addToMainTopic to an invalid subreddit", async () => {
    try {
      await addToMainTopic("AnonymousSubreddit", "Sports");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit isn't found");
    }
  });

  it("try addToMainTopic to a deleted subreddit", async () => {
    try {
      await addToMainTopic("DeletedSubreddit", "Sports");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit is deleted");
    }
  });

  it("should have addToSubtopics function", () => {
    expect(addToSubtopics).toBeDefined();
  });

  it("try addToSubtopics to a valid subreddit", async () => {
    const result = await addToSubtopics(
      "Hunter",
      ["Sports", "Art"],
      ["Sports", "Art"]
    );
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Community topics saved");
  });

  it("try addToSubtopics to an invalid subreddit", async () => {
    try {
      await addToSubtopics(
        "AnonymousSubreddit",
        ["Sports", "Art"],
        ["Sports", "Art"]
      );
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit isn't found");
    }
  });

  it("try addToSubtopics to a deleted subreddit", async () => {
    try {
      await addToSubtopics(
        "DeletedSubreddit",
        ["Sports", "Art"],
        ["Sports", "Art"]
      );
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("This subreddit is deleted");
    }
  });

  it("try addToSubtopics as a string not array to a subreddit", async () => {
    try {
      await addToSubtopics("DeletedSubreddit", "Sports", ["Sports", "Art"]);
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("Subtopics must be an array");
    }
  });

  it("try addToSubtopics as a with an invalid data to a subreddit", async () => {
    try {
      await addToSubtopics("DeletedSubreddit", ["Football"], ["Sports", "Art"]);
    } catch (error) {
      expect(error.statusCode).toEqual(404);
      expect(error.message).toEqual("Subtopic Football is not available");
    }
  });
});
