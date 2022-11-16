import User from "../models/User.js";
import { body, check } from "express-validator";

const postIdValidator = [
  body("id").not().isEmpty().withMessage("Id can't be empty"),
];

const pinPostValidator = [
  body("id").not().isEmpty().withMessage("Id can't be empty"),
  body("pin").not().isEmpty().withMessage("Pin/unpin flag is required"),
];

const submitValidator = [
  body("kind").not().isEmpty().withMessage("Post kind can't be empty"),
  check("kind").isIn(["text", "link", "image", "video", "post"]),
  body("title").not().isEmpty().withMessage("Post title can't be empty"),
  body("inSubreddit").not().isEmpty().withMessage("Post place can't be empty"),
];

const submit = async (req, res) => {
  const user = req.user;
  const post = req.post;
  try {
    user.posts.push(post.id);
    await user.save();
    res.status(201).json("Post submitted successfully!");
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
    return res.status(200).json(user.pinnedPosts);
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

export default {
  postIdValidator,
  pinPostValidator,
  submitValidator,
  submit,
  pinPost,
  getPinnedPosts,
  postDetails,
  postInsights,
};
