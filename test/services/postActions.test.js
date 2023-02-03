/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
  getCommentedUsers,
  clearSuggestedSort,
  setSuggestedSort,
  downVoteAComment,
  upVoteAComment,
  validateHidePost,
  checkForDownVotedComments,
  markCommentAsSpam,
  unmarkCommentAsSpam,
  checkForUpVotedComments,
  searchForComment,
  searchForPost,
  downVoteAPost,
  upVoteAPost,
  checkForDownVotedPosts,
  checkForUpVotedPosts,
  checkForSavedPosts,
  markPostAsSpam,
  unmarkPostAsSpam,
  hideAPost,
  unhideAPost,
  unfollowPost,
  followPost,
  savePost,
  unSavePost,
  saveComment,
  unSaveComment,
  isUserMod,
} from "../../services/postActions.js";
import { connectDatabase, closeDatabaseConnection } from "../database.js";
import User from "./../../models/User.js";
import Post from "./../../models/Post.js";
import Comment from "./../../models/Comment.js";
import Subreddit from "../../models/Community.js";

// eslint-disable-next-line max-statements
describe("Testing post actions functions", () => {
  let userOne = {},
    userTwo = {},
    userThree = {},
    postOne = {},
    commentOne = {},
    postTwo = {},
    privateSubreddit = {},
    commentTwo = {};
  beforeAll(async () => {
    await connectDatabase();

    userOne = await new User({
      username: "Noaman",
      email: "abdelrahmannoaman1@gmail.com",
      createdAt: Date.now(),
    }).save();

    userTwo = await new User({
      username: "Hamdy",
      email: "bodynoaman1996@gmail.com",
      createdAt: Date.now(),
    }).save();

    userThree = await new User({
      username: "Beshoy",
      email: "Bosha@gmail.com",
      createdAt: Date.now(),
    }).save();

    postOne = await new Post({
      title: "Noaman post",
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      createdAt: Date.now(),
      usersCommented: [userOne.id],
    }).save();

    privateSubreddit = await new Subreddit({
      title: "privateSubreddit",
      viewName: "privateSubreddit",
      category: "Art",
      type: "Public",
      nsfw: false,
      owner: {
        username: "Noaman",
        userID: userOne.Id,
      },
      moderators: [
        {
          userId: userOne._id,
          dateOfModeration: Date.now(),
        },
      ],
      dateOfCreation: Date.now(),
      subredditSettings: {
        sendWelcomeMessage: true,
        welcomeMessage: "ahlann w sahlan",
      },
    }).save();

    postTwo = await new Post({
      title: "Noaman post2",
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      createdAt: Date.now(),
      usersCommented: [userOne.id],
      subredditName: "privateSubreddit",
      subredditId: privateSubreddit._id,
    }).save();

    commentTwo = await new Comment({
      parentId: postOne.id,
      parentType: "post",
      postId: postOne.id,
      level: 1,
      createdAt: Date.now(),
      ownerUsername: "Hamdy",
      ownerId: userOne.id,
      content: "Wonderful post",
    }).save();

    commentOne = await new Comment({
      parentId: postOne.id,
      parentType: "post",
      postId: postOne.id,
      level: 1,
      createdAt: Date.now(),
      ownerUsername: "Noaman",
      ownerId: userOne.id,
      content: "Hamdy da mention",
    }).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Subreddit.deleteMany({});
    await closeDatabaseConnection();
  });

  it("should have getCommentedUsers function", () => {
    expect(getCommentedUsers).toBeDefined();
  });

  it("try getCommentedUsers function if the post has 1 commented user", async () => {
    const result = await getCommentedUsers(postOne.id);
    expect(result.statusCode).toEqual(200);
    expect(result.data.usernames.length).toEqual(1);
  });

  it("should have clearSuggestedSort function", () => {
    expect(clearSuggestedSort).toBeDefined();
  });

  it("try clearSuggestedSort function to a post while you are the owner", async () => {
    const result = await clearSuggestedSort(postOne.id, userOne);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("post-suggested sort is best now");
  });

  it("try clearSuggestedSort function to a post while you are not the owner", async () => {
    try {
      await clearSuggestedSort(postOne.id, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(401);
      expect(e.message).toEqual("You don't have the right to do this action");
    }
  });

  it("should have setSuggestedSort function", () => {
    expect(setSuggestedSort).toBeDefined();
  });

  it("try setSuggestedSort function to a post while you are the owner", async () => {
    const result = await setSuggestedSort(postOne.id, userOne, "hot");
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("post-suggested sort is hot now");
  });

  it("try clearSuggestedSort function to a post while you are not the owner", async () => {
    try {
      await setSuggestedSort(postOne.id, userTwo, "hot");
    } catch (e) {
      expect(e.statusCode).toEqual(401);
      expect(e.message).toEqual("You don't have the right to do this action");
    }
  });

  it("should have downVoteAComment function", () => {
    expect(downVoteAComment).toBeDefined();
  });

  it("try downVoteAComment function to a comment that didn't made anything to before", async () => {
    const result = await downVoteAComment(commentOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Comment is Downvoted successfully");
  });
  it("should have upVoteAComment function", () => {
    expect(upVoteAComment).toBeDefined();
  });

  it("try upVoteAComment function to a comment that was downvoted", async () => {
    const result = await upVoteAComment(commentOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Comment is Upvoted successfully");
  });

  it("try upVoteAComment function to a comment that was upvoted before", async () => {
    const result = await upVoteAComment(commentOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Comment upvote is cancelled successfully");
  });

  it("try downVoteAComment function to a comment that was upvoted", async () => {
    await upVoteAComment(commentOne, userThree);
    const result = await downVoteAComment(commentOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Comment is Downvoted successfully");
  });

  it("try downVoteAComment function to a comment that was downvoted before", async () => {
    const result = await downVoteAComment(commentOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual(
      "Comment downvote is cancelled successfully"
    );
  });

  it("should have checkForDownVotedComments function", () => {
    expect(checkForDownVotedComments).toBeDefined();
  });
  it("try checkForDownVotedComments function to a check if the comment was downVoted before or not while it was downVoted", async () => {
    await downVoteAComment(commentOne, userTwo);
    const result = checkForDownVotedComments(commentOne, userTwo);
    expect(result).toEqual(true);
  });

  it("try checkForDownVotedComments function to a check if the comment was downVoted before or not while it wasn't downVoted", async () => {
    await downVoteAComment(commentOne, userTwo);
    const result = checkForDownVotedComments(commentOne, userTwo);
    expect(result).toEqual(false);
  });

  it("should have checkForUpVotedComments function", () => {
    expect(checkForUpVotedComments).toBeDefined();
  });

  it("try checkForUpVotedComments function to a check if the comment was downVoted before or not while it was downVoted", async () => {
    await upVoteAComment(commentOne, userTwo);
    const result = checkForUpVotedComments(commentOne, userTwo);
    expect(result).toEqual(true);
  });

  it("try checkForUpVotedComments function to a check if the comment was downVoted before or not while it wasn't downVoted", async () => {
    await upVoteAComment(commentOne, userTwo);
    const result = checkForUpVotedComments(commentOne, userTwo);
    expect(result).toEqual(false);
  });

  it("should have downVoteAPost function", () => {
    expect(downVoteAPost).toBeDefined();
  });

  it("try downVoteAPost function to a post that wasn't upvoted neither downvoted", async () => {
    const result = await downVoteAPost(postOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post is Downvoted successfully");
  });

  it("try downVoteAPost function to a post that was upvoted", async () => {
    await upVoteAPost(postOne, userThree);
    const result = await downVoteAPost(postOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post is Downvoted successfully");
  });

  it("try downVoteAPost function to a post that was downvoted", async () => {
    const result = await downVoteAPost(postOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post downvote is cancelled successfully");
  });

  it("should have upVoteAPost function", () => {
    expect(upVoteAPost).toBeDefined();
  });

  it("try upVoteAPost function to a post that wasn't upvoted neither downvoted", async () => {
    const result = await upVoteAPost(postOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post is Upvoted successfully");
  });

  it("try upVoteAPost function to a post that was upvoted", async () => {
    const result = await upVoteAPost(postOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post upvote is cancelled successfully");
  });

  it("try upVoteAPost function to a post that was downvoted", async () => {
    await downVoteAPost(postOne, userThree);
    const result = await upVoteAPost(postOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post is Upvoted successfully");
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have checkForDownVotedPosts function", () => {
    expect(checkForDownVotedPosts).toBeDefined();
  });

  it("try checkForDownVotedPosts function to a check if the comment was downVoted before or not while it was downVoted", async () => {
    await downVoteAPost(postOne, userTwo);
    const result = checkForDownVotedPosts(postOne, userTwo);
    expect(result).toEqual(true);
  });

  it("try checkForDownVotedPosts function to a check if the comment was downVoted before or not while it wasn't downVoted", async () => {
    const result = checkForDownVotedPosts(postOne, userThree);
    expect(result).toEqual(false);
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have checkForUpVotedPosts function", () => {
    expect(checkForUpVotedPosts).toBeDefined();
  });

  it("try checkForUpVotedPosts function to a check if the comment was downVoted before or not while it was downVoted", async () => {
    await upVoteAPost(postOne, userTwo);
    const result = checkForUpVotedPosts(postOne, userTwo);
    expect(result).toEqual(true);
  });

  it("try checkForUpVotedComments function to a check if the comment was downVoted before or not while it wasn't downVoted", async () => {
    await upVoteAPost(postOne, userTwo);
    const result = checkForUpVotedPosts(postOne, userTwo);
    expect(result).toEqual(false);
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have markCommentAsSpam function", () => {
    expect(markCommentAsSpam).toBeDefined();
  });

  it("try markCommentAsSpam function to a mark a comment as a spam", async () => {
    const result = await markCommentAsSpam(commentOne, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Comment is spammed successfully");
  });

  it("try markCommentAsSpam function to a mark a comment as a spam but it was spammed before", async () => {
    try {
      await markCommentAsSpam(commentOne, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(409);
      expect(e.message).toEqual("This Comment is already spammed");
    }
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have isUserMod function", () => {
    expect(isUserMod).toBeDefined();
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have unmarkCommentAsSpam function", () => {
    expect(unmarkCommentAsSpam).toBeDefined();
  });

  it("try unmarkCommentAsSpam function to a mark a comment as a spam", async () => {
    const result = await unmarkCommentAsSpam(commentOne, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Comment is unspammed successfully");
  });

  it("try markCommentAsSpam function to a mark a comment as a spam but it was spammed before", async () => {
    try {
      await unmarkCommentAsSpam(commentOne, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(409);
      expect(e.message).toEqual("This comment is already unspammed");
    }
  });

  //-------------------------------------------------------------------------------------------------------
  it("should have markPostAsSpam function", () => {
    expect(markPostAsSpam).toBeDefined();
  });

  it("try markPostAsSpam function to a mark a post as a spam", async () => {
    const result = await markPostAsSpam(postOne, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post is spammed successfully");
  });

  it("try markPostAsSpam function to a mark a post as a spam but it was spammed before", async () => {
    try {
      await markPostAsSpam(postOne, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(409);
      expect(e.message).toEqual("This Post is already spammed");
    }
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have unmarkPostAsSpam function", () => {
    expect(unmarkPostAsSpam).toBeDefined();
  });

  it("try unmarkPostAsSpam function to a mark a comment as a spam", async () => {
    const result = await unmarkPostAsSpam(postOne, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post is unspammed successfully");
  });

  it("try unmarkPostAsSpam function to a mark a comment as a spam but it was spammed before", async () => {
    try {
      await unmarkPostAsSpam(postOne, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(409);
      expect(e.message).toEqual("This Post is already unspammed");
    }
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have hideAPost function", () => {
    expect(hideAPost).toBeDefined();
  });

  it("try hideAPost function to hide a post that wasn't hidden", async () => {
    const result = await hideAPost(postTwo, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post is hidden successfully");
  });

  it("try hideAPost function to hide a post that was already hidden", async () => {
    try {
      await hideAPost(postTwo, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(409);
      expect(e.message).toEqual("This Post is already hidden");
    }
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have unhideAPost function", () => {
    expect(unhideAPost).toBeDefined();
  });

  it("try unhideAPost function to unhide a post", async () => {
    const result = await unhideAPost(postTwo, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post is unhidden successfully");
  });

  it("try unhideAPost function to unhide a post that was already hidden", async () => {
    try {
      await unhideAPost(postTwo, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This Post is not hidden already");
    }
  });

  //-------------------------------------------------------------------------------------------------------
  it("should have followPost function", () => {
    expect(followPost).toBeDefined();
  });

  it("try followPost function to follow a post that wasn't followed", async () => {
    const result = await followPost(postOne, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual(
      "Followed! You will get updates when there is new activity."
    );
  });

  it("try followPost function to follow a post that was already followed", async () => {
    try {
      await followPost(postOne, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This Post is already followed");
    }
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have unfollowPost function", () => {
    expect(unfollowPost).toBeDefined();
  });

  it("try unfollowPost function to unfollow a post", async () => {
    const result = await unfollowPost(postOne, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual(
      "Unfollowed. You will not get updates on this post anymore."
    );
  });

  it("try unfollowPost function to unfollow a post that was already unfollowed", async () => {
    try {
      await unfollowPost(postOne, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This Post is not followed already");
    }
  });

  //-------------------------------------------------------------------------------------------------------
  it("should have savePost function", () => {
    expect(savePost).toBeDefined();
  });

  it("try savePost function to save a post that wasn't saved", async () => {
    await savePost(postOne, userTwo);
    const result = await savePost(postTwo, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post is saved successfully");
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have unSavePost function", () => {
    expect(unSavePost).toBeDefined();
  });

  it("try unSavePost function to unsave a post", async () => {
    const result = await unSavePost(postTwo, userTwo);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("Post is unsaved successfully");
  });

  it("try unSavePost function to unsave a post that was already unsaved", async () => {
    try {
      await unSavePost(postTwo, userOne);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This Post is not saved already");
    }
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have saveComment function", () => {
    expect(saveComment).toBeDefined();
  });

  it("try saveComment function to save a comment that wasn't saved", async () => {
    await saveComment(commentOne, userThree);
    const result = await saveComment(commentTwo, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("comment is saved successfully");
  });
  it("try saveComment function to save a comment that was already saved", async () => {
    try {
      await unSaveComment(commentTwo, userThree);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This Comment is not saved already");
    }
  });

  //-------------------------------------------------------------------------------------------------------
  it("should have unSaveComment function", () => {
    expect(unSaveComment).toBeDefined();
  });

  it("try unSaveComment function to unsave a post", async () => {
    const result = await unSaveComment(commentOne, userThree);
    expect(result.statusCode).toEqual(200);
    expect(result.message).toEqual("comment is unsaved successfully");
  });

  it("try unSaveComment function to unsave a comment that was already unsaved", async () => {
    try {
      await unSaveComment(commentTwo, userTwo);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("This Comment is not saved already");
    }
  });
  //-------------------------------------------------------------------------------------------------------
  it("should have validateHidePost function", () => {
    expect(validateHidePost).toBeDefined();
  });

  it("try validateHidePost function to validate request body while there is id", async () => {
    await validateHidePost({
      body: {
        id: postOne.id,
      },
    });
    const where = "we are here";
    expect(where).toEqual("we are here");
  });

  it("try validateHidePost function to validate request body while there is no id", async () => {
    try {
      await validateHidePost({ body: {} });
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("you must enter the id of the post");
    }
  });

  it("should have searchForPost function", () => {
    expect(searchForPost).toBeDefined();
  });
  it("try searchForPost function with invalid id", async () => {
    try {
      await searchForPost("hamada");
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Invalid post id");
    }
  });
  it("try searchForPost function with invalid id part 2", async () => {
    try {
      await searchForPost(commentOne.id);
    } catch (e) {
      expect(e.statusCode).toEqual(404);
      expect(e.message).toEqual("This post isn't found");
    }
  });

  it("should have searchForComment function", () => {
    expect(searchForComment).toBeDefined();
  });
  it("try searchForComment function with invalid id", async () => {
    try {
      await searchForComment("hamada");
    } catch (e) {
      expect(e.statusCode).toEqual(400);
      expect(e.message).toEqual("Invalid comment id");
    }
  });
  it("try searchForComment function with invalid id part 2", async () => {
    try {
      await searchForComment(postOne.id);
    } catch (e) {
      expect(e.statusCode).toEqual(404);
      expect(e.message).toEqual("This comment isn't found");
    }
  });
});
