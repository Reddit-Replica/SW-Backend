import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import { generateJWT } from "../../utils/generateTokens.js";
import { hashPassword } from "../../utils/passwordUtils.js";
import Subreddit from "../../models/Community.js";
const request = supertest(app);

// eslint-disable-next-line max-statements
describe("Testing Subreddit Creation endpoints", () => {
  afterAll(async () => {
    //await User.deleteMany({});
    //await Community.deleteMany({});
  });
  let moderatorUser, normalUser, token;
  beforeAll(async () => {
    await User.deleteMany({});
    await Subreddit.deleteMany({});
    moderatorUser = await new User({
      username: "AbdelrahmanNoaman",
      email: "noaman@gmail.com",
      password: hashPassword("12345678"),
    }).save();

    normalUser = await new User({
      username: "AhmedMahmoud",
      email: "Mahmoud@gmail.com",
      password: hashPassword("987654321"),
    }).save();
  });

  it("Create subreddit without entering title", async () => {
    token = generateJWT(moderatorUser);
    const subreddit = {
      type: "Private",
      category: "Sports",
      nsfw: false,
    };
    const response = await request
      .post("/create-subreddit")
      .send(subreddit)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });

  it("Create subreddit with a title more than 23 char", async () => {
    token = generateJWT(moderatorUser);
    const subreddit = {
      title: "The Unbreakable Hunter All Around The World",
      type: "Private",
      category: "Sports",
      nsfw: false,
    };
    const response = await request
      .post("/create-subreddit")
      .send(subreddit)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });

  it("Create subreddit without entering type", async () => {
    token = generateJWT(moderatorUser);
    const subreddit = {
      title: "Hunter",
      category: "Sports",
      nsfw: false,
    };
    const response = await request
      .post("/create-subreddit")
      .send(subreddit)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });

  it("Create subreddit without entering category", async () => {
    token = generateJWT(moderatorUser);
    const subreddit = {
      title: "Hunter",
      type: "Private",
      nsfw: false,
    };
    const response = await request
      .post("/create-subreddit")
      .send(subreddit)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });

  it("Create subreddit with an invalid category", async () => {
    token = generateJWT(moderatorUser);
    const subreddit = {
      title: "Hunter",
      type: "Private",
      category: "Man City",
      nsfw: false,
    };
    const response = await request
      .post("/create-subreddit")
      .send(subreddit)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });

  it("Create subreddit successfully", async () => {
    token = generateJWT(moderatorUser);
    const subreddit = {
      title: "Hunter",
      type: "Private",
      category: "Sports",
      nsfw: false,
    };
    const response = await request
      .post("/create-subreddit")
      .send(subreddit)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(201);
  });

  it("Creating subreddit with the same title", async () => {
    token = generateJWT(moderatorUser);
    const subreddit = {
      title: "Hunter",
      type: "private",
      category: "Gaming",
      nsfw: false,
    };
    const response = await request
      .post("/create-subreddit")
      .send(subreddit)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(400);
  });

  it("Creating subreddit with invalid token", async () => {
    const subreddit = {
      title: "Hunter",
      type: "private",
      category: "Gaming",
      nsfw: false,
    };
    const response = await request
      .post("/create-subreddit")
      .send(subreddit)
      .set("Authorization", "Bearer " + "invalid token");
    expect(response.status).toEqual(401);
  });

  it("joining subreddit that you are already in", async () => {
    token = generateJWT(moderatorUser);
    // eslint-disable-next-line max-len
    const { joinedSubreddits } = await User.findOne({
      username: moderatorUser.username,
    });
    const req = {
      subredditId: joinedSubreddits[0].subredditId.toString(),
    };
    const response = await request
      .post("/join-subreddit")
      .send(req)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(409);
  });

  it("joining subreddit with an invalid token", async () => {
    // eslint-disable-next-line max-len
    const { joinedSubreddits } = await User.findOne({
      username: moderatorUser.username,
    });
    const req = {
      subredditId: joinedSubreddits[0].subredditId.toString(),
    };
    const response = await request
      .post("/join-subreddit")
      .send(req)
      .set("Authorization", "Bearer " + "invalid token");

    expect(response.status).toEqual(401);
  });

  it("joining subreddit that you are not in", async () => {
    token = generateJWT(normalUser);
    const { _id } = await Subreddit.findOne({ title: "Hunter" });
    const req = {
      subredditId: _id.toString(),
    };
    const response = await request
      .post("/join-subreddit")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(200);
  });

  // eslint-disable-next-line max-len
  it("Adding description while you don't have the right to do it", async () => {
    token = generateJWT(normalUser);
    const req = {
      description: "small description",
    };
    const response = await request
      .post("/r/Hunter/add-description")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(403);
  });

  it("Adding description while you are moderator", async () => {
    token = generateJWT(moderatorUser);
    const req = {
      description: "small description",
    };
    const response = await request
      .post("/r/Hunter/add-description")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(201);
  });

  it("Adding description wih invalid token", async () => {
    const req = {
      description: "small description",
    };
    const response = await request
      .post("/r/Hunter/add-description")
      .send(req)
      .set("Authorization", "Bearer " + "invalid token");
    expect(response.status).toEqual(401);
  });

  // eslint-disable-next-line max-len
  it("Adding description while you are moderator with more than 300 char", async () => {
    token = generateJWT(moderatorUser);
    let s = "a".repeat(301);
    const req = {
      description: s,
    };
    const response = await request
      .post("/r/Hunter/add-description")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(400);
  });

  // eslint-disable-next-line max-len
  it("Adding an empty description while you are moderator", async () => {
    token = generateJWT(moderatorUser);
    const req = {};
    const response = await request
      .post("/r/Hunter/add-description")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(400);
  });

  // eslint-disable-next-line max-len
  it("Adding Main Topic while you don't have the right to do it", async () => {
    token = generateJWT(normalUser);
    const req = {
      title: "Sports",
    };
    const response = await request
      .post("/r/Hunter/add-mainTopic")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(403);
  });

  it("Adding Main Topic while you are moderator", async () => {
    token = generateJWT(moderatorUser);
    const req = {
      title: "Sports",
    };
    const response = await request
      .post("/r/Hunter/add-mainTopic")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(201);
  });

  it("Adding Main Topic wih invalid token", async () => {
    const req = {
      title: "Sports",
    };
    const response = await request
      .post("/r/Hunter/add-mainTopic")
      .send(req)
      .set("Authorization", "Bearer " + "invalid token");
    expect(response.status).toEqual(401);
  });

  it("Adding an invalid Main Topic while you are moderator", async () => {
    token = generateJWT(moderatorUser);
    const req = {
      title: "Liverpool",
    };
    const response = await request
      .post("/r/Hunter/add-mainTopic")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(400);
  });

  // eslint-disable-next-line max-len
  it("Adding SubTopics while you don't have the right to do it", async () => {
    token = generateJWT(normalUser);
    const req = {
      title: ["sports"],
    };
    const response = await request
      .post("/r/Hunter/add-subTopic")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(403);
  });

  it("Adding SubTopics while you are moderator", async () => {
    token = generateJWT(moderatorUser);
    const req = {
      title: ["Sports", "Crypto"],
    };
    const response = await request
      .post("/r/Hunter/add-subTopic")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(201);
  });
  it("Adding an invalid subTopics while you are moderator", async () => {
    token = generateJWT(moderatorUser);
    const req = {
      title: ["Liverpool"],
    };
    const response = await request
      .post("/r/Hunter/add-subTopic")
      .send(req)
      .set("Authorization", "Bearer " + token);
    expect(response.status).toEqual(400);
  });

  // eslint-disable-next-line max-len
  it("Adding SubTopics wih invalid token", async () => {
    const req = {
      title: ["Sports", "Crypto"],
    };
    const response = await request
      .post("/r/Hunter/add-subTopic")
      .send(req)
      .set("Authorization", "Bearer " + "invalid token");
    expect(response.status).toEqual(401);
  });
});
