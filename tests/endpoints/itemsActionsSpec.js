import supertest from "supertest";
import app from "../../app.js";
import Post from "./../../models/Post.js";
import User from "../../models/User.js";
import Comment from "../../models/Comment.js";
import { generateJWT } from "../../utils/generateTokens.js";

const request = supertest(app);

// eslint-disable-next-line max-statements
fdescribe("Testing post, comment, and message actions endpoints", () => {
  let post = {},
    post1 = {},
    comment = {},
    // message = {},
    user1 = {},
    user2 = {},
    token1 = "",
    token2 = "";

  beforeAll(async () => {
    // Create 2 users with a post and comment to the first user
    user1 = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user1.save();
    token1 = generateJWT(user1);

    post = new Post({
      title: "post title",
      ownerUsername: user1.username,
      ownerId: user1._id,
      subredditName: "subreddit",
      kind: "text",
    });
    await post.save();

    post1 = new Post({
      title: "post title",
      ownerUsername: user1.username,
      ownerId: user1._id,
      subredditName: "subreddit",
      kind: "link",
    });
    await post1.save();

    comment = new Comment({
      parentId: post._id,
      parentType: "post",
      level: 1,
      content: "comment content",
      ownerUsername: user1.username,
      ownerId: user1._id,
    });
    await comment.save();

    // TODO add message here

    user2 = new User({
      username: "Beshoy",
      email: "beshoy@gmail.com",
    });
    await user2.save();
    token2 = generateJWT(user2);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
  });

  it("try to delete a post without jwt in the header", async () => {
    const response = await request.delete("/delete").send({
      id: post._id,
      type: "post",
    });
    expect(response.statusCode).toEqual(401);
  });
  it("try to delete a comment without jwt in the header", async () => {
    const response = await request.delete("/delete").send({
      id: comment._id,
      type: "comment",
    });
    expect(response.statusCode).toEqual(401);
  });
  // it("try to delete a message without jwt in the header", async () => {});

  it("try to delete a comment with different user", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: comment._id,
        type: "comment",
      })
      .set("Authorization", "Bearer " + token2);

    expect(response.statusCode).toEqual(401);
  });
  it("try to delete a post with different user", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: post._id,
        type: "post",
      })
      .set("Authorization", "Bearer " + token2);

    expect(response.statusCode).toEqual(401);
  });
  // it("try to delete a message with different user", async () => {});

  it("try to delete a post without id in the body", async () => {
    const response = await request
      .delete("/delete")
      .send({
        type: "post",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });
  it("try to delete a post without type in the body", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: post._id,
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });
  it("try to delete a post with invalid value of the type", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: post._id,
        type: "value",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });

  it("try to delete a comment without id in the body", async () => {
    const response = await request
      .delete("/delete")
      .send({
        type: "comment",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });
  it("try to delete a comment without type in the body", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: comment._id,
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });
  it("try to delete a comment with invalid value of the type", async () => {
    const response = await request
      .delete("/delete")
      .send({
        type: "value",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(400);
  });

  // it("try to delete a message without id in the body", async () => {});
  // it("try to delete a message without type in the body", async () => {});
  // it("try to delete a message with invalid value of the type", async () => {});

  it("try to delete a post with wrong id", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: "63680202b0000986dded331f",
        type: "post",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(404);
  });
  it("try to delete a comment with wrong id", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: "63680202b0000986dded331f",
        type: "comment",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(404);
  });
  // it("try to delete a message with wrong id", async () => {});

  it("try to delete a post with all valid parameters", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: post._id,
        type: "post",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(204);
  });
  it("try to delete a comment with all valid parameters", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: comment._id,
        type: "comment",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(204);
  });
  // it("try to delete a message with all valid parameters", async () => {});

  it("try to delete the same post again", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: post._id,
        type: "post",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(404);
  });
  it("try to delete the same comment again", async () => {
    const response = await request
      .delete("/delete")
      .send({
        id: comment._id,
        type: "comment",
      })
      .set("Authorization", "Bearer " + token1);

    expect(response.statusCode).toEqual(404);
  });
  // it("try to delete the same message again", async () => {});

  it("try to edit a post without jwt in the header", async () => {
    const response = await request.put("/edit-user-text").send({
      id: post._id,
      type: "post",
      text: "new text",
    });
    expect(response.statusCode).toEqual(401);
  });
  it("try to edit a comment without jwt in the header", async () => {
    const response = await request.put("/edit-user-text").send({
      id: comment._id,
      type: "comment",
      text: "new text",
    });
    expect(response.statusCode).toEqual(401);
  });

  it("try to edit a post of other user", async () => {
    const response = await request
      .put("/edit-user-text")
      .send({
        id: post._id,
        type: "post",
        text: "new text",
      })
      .set("Authorization", "Bearer " + token2);
    console.log(response);
    expect(response.statusCode).toEqual(401);
  });
  it("try to edit a comment of other user", async () => {
    const response = await request
      .put("/edit-user-text")
      .send({
        id: comment._id,
        type: "comment",
        text: "new text",
      })
      .set("Authorization", "Bearer " + token2);
    expect(response.statusCode).toEqual(401);
  });

  // it("try to edit a post that have no text", async () => {});

  // it("try to edit a post with invalid id", async () => {});
  // it("try to edit a comment with invalid id", async () => {});

  // it("try to edit a post without id in body", async () => {});
  // it("try to edit a comment without id in body", async () => {});

  // it("try to edit a post without type in body", async () => {});
  // it("try to edit a comment without type in body", async () => {});

  // it("try to edit a post with invalid type", async () => {});
  // it("try to edit a comment with invalid type", async () => {});

  // it("try to edit a post without text in body", async () => {});
  // it("try to edit a comment without text in body", async () => {});

  // it("try to edit a post with all valid parameters", async () => {});
  // it("try to edit a comment with all valid parameters", async () => {});
});
