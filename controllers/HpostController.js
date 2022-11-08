import Post from "../models/Post.js";
import User from "../models/User.js";
import verifyUser from "../utils/verifyUser.js";

// eslint-disable-next-line max-statements
const createPost = async (req, res) => {
  const authorizationResult = verifyUser(req);
  if (!authorizationResult) {
    return res.status(401).json({
      error: "Token may be invalid or not found",
    });
  }
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
  const userId = authorizationResult.userId;
  const username = authorizationResult.username;

  try {
    if (kind === "image") {
      content = req.file.path;
    }
    const post = await new Post({
      kind: kind,
      ownerUsername: username,
      ownerId: userId,
      subredditName: subreddit,
      title: title,
      sharePostId: sharePostId,
      content: content,
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
    if (user.posts.find((post) => post === postId)) {
      if (!user.pinnedPosts.find((pinnedPost) => pinnedPost === postId)) {
        user.pinnedPosts.push(postId);
        await user.save();
        res.status(200).send("Post pinned successfully!");
      } else {
        return res.status(409).send("Post is already pinned");
      }
    } else {
      return res.status(401).send("User is not the owner of this post");
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
      if (user.savedPosts.find((id) => id === postId)) {
        saved = true;
      }
      if (user.followedPosts.find((id) => id === postId)) {
        followed = true;
      }
      if (user.hiddenPosts.find((id) => id === postId)) {
        hidden = true;
      }
      if (user.upvotedPosts.find((id) => id === postId)) {
        upvoted = true;
      }
      if (user.downvotedPosts.find((id) => id === postId)) {
        downvoted = true;
      }
      if (user.spammedPosts.find((id) => id === postId)) {
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
