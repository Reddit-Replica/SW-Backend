import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import Token from "./../../models/VerifyToken.js";
const request = supertest(app);

fdescribe("Testing sign up endpoints", () => {
  afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("try to sign up without username", async () => {
    const response = await request
      .post("/api/signup")
      .send({ email: "testing@gmail.com", password: "123456789" });

    expect(response.status).toEqual(400);
  });

  it("try to sign up without email", async () => {
    const response = await request
      .post("/api/signup")
      .send({ username: "Beshoy", password: "123456789" });

    expect(response.status).toEqual(400);
  });

  it("try to sign up with invalid email", async () => {
    const response = await request
      .post("/api/signup")
      .send({ email: "beshoy@gmail", password: "123456789" });

    expect(response.status).toEqual(400);
  });

  it("try to sign up without password", async () => {
    const response = await request
      .post("/api/signup")
      .send({ email: "beshoy@gmail.com", username: "Beshoy" });

    expect(response.status).toEqual(400);
  });

  it("try to sign up with short password", async () => {
    const response = await request
      .post("/api/signup")
      .send({ email: "beshoy@gmail.com", username: "Beshoy", password: "123" });

    expect(response.status).toEqual(400);
  });

  it("try to sign up with all valid parameters", async () => {
    const response = await request.post("/api/signup").send({
      email: "beshoy@gmail.com",
      username: "Beshoy",
      password: "123456789",
    });

    expect(response.status).toEqual(201);
  });

  it("try to sign up with unavailable username", async () => {
    const response = await request.post("/api/signup").send({
      email: "beshoy1@gmail.com",
      username: "Beshoy",
      password: "123456789",
    });

    expect(response.status).toEqual(400);
  });

  it("try to sign up with unavailable email", async () => {
    const response = await request.post("/api/signup").send({
      email: "beshoy@gmail.com",
      username: "Beshoy1",
      password: "123456789",
    });

    expect(response.status).toEqual(400);
  });

  it("check the availability of a taken username", async () => {
    const response = await request.get("/api/username-available").query({
      username: "Beshoy",
    });

    expect(response.status).toEqual(409);
  });

  it("check the availability of an available username", async () => {
    const response = await request.get("/api/username-available").query({
      username: "Philip",
    });

    expect(response.status).toEqual(200);
  });

  it("check the availability of a taken email", async () => {
    const response = await request.get("/api/email-available").query({
      email: "beshoy@gmail.com",
    });

    expect(response.status).toEqual(409);
  });

  it("check the availability of an available email", async () => {
    const response = await request.get("/api/email-available").query({
      email: "beshoy1@gmail.com",
    });

    expect(response.status).toEqual(200);
  });
});
