/* eslint-disable max-statements */
/* eslint-disable max-len */
import { body } from "express-validator";
import {
  searchForSubreddit,
  addUserToWaitingList,
  addToJoinedSubreddit,
  addToDescription,
  addToSubtopics,
  addToMainTopic,
  searchForSubredditById,
  addSubreddit,
} from "./../services/communityServices.js";
import { searchForUserService } from "../services/userServices.js";
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
      const result = await addUserToWaitingList(
        subreddit,
        username,
        req.body.message
      );
      res.status(result.statusCode).json(result.message);
    } else {
      //ADDING THIS SUBREDDIT TO JOINED SUBREDDITS LIST, INCREMENTING SUBREDDIT NUMBER OF MEMBERS
      const result = await addToJoinedSubreddit(user, subreddit);
      res.status(result.statusCode).json(result.message);
    }
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

/* we need to add moderated subreddits in user then we will push this user to them
const moderate = async(req,res)=>{
  const authPayload = verifyUser(req);
  if (!authPayload) {
    return res.status(401).send("Token may be invalid or not found");
  }
  const ModeratorId=authPayload.userId;
  try {
    const moderator=await User.findById(ModeratorId);
    moderator.joinedSubreddits.push({
      id:req.body.subredditID,
      name:req.body.title,
    });
    await moderator.save();

    res.status(200).send({
      moderator:moderator.joinedSubreddits,
    });

  } catch (err) {
    res.status(400).send({
      error:err,
    });
  }
};
*/

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
};
