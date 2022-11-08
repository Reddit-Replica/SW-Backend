import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import Token from "./../../models/VerifyToken.js";
const request = supertest(app);

// eslint-disable-next-line max-statements
xdescribe("Testing login endpoints", () => {
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
});
