import User from "../models/User.js";
import { body, check, query } from "express-validator";
import {
  checkSameUserEditing,
  editPostService,
} from "../services/postServices.js";
const postIdValidator = [
  query("id").not().isEmpty().withMessage("Id can't be empty"),
];

const pinPostValidator = [
  body("id").not().isEmpty().withMessage("Id can't be empty"),
  body("pin").not().isEmpty().withMessage("Pin/unpin flag is required"),
];

const submitValidator = [
  body("kind").not().isEmpty().withMessage("Post kind can't be empty"),
  check("kind").isIn(["hybrid", "link", "image", "video", "post"]),
  body("title").not().isEmpty().withMessage("Post title can't be empty"),
  body("inSubreddit").not().isEmpty().withMessage("Post place can't be empty"),
];

const editValidator = [
  body("content").not().isEmpty().withMessage("Content can't be empty"),
  body("postId").not().isEmpty().withMessage("postId can't be empty"),
];

const submit = async (req, res) => {
  const user = req.user;
  const post = req.post;
  try {
    await post.save();
    await user.save();
    res.status(201).json({
      id: post.id.toString(),
    });
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

const pinPost = async (req, res) => {
  const user = req.user;
  const postId = req.postId;
  try {
    if (req.body.pin) {
      user.pinnedPosts.push(postId);
      await user.save();
      res.status(200).json("Post pinned successfully!");
    } else {
      user.pinnedPosts = user.pinnedPosts.filter(
        (id) => id.toString() !== postId
      );
      await user.save();
      res.status(200).json("Post unpinned successfully!");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

const getPinnedPosts = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await User.findById(userId).populate("pinnedPosts");
    user.pinnedPosts = user.pinnedPosts.filter((post) => !post.deletedAt);
    const pinnedPosts = user.pinnedPosts.map((post) => {
      let vote = 0;
      if (
        user.upvotedPosts.find(
          (postId) => postId.toString() === post.id.toString()
        )
      ) {
        vote = 1;
      } else if (
        user.downvotedPosts.find(
          (postId) => postId.toString() === post.id.toString()
        )
      ) {
        vote = -1;
      }
      return {
        id: post.id.toString(),
        kind: post.kind,
        subreddit: post.subredditName,
        link: post.link,
        images: post.images,
        video: post.video,
        content: post.content,
        nsfw: post.nsfw,
        spoiler: post.spoiler,
        title: post.title,
        sharePostId: post.sharePostId,
        flair: post.flair,
        comments: post.numberOfComments,
        votes: post.numberOfVotes,
        postedAt: post.createdAt,
        postedBy: post.ownerUsername,
        vote: vote,
      };
    });
    return res.status(200).json({
      pinnedPosts: pinnedPosts,
    });
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

const postDetails = async (req, res) => {
  return res.status(200).json(req.postObj);
};

const postInsights = async (req, res) => {
  try {
    return res.status(200).json({
      totalViews: req.post.insights.totalViews,
      upvoteRate: req.post.insights.upvoteRate,
      communityKarma: req.post.insights.communityKarma,
      totalShares: req.post.insights.totalShares,
    });
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

const editPost = async (req, res) => {
  try {
    const neededPost = await checkSameUserEditing(
      req.body.postId,
      req.payload.userId
    );
    await editPostService(neededPost, req.body.content);
    res.status(200).json("Post edited successfully");
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

export default {
  postIdValidator,
  pinPostValidator,
  submitValidator,
  submit,
  pinPost,
  getPinnedPosts,
  postDetails,
  postInsights,
  editPost,
  editValidator,
};
