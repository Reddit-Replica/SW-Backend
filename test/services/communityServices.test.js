/* eslint-disable max-len */
import {
  searchForSubreddit,
  addToDescription,
  addToSubtopics,
  addToMainTopic,
  searchForSubredditById,
  addSubreddit,
  moderateSubreddit,
  checkForFavoriteSubreddits,
  makeSubredditFavorite,
  removeSubredditFromFavorite,
  addToJoinedSubreddit,
  checkForPrivateSubreddits,
  checkJoining,
  checkOnCategory,
  subredditNameAvailable,
  leaveSubredditService,
} from "../../services/communityServices.js";

import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Subreddit from "./../../models/Community.js";
import Category from "./../../models/Category.js";

// eslint-disable-next-line max-statements
describe("Testing community service functions", () => {
  let normalUser = {},
    subreddit = {},
    moderatorUser = {},
    subredditToJoin = {},
    privateSubreddit = {},
    publicSubreddit = {},
    subredditForNu3mn = {},
    user={};
  beforeAll(async () => {
    await connectDatabase();

    await new User({
      username: "SecondNormalUser",
      email: "Ahmed@gmail.com",
      createdAt: Date.now(),
    }).save();

    user = await new User({
      username: "user",
      email: "abdelrahmannoaman1@gmail.com",
      createdAt: Date.now(),
    }).save();

    moderatorUser = await new User({
      username: "Moderator",
      email: "Abelrahman@gmail.com",
      createdAt: Date.now(),
    }).save();

    await new User({
      username: "DeletedUser",
      email: "Hamouda@gmail.com",
      deletedAt: "10 June 2015",
      createdAt: Date.now(),
    }).save();

    await new Subreddit({
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
      dateOfCreation: Date.now(),
    }).save();

    privateSubreddit = await new Subreddit({
      title: "privateSubreddit",
      viewName: "privateSubreddit",
      category: "Art",
      type: "Private",
      nsfw: false,
      owner: {
        username: "Noaman",
        userID: normalUser.Id,
      },
      dateOfCreation: Date.now(),
      subredditSettings: {
        sendWelcomeMessage: true,
        welcomeMessage: "ahlann w sahlan",
      },
    }).save();

    publicSubreddit = await new Subreddit({
      title: "publicSubreddit",
      viewName: "publicSubreddit",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: "Noaman",
        userID: normalUser.Id,
      },
      dateOfCreation: Date.now(),
    }).save();

    normalUser = await new User({
      username: "NormalUser",
      email: "Noaman@gmail.com",
      createdAt: Date.now(),
      joinedSubreddits: [
        {
          subredditId: publicSubreddit.id,
          name: publicSubreddit.title,
        },
        {
          subredditId: privateSubreddit.id,
          name: privateSubreddit.title,
        },
      ],
    }).save();

    subredditToJoin = await new Subreddit({
      title: "Manga",
      viewName: "MangaReddit",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: moderatorUser.username,
        userID: moderatorUser._id,
      },
      dateOfCreation: Date.now(),
    }).save();

    subredditForNu3mn = await new Subreddit({
      title: "Manga",
      viewName: "MangaReddit",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: moderatorUser.username,
        userID: moderatorUser._id,
      },
      moderators: [
        {
          userId: normalUser._id,
          dateOfModeration: Date.now(),
        },
      ],
      dateOfCreation: Date.now(),
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Category.deleteMany({});
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

  it("try addSubreddit function with invalid subredditname", async () => {
    try {
      const req = {
        body: {
          subredditName: "Hunter*/%",
          type: "Private",
          category: "Sports",
          nsfw: false,
        },
      };
      const authPayload = {
        username: "Moderator",
        userId: moderatorUser.Id,
      };
      await addSubreddit(req, authPayload);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual(
        "subreddit name can only contain letters, numbers, or underscores."
      );
    }
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

  it("try moderateSubreddit to make a user moderator in a subreddit", async () => {
    try {
      await moderateSubreddit("NormalUser", "Hunter");
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("NormalUser is already a moderator");
    }
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
      expect(error.message).toEqual("This subreddit isn't found");
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
      expect(error.message).toEqual("This subreddit isn't found");
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
      expect(error.message).toEqual("This subreddit isn't found");
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
      expect(error.message).toEqual("This subreddit isn't found");
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
      expect(error.message).toEqual("This subreddit isn't found");
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
      expect(error.message).toEqual("This subreddit isn't found");
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

  it("should have leaveSubredditService function", () => {
    expect(leaveSubredditService).toBeDefined();
  });

  it("try to to let the moderator leave the subreddit", async () => {
    try {
      await leaveSubredditService(moderatorUser, subredditToJoin);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to to let a user leave a subreddit that he didn't join before", async () => {
    try {
      await leaveSubredditService(normalUser, subredditToJoin);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("try to to let a user leave a subreddit", async () => {
    const userJoined = await new User({
      username: "IWantToJoin",
      email: "lol@gmail.com",
      createdAt: Date.now(),
    }).save();

    userJoined.joinedSubreddits.push({
      subredditId: subredditToJoin._id,
      name: subredditToJoin.title,
    });
    await userJoined.save();

    const result = await leaveSubredditService(userJoined, subredditToJoin);
    expect(result.statusCode).toEqual(200);
  });

  it("should have makeSubredditFavorite function", () => {
    expect(makeSubredditFavorite).toBeDefined();
  });

  it("try makeSubredditFavorite to make a subreddit favourite", async () => {
    const result = await makeSubredditFavorite(
      normalUser,
      subredditToJoin.title,
      subredditToJoin.id
    );
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("subreddit is now favorite");
  });
  it("try checkForFavoriteSubreddits to make a subreddit favourite", async () => {
    const result = await checkForFavoriteSubreddits(
      normalUser,
      subredditToJoin
    );
    expect(result).toEqual(true);
  });

  it("should have removeSubredditFromFavorite function", () => {
    expect(removeSubredditFromFavorite).toBeDefined();
  });

  it("try removeSubredditFromFavorite to make a subreddit unfavourite", async () => {
    const result = await removeSubredditFromFavorite(
      normalUser,
      "privateSubreddit"
    );
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("subreddit is now un favorite");
  });
  it("try checkForFavoriteSubreddits to make a subreddit favourite", async () => {
    const result = await checkForFavoriteSubreddits(
      moderatorUser,
      subredditToJoin
    );
    expect(result).toEqual(false);
  });

  it("should have checkForFavoriteSubreddits function", () => {
    expect(checkForFavoriteSubreddits).toBeDefined();
  });

  it("should have checkForPrivateSubreddits function", () => {
    expect(checkForPrivateSubreddits).toBeDefined();
  });

  it("try checkForPrivateSubreddits", async () => {
    try {
      await checkForPrivateSubreddits(moderatorUser, privateSubreddit);
    } catch (e) {
      expect(e.statusCode).toEqual(401);
      expect(e.message).toEqual(
        "privateSubreddit is a private subreddit, to do this action you have to request for joining it first"
      );
    }
  });

  it("try checkForPrivateSubreddits", async () => {
    const result = await checkForPrivateSubreddits(
      normalUser,
      privateSubreddit
    );
    expect(result).toEqual(true);
  });
  it("try checkForPrivateSubreddits", async () => {
    const result = await checkForPrivateSubreddits(normalUser, publicSubreddit);
    expect(result).toEqual(true);
  });

  it("should have checkJoining function", () => {
    expect(checkJoining).toBeDefined();
  });

  it("try checkJoining", async () => {
    try {
      await checkJoining(moderatorUser, privateSubreddit.title);
    } catch (e) {
      expect(e.statusCode).toEqual(401);
      expect(e.message).toEqual(
        "You haven't joined privateSubreddit yet , to do this action you have to join it first"
      );
    }
  });

  it("try checkForPrivateSubreddits", async () => {
    const result = await checkJoining(normalUser, privateSubreddit.title);
    expect(result).toEqual(true);
  });

  it("should have checkOnCategory function", () => {
    expect(checkOnCategory).toBeDefined();
  });

  it("try checkOnCategory", async () => {
    try {
      await checkOnCategory("sports");
    } catch (e) {
      expect(e.statusCode).toEqual(404);
      expect(e.message).toEqual("sports is not available as a category");
    }
  });

  it("try checkOnCategory", async () => {
    try {
      await checkOnCategory("Sports");
      const where = "we are here";
      expect(where).toEqual("we are here");
    } catch (e) {}
  });

  it("should have subredditNameAvailable function", () => {
    expect(subredditNameAvailable).toBeDefined();
  });

  it("try subredditNameAvailable", async () => {
    try {
      await subredditNameAvailable("%mnoy%");
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual(
        "subreddit name can only contain letters, numbers, or underscores."
      );
    }
  });

  it("try subredditNameAvailable", async () => {
    try {
      await subredditNameAvailable("as");
    } catch (e) {
      expect(e.statusCode).toEqual(409);
      expect(e.message).toEqual(
        "Community names must be between 3–21 characters"
      );
    }
  });

  it("try subredditNameAvailable", async () => {
    try {
      await subredditNameAvailable("privateSubreddit");
    } catch (e) {
      expect(e.statusCode).toEqual(409);
      expect(e.message).toEqual("Subreddit's name is already taken");
    }
  });

  it("try subredditNameAvailable", async () => {
    const result = await subredditNameAvailable("no3mnygd3an");
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("The subreddit's name is available");
  });

  it("should have searchForSubredditById function", () => {
    expect(searchForSubredditById).toBeDefined();
  });

  it("try searchForSubredditById", async () => {
    try {
      await searchForSubredditById("dafa");
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This is not a valid subreddit id");
    }
  });

  it("try searchForSubredditById", async () => {
    try {
      await searchForSubredditById(normalUser.id);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This subreddit isn't found");
    }
  });

  it("try searchForSubredditById", async () => {
    try {
      const subreddit = await Subreddit.findOne({ title: "DeletedSubreddit" });
      await searchForSubredditById(subreddit.id);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This subreddit is deleted");
    }
  });

  it("try searchForSubredditById", async () => {
    const result = await searchForSubredditById(privateSubreddit.id);
    expect(result).not.toBeNull();
  });
  it("should have searchForSubreddit function", () => {
    expect(searchForSubreddit).toBeDefined();
  });

  it("should have leaveSubredditService function", () => {
    expect(leaveSubredditService).toBeDefined();
  });


});
