/* eslint-disable max-statements */
/* eslint-disable max-len */
import { body } from "express-validator";
import {
  searchForSubreddit,
  addToJoinedSubreddit,
  addToDescription,
  addToSubtopics,
  addToMainTopic,
  searchForSubredditById,
  addSubreddit,
  checkForPrivateSubreddits,
  makeSubredditFavorite,
  checkForFavoriteSubreddits,
  removeSubredditFromFavorite,
  subredditNameAvailable,
  leaveSubredditService,
} from "./../services/communityServices.js";
import {
  getUserFromJWTService,
  searchForUserService,
} from "../services/userServices.js";
import { getSubredditService } from "../services/subredditActionsServices.js";
import {
  subredditCategoryListing,
  twoRandomCategories,
  subredditTrendingListing,
} from "../services/subredditListing.js";
export let MainTopics = [
  "Activism",
  "Addition Support",
  "Animals And Pets",
  "Anime",
  "Art",
  "Beauty And Makeup",
  "Bussiness, Economics, And Finance",
  "Careers",
  "Cars And Motor Vehicles",
  "Celebrity",
  "Crafts And DIY",
  "Crypto",
  "Culture, Race, And Ethnicity",
  "Family And Relationships",
  "Fashion",
  "Fitness And Nutrition",
  "Funny/Humor",
  "Food And Drink",
  "Gaming",
  "Gender",
  "History",
  "Hobbies",
  "Home and Garden",
  "Internet Culture and Memes",
  "Law",
  "Learning and Education",
  "Marketplace and Deals",
  "Mature Themes and Adults",
  "Medical and Mental Health",
  "Men's Health",
  "Meta/Reddit",
  "Military",
  "Movies",
  "Music",
  "Ourdoors and Nature",
  "Place",
  "Podcasts and Streamers",
  "Politics",
  "Programming",
  "Reading, Writing and Literature",
  "Religion and Spirituality",
  "Science",
  "Sexual Orientation",
  "Sports",
  "Tabletop Games",
  "Technology",
  "Television",
  "Trauma Support",
  "Travel",
  "Woman's Health",
  "World News",
  "None Of These Topics",
];
const subredditValidator = [
  body("subredditName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Subreddit name can not be empty")
    .isLength({ min: 0, max: 23 })
    .withMessage("Subreddit name must be less than 23 character"),
  body("category")
    .trim()
    .not()
    .isEmpty()
    .withMessage("category can not be empty"),
  body("type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("type can not be empty")
    .isIn(["Private", "Public", "Restricted"])
    .withMessage(
      "Subreddit type must be either 'Public' or 'Restricted or 'Private"
    ),
];

//CHECKING ON DESCRIPTION
const descriptionValidator = [
  body("description")
    .not()
    .isEmpty()
    .withMessage("description can not be empty")
    .isLength({ min: 0, max: 300 })
    .withMessage("description must be less than 300 character"),
];
//CHECKING ON MAIN TOPICS
const mainTopicValidator = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("main topic can not be empty")
    .isIn(MainTopics)
    .withMessage("This Main Topic is not available"),
];
//CHECKING ON SUB TOPICS
const subTopicValidator = [
  body("title").not().isEmpty().withMessage("subtopic can not be empty"),
];

const subredditNameValidator = [
  body("subredditName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Subreddit name can not be empty")
    .isLength({ min: 0, max: 23 })
    .withMessage("Subreddit name must be less than 23 character"),
];

