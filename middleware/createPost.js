/* eslint-disable max-statements */
import Subreddit from "../models/Community.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Flair from "../models/Flair.js";
import { deleteFile } from "../services/userSettings.js";
import {
  checkIfBanned,
  checkIfMuted,
} from "../services/subredditActionsServices.js";

/**
 * Middleware used to check the post is being submitted in a subreddit
 * and if yes, it verifies the subreddit exists and that the user
 * is either a member of it or a moderator.
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
      if (!postSubreddit || postSubreddit.deletedAt) {
        return res.status(404).json("Subreddit not found or deleted");
      }
      if (
        !user.joinedSubreddits.find((sr) => sr.name === subreddit) &&
        !user.moderatedSubreddits.find((sr) => sr.name === subreddit)
      ) {
        return res
          .status(401)
          .json("User is not a member/mod of this subreddit");
      }
      if (checkIfBanned(userId, postSubreddit)) {
        return res.status(400).json({
          error: "User is banned from this subreddit",
        });
      }
      if (checkIfMuted(userId, postSubreddit)) {
        return res.status(400).json({
          error: "User is muted from this subreddit",
        });
      }
      req.subreddit = subreddit;
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to check if the post flair subreddit is the same as
 * the subreddit that the post is being submitted in (if the flair exists)
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function checkPostFlair(req, res, next) {
  const flairId = req.body.flairId;
  try {
    if (flairId && !req.subreddit) {
      return res.status(400).json({
        error: "The given flair should belong to a subreddit",
      });
    }
    if (req.subreddit && flairId) {
      if (!mongoose.Types.ObjectId.isValid(flairId)) {
        return res.status(400).json({
          error: "Invalid Flair id (should be in the correct format)",
        });
      }
      const flair = await Flair.findById(flairId).populate("subreddit");
      if (flair.subreddit.title !== req.subreddit) {
        return res.status(400).json({
          error: "Flair doesn't belong to the post subreddit",
        });
      }
    }
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}

/**
 * Middleware used to check if the post kind is hybrid and then sets the
 * post content as given from the rich text editor in the body with no changes.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function checkHybridPost(req, res, next) {
  const kind = req.body.kind;
  if (kind === "hybrid") {
    req.content = req.body.content;
  }
  next();
}

/**
 * Middleware used to check if the post kind is image/video, if yes then
 * verify that files are given in both cases. An images array is also made with
 * each element object containing the image path, its caption and a link only when
 * the kind is image and then pass the array in the request.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export function checkImagesAndVideos(req, res, next) {
  const kind = req.body.kind;
  if (kind === "image") {
    let imageCaptions = req.body.imageCaptions;
    let imageLinks = req.body.imageLinks;
    let images = [];
    const imageFiles = req.files?.images;
    if (!imageFiles) {
      return res.status(404).json("Images not found");
    }
    if (
      imageFiles.length === 1 &&
      typeof imageCaptions === "string" &&
      typeof imageLinks === "string"
    ) {
      const caption = imageCaptions;
      const link = imageLinks;
      imageCaptions = [];
      imageLinks = [];
      imageCaptions.push(caption);
      imageLinks.push(link);
    }
    if (
      imageFiles.length !== imageCaptions?.length ||
      imageFiles.length !== imageLinks?.length
    ) {
      for (const image of imageFiles) {
        deleteFile(image.path);
      }
      return res.status(400).json({
        error: "Each image should have a caption and a link",
      });
    }
    imageFiles.forEach((image) => {
      images.push({
        path: image.path,
        caption: imageCaptions?.length > 0 ? imageCaptions[0] : null,
        link: imageLinks?.length > 0 ? imageLinks[0] : null,
      });
      imageCaptions?.shift();
      imageLinks?.shift();
    });
    req.images = images;
  } else if (kind === "video") {
    const videoFile = req.files?.video;
    if (!videoFile) {
      return res.status(404).json("Video not found");
    }
    if (videoFile.length > 1) {
      for (const video of videoFile) {
        deleteFile(video.path);
      }
      return res.status(400).json({
        error: "Videos can only have one video",
      });
    }
    req.video = videoFile[0].path;
  }
  next();
}

/**
 * Middleware used to verify that if the id of the post being shared exists, if yes
 * then it verifies that the kind is 'post'. The shared post is obtained from the DB
 * to increment it's totalShares in the insights then save it.
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
    if (kind === "post" && !sharePostId) {
      return res.status(400).json({
        error: "sharePostId is required",
      });
    }
    if (sharePostId) {
      if (kind !== "post") {
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
 * Middleware used to create a new post with the parameters obtained
 * from the request body and passes the newly created post in the request
 * to be saved in the user's posts in the controller.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function postSubmission(req, res, next) {
  const {
    kind,
    title,
    link,
    nsfw,
    spoiler,
    flairId,
    sendReplies,
    sharePostId,
    scheduleDate,
    scheduleTime,
    scheduleTimeZone,
  } = req.body;
  try {
    const userId = req.user.id;
    const username = req.user.username;
    const post = await new Post({
      kind: kind,
      ownerUsername: username,
      ownerId: userId,
      subredditName: req.subreddit,
      title: title,
      sharePostId: sharePostId,
      link: link,
      video: req.video,
      images: req.images,
      nsfw: nsfw,
      spoiler: spoiler,
      flair: flairId,
      content: req.content,
      sendReplies: sendReplies,
      sharePostId: sharePostId,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTime,
      scheduleTimeZone: scheduleTimeZone,
      createdAt: Date.now(),
    }).save();
    req.post = post;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}
/**
 * Middleware used to add the post in all necesssary places in the user/post/subreddit models and
 * modify any parameters that are affected upon post creation.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function addPost(req, res, next) {
  try {
    const user = req.user;
    const post = req.post;
    if (post.subredditName) {
      const subreddit = await Subreddit.findOne({ title: post.subredditName });
      subreddit.unmoderatedPosts.push(post.id.toString());
      subreddit.subredditPosts.push(post.id.toString());
      await subreddit.save();
    }
    user.posts.push(post.id);
    user.upvotedPosts.push(post.id);
    user.commentedPosts.push(post.id);
    post.numberOfUpvotes = 1;
    post.numberOfVotes = 1;
    user.upVotes += 1;
    user.karma += 1;
    post.hotTimingScore = post.createdAt.getTime() / 10000;
    post.bestTimingScore = post.createdAt.getTime() / 10000000;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}
