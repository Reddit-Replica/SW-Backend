import Post from "../models/Post.js";
import Subreddit from "../models/Community.js";
import mongoose from "mongoose";

/**
 * Middleware used to check if the post that we want to perform the action on
 * is exist or not deleted before.
 * It also check if the post belong to the user making the request or no.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function verifyPostActions(req, res, next) {
  try {
    let { id } = req.body;
    if (!id) {
      id = req.query.id;
    }
    const { userId } = req.payload;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "In valid id",
      });
    }
    const post = await Post.findById(id);

    if (!post || post.deletedAt) {
      return res.status(404).json("Post not found");
    }

    // check if the post does not belong to the user making the request
    if (post.ownerId.toString() !== userId.toString()) {
      return res.status(401).json("Access Denied");
    }

    req.post = post;
    next();
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
}

/**
 * Middleware used to check the user seeing the post insights is the
 * owner or mod of the post subreddit.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function verifyPostInsights(req, res, next) {
  try {
    let { id } = req.query;
    const { userId } = req.payload;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid ID",
      });
    }
    const post = await Post.findById(id);

    if (!post || post.deletedAt) {
      return res.status(404).json("Post not found");
    }

    if (!post.subredditName) {
      if (post.ownerId.toString() !== userId.toString()) {
        return res.status(401).json("Access Denied");
      }
    } else {
      const subreddit = await Subreddit.findOne({ title: post.subredditName });
      if (!subreddit || subreddit.deletedAt) {
        return res.status(404).json("Subreddit not found");
      }
      if (
        post.ownerId.toString() !== userId.toString() &&
        !subreddit.moderators.find(
          (mod) => mod.userID.toString() === userId.toString()
        )
      ) {
        return res.status(401).json("Access Denied");
      }
    }

    req.post = post;
    next();
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
}
