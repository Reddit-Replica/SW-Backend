import Post from "../models/Post.js";
import Subreddit from "../models/Community.js";
import User from "../models/User.js";
import { body, check } from "express-validator";

const postIdValidator = [
  body("id").not().isEmpty().withMessage("Id can't be empty"),
];

const pinPostValidator = [
  body("id").not().isEmpty().withMessage("Id can't be empty"),
  body("pin").not().isEmpty().withMessage("Pin/unpin flag is required"),
];

const submitValidator = [
  body("kind").not().isEmpty().withMessage("Post kind can't be empty"),
  check("kind").isIn(["text", "link", "image", "video", "post"]),
  body("title").not().isEmpty().withMessage("Post title can't be empty"),
  body("subreddit")
    .not()
    .isEmpty()
    .withMessage("Subreddit name should be given"),
];

// eslint-disable-next-line max-statements
const createPost = async (req, res) => {
  const {
    kind,
    subreddit,
    title,
    content,
    nsfw,
    spoiler,
    imageCaptions,
    imageLinks,
    flairId,
    sendReplies,
    sharePostId,
    scheduleDate,
    scheduleTime,
    scheduleTimeZone,
  } = req.body;
  const userId = req.payload.userId;
  const username = req.payload.username;

  try {
    const user = await User.findById(userId);
    // Check if the subreddit is available
    if (subreddit) {
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
    const post = await new Post({
      kind: sharePostId ? "post" : kind,
      ownerUsername: username,
      ownerId: userId,
      subredditName: subreddit,
      title: title,
      sharePostId: sharePostId,
      content: kind === "video" ? req.files[0]?.path : content,
      images: images,
      nsfw: nsfw,
      spoiler: spoiler,
      flair: flairId,
      sendReplies: sendReplies,
      sharePostId: sharePostId,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTime,
      scheduleTimeZone: scheduleTimeZone,
    }).save();
    if (sharePostId) {
      const sharedPost = await Post.findById(sharePostId);
      sharedPost.insights.totalShares += 1;
      await sharedPost.save();
    }
    user.posts.push(post.id);
    await user.save();
    res.status(201).json("Post submitted successfully!");
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

// eslint-disable-next-line max-statements
const pinPost = async (req, res) => {
  const postId = req.body.id;
  const userId = req.payload.userId;
  try {
    const user = await User.findById(userId);
    if (req.body.pin) {
      if (
        !user.pinnedPosts.find((pinnedPost) => pinnedPost.toString() === postId)
      ) {
        user.pinnedPosts.push(postId);
        await user.save();
        res.status(200).json("Post pinned successfully!");
      } else {
        return res.status(409).json("Post is already pinned");
      }
    } else {
      if (
        user.pinnedPosts.find((pinnedPost) => pinnedPost.toString() === postId)
      ) {
        user.pinnedPosts = user.pinnedPosts.filter(
          (id) => id.toString() !== postId
        );
        await user.save();
        res.status(200).json("Post unpinned successfully!");
      } else {
        return res.status(409).json("Post is already unpinned");
      }
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

const getPinnedPosts = async (req, res) => {
  const userId = req.payload.userId;
  try {
    const user = await User.findOne({
      _id: userId,
    }).populate("pinnedPosts");
    user.pinnedPosts = user.pinnedPosts.filter((post) => !post.deletedAt);
    return res.status(200).json(user.pinnedPosts);
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

// eslint-disable-next-line max-statements
const postDetails = async (req, res) => {
  const postId = req.body.id;
  try {
    const post = await Post.findOne({
      _id: postId,
    }).populate("flair");
    if (!post) {
      return res.status(404).json("Post not found");
    }
    let saved = false,
      followed = false,
      hidden = false;
    let votingType = 0,
      spammed = false,
      inYourSubreddit = false;
    if (req.loggedIn) {
      const userId = req.userId;
      const user = await User.findOne({
        _id: userId,
      });
      if (user.savedPosts.find((id) => id.toString() === postId)) {
        saved = true;
      }
      if (user.followedPosts.find((id) => id.toString() === postId)) {
        followed = true;
      }
      if (user.hiddenPosts.find((id) => id.toString() === postId)) {
        hidden = true;
      }
      if (user.upvotedPosts.find((id) => id.toString() === postId)) {
        votingType = 1;
      }
      if (user.downvotedPosts.find((id) => id.toString() === postId)) {
        votingType = -1;
      }
      if (user.spammedPosts.find((id) => id.toString() === postId)) {
        spammed = true;
      }
      if (
        user.moderatedSubreddits.find((sr) => sr.name === post.subredditName)
      ) {
        inYourSubreddit = true;
      }
    }
    return res.status(200).json({
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
      votingType: votingType,
      saved: saved,
      followed: followed,
      hidden: hidden,
      spammed: spammed,
      inYourSubreddit: inYourSubreddit,
      moderation: post.moderation,
    });
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
};

const postInsights = async (req, res) => {
  try {
    return res.status(200).json({
      totalViews: req.post.insights.totalViews,
      upvoteRate: req.post.insights.upvoteRate,
      communityKarma: req.post.insights.communityKarma,
      totalShares: req.post.insights.totalShares,
    });
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

export default {
  postIdValidator,
  pinPostValidator,
  submitValidator,
  createPost,
  pinPost,
  getPinnedPosts,
  postDetails,
  postInsights,
};
