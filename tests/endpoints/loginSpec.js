import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import { generateVerifyToken } from "../../utils/generateTokens.js";
import { hashPassword } from "../../utils/passwordUtils.js";
import Token from "./../../models/VerifyToken.js";
const request = supertest(app);

// eslint-disable-next-line max-statements
describe("Testing login endpoints", () => {
  afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("try to send forget-username email to email dosn't exist", async () => {
    const response = await request.post("/login/forget-username").send({
      email: "beshoy@gmail.com",
    });

    expect(response.status).toEqual(400);
  });

  it("try to send forget email to a valid email", async () => {
    const user = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user.save();

    const response = await request.post("/login/forget-username").send({
      email: "beshoy@gmail.com",
    });

    expect(response.status).toEqual(200);
  });

  it("Try to login with correct credentials", async () => {
    const user = new User({
      username: "Hamdy",
      email: "abdelrahmanhamdy49@gmail.com",
      password: hashPassword("12345678"),
    });
    await user.save();

    const response = await request.post("/login").send({
      username: "Hamdy",
      password: "12345678",
    });

    expect(response.status).toEqual(200);
  });

  it("Try to login with invalid password", async () => {
    const response = await request.post("/login").send({
      username: "Hamdy",
      password: "987654321",
    });

    expect(response.status).toEqual(400);
  });

  it("Try to login with a short password", async () => {
    const response = await request.post("/login").send({
      username: "Hamdy",
      password: "1234",
    });

    expect(response.status).toEqual(400);
  });

  it("Try to login with a not-found username", async () => {
    const response = await request.post("/login").send({
      username: "Ahmed",
      password: "12345678",
    });

    expect(response.status).toEqual(400);
  });

  it("Try to send a forget password email to a not-found email", async () => {
    const response = await request.post("/login/forget-password").send({
      username: "Hamdy",
      email: "invalidemail@gmail.com",
    });

    expect(response.status).toEqual(400);
  });

  it("Try to send a forget password email to an invalid username", async () => {
    const response = await request.post("/login/forget-password").send({
      username: "Ahmed",
      email: "abdelrahmanhamdy49@gmail.com",
    });

    expect(response.status).toEqual(400);
  });

  it("Try to send a forget password email to the correct user", async () => {
    const response = await request.post("/login/forget-password").send({
      username: "Hamdy",
      email: "abdelrahmanhamdy49@gmail.com",
    });

    expect(response.status).toEqual(200);
  });

  it("Try to reset password with correct id but invalid token", async () => {
    const user = await User.findOne({
      username: "Hamdy",
    });
    let response = await request
      .post(`/reset-password/${user.id}/a231wq23`)
      .send({
        newPassword: "123456789",
        verifyPassword: "123456789",
      });

    expect(response.status).toEqual(403);

    response = await request.post("/login").send({
      username: "Hamdy",
      password: "123456789",
    });

    expect(response.status).toEqual(400);
  });

  it("Try to reset password with invalid id but correct token", async () => {
    const user = await User.findOne({
      username: "Hamdy",
    });
    const token = await Token.findOne({
      userId: user.id,
    });
    let response = await request
      .post(`/reset-password/invalidid123/${token.token}`)
      .send({
        newPassword: "123456789",
        verifyPassword: "123456789",
      });

    expect(response.status).toEqual(403);

    response = await request.post("/login").send({
      username: "Hamdy",
      password: "123456789",
    });

    expect(response.status).toEqual(400);
  });

  it("Try to reset password with non-matching passwords", async () => {
    const user = await User.findOne({
      username: "Hamdy",
    });
    const token = await Token.findOne({
      userId: user.id,
    });
    let response = await request
      .post(`/reset-password/${user.id}/${token.token}`)
      .send({
        newPassword: "123456789",
        verifyPassword: "987654321",
      });

    expect(response.status).toEqual(400);

    response = await request.post("/login").send({
      username: "Hamdy",
      password: "123456789",
    });

    expect(response.status).toEqual(400);
  });

  it("Try to reset password with an expired token", async () => {
    const user = await User.findOne({
      username: "Hamdy",
    });
    const token = await Token.findOne({
      userId: user.id,
    });
    token.expireAt = Date.now() - 360000000;
    await token.save();
    let response = await request
      .post(`/reset-password/${user.id}/${token.token}`)
      .send({
        newPassword: "123456789",
        verifyPassword: "123456789",
      });

    expect(response.status).toEqual(403);

    response = await request.post("/login").send({
      username: "Hamdy",
      password: "123456789",
    });

    expect(response.status).toEqual(400);
  });

  it("Try to reset password with the correct id and token", async () => {
    const user = await User.findOne({
      username: "Hamdy",
    });
    const token = await generateVerifyToken(user.id, "forgetPassword");
    let response = await request
      .post(`/reset-password/${user.id.toString()}/${token}`)
      .send({
        newPassword: "123456789",
        verifyPassword: "123456789",
      });

    expect(response.status).toEqual(200);

    response = await request.post("/login").send({
      username: "Hamdy",
      password: "123456789",
    });

    expect(response.status).toEqual(200);
  });
});
