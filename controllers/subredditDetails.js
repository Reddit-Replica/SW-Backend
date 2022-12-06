import { getSubredditDetails } from "../services/subredditDetails.js";

const subredditDetails = async (req, res) => {
  try {
    const subreddit = req.subreddit;
    const subbredditDetails = await getSubredditDetails(
      subreddit,
      req.loggedIn,
      req.payload
    );
    res.status(200).json(subbredditDetails);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

export default {
  subredditDetails,
};
