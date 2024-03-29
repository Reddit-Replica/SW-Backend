import {
  sendResetPasswordEmail,
  sendVerifyEmail,
  sendUsernameEmail,
} from "../../utils/sendEmails.js";
import User from "../../models/User.js";
import Token from "./../../models/VerifyToken.js";
import supertest from "supertest";
import app from "../../app.js";
supertest(app);

describe("Testing send emails functions", () => {
  let user = {},
    token = {};
  beforeAll(async () => {
    user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user.save();

    token = new Token({
      userId: user._id,
      token: "token",
      type: "type",
    });
    await token.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("should have sendResetPasswordEmail method", () => {
    expect(sendResetPasswordEmail).toBeDefined();
  });

  it("try to send reset password email", async () => {
    expect(sendResetPasswordEmail(user, token.token)).toBeTruthy();
  });

  it("should have sendVerifyEmail method", () => {
    expect(sendVerifyEmail).toBeDefined();
  });

  it("try to send verify email", () => {
    expect(sendVerifyEmail(user, token.token)).toBeTruthy();
  });

  it("should have sendUsernameEmail method", () => {
    expect(sendUsernameEmail).toBeDefined();
  });

  it("try to send forget username email", () => {
    expect(sendUsernameEmail(user)).toBeTruthy();
  });
});
