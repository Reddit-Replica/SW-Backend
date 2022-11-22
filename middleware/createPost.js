import Subreddit from "../models/Community.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Flair from "../models/Flair.js";

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
// eslint-disable-next-line max-statements
export async function checkPostFlair(req, res, next) {
  const flairId = req.body.flairId;
  try {
    if (req.subreddit && flairId) {
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
 * Middleware used to check if the post kind is hybrid and then extracts
 * the text, images, videos, and links content from the body along with image
 * and video captions. The hybridContent object is formed according to the
 * structure in the Post model and passed with the request.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
// eslint-disable-next-line max-statements
export async function checkHybridPost(req, res, next) {
  const kind = req.body.kind;
  if (kind === "hybrid") {
    let images = [];
    let videos = [];
    const imageFiles = req.files?.images;
    const videoFiles = req.files?.videos;
    const { texts, links, imageCaptions, videoCaptions } = req.body;
    if (imageFiles && !imageCaptions) {
      return res.status(400).json({
        error: "Image captions are required",
      });
    }
    if (videoFiles && !videoCaptions) {
      return res.status(400).json({
        error: "Video captions are required",
      });
    }
    if (imageFiles) {
      for (let i = 0; i < imageFiles.length; i++) {
        images.push({
          image: {
            path: imageFiles[i].path,
            caption: imageCaptions[i].caption,
          },
          index: imageCaptions[i].index,
        });
      }
    }
    if (videoFiles) {
      for (let i = 0; i < videoFiles.length; i++) {
        videos.push({
          video: {
            path: videoFiles[i].path,
            caption: videoCaptions[i].caption,
          },
          index: videoCaptions[i].index,
        });
      }
    }
    req.hybridContent = {
      texts,
      links,
      images,
      videos,
    };
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
  const imageCaptions = req.body.imageCaptions;
  const imageLinks = req.body.imageLinks;
  let images = [];
  if (kind === "image") {
    const imageFiles = req.files.images;
    if (!imageFiles) {
      return res.status(404).json("Images not found");
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
    const videoFiles = req.files.videos;
    if (!videoFiles) {
      return res.status(404).json("Videos not found");
    }
    if (videoFiles.length > 1) {
      return res.status(400).json({
        error: "Videos can only have one video",
      });
    }
    req.video = videoFiles[0].path;
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
    subreddit,
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
      subredditName: subreddit,
      title: title,
      sharePostId: sharePostId,
      link: link,
      video: req.video,
      images: req.images,
      nsfw: nsfw,
      spoiler: spoiler,
      flair: flairId,
      hybridContent: req.hybridContent,
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
