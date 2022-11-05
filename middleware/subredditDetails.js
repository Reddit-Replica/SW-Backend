import Subreddit from "../models/subreddit.js";

const createSubreddit = async (req, _res, next) => {
  const subreddit = req.params.subreddit;
  const newSubreddit = new Subreddit({
    subredditName: subreddit,
    category: "Test Category" + subreddit,
    numberOfMembers: 1,
    primaryTopic: "test",
    dateOfCreation: Date.now(),
    type: "Private",
    image: "test.png",
    owner: "zedyad",
    description: "This is new subreddit",
    communitySettings: {
      NSFW: true,
    },
  });
  await newSubreddit.save();
  next();
};

const checkSubreddit = async (req, res, next) => {
  const subredditName = req.params.subreddit;
  const subbredditObject = await Subreddit.findOne({
    subredditName: subredditName,
  });
  if (!subbredditObject) {
    res.status(404).json({
      error: "Subreddit not found!",
    });
  } else {
    req.subreddit = subbredditObject;
    next();
  }
};

export default {
  createSubreddit,
  checkSubreddit,
};
