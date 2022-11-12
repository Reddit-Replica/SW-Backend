import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Subreddit from "../models/Community.js";

/**
 * Middleware used to check if a thing (post/comment) and a subreddit
 * are not found (404). If they are, we check for the user requesting to
 * approve this thing if he is a moderator in the subreddit containing
 * this thing or not (401)
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */

// eslint-disable-next-line max-statements
export async function checkthingMod(req, res, next) {
  const id = req.body.id;
  const type = req.body.type;
  const username = req.payload.username;
  if (type === "post") {
    try {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json("Post not found");
      }
      const subreddit = await Subreddit.findOne({
        title: post.subredditName,
      });

      if (!subreddit) {
        return res.status(404).json("Subreddit not found");
      }

      if (!subreddit.moderators.find((mod) => mod.username === username)) {
        return res.status(401).json("User is not a mod in this subreddit");
      }
      req.post = post;
      req.type = type;
      req.subreddit = subreddit;
      next();
    } catch (err) {
      res.status(500).json("Internal server error");
    }
  } else if (type === "comment") {
    try {
      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).json("Comment not found");
      }
      const subreddit = Subreddit.findOne({
        title: comment.subredditName,
      });

      if (!subreddit) {
        return res.status(404).json("Subreddit not found");
      }
      if (!subreddit.moderators.find((mod) => mod.username === username)) {
        return res.status(401).json("User is not a mod in this subreddit");
      }
      req.comment = comment;
      req.type = type;
      req.subreddit = subreddit;
      next();
    } catch (err) {
      return res.status(500).json("Internal server error");
    }
  }
}
