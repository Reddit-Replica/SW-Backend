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
import mongoose from "mongoose";

/**
 * Middleware used to check if the post is being submitted in a subreddit
 * and if yes, it verifies the subreddit exists and that the user
 * is either a member of it or a moderator. Then checks for the ability to post in it,
 * the spoiler enabled, suggested sort, and if the user is banned/muted.
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
    if (!user || user.deletedAt) {
      return res.status(404).json("User not found or deleted");
    }
    req.suggestedSort = "new";
    if (inSubreddit && inSubreddit !== "false") {
      // Check Subreddit name
      if (!subreddit) {
        return res.status(400).json({
          error: "Subreddit can't be empty",
        });
      }
      // Check if the subreddit exists
      const postSubreddit = await Subreddit.findOne({
        title: subreddit,
      });
      if (!postSubreddit || postSubreddit.deletedAt) {
        return res.status(404).json("Subreddit not found or deleted");
      }
      // CHECK ABILITY TO POST
      if (!user.joinedSubreddits.find((sr) => sr.name === subreddit)) {
        return res.status(401).json("User is not a member of this subreddit");
      }
      if (postSubreddit.type !== "Public") {
        // eslint-disable-next-line max-depth
        if (
          !postSubreddit.approvedUsers.find(
            (approvedUser) =>
              approvedUser.userID.toString() === userId.toString()
          )
        ) {
          return res.status(401).json("User is not approved in this subreddit");
        }
      }
      if (postSubreddit.type === "Restricted") {
        // eslint-disable-next-line max-depth
        if (
          postSubreddit.subredditSettings.approvedUsersHaveTheAbilityTo ===
          "Comment only"
        ) {
          return res
            .status(401)
            .json(
              "Approved users don't have the ability to post in this subreddit"
            );
        }
      }
      // CHECK SPOILER
      if (
        req.body.spoiler === true &&
        postSubreddit.subredditPostSettings.enableSpoiler === false
      ) {
        return res.status(400).json({
          error: "Spoiler can't be set in this subreddit",
        });
      }
      // Prepare suggested sort
      req.suggestedSort =
        postSubreddit.subredditPostSettings.suggestedSort !== "none"
          ? postSubreddit.subredditPostSettings.suggestedSort
          : req.suggestedSort;

      // Check banned & muted
      if (await checkIfBanned(userId, postSubreddit)) {
        return res.status(400).json({
          error: "User is banned from this subreddit",
        });
      }
      if (await checkIfMuted(userId, postSubreddit)) {
        return res.status(400).json({
          error: "User is muted from this subreddit",
        });
      }
      req.subreddit = subreddit;
      req.subredditId = postSubreddit.id;
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
      const flair = await Flair.findById(flairId)?.populate("subreddit");
      if (!flair || flair.deletedAt) {
        return res.status(404).json("Flair not found or deleted");
      }
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
 * the kind is image and then pass the array in the request. In case of kind = video,
 * only a single video can be submitted in a post
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
 * to increment its totalShares in the insights then save it. An extra check is also made
 * in case there is an original shared post (stemmed from it) so then we will need to
 * increase the original post's total shares and not the parent one.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */
export async function sharePost(req, res, next) {
  let sharePostId = req.body.sharePostId;
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
      let sharedPost = await Post.findById(sharePostId);
      if (!sharedPost || sharedPost.deletedAt) {
        return res.status(404).json("Shared post not found or deleted");
      }
      if (sharedPost.sharePostId) {
        sharePostId = sharedPost.sharePostId;
        const originalSharedPost = await Post.findById(sharePostId);
        // eslint-disable-next-line max-depth
        if (!originalSharedPost || originalSharedPost.deletedAt) {
          return res
            .status(404)
            .json("Original shared post not found or deleted");
        }
        sharedPost = undefined;
        sharedPost = originalSharedPost;
      }
      req.sharePostId = sharePostId;
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
      subredditId: req.subredditId,
      title: title,
      link: link,
      video: req.video,
      images: req.images,
      nsfw: nsfw,
      spoiler: spoiler,
      flair: flairId,
      content: req.content,
      sendReplies: sendReplies,
      suggestedSort: req.suggestedSort,
      sharePostId: req.sharePostId,
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
    post.hotTimingScore = Math.round(post.createdAt.getTime() / 10000);
    post.bestTimingScore = Math.round(post.createdAt.getTime() / 100000);
    post.hotScore =
      post.hotTimingScore + post.numberOfVotes + post.numberOfComments;
    post.bestScore =
      post.bestTimingScore + post.numberOfVotes + post.numberOfComments;
    next();
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
}
