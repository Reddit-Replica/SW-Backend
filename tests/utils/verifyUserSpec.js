import verifyUser from "../../utils/verifyUser.js";
import { generateJWT } from "../../utils/generateTokens.js";
import User from "../../models/User.js";
import Token from "./../../models/VerifyToken.js";
import supertest from "supertest";
import app from "../../app.js";
supertest(app);

describe("Testing verifying a user is logged in", () => {
  afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("should have verifyUser method", () => {
    expect(verifyUser).toBeDefined();
  });

  it("check if verifyUser verifies a valid jwt", () => {
    const user = {
      id: "mongodbId",
      username: "Hamdy",
    };
    const token = generateJWT(user);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const decodedPayload = verifyUser(req);
    expect(decodedPayload.userId).toEqual("mongodbId");
    expect(decodedPayload.username).toEqual("Hamdy");
  });

  it("Send an invalid token to verifyUser", () => {
    const req = {
      headers: {
        authorization: "Bearer invalidToken",
      },
    };
    const decodedPayload = verifyUser(req);
    expect(decodedPayload).toBeNull();
  });
});
