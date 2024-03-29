import { body, check } from "express-validator";
import {
  addToSpammedComments,
  markPostAsModerated,
  removeFromSpammedComments,
} from "../services/postsModeration.js";

const modValidator = [
  body("id").not().isEmpty().withMessage("Id can't be empty"),
  body("type").not().isEmpty().withMessage("Type can't be empty"),
  check("type").isIn(["post", "comment"]),
];

// eslint-disable-next-line max-statements
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
    post.moderation.remove = undefined;
    post.moderation.spam = undefined;
    post.markedSpam = false;
    if (post.subredditName) {
      markPostAsModerated(post.id, post.subredditName, "approve");
    }
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
    if (comment.subredditName) {
      removeFromSpammedComments(comment.id, comment.subredditName);
    }
    comment.moderation.remove = undefined;
    comment.moderation.spam = undefined;
    comment.markedSpam = false;
    await comment.save();
    return res.status(200).json("Comment approved successfully!");
  }
};

// eslint-disable-next-line max-statements
const remove = async (req, res) => {
  const username = req.payload.username;
  if (req.type === "post") {
    const post = req.post;
    if (post.moderation.remove.removedBy) {
      return res.status(400).json({
        error: "Post is already removed",
      });
    }
    post.moderation.remove = {
      removedBy: username,
      removedDate: Date.now(),
    };
    post.moderation.approve = undefined;
    if (post.subredditName) {
      markPostAsModerated(post.id, post.subredditName, "remove");
    }
    await post.save();
    return res.status(200).json("Post removed successfully!");
  } else if (req.type === "comment") {
    const comment = req.comment;
    if (comment.moderation.remove.removedBy) {
      return res.status(400).json({
        error: "Comment is already removed",
      });
    }
    comment.moderation.remove = {
      removedBy: username,
      removedDate: Date.now(),
    };
    comment.moderation.approve = undefined;
    await comment.save();
    return res.status(200).json("Comment removed successfully!");
  }
};

// eslint-disable-next-line max-statements
const modSpam = async (req, res) => {
  const username = req.payload.username;
  if (req.type === "post") {
    const post = req.post;
    if (post.moderation.spam.spammedBy) {
      return res.status(400).json({
        error: "Post is already marked as spam",
      });
    }
    post.moderation.spam = {
      spammedBy: username,
      spammedDate: Date.now(),
    };
    post.markedSpam = true;
    post.moderation.approve = undefined;
    if (post.subredditName) {
      markPostAsModerated(post.id, post.subredditName, "spam");
    }
    await post.save();
    return res.status(200).json("Post spammed successfully!");
  } else if (req.type === "comment") {
    const comment = req.comment;
    if (comment.moderation.spam.spammedBy) {
      return res.status(400).json({
        error: "Comment is already marked as spam",
      });
    }
    comment.moderation.spam = {
      spammedBy: username,
      spammedDate: Date.now(),
    };
    comment.markedSpam = true;
    comment.moderation.approve = undefined;
    if (comment.subredditName) {
      addToSpammedComments(comment.id, comment.subredditName);
    }
    await comment.save();
    return res.status(200).json("Comment spammed successfully!");
  }
};

const lock = async (req, res) => {
  if (req.type === "post") {
    const post = req.post;
    if (post.moderation.lock) {
      return res.status(400).json({
        error: "Post is already locked",
      });
    }
    post.moderation.lock = true;
    await post.save();
    return res.status(200).json("Post locked successfully!");
  } else if (req.type === "comment") {
    const comment = req.comment;
    if (comment.moderation.lock) {
      return res.status(400).json({
        error: "Comment is already locked",
      });
    }
    comment.moderation.lock = true;
    await comment.save();
    return res.status(200).json("Comment locked successfully!");
  }
};

const unlock = async (req, res) => {
  if (req.type === "post") {
    const post = req.post;
    if (!post.moderation.lock) {
      return res.status(400).json({
        error: "Post is already unlocked",
      });
    }
    post.moderation.lock = false;
    await post.save();
    return res.status(200).json("Post unlocked successfully!");
  } else if (req.type === "comment") {
    const comment = req.comment;
    if (!comment.moderation.lock) {
      return res.status(400).json({
        error: "Comment is already unlocked",
      });
    }
    comment.moderation.lock = false;
    await comment.save();
    return res.status(200).json("Comment unlocked successfully!");
  }
};

export default {
  modValidator,
  approve,
  remove,
  lock,
  unlock,
  modSpam,
};
