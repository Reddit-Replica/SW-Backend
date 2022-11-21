import {
  getUserFromJWTService,
  searchForUserService,
  blockUserService,
} from "../../services/userServices.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";

// eslint-disable-next-line max-statements
describe("Testing user services functions", () => {
  let user = {},
    mainUser = {},
    userToAction = {};
  beforeAll(async () => {
    await connectDatabase();

    user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user.save();

    mainUser = new User({
      username: "MainUser",
      email: "veryfunny@gmail.com",
    });
    await mainUser.save();

    userToAction = new User({
      username: "UserToAction",
      email: "haha@gmail.com",
    });
    await userToAction.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
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
      console.log(error);
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
      await blockUserService(mainUser, userToAction, true);
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
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("User blocked successfully");
  });

  it("try to unblock user", async () => {
    const result = await blockUserService(mainUser, userToAction, false);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("User unblocked successfully");
  });

  it("try to unblock the same user again", async () => {
    const result = await blockUserService(mainUser, userToAction, false);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("User unblocked successfully");
  });

  // it("", () => {});
  // it("", () => {});
  // it("", () => {});
  // it("", () => {});
  // it("", () => {});
  // it("", () => {});
  // it("", () => {});
  // it("", () => {});
  // it("", () => {});
});
