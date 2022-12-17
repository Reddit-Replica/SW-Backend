/* eslint-disable max-len */
import {
  getUser,
  getUserByUsername,
  verifyCredentials,
  setNewEmail,
  setNewPassword,
  checkDuplicateSocialLink,
  checkSocialLink,
  deleteFile,
  connectToGoogle,
  connectToFacebook,
} from "../../services/userSettings";

import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { hashPassword, comparePasswords } from "../../utils/passwordUtils.js";

// eslint-disable-next-line max-statements
describe("Testing User settings Service functions", () => {
  let user1 = {},
    user2 = {},
    user3 = {};
  beforeAll(async () => {
    await connectDatabase();

    user1 = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      password: hashPassword("12345678"),
      createdAt: Date.now(),
    }).save();

    user2 = await new User({
      username: "ahmed",
      email: "ahmed@gmail.com",
      password: hashPassword("123456789"),
      createdAt: Date.now(),
    }).save();

    user3 = await new User({
      username: "mohamed",
      email: "mohamed@gmail.com",
      password: hashPassword("1234567890"),
      createdAt: Date.now(),
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have getUser defined", () => {
    expect(getUser).toBeDefined();
  });

  it("Test getUser", async () => {
    const user = await getUser(user1.id);
    expect(user.username).toEqual("hamdy");
  });

  it("Test getUser with an invalid ID", async () => {
    try {
      // eslint-disable-next-line new-cap
      const invalidId = mongoose.Types.ObjectId.generate(10);
      await getUser(invalidId);
    } catch (err) {
      expect(err.statusCode).toEqual(401);
    }
  });

  it("Should have getUserByUsername defined", () => {
    expect(getUserByUsername).toBeDefined();
  });

  it("Test getUserByUsername", async () => {
    const user = await getUserByUsername("hamdy");
    expect(user.username).toEqual("hamdy");
  });

  it("Test getUserByUsername with an invalid username", async () => {
    try {
      await getUserByUsername("invalidUsername");
    } catch (err) {
      expect(err.statusCode).toEqual(401);
    }
  });

  it("Should have verifyCredentials defined", () => {
    expect(verifyCredentials).toBeDefined();
  });

  it("Test verifyCredentials with correct username & password", async () => {
    try {
      verifyCredentials(user1, "hamdy", "12345678");
      expect("Passed Test").toBeTruthy();
    } catch (err) {
      console.log(err);
    }
  });

  it("Test verifyCredentials with an invalid username", async () => {
    try {
      verifyCredentials(user1, "invalidUsername", "12345678");
    } catch (err) {
      expect(err.statusCode).toEqual(401);
      expect(err.message).toEqual("Invalid username");
    }
  });

  it("Test verifyCredentials with an invalid password", async () => {
    try {
      verifyCredentials(user1, "hamdy", "invalidPassword");
    } catch (err) {
      expect(err.statusCode).toEqual(401);
      expect(err.message).toEqual("Invalid password");
    }
  });

  it("Should have setNewPassword defined", () => {
    expect(setNewPassword).toBeDefined();
  });

  it("Test setNewPassword with non-matching password", async () => {
    try {
      await setNewPassword(user1, "pass1", "pass2");
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("New passwords do not match");
    }
  });

  it("Test setNewPassword same old password", async () => {
    try {
      await setNewPassword(user1, "12345678", "12345678");
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual(
        "New password is the same as the old password"
      );
    }
  });

  it("Test setNewPassword with correct matching passwords", async () => {
    await setNewPassword(user1, "012345678", "012345678");
    user1 = await User.findById(user1.id);
    const valid = comparePasswords("012345678", user1.password);
    expect(valid).toBeTruthy();
  });

  it("Should have setNewEmail defined", () => {
    expect(setNewEmail).toBeDefined();
  });

  it("Test setNewEmail", async () => {
    user1.userSettings.verifiedEmail = true;
    await user1.save();
    await setNewEmail(user1, user1.id, "abdelrahman@gmail.com");
    user1 = await User.findById(user1.id);
    expect(user1.email).toEqual("abdelrahman@gmail.com");
    expect(user1.userSettings.verifiedEmail).toBeFalsy();
  });

  it("Should have checkSocialLink defined", () => {
    expect(checkSocialLink).toBeDefined();
  });

  it("Test checkSocialLink for a user with zero links", async () => {
    try {
      await checkSocialLink(user1);
    } catch (err) {
      expect(err.statusCode).toEqual(404);
      expect(err.message).toEqual("The user doesn't have any social links");
    }
  });

  it("Test checkSocialLink for a not-found link", async () => {
    try {
      user1.userSettings.socialLinks = [
        {
          type: "google",
          displayText: "Google",
          link: "www.google.com",
        },
      ];
      await user1.save();
      await checkSocialLink(user1, "facebook", "FACEBOOK", "www.facebook.com");
    } catch (err) {
      expect(err.statusCode).toEqual(404);
      expect(err.message).toEqual("Social link not found");
    }
  });

  it("Test checkSocialLink for an existing link", async () => {
    try {
      await checkSocialLink(user1, "google", "Google", "www.google.com");
      expect("Passed Test").toBeTruthy();
    } catch (err) {
      console.log(err);
    }
  });

  it("Should have checkDuplicateSocialLink defined", () => {
    expect(checkDuplicateSocialLink).toBeDefined();
  });

  it("Test checkDuplicateSocialLink for the same social link", async () => {
    try {
      await checkDuplicateSocialLink(
        user1,
        "google",
        "Google",
        "www.google.com"
      );
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Social link already added before");
    }
  });

  it("Test checkDuplicateSocialLink for a not-found link", async () => {
    try {
      await checkDuplicateSocialLink(
        user1,
        "not-found",
        "Google",
        "www.google.com"
      );
      expect("Passed Test").toBeTruthy();
    } catch (err) {
      console.log(err);
    }
  });

  it("Should have deleteFile defined", () => {
    expect(deleteFile).toBeDefined();
  });

  it("Test deleteFile for a newly created file", async () => {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      fs.appendFile("test\\services\\toBeDeleted.txt", "Hello", function (err) {
        if (err) {
          throw err;
        }
        let exists = fs.existsSync(path.join(__dirname, "toBeDeleted.txt"));
        expect(exists).toBeTruthy();
        deleteFile(path.join(__dirname, "toBeDeleted.txt"));
        exists = fs.existsSync(path.join(__dirname, "toBeDeleted.txt"));
        expect(exists).toBeFalsy();
      });
    } catch (err) {
      console.log(err);
    }
  });

  it("Should have connectToGoogle defined", () => {
    expect(connectToGoogle).toBeDefined();
  });

  it("Test connectToGoogle with a valid token", async () => {
    try {
      const token = jwt.sign(
        { email: "abdelrahmanhamdy@gmail.com" },
        process.env.TOKEN_SECRET
      );
      connectToGoogle(user1, token);
      await user1.save();
      expect(user1.googleEmail).toEqual("abdelrahmanhamdy@gmail.com");
    } catch (err) {
      console.log(err);
    }
  });

  it("Test connectToGoogle with the same google email", async () => {
    try {
      const token = jwt.sign(
        { email: "abdelrahmanhamdy@gmail.com" },
        process.env.TOKEN_SECRET
      );
      connectToGoogle(user1, token);
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Google Email already set");
    }
  });

  it("Should have connectToFacebook defined", () => {
    expect(connectToFacebook).toBeDefined();
  });

  it("Test connectToFacebook with a valid token", async () => {
    try {
      const token = jwt.sign(
        { email: "abdelrahmanhamdy@gmail.com" },
        process.env.TOKEN_SECRET
      );
      connectToFacebook(user1, token);
      await user1.save();
      expect(user1.facebookEmail).toEqual("abdelrahmanhamdy@gmail.com");
    } catch (err) {
      console.log(err);
    }
  });

  it("Test connectToFacebook with the same facebook email", async () => {
    try {
      const token = jwt.sign(
        { email: "abdelrahmanhamdy@gmail.com" },
        process.env.TOKEN_SECRET
      );
      connectToFacebook(user1, token);
    } catch (err) {
      expect(err.statusCode).toEqual(400);
      expect(err.message).toEqual("Facebook Email already set");
    }
  });
});
