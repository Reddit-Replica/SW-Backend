import Post from "../models/Post.js";
import Subreddit from "../models/Subreddit.js";
import User from "../models/User.js";
import verifyUser from "../utils/verifyUser.js";

// eslint-disable-next-line max-statements
const createPost = async (req, res) => {
  const authorizationResult = verifyUser(req);
  if (!authorizationResult) {
    return res.status(401).send("Token may be invalid or not found");
  }
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
  const userId = authorizationResult.userId;
  const username = authorizationResult.username;

  try {
    // Check if the subreddit is available
    const postSubreddit = await Subreddit.findOne({
      title: subreddit,
    });
    if (!postSubreddit) {
      return res.status(404).send("Subreddit not found");
    }
    let images = [];
    if (kind === "image") {
      req.files.forEach((file) => {
        images.push({
          path: file.path,
          caption: imageCaptions?.length > 0 ? imageCaptions[0] : "",
          link: imageLinks?.length > 0 ? imageLinks[0] : "",
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
      content: kind === "video" ? req.files[0].path : content,
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
      const sharedPost = Post.findOne({
        _id: sharePostId,
      });
      sharedPost.insights.totalShares += 1;
    }
    const user = await User.findOne({
      _id: userId,
    });
    user.posts.push(post.id);
    await user.save();
    res.status(201).send("Post submitted successfully!");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

// eslint-disable-next-line max-statements
const pinPost = async (req, res) => {
  const authorizationResult = verifyUser(req);
  if (!authorizationResult) {
    return res.status(401).send("Token may be invalid or not found");
  }
  const postId = req.body.id;
  const userId = authorizationResult.userId;
  try {
    const user = await User.findOne({
      _id: userId,
    });
    if (!user.posts.find((post) => post.toString() === postId)) {
      return res.status(401).send("User is not the owner of this post");
    }
    if (req.body.pin) {
      if (
        !user.pinnedPosts.find((pinnedPost) => pinnedPost.toString() === postId)
      ) {
        user.pinnedPosts.push(postId);
        await user.save();
        res.status(200).send("Post pinned successfully!");
      } else {
        return res.status(409).send("Post is already pinned");
      }
    } else {
      if (
        user.pinnedPosts.find((pinnedPost) => pinnedPost.toString() === postId)
      ) {
        user.pinnedPosts = user.pinnedPosts.filter(
          (id) => id.toString() !== postId
        );
        await user.save();
        res.status(200).send("Post unpinned successfully!");
      } else {
        return res.status(409).send("Post is already unpinned");
      }
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const getPinnedPosts = async (req, res) => {
  const authorizationResult = verifyUser(req);
  if (!authorizationResult) {
    return res.status(401).send("Token may be invalid or not found");
  }
  const userId = authorizationResult.userId;
  try {
    const user = await User.findOne({
      _id: userId,
    }).populate("pinnedPosts");
    user.pinnedPosts = user.pinnedPosts.filter((post) => !post.deletedAt);
    return res.status(200).json(user.pinnedPosts);
  } catch (err) {
    res.status(500).send("Internal server error");
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
      return res.status(404).send("Post not found");
    }
    let saved = false,
      followed = false,
      hidden = false;
    let upvoted = false,
      downvoted = false,
      spammed = false;
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
        upvoted = true;
      }
      if (user.downvotedPosts.find((id) => id.toString() === postId)) {
        downvoted = true;
      }
      if (user.spammedPosts.find((id) => id.toString() === postId)) {
        spammed = true;
      }
    }
    return res.status(200).json({
      kind: post.kind,
      subreddit: post.subredditName,
      content: post.content,
      nsfw: post.nsfw,
      spoiler: post.spoiler,
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
      upvoted: upvoted,
      downvoted: downvoted,
      saved: saved,
      followed: followed,
      hidden: hidden,
      spammed: spammed,
    });
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

const postInsights = async (req, res) => {
  const authorizationResult = verifyUser(req);
  if (!authorizationResult) {
    return res.status(401).send("Token may be invalid or not found");
  }
  const postId = req.body.id;
  const userId = authorizationResult.userId;
  try {
    const post = await Post.findOne({
      _id: postId,
    });
    if (!post) {
      return res.status(404).send("Post not found");
    }
    if (post.ownerId.toString() !== userId) {
      return res.status(401).send("User is not the owner of this post");
    }
    return res.status(200).json({
      totalViews: post.insights.totalViews,
      upvoteRate: post.insights.upvoteRate,
      communityKarma: post.insights.communityKarma,
      totalShares: post.insights.totalShares,
    });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export default {
  createPost,
  pinPost,
  getPinnedPosts,
  postDetails,
  postInsights,
};
