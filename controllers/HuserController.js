import { listingBannedUsers } from "../services/userListing.js";

const getBannedUsers = async (req, res) => {
  try {
    const { before, after, limit } = req.query;
    const result = await listingBannedUsers(
      limit,
      before,
      after,
      req.subreddit
    );

    res.status(200).json(result);
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
