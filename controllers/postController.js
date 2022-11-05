import Post from "../models/Post";
import User from "../models/User";

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
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(400).json({
        error: "Authorization Header not found!",
      });
    }
    const token = authorizationHeader.split(" ")[1];
    let userId;
    try {
      const decodedPayload = jwt.verify(token, process.env.TOKEN_SECRET);
      userId = decodedPayload.userId;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
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
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export default {
  createPost,
};
