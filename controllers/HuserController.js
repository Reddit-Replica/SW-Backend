import { listingBannedUsers } from "../services/userListing.js";

const getBannedUsers = async (req, res) => {
  try {
    const { before, after, limit } = req.query;
    let result;
    result = await listingBannedUsers(req.params.subreddit, "spammedPosts", {
      before,
      after,
      limit,
    });

    res.status(result.statusCode).json(result.data);
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

export default {
  getBannedUsers,
};
