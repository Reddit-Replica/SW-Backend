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
  check("kind").isIn(["hybrid", "link", "image", "video", "post"]),
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
