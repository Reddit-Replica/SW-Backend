import supertest from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import Message from "../../models/Message.js";
import { generateJWT } from "../../utils/generateTokens.js";
import { hashPassword } from "../../utils/passwordUtils.js";

const request = supertest(app);

// eslint-disable-next-line max-statements
fdescribe("Testing Read-all-msgs endpoint", () => {
  let user, token;
  beforeAll(async () => {
    const postReply = await new Message({
      type: "postReply",
      text: "Message text",
      senderUsername: "Ahmed",
      receiverUsername: "Mohamed",
      subject: "Message Subject",
    }).save();
    const usernameMention = await new Message({
      type: "usernameMention",
      text: "Message text",
      senderUsername: "Ahmed",
      receiverUsername: "Mohamed",
      subject: "Message Subject",
    }).save();
    const message = await new Message({
      type: "privateMessage",
      text: "Message text",
      senderUsername: "Ahmed",
      receiverUsername: "Mohamed",
      subject: "Message Subject",
    }).save();
    user = await new User({
      username: "Ahmed",
      password: hashPassword("12345678"),
      email: "ahmed@gmail.com",
      receivedMessages: [message.id],
      postReplies: [postReply.id],
      usernameMentions: [usernameMention.id],
    }).save();
    token = generateJWT(user);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
  });

  it("Read messages without token", async () => {
    const response = await request.patch("/read-all-msgs").send({
      type: "Messages",
    });

    expect(response.statusCode).toEqual(401);
  });

  it("Read username mentions", async () => {
    const response = await request
      .patch("/read-all-msgs")
      .send({
        type: "Username Mentions",
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(200);
    const msg = await Message.findById(user.usernameMentions[0]);
    expect(msg.isRead).toBeTruthy();
  });

  it("Read post replies", async () => {
    const response = await request
      .patch("/read-all-msgs")
      .send({
        type: "Post Replies",
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(200);
    const msg = await Message.findById(user.postReplies[0]);
    expect(msg.isRead).toBeTruthy();
  });

  it("Read received messages", async () => {
    const response = await request
      .patch("/read-all-msgs")
      .send({
        type: "Messages",
      })
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toEqual(200);
    const msg = await Message.findById(user.receivedMessages[0]);
    expect(msg.isRead).toBeTruthy();
  });
});
