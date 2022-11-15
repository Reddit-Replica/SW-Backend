import User from "../models/User.js";
import Post from "../models/Post.js";

/**
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function checkPostExistence(req, res, next) {
  const postId = req.body.id;
  try {
    const post = await Post.findById(postId).populate("flair");
    if (!post) {
      return res.status(404).json("Post not found");
    }
    req.post = post;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function setPostActions(req, res, next) {
  (req.saved = false), (req.followed = false), (req.hidden = false);
  (req.votingType = 0), (req.spammed = false), (req.inYourSubreddit = false);
  try {
    if (req.loggedIn) {
      const userId = req.userId;
      const user = await User.findById(userId);
      const postId = req.postId;
      if (user.savedPosts.find((id) => id.toString() === postId)) {
        req.saved = true;
      }
      if (user.followedPosts.find((id) => id.toString() === postId)) {
        req.followed = true;
      }
      if (user.hiddenPosts.find((id) => id.toString() === postId)) {
        req.hidden = true;
      }
      if (user.upvotedPosts.find((id) => id.toString() === postId)) {
        req.votingType = 1;
      }
      if (user.downvotedPosts.find((id) => id.toString() === postId)) {
        req.votingType = -1;
      }
      if (user.spammedPosts.find((id) => id.toString() === postId)) {
        req.spammed = true;
      }
      if (
        user.moderatedSubreddits.find((sr) => sr.name === post.subredditName)
      ) {
        req.inYourSubreddit = true;
      }
    }
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to check the id sent in the request if it was
 * a valid mongo ObjectId.
 * If it was invalid a status code of 400 will be sent.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function getPostDetails(req, res, next) {
  const post = req.post;
  const postObj = {
    kind: post.kind,
    subreddit: post.subredditName,
    content: post.content,
    images: post.images,
    nsfw: post.nsfw,
    spoiler: post.spoiler,
    sharePostId: post.sharePostId,
    title: post.title,
    flair: {
      id: post.flair?._id,
      flairName: post.flair?.flairName,
      order: post.flair?.order,
      backgroundColor: post.flair?.backgroundColor,
      textColor: post.flair?.textColor,
    },
    comments: post.numberOfComments,
    votes: post.numberOfUpvotes - post.numberOfDownvotes,
    postedAt: post.createdAt,
    postedBy: post.ownerUsername,
    votingType: req.votingType,
    saved: req.saved,
    followed: req.followed,
    hidden: req.hidden,
    spammed: req.spammed,
    inYourSubreddit: req.inYourSubreddit,
    moderation: post.moderation,
  };
  req.postObj = postObj;
  next();
}
