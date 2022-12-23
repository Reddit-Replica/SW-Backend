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
    subredditOne = {},
    subredditTwo = {},
    subredditThree = {},
    subredditFour = {},
    subredditFive = {},
    subredditSix = {},
    subredditSeven = {},
    subredditEight = {},
    subredditNine = {},
    subredditTen = {},
    subredditEleven = {},
    subredditOne2 = {},
    subredditTwo2 = {},
    subredditThree2 = {},
    subredditFour2 = {},
    subredditFive2 = {},
    subredditSix2 = {},
    subredditSeven2 = {},
    subredditEight2 = {},
    subredditNine2 = {},
    subredditTen2 = {},
    subredditEleven2 = {},
    subredditOne3 = {},
    subredditTwo3 = {},
    subredditThree3 = {},
    subredditFour3 = {},
    subredditFive3 = {},
    subredditSix3 = {},
    subredditSeven3 = {},
    subredditTwelve = {};
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

    subredditTwo = await new Subreddit({
      title: "NewsSubreddit",
      viewName: "Al Akhbar",
      category: "News",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 10,
      numberOfViews: 20,
    }).save();

    subredditThree = await new Subreddit({
      title: "BeautySubreddit",
      viewName: "Zamalek",
      category: "Beauty",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 5,
      numberOfViews: 40,
    }).save();

    subredditFour = await new Subreddit({
      title: "GamingSubreddit",
      viewName: "SpiderMan",
      category: "Gaming",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 19,
      numberOfViews: 36,
    }).save();

    subredditFive = await new Subreddit({
      title: "TVSubreddit",
      viewName: "Al Nahar",
      category: "TV",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 12,
      numberOfViews: 120,
    }).save();

    subredditSix = await new Subreddit({
      title: "AwwSubreddit",
      viewName: "Awwwwwwww",
      category: "Aww",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 22,
      numberOfViews: 27,
    }).save();

    subredditSeven = await new Subreddit({
      title: "MemesSubreddit",
      viewName: "Ahly",
      category: "Memes",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 103,
      numberOfViews: 501,
    }).save();

    subredditEight = await new Subreddit({
      title: "PicsAndGifsSubreddit",
      viewName: "Swar",
      category: "Pics & Gifs",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 1,
      numberOfViews: 1,
    }).save();

    subredditNine = await new Subreddit({
      title: "TravelSubreddit",
      viewName: "Zamalek",
      category: "Travel",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 2,
      numberOfViews: 2,
    }).save();

    subredditTen = await new Subreddit({
      title: "TechSubreddit",
      viewName: "Ahly",
      category: "Tech",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 4,
      numberOfViews: 5,
    }).save();

    subredditEleven = await new Subreddit({
      title: "MusicSubreddit",
      viewName: "Al Akhbar",
      category: "Music",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 6,
      numberOfViews: 7,
    }).save();

    subredditTwelve = await new Subreddit({
      title: "ArtSubreddit",
      viewName: "Zamalek",
      category: "Art & Design",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 8,
      numberOfViews: 9,
    }).save();
    subredditOne2 = await new Subreddit({
      title: "BooksSubreddit",
      viewName: "Ahly",
      category: "Books & Writing",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 100,
      numberOfViews: 101,
    }).save();

    subredditTwo2 = await new Subreddit({
      title: "CryptoSubreddit",
      viewName: "Al Akhbar",
      category: "Crypto",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 101,
      numberOfViews: 102,
    }).save();

    subredditThree2 = await new Subreddit({
      title: "DiscussionSubreddit",
      viewName: "Zamalek",
      category: "Discussion",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 102,
      numberOfViews: 103,
    }).save();

    subredditFour2 = await new Subreddit({
      title: "E3Subreddit",
      viewName: "SpiderMan",
      category: "E3",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 103,
      numberOfViews: 104,
    }).save();

    subredditFive2 = await new Subreddit({
      title: "FashionSubreddit",
      viewName: "Al Nahar",
      category: "Fashion",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 104,
      numberOfViews: 105,
    }).save();

    subredditSix2 = await new Subreddit({
      title: "FSubreddit",
      viewName: "Awwwwwwww",
      category: "Finance & Business",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 1000,
      numberOfViews: 10000,
    }).save();

    subredditSeven2 = await new Subreddit({
      title: "FoodSubreddit",
      viewName: "Ahly",
      category: "Food",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 110,
      numberOfViews: 109,
    }).save();

    subredditOne3 = await new Subreddit({
      title: "BooksSubreddit",
      viewName: "Ahly",
      category: "parenting",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 210,
      numberOfViews: 211,
    }).save();

    subredditTwo3 = await new Subreddit({
      title: "CryptoSubreddit",
      viewName: "Al Akhbar",
      category: "Photography",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 211,
      numberOfViews: 212,
    }).save();

    subredditThree3 = await new Subreddit({
      title: "DiscussionSubreddit",
      viewName: "Zamalek",
      category: "Relationships",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 212,
      numberOfViews: 213,
    }).save();

    subredditFour3 = await new Subreddit({
      title: "E3Subreddit",
      viewName: "SpiderMan",
      category: "Science",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 213,
      numberOfViews: 214,
    }).save();

    subredditFive3 = await new Subreddit({
      title: "FashionSubreddit",
      viewName: "Al Nahar",
      category: "Videos",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 214,
      numberOfViews: 215,
    }).save();

    subredditSix3 = await new Subreddit({
      title: "FSubreddit",
      viewName: "Awwwwwwww",
      category: "Vroom",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 109,
      numberOfViews: 108,
    }).save();

    subredditSeven3 = await new Subreddit({
      title: "FoodSubreddit",
      viewName: "Ahly",
      category: "Wholesome",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 110,
      numberOfViews: 109,
    }).save();

    subredditEight2 = await new Subreddit({
      title: "HSubreddit",
      viewName: "Swar",
      category: "Health & Fitness",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 200,
      numberOfViews: 201,
    }).save();

    subredditNine2 = await new Subreddit({
      title: "TravelSubreddit",
      viewName: "Zamalek",
      category: "Learning",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 201,
      numberOfViews: 202,
    }).save();

    subredditTen2 = await new Subreddit({
      title: "TechSubreddit",
      viewName: "Ahly",
      category: "Mindblowing",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 202,
      numberOfViews: 203,
    }).save();

    subredditEleven2 = await new Subreddit({
      title: "MusicSubreddit",
      viewName: "Al Akhbar",
      category: "Outdoors",
      type: "Private",
      dateOfCreation: Date.now(),
      owner: {
        username: "Noaman",
      },
      members: 204,
      numberOfViews: 205,
    }).save();

    userTwo = await new User({
      username: "Hamdy",
      email: "bodynoaman1996@gmail.com",
      createdAt: Date.now(),
      joinedSubreddits: [
        {
          subredditId: subredditSix2._id,
          name: subredditSix2.title,
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
  it("try subredditCategoryListing function if the user already had the conversation", async () => {
    const result = await subredditCategoryListing(
      userTwo,
      "News",
      "",
      "",
      75,
      true,
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(1);
  });

  it("try subredditCategoryListing function if the user already had the conversation", async () => {
    const result = await subredditCategoryListing(
      userTwo,
      "News",
      userOne.id,
      "",
      75,
      true,
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(0);
  });

  it("try subredditCategoryListing function if the user already had the conversation", async () => {
    const result = await subredditCategoryListing(
      userTwo,
      "News",
      subredditThree._id,
      "",
      5,
      false,
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(5);
  });
  it("try subredditCategoryListing function if the user already had the conversation", async () => {
    const result = await subredditCategoryListing(
      userTwo,
      "News",
      "",
      subredditOne._id,
      5,
      false,
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(5);
  });

  it("try subredditCategoryListing function if the user already had the conversation", async () => {
    const result = await subredditCategoryListing(
      userTwo,
      "News",
      "",
      subredditEight._id,
      5,
      false,
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(0);
  });

  it("should have twoRandomCategories function", () => {
    expect(twoRandomCategories).toBeDefined();
  });

  it("try twoRandomCategories function if the user already had the conversation", async () => {
    const result = await twoRandomCategories(userTwo, true);
    expect(result.statusCode).toEqual(200);
    expect(result.data.firstCategoryChildren.length).toEqual(1);
    expect(result.data.secondCategoryChildren.length).toEqual(1);
  });

  it("should have subredditTrendingListing function", () => {
    expect(subredditTrendingListing).toBeDefined();
  });

  it("try subredditTrendingListing function if the user already had the conversation", async () => {
    const result = await subredditTrendingListing(userTwo, "", "", 75, true);
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(30);
  });
  it("try subredditTrendingListing function if the user already had the conversation", async () => {
    const result = await subredditTrendingListing(
      userTwo,
      userOne.id,
      "",
      75,
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(0);
  });
  it("try subredditTrendingListing function if the user already had the conversation", async () => {
    const result = await subredditTrendingListing(
      userTwo,
      subredditTwo.id,
      "",
      5,
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(5);
  });
  it("try subredditTrendingListing function if the user already had the conversation", async () => {
    const result = await subredditTrendingListing(
      userTwo,
      "",
      subredditOne.id,
      5,
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(5);
  });
  it("try subredditTrendingListing function if the user already had the conversation", async () => {
    const result = await subredditTrendingListing(
      userTwo,
      "",
      subredditEight.id,
      5,
      true
    );
    expect(result.statusCode).toEqual(200);
    expect(result.data.length).toEqual(0);
  });
});
