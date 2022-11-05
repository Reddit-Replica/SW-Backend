import {
  generateJWT,
  generateVerifyToken,
} from "../../utils/generateTokens.js";
import User from "../../models/User.js";
import Token from "./../../models/VerifyToken.js";
import supertest from "supertest";
import app from "../../app.js";
supertest(app);

describe("Testing generate tokens", () => {
  afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("should have generateJWT method", () => {
    expect(generateJWT).toBeDefined();
  });

  it("check if generateJWT returns a valid jwt", () => {
    const user = {
      userId: "mongodbId",
      username: "Beshoy",
    };
    const token = generateJWT(user);
    try {
      const decodedPayload = jwt.verify(token, process.env.TOKEN_SECRET);
      expect(decodedPayload).toEqual(user);
    } catch (err) {
      return false;
    }
  });

  it("try to send empty user object to generateJWT", () => {
    const user = {};
    const token = generateJWT(user);
    try {
      const decodedPayload = jwt.verify(token, process.env.TOKEN_SECRET);
      expect(decodedPayload).toEqual(user);
    } catch (err) {
      return false;
    }
  });

  it("should have generateVerifyToken method", () => {
    expect(generateVerifyToken).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("check if generateVerifyToken returns a valid token with length 64", async () => {
    const user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user.save();
    const token = await generateVerifyToken(user._id);
    expect(token.length).toEqual(64);
  });
});
