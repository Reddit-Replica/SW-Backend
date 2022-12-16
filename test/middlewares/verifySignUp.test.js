import { jest } from "@jest/globals";
import { checkDuplicateUsernameOrEmail } from "../../middleware/verifySignUp";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";

// eslint-disable-next-line max-statements
describe("Testing checkDuplicateUsernameOrEmail middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction = jest.fn();

  beforeAll(async () => {
    await connectDatabase();

    await new User({
      username: "Beshoy",
      email: "besho@gmail.com",
      createdAt: Date.now(),
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await closeDatabaseConnection();
  });

  beforeEach(() => {
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

  it("should have checkDuplicateUsernameOrEmail function", () => {
    expect(checkDuplicateUsernameOrEmail).toBeDefined();
  });

  it("try to use a username already used", async () => {
    mockRequest = {
      body: {
        username: "Beshoy",
        email: "new@gmail.com",
      },
    };
    await checkDuplicateUsernameOrEmail(
      mockRequest,
      mockResponse,
      nextFunction
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("try to use an email already used", async () => {
    mockRequest = {
      body: {
        username: "new",
        email: "besho@gmail.com",
      },
    };
    await checkDuplicateUsernameOrEmail(
      mockRequest,
      mockResponse,
      nextFunction
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("try to use a new username and email", async () => {
    mockRequest = {
      body: {
        username: "new",
        email: "new@gmail.com",
      },
    };
    await checkDuplicateUsernameOrEmail(
      mockRequest,
      mockResponse,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalled();
  });
});
