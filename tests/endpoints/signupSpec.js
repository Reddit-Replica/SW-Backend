import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import Token from "./../../models/VerifyToken.js";
const request = supertest(app);

// eslint-disable-next-line max-statements
describe("Testing sign up endpoints", () => {
  afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("try to sign up without username", async () => {
    const response = await request
      .post("/signup")
      .send({ email: "testing@gmail.com", password: "123456789" });

    expect(response.status).toEqual(400);
  });

  it("try to sign up without email", async () => {
    const response = await request
      .post("/signup")
      .send({ username: "Beshoy", password: "123456789" });

    expect(response.status).toEqual(400);
  });

  it("try to sign up with invalid email", async () => {
    const response = await request.post("/signup").send({
      username: "Beshoy",
      email: "beshoy@gmail",
      password: "123456789",
    });

    expect(response.status).toEqual(400);
  });

  it("try to sign up without password", async () => {
    const response = await request
      .post("/signup")
      .send({ email: "beshoy@gmail.com", username: "Beshoy" });

    expect(response.status).toEqual(400);
  });

  it("try to sign up with short password", async () => {
    const response = await request
      .post("/signup")
      .send({ email: "beshoy@gmail.com", username: "Beshoy", password: "123" });

    expect(response.status).toEqual(400);
  });

  it("try to sign up with all valid parameters", async () => {
    const response = await request.post("/signup").send({
      email: "beshoy@gmail.com",
      username: "Beshoy",
      password: "123456789",
    });

    expect(response.status).toEqual(201);
  });

  it("try to sign up with unavailable username", async () => {
    const response = await request.post("/signup").send({
      email: "beshoy1@gmail.com",
      username: "Beshoy",
      password: "123456789",
    });

    expect(response.status).toEqual(400);
  });

  it("try to sign up with unavailable email", async () => {
    const response = await request.post("/signup").send({
      email: "beshoy@gmail.com",
      username: "Beshoy1",
      password: "123456789",
    });

    expect(response.status).toEqual(400);
  });

  it("check the availability of a taken username", async () => {
    const response = await request.get("/username-available").query({
      username: "Beshoy",
    });

    expect(response.status).toEqual(409);
  });

  it("check the availability of an available username", async () => {
    const response = await request.get("/username-available").query({
      username: "Philip",
    });

    expect(response.status).toEqual(200);
  });

  it("check the availability of a taken email", async () => {
    const response = await request.get("/email-available").query({
      email: "beshoy@gmail.com",
    });

    expect(response.status).toEqual(409);
  });

  it("check the availability of an available email", async () => {
    const response = await request.get("/email-available").query({
      email: "beshoy1@gmail.com",
    });

    expect(response.status).toEqual(200);
  });

  it("try to sign up with google without access token", async () => {
    const response = await request.post("/signin/google");

    expect(response.status).toEqual(400);
  });

  it("try to sign up with google with valid access token", async () => {
    const response = await request.post("/signin/google").send({
      accessToken:
        // eslint-disable-next-line max-len
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImY0NTEzNDVmYWQwODEwMWJmYjM0NWNmNjQyYTJkYTkyNjdiOWViZWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNTE1MzU3NDU2NTQ0LXN1a3BqNXB1ZmlyMjc5Y3JpdWZmNHRpcmQwamQwYjBuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNTE1MzU3NDU2NTQ0LXN1a3BqNXB1ZmlyMjc5Y3JpdWZmNHRpcmQwamQwYjBuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA2MjUzODUxMjMwMzg5NjMxMzQ0IiwiZW1haWwiOiJib3NoYTM2OUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjhMU2tDSmxhemtvcm4xdXdrenhrSGciLCJuYW1lIjoiQmVzaG95IE1vcmFkIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTFWeUpIZmV1MF8zOUhqLWZBRjFJTURqTWt1V1lQekxIUm1wV1JKWlE9czk2LWMiLCJnaXZlbl9uYW1lIjoiQmVzaG95IiwiZmFtaWx5X25hbWUiOiJNb3JhZCIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjY3NjU0MTIwLCJleHAiOjE2Njc2NTc3MjAsImp0aSI6IjQ2ZGI4NjJlODMxOGM5MzgyODM0Y2RhNzI5MzAwNGE2YTg4ZWI5OGMifQ.n1atedEJ9FLvZr3_rMRV6F8_v--oATZbtRIZrQc2lvcs_wwnp0PjHj4MURKXjdIcgBO1n87vJiJbtCVKVUYycHiRtU3KeDaQTweYkl44M5KqBIauw1UE0nM3Cr6sBaWqqjNjAZNFwiIxtnCbQ81Lmnfg0aFBbNsziRE71SPej0Mjmt0LrDGVBCahu0XcplbnjSwXjxlg3PDPOvm28TYoQCiBinypMaXdcAGWk18V6XKeI7KBXfItIdAtYhr4yCouLjJevqOZO2BWKEbfT2WXjCjGQC6HqnXwzpP6bY0eCaDy17AduHhXIGPIlYKXx0AU48SEguVtH7vMza0o7O-hcg",
    });

    expect(response.status).toEqual(201);
  });

  it("try to sign up with google with same access token again", async () => {
    const response = await request.post("/signin/google").send({
      accessToken:
        // eslint-disable-next-line max-len
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImY0NTEzNDVmYWQwODEwMWJmYjM0NWNmNjQyYTJkYTkyNjdiOWViZWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNTE1MzU3NDU2NTQ0LXN1a3BqNXB1ZmlyMjc5Y3JpdWZmNHRpcmQwamQwYjBuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNTE1MzU3NDU2NTQ0LXN1a3BqNXB1ZmlyMjc5Y3JpdWZmNHRpcmQwamQwYjBuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA2MjUzODUxMjMwMzg5NjMxMzQ0IiwiZW1haWwiOiJib3NoYTM2OUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjhMU2tDSmxhemtvcm4xdXdrenhrSGciLCJuYW1lIjoiQmVzaG95IE1vcmFkIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTFWeUpIZmV1MF8zOUhqLWZBRjFJTURqTWt1V1lQekxIUm1wV1JKWlE9czk2LWMiLCJnaXZlbl9uYW1lIjoiQmVzaG95IiwiZmFtaWx5X25hbWUiOiJNb3JhZCIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjY3NjU0MTIwLCJleHAiOjE2Njc2NTc3MjAsImp0aSI6IjQ2ZGI4NjJlODMxOGM5MzgyODM0Y2RhNzI5MzAwNGE2YTg4ZWI5OGMifQ.n1atedEJ9FLvZr3_rMRV6F8_v--oATZbtRIZrQc2lvcs_wwnp0PjHj4MURKXjdIcgBO1n87vJiJbtCVKVUYycHiRtU3KeDaQTweYkl44M5KqBIauw1UE0nM3Cr6sBaWqqjNjAZNFwiIxtnCbQ81Lmnfg0aFBbNsziRE71SPej0Mjmt0LrDGVBCahu0XcplbnjSwXjxlg3PDPOvm28TYoQCiBinypMaXdcAGWk18V6XKeI7KBXfItIdAtYhr4yCouLjJevqOZO2BWKEbfT2WXjCjGQC6HqnXwzpP6bY0eCaDy17AduHhXIGPIlYKXx0AU48SEguVtH7vMza0o7O-hcg",
    });

    expect(response.status).toEqual(200);
  });

  it("try to verify the email with invalid token", async () => {
    const user = new User({
      username: "Besho",
      email: "besho@gmail.com",
    });
    await user.save();

    const response = await request.post(
      `/verify-email/${user._id}/invalidtoken`
    );

    expect(response.status).toEqual(403);
  });
  it("try to verify the email with invalid user id", async () => {
    const user = new User({
      username: "Besho",
      email: "besho@gmail.com",
    });
    await user.save();

    const token = new Token({
      userId: user._id,
      type: "verifyEmail",
      token: "token",
    });

    await token.save();

    const response = await request.post(
      `/verify-email/invalidId/${token.token}`
    );

    expect(response.status).toEqual(400);
  });
  it("try to verify the email with all valid parameters", async () => {
    const user = new User({
      username: "Besho",
      email: "besho@gmail.com",
    });
    await user.save();

    const token = new Token({
      userId: user._id,
      type: "verifyEmail",
      token: "token",
    });

    await token.save();

    const response = await request.post(
      `/verify-email/${user._id.toString()}/${token.token}`
    );

    expect(response.status).toEqual(200);
  });
});
