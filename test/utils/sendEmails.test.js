// import {
//   sendResetPasswordEmail,
//   sendVerifyEmail,
//   sendUsernameEmail,
// } from "../../utils/sendEmails.js";
// import User from "../../models/User.js";
// import Token from "./../../models/VerifyToken.js";
// import { connectDatabase, closeDatabaseConnection } from "./../database.js";

// describe("Testing send emails functions", () => {
//   let user = {},
//     token = {};
//   beforeAll(async () => {
//     await connectDatabase();

//     user = new User({
//       username: "Beshoy",
//       email: "beshoy@gmail.com",
//       createdAt: Date.now(),
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
//     expect(await sendResetPasswordEmail(user, token.token)).toBeTruthy();
//   });

//   it("try let sendResetPasswordEmail throw an error", async () => {
//     expect(await sendResetPasswordEmail(null, token.token)).toBeFalsy();
//   });

//   it("should have sendVerifyEmail method", () => {
//     expect(sendVerifyEmail).toBeDefined();
//   });

//   it("try to send verify email", () => {
//     expect(sendVerifyEmail(user, token.token)).toBeTruthy();
//   });

//   it("try let sendVerifyEmail throw an error", () => {
//     expect(sendVerifyEmail(null, token.token)).toBeFalsy();
//   });

//   it("should have sendUsernameEmail method", () => {
//     expect(sendUsernameEmail).toBeDefined();
//   });

//   it("try to send forget username email", () => {
//     expect(sendUsernameEmail(user)).toBeTruthy();
//   });

//   it("try let sendUsernameEmail throw an error", () => {
//     expect(sendUsernameEmail(null)).toBeFalsy();
//   });
// });
