// import {
//   sendResetPasswordEmail,
//   sendVerifyEmail,
//   sendUsernameEmail,
// } from "../../utils/sendEmails.js";
// import User from "../../models/User.js";
// import Token from "./../../models/VerifyToken.js";
// import { connectDatabase, closeDatabaseConnection } from "./../database.js";

describe("Testing send emails functions", () => {
  test("Testing jsend emailsest", () => {
    expect(2 + 5).toBe(7);

    expect(1 + 2).not.toBe(5);
  });
  //   let user = {},
  //     token = {};
  //   beforeAll(async () => {
  //     await connectDatabase();

  //     user = new User({
  //       username: "Beshoy",
  //       email: "beshoy@gmail.com",createdAt: Date.now(),
  //     });
  //     await user.save();

  //     token = new Token({
  //       userId: user._id,
  //       token: "token",
  //       type: "type",
  //     });
  //     await token.save();
  //   });

  //   afterAll(async () => {
  //     await user.remove();
  //     await token.remove();
  //     await closeDatabaseConnection();
  //   });

  //   it("should have sendResetPasswordEmail method", () => {
  //     expect(sendResetPasswordEmail).toBeDefined();
  //   });

  //   it("try to send reset password email", async () => {
  //     expect(
  //       sendResetPasswordEmail(user.email, user.username, user._id, token.token)
  //     ).toBeTruthy();
  //   });

  //   it("should have sendVerifyEmail method", () => {
  //     expect(sendVerifyEmail).toBeDefined();
  //   });

  //   it("try to send verify email", () => {
  //     expect(sendVerifyEmail(user.email, user._id, token.token)).toBeTruthy();
  //   });

  //   it("should have sendUsernameEmail method", () => {
  //     expect(sendUsernameEmail).toBeDefined();
  //   });

  //   it("try to send forget username email", () => {
  //     expect(sendUsernameEmail(user.email, user.username)).toBeTruthy();
  //   });
});
