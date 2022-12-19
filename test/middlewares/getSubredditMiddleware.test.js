import { jest } from "@jest/globals";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import { getBodySubreddit } from "../../middleware/getSubredditMiddleware";
import Subreddit from "../../models/Community";

// eslint-disable-next-line max-statements
describe("Testing getBodySubreddit middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction = jest.fn();

  let subreddit = {};
  beforeAll(async () => {
    await connectDatabase();

    subreddit = await new Subreddit({
      type: "public",
      title: "subreddit",
      category: "fun",
      viewName: "LOL",
      owner: {
        username: "Beshoy",
      },
      createdAt: Date.now(),
    }).save();
  });

  afterAll(async () => {
    await Subreddit.deleteMany({});
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

  it("should have getBodySubreddit function", () => {
    expect(getBodySubreddit).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("try to send an invalid subreddit name to getBodySubreddit function", async () => {
    mockRequest = {
      body: {
        subreddit: "invalid",
      },
    };
    await getBodySubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  // eslint-disable-next-line max-len
  it("try to send a valid subreddit name to getBodySubreddit function", async () => {
    mockRequest = {
      body: {
        subreddit: subreddit.title,
      },
    };
    await getBodySubreddit(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
