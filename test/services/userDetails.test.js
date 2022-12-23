import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import {
  getUserDetailsService,
  getUserFollowedUsersService,
} from "../../services/userServices.js";

describe("Testing user details services", () => {
  beforeAll(async () => {
    await connectDatabase();
  });
  afterAll(async () => {
    await User.deleteMany({});
    closeDatabaseConnection();
  });
  describe("getUserDetailsService", () => {
    it("Deleted user", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      await expect(getUserDetailsService("zeyad")).rejects.toThrow(
        "User not found"
      );

      await User.deleteMany({});
    });
    it("valid user", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        karma: 2,
      }).save();

      const details = await getUserDetailsService("zeyad");
      expect(details).toMatchObject({ karma: 2 });

      await User.deleteMany({});
    });
  });
  describe("getUserFollowedUsersService", () => {
    it("Deleted user", async () => {
      const user = await new User({
        username: "zeyad1",
        createdAt: Date.now(),
        deletedAt: Date.now(),
      }).save();

      await expect(getUserFollowedUsersService(user._id)).rejects.toThrow(
        "User isn't found"
      );

      await User.deleteMany({});
    });
    it("valid user", async () => {
      const user = await new User({
        username: "zeyad",
        createdAt: Date.now(),
        karma: 2,
      }).save();
      const user3 = await new User({
        username: "zeyad2",
        createdAt: Date.now(),
        karma: 2,
      }).save();
      const user4 = await new User({
        username: "zeyad3",
        createdAt: Date.now(),
        karma: 2,
      }).save();
      user4.followedUsers.push(user3._id);
      user4.followedUsers.push(user._id);

      await user4.save();

      const details = await getUserFollowedUsersService(user4._id);
      expect(details.length).toBe(2);

      // await User.deleteMany({});
    });
  });
});