//CREATE SUBREDDIT
const createSubreddit = async (req, res) => {
  try {
    const result = await addSubreddit(req, req.payload);
    res.status(result.statusCode).json(result.message);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const joinSubreddit = async (req, res) => {
  const authPayload = req.payload;
  //GETTING USER USERNAME
  const username = authPayload.username;
  try {
    //GETTING USER DATA,CHECKING FOR HIS EXISTENCE
    const user = await searchForUserService(username);
    //GETTING SUBREDDIT DATA,CHECKING FOR ITS EXISTENCE
    const subreddit = await searchForSubredditById(req.body.subredditId);
    //IF THE REQUESTED SUBREDDIT IS PRIVATE,THEN THE USER WOULD BE ADDED TO THE WAITING LIST WAITING FOR MODERATOR TO APPROVE
    if (subreddit.type === "Private") {
      if (subreddit.subredditSettings.acceptingRequestsToJoin) {
        const result = await addToJoinedSubreddit(user, subreddit);
        res.status(result.statusCode).json(result.message);
      } else {
        let err = new Error("you are not allowed to join this subreddit");
        err.statusCode = 401;
        throw err;
      }
    } else {
      const result = await addToJoinedSubreddit(user, subreddit);
      res.status(result.statusCode).json(result.message);
    }
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const leaveSubreddit = async (req, res) => {
  try {
    const user = await getUserFromJWTService(req.payload.userId);
    const subreddit = await getSubredditService(req.body.subredditName);

    const result = await leaveSubredditService(user, subreddit);
    res.status(result.statusCode).json(result.message);
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const addDescription = async (req, res) => {
  try {
    //GETTING SUBREDDIT DATA
    await searchForSubreddit(req.params.subreddit);
    //ADDING DESCRIPTION OF THE SUBREDDIT
    const result = await addToDescription(
      req.params.subreddit,
      req.body.description
    );

    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const addMainTopic = async (req, res) => {
  try {
    //GETTING SUBREDDIT DATA
    await searchForSubreddit(req.params.subreddit);
    //ADDING THE MAIN TOPIC OF THE SUBREDDIT
    const result = await addToMainTopic(req.params.subreddit, req.body.title);

    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const addSubTopics = async (req, res) => {
  try {
    await searchForSubreddit(req.params.subreddit);
    //ADDING DESCRIPTION OF THE SUBREDDIT
    const result = await addToSubtopics(
      req.params.subreddit,
      req.body.title,
      MainTopics
    );
    //SENDING RESPONSES
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const availableSubredditName = async (req, res) => {
  try {
    const result = await subredditNameAvailable(req.query.subredditName);
    //SENDING RESPONSES
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const addToFavorite = async (req, res) => {
  try {
    const subreddit = await searchForSubreddit(req.params.subreddit);
    const user = await searchForUserService(req.payload.username);
    await checkForPrivateSubreddits(user, subreddit);
    const isFavorite = await checkForFavoriteSubreddits(user, subreddit);
    if (isFavorite) {
      let error = new Error(
        `${subreddit.title} is a favorite subreddit already`
      );
      error.statusCode = 400;
      throw error;
    }
    const result = await makeSubredditFavorite(
      user,
      subreddit.title,
      subreddit.id
    );

    //SENDING RESPONSES
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const removeFromFavorite = async (req, res) => {
  try {
    const subreddit = await searchForSubreddit(req.params.subreddit);
    const user = await searchForUserService(req.payload.username);
    await checkForPrivateSubreddits(user, subreddit);
    const isFavorite = await checkForFavoriteSubreddits(user, subreddit);
    if (!isFavorite) {
      let error = new Error(`${subreddit.title} is not favorite already`);
      error.statusCode = 400;
      throw error;
    }
    const result = await removeSubredditFromFavorite(user, subreddit.title);

    //SENDING RESPONSES
    return res.status(result.statusCode).json(result.message);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const subredditLeaderboardWithCategory = async (req, res) => {
  try {
    let { before, after, limit } = req.query;
    let user;
    if (req.loggedIn) {
      user = await searchForUserService(req.payload.username);
    }
    const result = await subredditCategoryListing(
      user,
      req.params.categoryName,
      before,
      after,
      limit,
      true,
      req.loggedIn
    );
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const subredditLeaderboard = async (req, res) => {
  try {
    let { before, after, limit } = req.query;
    let user;
    if (req.loggedIn) {
      user = await searchForUserService(req.payload.username);
    }
    const result = await subredditCategoryListing(
      user,
      "",
      before,
      after,
      limit,
      false,
      req.loggedIn
    );
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const randomCategories = async (req, res) => {
  try {
    let user;
    if (req.loggedIn) {
      user = await searchForUserService(req.payload.username);
    }
    const result = await twoRandomCategories(user, req.loggedIn);
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

const trendingSubreddits = async (req, res) => {
  try {
    let { before, after, limit } = req.query;
    let user;
    if (req.loggedIn) {
      user = await searchForUserService(req.payload.username);
    }
    const result = await subredditTrendingListing(
      user,
      before,
      after,
      limit,
      req.loggedIn
    );
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

export default {
  createSubreddit,
  joinSubreddit,
  subredditValidator,
  descriptionValidator,
  addDescription,
  addMainTopic,
  addSubTopics,
  mainTopicValidator,
  subTopicValidator,
  addToFavorite,
  removeFromFavorite,
  availableSubredditName,
  subredditLeaderboard,
  subredditLeaderboardWithCategory,
  subredditNameValidator,
  leaveSubreddit,
  randomCategories,
  trendingSubreddits,
};
