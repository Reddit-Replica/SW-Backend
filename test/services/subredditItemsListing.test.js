/* eslint-disable max-len */
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import {
  listingSubredditPosts,
  listingSubredditComments,
} from "../../services/subredditItemsListing.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Subreddit from "./../../models/Community.js";
import Comment from "./../../models/Comment.js";
import mongoose from "mongoose";

// eslint-disable-next-line max-statements
describe("Testing Subreddit Items Listing Service functions", () => {
  let user = {},
    subreddit = {},
    post1 = {},
    post2 = {},
    post3 = {},
    comment1 = {},
    comment2 = {},
    comment3 = {};
  // eslint-disable-next-line max-statements
  beforeAll(async () => {
    await connectDatabase();

    user = await new User({
      username: "hamdy",
      email: "hamdy@gmail.com",
      createdAt: Date.now(),
    }).save();

    subreddit = await new Subreddit({
      title: "subreddit",
      viewName: "SR",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: "hamdy",
        userID: user.id,
      },
      createdAt: Date.now(),
    }).save();

    post1 = new Post({
      title: "First post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await post1.save();

    post2 = new Post({
      title: "Second Post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 3,
      createdAt: Date.now() + 10,
    });
    await post2.save();

    post3 = new Post({
      title: "Third post",
      ownerUsername: user.username,
      ownerId: user._id,
      subredditName: "subreddit",
      kind: "hybrid",
      numberOfVotes: 1,
      createdAt: Date.now() + 20,
    });
    await post3.save();

    comment1 = new Comment({
      parentId: post1._id,
      postId: post1._id,
      parentType: "post",
      level: 1,
      content: [{ insert: "Comment 1" }],
      ownerId: user._id,
      ownerUsername: user.username,
      subredditName: "subreddit",
      numberOfVotes: 5,
      createdAt: Date.now(),
    });
    await comment1.save();

    comment2 = new Comment({
      parentId: post2._id,
      postId: post2._id,
      parentType: "post",
      level: 1,
      content: [{ insert: "Comment 2" }],
      ownerId: user._id,
      ownerUsername: user.username,
      subredditName: "subreddit",
      numberOfVotes: 4,
      createdAt: Date.now() + 10,
    });
    await comment2.save();

    comment3 = new Comment({
      parentId: post3._id,
      postId: post3._id,
      parentType: "post",
      level: 2,
      content: [{ insert: "Comment 3" }],
      ownerId: user._id,
      ownerUsername: user.username,
      numberOfVotes: 4,
      createdAt: Date.now() + 20,
    });
    await comment3.save();

    subreddit.subredditPosts.push(post1.id, post2.id, post3.id);
    subreddit.spammedPosts.push(post1.id, post2.id, post3.id);
    subreddit.editedPosts.push(post1.id, post2.id, post3.id);
    subreddit.unmoderatedPosts.push(post1.id, post2.id, post3.id);

    subreddit.spammedComments.push(comment1.id, comment2.id, comment3.id);
    subreddit.editedComments.push(comment1.id, comment2.id, comment3.id);
    await subreddit.save();
  });
  afterAll(async () => {
    await User.deleteMany({});
    await Comment.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await closeDatabaseConnection();
  });

  it("Should have listingSubredditPosts defined", () => {
    expect(listingSubredditPosts).toBeDefined();
  });

  it("(SPAMMED POSTS) Test listingSubredditPosts without before/after/limit/sort", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "spammedPosts",
      {}
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(SPAMMED POSTS) Test listingSubredditPosts with new sort but without before/after/limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "spammedPosts",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(SPAMMED POSTS) Test listingSubredditPosts with old sort but without before/after/limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "spammedPosts",
      { sort: "old" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post1.id.toString());
    expect(result.data.after.toString()).toEqual(post3.id.toString());
  });

  it("(SPAMMED POSTS) Test new listingSubredditPosts with before & limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "spammedPosts",
      { sort: "new", limit: 1, before: post2.id.toString() }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post3.id.toString());
  });

  it("(SPAMMED POSTS) Test new listingSubredditPosts with before only", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "spammedPosts",
      { sort: "new", before: post1.id.toString() }
    );
    expect(result.data.children.length).toEqual(2);
    expect(result.data.after.toString()).toEqual(post2.id.toString());
    expect(result.data.before.toString()).toEqual(post3.id.toString());
  });

  it("(SPAMMED POSTS) Test new listingSubredditPosts with before only returning no data", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "spammedPosts",
      { sort: "new", before: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(0);
    expect(result.data.after).toEqual("");
    expect(result.data.before).toEqual("");
  });

  it("(SPAMMED POSTS) Test new listingSubredditPosts with after only", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "spammedPosts",
      { sort: "new", after: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(2);
    expect(result.data.before.toString()).toEqual(post2.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(SPAMMED POSTS) Test new listingSubredditPosts with after only & limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "spammedPosts",
      { sort: "new", limit: 1, after: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(post2.id.toString());
    expect(result.data.after.toString()).toEqual(post2.id.toString());
  });

  it("(SPAMMED POSTS) Test new listingSubredditPosts with both after & before", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "spammedPosts",
      { sort: "new", after: post3.id.toString(), before: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(EDITED POSTS) Test listingSubredditPosts without before/after/limit/sort", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "editedPosts",
      {}
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(EDITED POSTS) Test listingSubredditPosts with new sort but without before/after/limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "editedPosts",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(EDITED POSTS) Test listingSubredditPosts with old sort but without before/after/limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "editedPosts",
      { sort: "old" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post1.id.toString());
    expect(result.data.after.toString()).toEqual(post3.id.toString());
  });

  it("(EDITED POSTS) Test new listingSubredditPosts with before & limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "editedPosts",
      { sort: "new", limit: 1, before: post2.id.toString() }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post3.id.toString());
  });

  it("(EDITED POSTS) Test new listingSubredditPosts with before only", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "editedPosts",
      { sort: "new", before: post1.id.toString() }
    );
    expect(result.data.children.length).toEqual(2);
    expect(result.data.after.toString()).toEqual(post2.id.toString());
    expect(result.data.before.toString()).toEqual(post3.id.toString());
  });

  it("(EDITED POSTS) Test new listingSubredditPosts with before only returning no data", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "editedPosts",
      { sort: "new", before: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(0);
    expect(result.data.after).toEqual("");
    expect(result.data.before).toEqual("");
  });

  it("(EDITED POSTS) Test new listingSubredditPosts with after only", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "editedPosts",
      { sort: "new", after: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(2);
    expect(result.data.before.toString()).toEqual(post2.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(EDITED POSTS) Test new listingSubredditPosts with after only & limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "editedPosts",
      { sort: "new", limit: 1, after: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(post2.id.toString());
    expect(result.data.after.toString()).toEqual(post2.id.toString());
  });

  it("(EDITED POSTS) Test new listingSubredditPosts with both after & before", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "editedPosts",
      { sort: "new", after: post3.id.toString(), before: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(UNMODERATED POSTS) Test listingSubredditPosts without before/after/limit/sort", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      {}
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(UNMODERATED POSTS) Test listingSubredditPosts with new sort but without before/after/limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(UNMODERATED POSTS) Test listingSubredditPosts with old sort but without before/after/limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "old" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post1.id.toString());
    expect(result.data.after.toString()).toEqual(post3.id.toString());
  });

  it("(UNMODERATED POSTS) Test new listingSubredditPosts with before & limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "new", limit: 1, before: post2.id.toString() }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post3.id.toString());
  });

  it("(UNMODERATED POSTS) Test new listingSubredditPosts with before only", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "new", before: post1.id.toString() }
    );
    expect(result.data.children.length).toEqual(2);
    expect(result.data.after.toString()).toEqual(post2.id.toString());
    expect(result.data.before.toString()).toEqual(post3.id.toString());
  });

  it("(UNMODERATED POSTS) Test new listingSubredditPosts with before only returning no data", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "new", before: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(0);
    expect(result.data.after).toEqual("");
    expect(result.data.before).toEqual("");
  });

  it("(UNMODERATED POSTS) Test new listingSubredditPosts with after only", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "new", after: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(2);
    expect(result.data.before.toString()).toEqual(post2.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(UNMODERATED POSTS) Test new listingSubredditPosts with after only & limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "new", limit: 1, after: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(post2.id.toString());
    expect(result.data.after.toString()).toEqual(post2.id.toString());
  });

  it("(UNMODERATED POSTS) Test new listingSubredditPosts with both after & before", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "new", after: post3.id.toString(), before: post3.id.toString() }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("(UNMODERATED POSTS) Test new listingSubredditPosts with negative limit", async () => {
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "new", limit: -5 }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post3.id.toString());
  });

  it("(UNMODERATED POSTS) Test new listingSubredditPosts with flags set", async () => {
    user.savedPosts.push(post1.id);
    user.upvotedPosts.push(post1.id);
    user.downvotedPosts.push(post1.id);
    await user.save();
    const result = await listingSubredditPosts(
      user.id,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(post3.id.toString());
    expect(result.data.after.toString()).toEqual(post1.id.toString());
  });

  it("Test listingSubredditPosts with invalid subreddit name", async () => {
    const result = await listingSubredditPosts(
      user.id,
      "invalidSR",
      "unmoderatedPosts",
      { sort: "new", after: post3.id.toString(), before: post3.id.toString() }
    );
    expect(result.statusCode).toEqual(404);
  });

  it("Test listingSubredditPosts with invalid moderator ID", async () => {
    const invalidId = mongoose.Types.ObjectId.generate(10);
    const result = await listingSubredditPosts(
      invalidId,
      subreddit.title,
      "unmoderatedPosts",
      { sort: "new", after: post3.id.toString(), before: post3.id.toString() }
    );
    expect(result.statusCode).toEqual(404);
  });

  it("Test listingSubredditComments with invalid subreddit name", async () => {
    const result = await listingSubredditComments(
      user.id,
      "invalidSR",
      "spammedComments",
      {
        sort: "new",
        after: comment3.id.toString(),
        before: comment3.id.toString(),
      }
    );
    expect(result.statusCode).toEqual(404);
  });

  it("Test listingSubredditComments with invalid moderator ID", async () => {
    const invalidId = mongoose.Types.ObjectId.generate(10);
    const result = await listingSubredditComments(
      invalidId,
      subreddit.title,
      "spammedComments",
      {
        sort: "new",
        after: comment3.id.toString(),
        before: comment3.id.toString(),
      }
    );
    expect(result.statusCode).toEqual(404);
  });

  it("Should have listingSubredditComments defined", () => {
    expect(listingSubredditComments).toBeDefined();
  });

  it("(SPAMMED COMMENTS) Test listingSubredditComments without before/after/limit/sort", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
    expect(result.data.after.toString()).toEqual(comment1.id.toString());
  });

  it("(SPAMMED COMMENTS) Test listingSubredditComments with new sort but without before/after/limit", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
    expect(result.data.after.toString()).toEqual(comment1.id.toString());
  });

  it("(SPAMMED COMMENTS) Test listingSubredditComments with old sort but without before/after/limit", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      { sort: "old" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(comment1.id.toString());
    expect(result.data.after.toString()).toEqual(comment3.id.toString());
  });

  it("(SPAMMED COMMENTS) Test new listingSubredditComments with before & limit", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      { sort: "new", limit: 1, before: comment2.id.toString() }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
    expect(result.data.after.toString()).toEqual(comment3.id.toString());
  });

  it("(SPAMMED COMMENTS) Test new listingSubredditComments with before only", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      { sort: "new", before: comment1.id.toString() }
    );
    expect(result.data.children.length).toEqual(2);
    expect(result.data.after.toString()).toEqual(comment2.id.toString());
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
  });

  it("(SPAMMED COMMENTS) Test new listingSubredditComments with before only returning no data", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      { sort: "new", before: comment3.id.toString() }
    );
    expect(result.data.children.length).toEqual(0);
    expect(result.data.after).toEqual("");
    expect(result.data.before).toEqual("");
  });

  it("(SPAMMED COMMENTS) Test new listingSubredditComments with after only returning no data", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      { sort: "new", after: comment1.id.toString() }
    );
    expect(result.data.children.length).toEqual(0);
    expect(result.data.after).toEqual("");
    expect(result.data.before).toEqual("");
  });

  it("(SPAMMED COMMENTS) Test new listingSubredditComments with after only", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      { sort: "new", after: comment3.id.toString() }
    );
    expect(result.data.children.length).toEqual(2);
    expect(result.data.before.toString()).toEqual(comment2.id.toString());
    expect(result.data.after.toString()).toEqual(comment1.id.toString());
  });

  it("(SPAMMED COMMENTS) Test new listingSubredditComments with after only & limit", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      { sort: "new", limit: 1, after: comment3.id.toString() }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(comment2.id.toString());
    expect(result.data.after.toString()).toEqual(comment2.id.toString());
  });

  it("(SPAMMED COMMENTS) Test new listingSubredditComments with both after & before", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      {
        sort: "new",
        after: comment3.id.toString(),
        before: comment3.id.toString(),
      }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
    expect(result.data.after.toString()).toEqual(comment1.id.toString());
  });

  it("(SPAMMED COMMENTS) Test new listingSubredditComments with flags set", async () => {
    user.savedComments.push(comment1.id);
    user.upvotedComments.push(comment1.id);
    user.downvotedComments.push(comment1.id);
    await user.save();
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "spammedComments",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
    expect(result.data.after.toString()).toEqual(comment1.id.toString());
  });

  it("(EDITED COMMENTS) Test listingSubredditComments without before/after/limit/sort", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "editedComments",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
    expect(result.data.after.toString()).toEqual(comment1.id.toString());
  });

  it("(EDITED COMMENTS) Test listingSubredditComments with new sort but without before/after/limit", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "editedComments",
      { sort: "new" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
    expect(result.data.after.toString()).toEqual(comment1.id.toString());
  });

  it("(EDITED COMMENTS) Test listingSubredditComments with old sort but without before/after/limit", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "editedComments",
      { sort: "old" }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(comment1.id.toString());
    expect(result.data.after.toString()).toEqual(comment3.id.toString());
  });

  it("(EDITED COMMENTS) Test new listingSubredditComments with before & limit", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "editedComments",
      { sort: "new", limit: 1, before: comment2.id.toString() }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
    expect(result.data.after.toString()).toEqual(comment3.id.toString());
  });

  it("(EDITED COMMENTS) Test new listingSubredditComments with before only", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "editedComments",
      { sort: "new", before: comment1.id.toString() }
    );
    expect(result.data.children.length).toEqual(2);
    expect(result.data.after.toString()).toEqual(comment2.id.toString());
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
  });

  it("(EDITED COMMENTS) Test new listingSubredditComments with before only returning no data", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "editedComments",
      { sort: "new", before: comment3.id.toString() }
    );
    expect(result.data.children.length).toEqual(0);
    expect(result.data.after).toEqual("");
    expect(result.data.before).toEqual("");
  });

  it("(EDITED COMMENTS) Test new listingSubredditComments with after only returning no data", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "editedComments",
      { sort: "new", after: comment1.id.toString() }
    );
    expect(result.data.children.length).toEqual(0);
    expect(result.data.after).toEqual("");
    expect(result.data.before).toEqual("");
  });

  it("(EDITED COMMENTS) Test new listingSubredditComments with after only", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "editedComments",
      { sort: "new", after: comment3.id.toString() }
    );
    expect(result.data.children.length).toEqual(2);
    expect(result.data.before.toString()).toEqual(comment2.id.toString());
    expect(result.data.after.toString()).toEqual(comment1.id.toString());
  });

  it("(EDITED COMMENTS) Test new listingSubredditComments with after only & limit", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "editedComments",
      { sort: "new", limit: 1, after: comment3.id.toString() }
    );
    expect(result.data.children.length).toEqual(1);
    expect(result.data.before.toString()).toEqual(comment2.id.toString());
    expect(result.data.after.toString()).toEqual(comment2.id.toString());
  });

  it("(EDITED COMMENTS) Test new listingSubredditComments with both after & before", async () => {
    const result = await listingSubredditComments(
      user.id,
      subreddit.title,
      "editedComments",
      {
        sort: "new",
        after: comment3.id.toString(),
        before: comment3.id.toString(),
      }
    );
    expect(result.data.children.length).toEqual(3);
    expect(result.data.before.toString()).toEqual(comment3.id.toString());
    expect(result.data.after.toString()).toEqual(comment1.id.toString());
  });
});
