import Post from "../models/Post";

// eslint-disable-next-line max-statements
const createPost = async (req, res) => {
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
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export default {
  createPost,
};
