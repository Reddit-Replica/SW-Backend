import { prepareSubredditSettings } from "../services/subredditSettings.js";
const getSubredditSettings = (req, res) => {
  try {
    const settings = prepareSubredditSettings(req.subreddit);
    res.status(200).json(settings);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};

export default {
  getSubredditSettings,
};
