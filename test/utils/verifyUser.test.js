import verifyUser from "../../utils/verifyUser.js";
import { generateJWT } from "../../utils/generateTokens.js";
import dotenv from "dotenv";
dotenv.config();

describe("Testing verifying a user is logged in", () => {
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
