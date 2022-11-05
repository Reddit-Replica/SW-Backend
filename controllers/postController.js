import Post from "../models/Post.js";
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
    flairId,
    sendReplies,
    sharePostId,
    scheduleDate,
    scheduleTime,
    scheduleTimeZone,
  } = req.body;
  try {
    const userId = authorizationResult;
    const post = new Post({
      kind: kind,
      subreddit: subreddit,
      title: title,
      content: content,
      nsfw: nsfw,
      spoiler: spoiler,
      flairId: flairId,
      sendReplies: sendReplies,
      sharePostId: sharePostId,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTime,
      scheduleTimeZone: scheduleTimeZone,
    });
    await post.save();
    const user = await User.findOne({
      id: userId,
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
  const userId = authorizationResult;
  try {
    const user = await User.findOne({
      id: userId,
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
  const userId = authorizationResult;
  try {
    const user = await User.findOne({
      id: userId,
    }).populate("pinnedPosts");
    return res.status(200).json(user.pinnedPosts);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export default {
  createPost,
  pinPost,
  getPinnedPosts,
};
