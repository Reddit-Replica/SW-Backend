import Subreddit from "../models/Community.js";

const createSubreddit = async (req, _res, next) => {
  const subreddit = req.params.subreddit;
  const newSubreddit = new Subreddit({
    title: subreddit,
    category: "Test Category" + subreddit,
    numberOfMembers: 1,
    primaryTopic: "test",
    type: "Private",
    image: "test.png",
    owner: "zedyad",
    description: "This is new subreddit",
    owner: {
      username: "zeyadtarekk",
      userID: "6368f28e311af194fd6285a4",
    },
    moderators: [
      {
        username: "zeyadtarekk",
        userID: "6368f28e311af194fd6285a4",
        nickname: "anything",
      },
    ],
  });
  await newSubreddit.save();
  next();
};

/**
 * A middleware used to make sure that the provided subreddit name exists
 * If that subreddit exists it adds it to the request object to make the next middleware access it
 * It it doesn't exist then it returns a response with status code 404 and error message
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */

const checkSubreddit = async (req, res, next) => {
  const subredditName = req.params.subreddit;
  const subbredditObject = await Subreddit.findOne({
    title: subredditName,
  });
  if (!subbredditObject || subbredditObject.deletedAt) {
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
