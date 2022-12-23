import {
  searchForUserService,
  getUserFromJWTService,
  blockUserService,
  followUserService,
  getUserAboutDataService,
  clearHistoyService,
} from "../../services/userServices.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Subreddit from "./../../models/Community.js";

// eslint-disable-next-line max-statements
describe("Testing user services functions", () => {
  let user = {},
    mainUser = {},
    userToAction = {},
    subreddit = {},
    post = {};
  beforeAll(async () => {
    await connectDatabase();

    user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
      createdAt: Date.now(),
    });
    await user.save();

    mainUser = new User({
      username: "MainUser",
      email: "veryfunny@gmail.com",
      displayName: "Beshoy Morad",
      about: "I am studying without [stu]",
      createdAt: Date.now(),
    });
    await mainUser.save();

    subreddit = new Subreddit({
      title: "Subreddit",
      viewName: "Subreddit",
      category: "Sports",
      type: "Public",
      owner: {
        username: mainUser.username,
        userID: mainUser._id,
      },
      dateOfCreation: Date.now(),
    });
    subreddit.moderators.push({
      username: mainUser.username,
      userID: mainUser._id,
      dateOfModeration: mainUser.createdAt,
    });
    await subreddit.save();

    userToAction = new User({
      username: "UserToAction",
      email: "haha@gmail.com",
      createdAt: Date.now(),
    });
    await userToAction.save();

    post = new Post({
      title: "Without subreddit post",
      ownerUsername: user.username,
      ownerId: user._id,
      kind: "hybrid",
      createdAt: Date.now(),
    });
    await post.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Subreddit.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have searchForUserService function", () => {
    expect(searchForUserService).toBeDefined();
  });

  it("try searchForUserService function with valid username", async () => {
    const result = await searchForUserService("Beshoy");
    expect(result.username).toEqual("Beshoy");
    expect(result.email).toEqual("beshoy@gmail.com");
  });

  it("try searchForUserService with invalid username", async () => {
    try {
      await searchForUserService("Philip");
    } catch (error) {
      expect(error.statusCode).toEqual(404);
      expect(error.message).toEqual("Didn't find a user with that username");
    }
  });

  it("should have getUserFromJWTService function", () => {
    expect(getUserFromJWTService).toBeDefined();
  });
  it("try getUserFromJWTService with valid id", async () => {
    const result = await getUserFromJWTService(user._id);
    expect(result.username).toEqual("Beshoy");
  });
  it("try getUserFromJWTService with invalid id", async () => {
    try {
      await getUserFromJWTService("invalid id");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("Invalid id from the token");
    }
  });
  it("try getUserFromJWTService with id dose not exist", async () => {
    try {
      const id = user._id;
      await user.remove();

      await getUserFromJWTService(id);
    } catch (error) {
      expect(error.statusCode).toEqual(404);
      expect(error.message).toEqual("Didn't find a user with that username");
    }
  });

  it("should have blockUserService function", () => {
    expect(blockUserService).toBeDefined();
  });

  it("try to let the user block himself", async () => {
    try {
      await blockUserService(mainUser, mainUser, true);
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("User can not block himself");
    }
  });

  it("try to block another user", async () => {
    const result = await blockUserService(mainUser, userToAction, true);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("User blocked successfully");
  });

  it("try to block the same user again", async () => {
    const result = await blockUserService(mainUser, userToAction, true);
    expect(result.statusCode).toEqual(400);
  });

  it("try to unblock user", async () => {
    const result = await blockUserService(mainUser, userToAction, false);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("User unblocked successfully");
  });

  it("try to unblock the same user again", async () => {
    const result = await blockUserService(mainUser, userToAction, false);
    expect(result.statusCode).toEqual(400);
  });

  it("should have followUserService function", () => {
    expect(followUserService).toBeDefined();
  });

  it("try to let the user follow himself", async () => {
    try {
      await followUserService(mainUser, mainUser, true);
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("User can not follow himself");
    }
  });

  it("try to follow another user", async () => {
    const result = await followUserService(mainUser, userToAction, true);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("User followed successfully");
  });

  it("try to follow the same user again", async () => {
    const result = await followUserService(mainUser, userToAction, true);
    expect(result.statusCode).toEqual(400);
  });

  it("try to unfollow user", async () => {
    const result = await followUserService(mainUser, userToAction, false);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("User unfollowed successfully");
  });

  it("try to unfollow the same user again", async () => {
    const result = await followUserService(mainUser, userToAction, false);
    expect(result.statusCode).toEqual(400);
  });

  it("should have clearHistoyService function", () => {
    expect(clearHistoyService).toBeDefined();
  });

  it("try to clear the history of a user", async () => {
    mainUser.historyPosts.push(post._id);
    await mainUser.save();

    await clearHistoyService(mainUser);
    expect(mainUser.historyPosts.length).toEqual(0);
  });

  it("should have getUserAboutDataService function", () => {
    expect(getUserAboutDataService).toBeDefined();
  });

  it("try to get the information of invalid username", async () => {
    try {
      await getUserAboutDataService("invalid");
    } catch (error) {
      expect(error.statusCode).toEqual(404);
      expect(error.message).toEqual("Didn't find a user with that username");
    }
  });

  it("get the information of a user with no logged in user", async () => {
    const result = await getUserAboutDataService("MainUser");
    expect(result.statusCode).toEqual(200);
    expect(result.data.displayName).toEqual("Beshoy Morad");
    expect(result.data.about).toEqual("I am studying without [stu]");
  });

  // eslint-disable-next-line max-len
  it("get the information of a user with invalid logged in user id", async () => {
    try {
      await getUserAboutDataService("MainUser", "invalid id");
    } catch (error) {
      expect(error.statusCode).toEqual(400);
      expect(error.message).toEqual("Invalid id from the token");
    }
  });

  it("get the information of a user with logged in user", async () => {
    const result = await getUserAboutDataService("MainUser", userToAction._id);
    expect(result.statusCode).toEqual(200);
    expect(result.data.displayName).toEqual("Beshoy Morad");
    expect(result.data.about).toEqual("I am studying without [stu]");
  });

  // eslint-disable-next-line max-len
  it("get the information of a user with logged in user who blocked that user", async () => {
    await blockUserService(userToAction, mainUser, true);
    const result = await getUserAboutDataService("MainUser", userToAction._id);
    expect(result.statusCode).toEqual(200);
    expect(result.data.displayName).toEqual("Beshoy Morad");
    expect(result.data.blocked).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  it("get the information of a user with logged in user who followed that user", async () => {
    await followUserService(userToAction, mainUser, true);
    const result = await getUserAboutDataService("MainUser", userToAction._id);
    expect(result.statusCode).toEqual(200);
    expect(result.data.displayName).toEqual("Beshoy Morad");
    expect(result.data.followed).toBeTruthy();
  });
});
