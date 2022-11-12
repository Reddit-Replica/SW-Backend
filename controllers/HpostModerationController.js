import Post from "../models/Post.js";
import Subreddit from "../models/Community.js";
import User from "../models/User.js";
import { body, check } from "express-validator";

const approveValidator = [
  body("id").not().isEmpty().withMessage("Id can't be empty"),
  body("type").not().isEmpty().withMessage("Type kind can't be empty"),
  check("type").isIn(["post", "comment"]),
];

const approve = async (req, res) => {
  const username = req.payload.username;
  if (req.type === "post") {
    const post = req.post;
    if (post.moderation.approve.approvedBy) {
      return res.status(400).json({
        error: "Post is already approved",
      });
    }
    post.moderation.approve = {
      approvedBy: username,
      approvedDate: Date.now(),
    };
    await post.save();
    return res.status(200).json("Post approved successfully!");
  } else if (req.type === "comment") {
    const comment = req.comment;
    if (comment.moderation.approve.approvedBy) {
      return res.status(400).json({
        error: "Comment is already approved",
      });
    }
    comment.moderation.approve = {
      approvedBy: username,
      approvedDate: Date.now(),
    };
    await comment.save();
    return res.status(200).json("Comment approved successfully!");
  }
};

export default {
  approveValidator,
  approve,
};
