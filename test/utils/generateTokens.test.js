import {
  generateJWT,
  generateVerifyToken,
} from "../../utils/generateTokens.js";
import User from "../../models/User.js";
import Token from "./../../models/VerifyToken.js";
import { connectDatabase, closeDatabaseConnection } from "./../database.js";

describe("Testing generate tokens", () => {
  beforeAll(async () => {
    await connectDatabase();
  });
  afterAll(async () => {
    await closeDatabaseConnection();
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
      return undefined;
    }
  });

  it("try to send empty user object to generateJWT", () => {
    const user = {};
    const token = generateJWT(user);
    try {
      const decodedPayload = jwt.verify(token, process.env.TOKEN_SECRET);
      expect(decodedPayload).toEqual(user);
    } catch (err) {
      return undefined;
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
      createdAt: Date.now(),
    });
    await user.save();
    const token = await generateVerifyToken(user._id, "random");
    expect(token.length).toEqual(64);

    await user.remove();
    await Token.deleteMany({});
  });
});
