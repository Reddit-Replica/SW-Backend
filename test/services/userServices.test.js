import {
  getUserFromJWTService,
  searchForUserService,
} from "../../services/userServices.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";

describe("Testing user services functions", () => {
  let user = {};
  beforeAll(async () => {
    await connectDatabase();

    user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user.save();
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
  // it("", () => {});
  // it("", () => {});
  // it("", () => {});
});
