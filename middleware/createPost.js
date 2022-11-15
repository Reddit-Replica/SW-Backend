import Subreddit from "../models/Community.js";
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
// eslint-disable-next-line max-statements
export async function checkPostSubreddit(req, res, next) {
  const inSubreddit = req.body.inSubreddit;
  const subreddit = req.body.subreddit;
  const userId = req.payload.userId;
  try {
    const user = await User.findById(userId);
    if (inSubreddit && inSubreddit !== "false") {
      if (!subreddit) {
        return res.status(400).json({
          error: "Subreddit can't be empty",
        });
      }
      const postSubreddit = await Subreddit.findOne({
        title: subreddit,
      });
      if (!postSubreddit) {
        return res.status(404).json("Subreddit not found");
      }
      if (
        !user.joinedSubreddits.find((sr) => sr.name === subreddit) &&
        !user.moderatedSubreddits.find((sr) => sr.name === subreddit)
      ) {
        return res
          .status(401)
          .json("User is not a member/mod of this subreddit");
      }
    }
    req.user = user;
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
export function checkImagesAndVideos(req, res, next) {
  const kind = req.body.kind;
  const imageCaptions = req.body.imageCaptions;
  const imageLinks = req.body.imageLinks;
  if (kind === "image" || kind === "video") {
    if (!req.files) {
      return res.status(404).json("File(s) not found");
    }
  }
  let images = [];
  if (kind === "image") {
    req.files.forEach((file) => {
      images.push({
        path: file.path,
        caption: imageCaptions?.length > 0 ? imageCaptions[0] : null,
        link: imageLinks?.length > 0 ? imageLinks[0] : null,
      });
      imageCaptions?.shift();
      imageLinks?.shift();
    });
  }
  req.images = images;
  next();
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
export async function sharePost(req, res, next) {
  const sharePostId = req.body.sharePostId;
  const kind = req.body.kind;
  try {
    if (sharePostId) {
      if (sharePostId && kind !== "post") {
        return res.status(400).json({
          error: "Kind for sharing a post should be 'post'",
        });
      }
      const sharedPost = await Post.findById(sharePostId);
      sharedPost.insights.totalShares += 1;
      await sharedPost.save();
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
export async function postSubmission(req, res, next) {
  const {
    kind,
    subreddit,
    title,
    content,
    nsfw,
    spoiler,
    flairId,
    sendReplies,
    sharePostId,
    scheduleDate,
    scheduleTime,
    scheduleTimeZone,
  } = req.body;
  const userId = req.user.id;
  const username = req.user.username;
  try {
    const post = await new Post({
      kind: kind,
      ownerUsername: username,
      ownerId: userId,
      subredditName: subreddit,
      title: title,
      sharePostId: sharePostId,
      content: kind === "video" ? req.files[0]?.path : content,
      images: req.images,
      nsfw: nsfw,
      spoiler: spoiler,
      flair: flairId,
      sendReplies: sendReplies,
      sharePostId: sharePostId,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTime,
      scheduleTimeZone: scheduleTimeZone,
    }).save();
    req.post = post;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}
