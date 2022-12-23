/* eslint-disable max-len */
import { jest } from "@jest/globals";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  verifyUserByUsername,
  checkPasswords,
  verifyUsernameAndEmail,
  ResetPasswordEmail,
  verifyUserById,
  verifyResetToken,
} from "../../middleware/login.js";
import { optionalToken } from "../../middleware/optionalToken.js";
import { generateJWT } from "../../utils/generateTokens.js";
import User from "../../models/User.js";
import Token from "../../models/VerifyToken.js";
import crypto from "crypto";
import { hashPassword } from "../../utils/passwordUtils.js";

// eslint-disable-next-line max-statements
describe("Testing Login middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  let user1 = {};
  let user2 = {};
  let verifyToken = {};
  beforeAll(async () => {
    await connectDatabase();

    user1 = await new User({
      username: "hamdy",
      email: "abdelrahman@gmail.com",
      createdAt: Date.now(),
      password: hashPassword("12345678"),
    }).save();

    user2 = await new User({
      username: "beshoy",
      email: "besho@gmail.com",
      createdAt: Date.now(),
      password: hashPassword("87654321"),
    }).save();

    verifyToken = await new Token({
      userId: user2._id,
      token: crypto.randomBytes(32).toString("hex"),
      type: "forgetPassword",
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
    await closeDatabaseConnection();
  });

  beforeEach(() => {
    nextFunction = jest.fn();
    mockRequest = {};
    mockResponse = {
      status: () => {
        jest.fn();
        return mockResponse;
      },
      json: () => {
        jest.fn();
        return mockResponse;
      },
    };
  });

  it("should have verifyUserByUsername function", () => {
    expect(verifyUserByUsername).toBeDefined();
  });

  it("Test verifyUserByUsername with an deleted user", async () => {
    user1.deletedAt = Date.now();
    await user1.save();
    mockRequest = {
      body: {
        username: user1.username,
      },
    };
    await verifyUserByUsername(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  it("Test verifyUserByUsername correctly", async () => {
    user1.deletedAt = undefined;
    await user1.save();
    mockRequest = {
      body: {
        username: user1.username,
      },
    };
    await verifyUserByUsername(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user.username).toEqual("hamdy");
  });

  it("Test verifyUserByUsername with an invalid username", async () => {
    mockRequest = {
      body: {
        username: "invalidUsername",
      },
    };
    await verifyUserByUsername(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  it("should have checkPasswords function", () => {
    expect(checkPasswords).toBeDefined();
  });

  it("Test checkPasswords with non-matching passwords", async () => {
    mockRequest = {
      body: {
        password: "123456789",
      },
      user: user1,
    };
    await checkPasswords(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.token).toBeUndefined();
  });

  it("Test checkPasswords with matching passwords", async () => {
    mockRequest = {
      body: {
        password: "12345678",
      },
      user: user1,
    };
    await checkPasswords(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.token).toBeDefined();
  });

  it("Test checkPasswords with no user", async () => {
    mockRequest = {
      body: {
        password: "12345678",
      },
    };
    await checkPasswords(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.token).toBeUndefined();
  });

  it("Test checkPasswords with an invalid user", async () => {
    mockRequest = {
      body: {
        password: "12345678",
      },
      user: {
        password: "12345678",
      },
    };
    await checkPasswords(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.token).toBeUndefined();
  });

  it("Test checkPasswords with an empty user", async () => {
    mockRequest = {
      body: {
        password: "12345678",
      },
    };
    await checkPasswords(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.token).toBeUndefined();
  });

  it("should have verifyUsernameAndEmail function", () => {
    expect(verifyUsernameAndEmail).toBeDefined();
  });

  it("Test verifyUsernameAndEmail with an incorrect email", async () => {
    mockRequest = {
      body: {
        username: "hamdy",
        email: "invalidEmail@gmail.com",
      },
    };
    await verifyUsernameAndEmail(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  it("Test verifyUsernameAndEmail with a deleted user", async () => {
    user1.deletedAt = Date.now();
    await user1.save();
    mockRequest = {
      body: {
        username: "hamdy",
        email: "abderlrahman@gmail.com",
      },
    };
    await verifyUsernameAndEmail(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  it("Test verifyUsernameAndEmail with an incorrect username", async () => {
    mockRequest = {
      body: {
        username: "invalidUsername",
        email: "abdelrahman@gmail.com",
      },
    };
    await verifyUsernameAndEmail(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  it("Test verifyUsernameAndEmail with an no username/email", async () => {
    user1.deletedAt = undefined;
    await user1.save();
    mockRequest = {
      body: {},
    };
    await verifyUsernameAndEmail(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  it("Test verifyUsernameAndEmail correctly", async () => {
    mockRequest = {
      body: {
        username: "hamdy",
        email: "abdelrahman@gmail.com",
      },
    };
    await verifyUsernameAndEmail(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user.username).toEqual(user1.username);
  });

  it("should have ResetPasswordEmail function", () => {
    expect(ResetPasswordEmail).toBeDefined();
  });

  it("Test ResetPasswordEmail with no user", async () => {
    mockRequest = {};
    await ResetPasswordEmail(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.emailSent).toBeUndefined();
  });

  it("Test ResetPasswordEmail correctly", async () => {
    mockRequest = {
      user: user1,
    };
    await ResetPasswordEmail(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.emailSent).toBeTruthy();
  });

  it("should have verifyUserById function", () => {
    expect(verifyUserById).toBeDefined();
  });

  it("Test verifyUserById with an invaid ID", async () => {
    mockRequest = {
      params: {
        id: "invalidId",
      },
    };
    await verifyUserById(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  it("Test verifyUserById with a deleted user", async () => {
    user1.deletedAt = Date.now();
    await user1.save();
    mockRequest = {
      params: {
        id: user1.id,
      },
    };
    await verifyUserById(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  it("Test verifyUserById correctly", async () => {
    user1.deletedAt = undefined;
    await user1.save();
    mockRequest = {
      params: {
        id: user1.id,
      },
    };
    await verifyUserById(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user.username).toEqual("hamdy");
  });

  it("should have verifyResetToken function", () => {
    expect(verifyResetToken).toBeDefined();
  });

  it("Test verifyResetToken with an invaid token", async () => {
    mockRequest = {
      params: {
        token: "invalidToken",
      },
    };
    await verifyResetToken(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.token).toBeUndefined();
  });

  it("Test verifyResetToken with a correct token", async () => {
    mockRequest = {
      params: {
        token: verifyToken.token,
      },
      user: user2,
    };
    await verifyResetToken(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.token.userId.toString()).toEqual(user2.id.toString());
  });

  it("Test verifyResetToken with an expired token", async () => {
    verifyToken.expireAt = Date.now() - 360000;
    await verifyToken.save();
    mockRequest = {
      params: {
        token: verifyToken.token,
      },
      user: user2,
    };
    await verifyResetToken(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRequest.token).toBeUndefined();
  });

  it("should have optionalToken function", () => {
    expect(optionalToken).toBeDefined();
  });

  it("Test optionalToken with a valid req", async () => {
    mockRequest = {
      headers: {
        authorization: "Bearer " + generateJWT(user1),
      },
    };
    await optionalToken(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.loggedIn).toBeTruthy();
    expect(mockRequest.userId.toString()).toEqual(user1.id.toString());
  });

  it("Test optionalToken with an invalid req", async () => {
    mockRequest = {
      headers: {
        authorization: "Bearer ",
      },
    };
    await optionalToken(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.loggedIn).toBeFalsy();
  });
});
