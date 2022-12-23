import User from "../models/User.js";
import Post from "../models/Post.js";

/**
 * Middleware used to check if a post exists given its id. It also populates
 * the flair object in case there's a post because the post flair parameters
 * will be returned along with the other post details. The post is passed with the
 * request to the next middleware.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function checkPostExistence(req, res, next) {
  const postId = req.query.id;
  try {
    const post = await Post.findById(postId)?.populate("flair");
    if (!post || post?.deletedAt) {
      return res.status(404).json("Post may be not found or deleted");
    }
    req.post = post;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to set the post actions from the user's collections
 * of posts which include whether it's saved, followed, hidden, spammed,
 * upvoted, downvoted and if it's in the user's subreddit by checking the
 * moderators of that subreddit. These checks are made only if the user is
 * logged in, otherwise all ara false and the voting is 0.
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
      if (!user || user.deletedAt) {
        return res.status(404).json("User not found or deleted");
      }
      const postId = req.query.id;
      if (
        !user.historyPosts.find((id) => id.toString() === postId.toString())
      ) {
        user.historyPosts.push(postId);
        await user.save();
      }
      if (user.savedPosts?.find((id) => id.toString() === postId)) {
        req.saved = true;
      }
      if (user.followedPosts?.find((id) => id.toString() === postId)) {
        req.followed = true;
      }
      if (user.hiddenPosts?.find((id) => id.toString() === postId)) {
        req.hidden = true;
      }
      if (user.upvotedPosts?.find((id) => id.toString() === postId)) {
        req.votingType = 1;
      }
      if (user.downvotedPosts?.find((id) => id.toString() === postId)) {
        req.votingType = -1;
      }
      if (user.spammedPosts?.find((id) => id.toString() === postId)) {
        req.spammed = true;
      }
      if (
        user.moderatedSubreddits?.find(
          (sr) => sr.name === req.post.subredditName
        )
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
 * Middleware used to generate a post object from the post parameters
 * given from the previous middleware to be returned with a status code
 * of 200 in the controller.
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
    id: post.id.toString(),
    kind: post.kind,
    subreddit: post.subredditName,
    link: post.link,
    images: post.images,
    video: post.video,
    content: post.content,
    nsfw: post.nsfw,
    spoiler: post.spoiler,
    markedSpam: post.markedSpam,
    sharePostId: post.sharePostId,
    title: post.title,
    suggestedSort: post.suggestedSort,
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
    editedAt: post.editedAt,
    postedBy: post.ownerUsername,
    sendReplies: post.sendReplies,
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
