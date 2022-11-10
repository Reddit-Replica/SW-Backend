/* eslint-disable max-len */
import Subreddit from "./../models/Community.js";
import User from "./../models/User.js";
import { body } from "express-validator";
//CHECKING ON SUBREDDIT DATA
// eslint-disable-next-line max-statements
let Categories = [
  "Sports",
  "Gaming",
  "News",
  "TV",
  "Aww",
  "Memes",
  "Pics & Gifs",
  "Travel",
  "Tech",
  "Music",
  "Art & Design",
  "Beauty",
  "Books & Writing",
  "Crypto",
  "Discussion",
  "E3",
  "Fashion",
  "Finance & Business",
  "Food",
  "Health & Fitness",
  "Learning",
  "Mindblowing",
  "ourdoors",
  "parenting",
  "Photography",
  "Relationships",
  "Science",
  "Videos",
  "Vroom",
  "Wholesome",
];
let MainTopics = [
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
  body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("title can not be empty")
    .isLength({ min: 0, max: 23 })
    .withMessage("title must be less than 23 character"),
  body("category")
    .trim()
    .not()
    .isEmpty()
    .withMessage("category can not be empty")
    .isIn(Categories)
    .withMessage("This category is not available"),
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
  body("title").not().isEmpty().withMessage("sub topic can not be empty"),
];

//CREATE SUBREDDIT
// eslint-disable-next-line max-statements
const createSubreddit = async (req, res) => {
  //CHECK FOR TOKEN
  const authPayload = req.payload;
  //GETTING USER DATA
  const creatorUsername = authPayload.username;
  const creatorId = authPayload.userId;
  const { title, category, type, nsfw } = req.body;
  const owner = {
    username: creatorUsername,
    userID: creatorId,
  };
  const moderators = [];
  moderators.push({
    username: creatorUsername,
    userID: creatorId,
  });
  try {
    //ADDING NEW SUBREDDIT
    const subreddit = await new Subreddit({
      title: title,
      category: category,
      type: type,
      nsfw: nsfw,
      owner: owner,
      moderators: moderators,
    }).save();
    //MAKE THE USER OWNER OF THE SUBREDDIT
    const moderator = await User.findById(creatorId);
    const addedSubreddit = {
      subredditId: subreddit.id,
      name: title,
    };
    moderator.ownedSubreddits.push(addedSubreddit);
    moderator.joinedSubreddits.push(addedSubreddit);
    await moderator.save();
    //RETURN RESPONSE
    return res.status(201).send({
      subreddit: subreddit,
    });
  } catch (err) {
    if (err.cause) {
      return res.status(err.cause).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};
//JOINING A SUBREDDIT
// eslint-disable-next-line max-statements
const joinSubreddit = async (req, res) => {
  //CHECKING FOR USER
  const authPayload = req.payload;
  //GETTING USER ID
  const userId = authPayload.userId;
  const username = authPayload.username;
  try {
    //GETTING USER DATA
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("this user isn't found", { cause: 400 });
    }
    //GETTING SUBREDDIT DATA
    const subreddit = await Subreddit.findById(req.body.subredditId);
    if (!subreddit) {
      throw new Error("this subreddit isn't found", { cause: 400 });
    }
    if (!subreddit.deletedAt) {
      throw new Error("this subreddit is deleted", { cause: 400 });
    }
    if (subreddit.type === "Private") {
      subreddit.waitedUsers.push({
        username: username,
        userID: userId,
        message: req.body.message,
      });
      await subreddit.save();
      return res
        .status(200)
        .json("Your request is sent successfully" );
    }
    //ADDING THIS SUB REDDIT TO JOINED SUBREDDITS LIST
    user.joinedSubreddits.push({
      subredditId: subreddit.id,
      name: subreddit.title,
    });
    await user.save();
    //INCREASING NUMBER OF MEMBERS OF SUBREDDIT
    subreddit.members += 1;
    await subreddit.save();
    //SENDING RESPONSES
    return res.status(200).json("you joined the subreddit successfully");
  } catch (err) {
    if (err.cause) {
      return res.status(err.cause).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

// eslint-disable-next-line max-statements
const addDescription = async (req, res) => {
  try {
    //GETTING SUBREDDIT DATA
    const subreddit = await Subreddit.findOne({ title: req.params.subreddit });
    if (!subreddit) {
      throw new Error("this subreddit isn't found", { cause: 400 });
    }
    if (!subreddit.deletedAt) {
      throw new Error("this subreddit is deleted", { cause: 400 });
    }
    //ADDING DESCRIPTION OF THE SUBREDDIT
    subreddit.description = req.body.description;
    await subreddit.save();
    //SENDING RESPONSES
    return res.status(201).json("Subreddit settings updated successfully");
  } catch (err) {
    if (err.cause) {
      return res.status(err.cause).json({
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
    const subreddit = await Subreddit.findOne({ title: req.params.subreddit });
    if (!subreddit) {
      throw new Error("this subreddit isn't found", { cause: 400 });
    }
    if (!subreddit.deletedAt) {
      throw new Error("this subreddit is deleted", { cause: 400 });
    }
    //ADDING DESCRIPTION OF THE SUBREDDIT
    subreddit.mainTopic = req.body.title;
    await subreddit.save();
    //SENDING RESPONSES
    return res.status(201).json("Successfully updated primary topic!");
  } catch (err) {
    if (err.cause) {
      return res.status(err.cause).json({
        error: err.message,
      });
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
};

// eslint-disable-next-line max-statements
const addSubTopics = async (req, res) => {
  try {
    //GETTING SUBREDDIT DATA
    const subreddit = await Subreddit.findOne({ title: req.params.subreddit });
    if (!subreddit) {
      throw new Error("this subreddit isn't found", { cause: 400 });
    }
    if (!subreddit.deletedAt) {
      throw new Error("this subreddit is deleted", { cause: 400 });
    }
    //ADDING DESCRIPTION OF THE SUBREDDIT
    const validateArr = req.body.title;
    validateArr.forEach(function (subtopic) {
      if (!MainTopics.includes(subtopic)) {
        throw new Error(`subtopic ${subtopic} is not available`, {
          cause: 400,
        });
      }
    });
    subreddit.subTopics = req.body.title;
    await subreddit.save();
    //SENDING RESPONSES
    return res.status(201).json("Community topics saved");
  } catch (err) {
    if (err.cause) {
      return res.status(err.cause).json({
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
