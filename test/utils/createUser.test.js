import { finalizeCreateUser } from "../../utils/createUser.js";
import User from "../../models/User.js";
import Token from "./../../models/VerifyToken.js";
import { connectDatabase, closeDatabaseConnection } from "./../database.js";

describe("Testing finializeCreateUser file", () => {
  let user = {};
  beforeAll(async () => {
    await connectDatabase();
    user = await new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
      createdAt: Date.now(),
    }).save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have finalizeCreateUser method", () => {
    expect(finalizeCreateUser).toBeDefined();
  });

  it("try to call finalize create user without sending an email", async () => {
    const user = await new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
      createdAt: Date.now(),
    }).save();
    const result = await finalizeCreateUser(user, false);
    expect(result.statusCode).toEqual(201);
  });

  it("try to call finalize create user and send a verification email", async () => {
    const result = await finalizeCreateUser(user, true);
    expect(result.statusCode).toEqual(201);
  });
});
