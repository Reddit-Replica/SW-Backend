/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
  subredditCategoryListing,
  twoRandomCategories,
  subredditTrendingListing,
} from "../../services/subredditListing.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "../../models/User.js";
import Subreddit from "../../models/Community.js";

// eslint-disable-next-line max-statements
describe("Testing subreddit service functions", () => {
  let userOne = {},
    userTwo = {},
    userThree = {},
    postOne = {},
    postTwo = {},
    postThree = {},
    postFour = {},
    subredditOne = {};
  beforeAll(async () => {
    await connectDatabase();

    userOne = await new User({
      username: "Noaman",
      email: "abdelrahmannoaman1@gmail.com",
      createdAt: Date.now(),
    }).save();

    userThree = await new User({
      username: "Beshoy",
      email: "Bosha@gmail.com",
      createdAt: Date.now(),
    }).save();

    subredditOne = await new Subreddit({
      title: "SportsSubreddit",
      viewName: "Ahly",
      category: "Sports",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 20,
      numberOfViews: 63,
    }).save();

    userTwo = await new User({
      username: "Hamdy",
      email: "bodynoaman1996@gmail.com",
      createdAt: Date.now(),
      joinedSubreddits: [
        {
          subredditId: subredditOne._id,
          name: subredditOne.title,
        },
      ],
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have subredditCategoryListing function", () => {
    expect(subredditCategoryListing).toBeDefined();
  });

  it("try subredditCategoryListing function if the user already had the conversation", async () => {
    const result = await subredditCategoryListing(
      userTwo,
      "News",
      "",
      "",
      75,
      false,
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(30);
  });
});
