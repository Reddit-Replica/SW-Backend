/* eslint-disable max-len */
import verifyUser from "../utils/verifyUser.js";
import Subreddit from "./../models/Community.js";
import User from "./../models/User.js";
import { body } from "express-validator";
//CHECKING ON SUBREDDIT DATA
// eslint-disable-next-line max-statements
const subredditValidator = [
  body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("title can not be empty")
    .isLength({ min: 0, max: 23 })
    .withMessage("title must be less than 23 character"),
  body("category").not().isEmpty().withMessage("category can not be empty"),
  body("type").not().isEmpty().withMessage("type can not be empty"),
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
  body("title").not().isEmpty().withMessage("main topic can not be empty"),
];
//CHECKING ON SUB TOPICS
const subTopicValidator = [
  body("title").not().isEmpty().withMessage("sub topic can not be empty"),
];

//CREATE SUBREDDIT
// eslint-disable-next-line max-statements
const createSubreddit = async (req, res) => {
  //CHECK FOR TOKEN
  const authPayload = verifyUser(req);
  if (!authPayload) {
    throw new Error("Token may be invalid or not found");
  }
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
    moderator.ownedSubreddits.push({
      subredditId: subreddit.id,
      name: title,
    });
    //ADD THIS SUBREDDIT TO THE ONES HE FOLLOWS
    await moderator.save();
    moderator.joinedSubreddits.push({
      subredditId: subreddit.id,
      name: title,
    });
    await moderator.save();
    //RETURN RESPONSE
    res.status(201).send({
      subreddit: subreddit,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};
//JOINING A SUBREDDIT
// eslint-disable-next-line max-statements
const joinSubreddit = async (req, res) => {
  //CHECKING FOR USER
  const authPayload = verifyUser(req);
  if (!authPayload) {
    throw new Error("Token may be invalid or not found");
  }
  //GETTING USER ID
  const userId = authPayload.userId;
  try {
    //GETTING USER DATA
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("this user isn't found");
    }
    //GETTING SUBREDDIT DATA
    const subreddit = await Subreddit.findById(req.body.subredditId);
    if (!subreddit) {
      throw new Error("this subreddit isn't found");
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
    res.status(200).json({ message: "you joined the subreddit successfully" });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// eslint-disable-next-line max-statements
const addDescription = async (req, res) => {
  //CHECKING FOR USER
  console.log("a");
  const authPayload = verifyUser(req);
  if (!authPayload) {
    throw new Error("Token may be invalid or not found");
  }
  try {
    //GETTING SUBREDDIT DATA
    const subreddit = await Subreddit.findOne({ title: req.params.subreddit });
    if (!subreddit) {
      throw new Error("this subreddit isn't found");
    }
    //ADDING DESCRIPTION OF THE SUBREDDIT
    subreddit.description = req.body.description;
    await subreddit.save();
    //SENDING RESPONSES
    res.status(201).json("Subreddit settings updated successfully");
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

const addMainTopic = async (req, res) => {
  //CHECKING FOR USER
  const authPayload = verifyUser(req);
  if (!authPayload) {
    throw new Error("Token may be invalid or not found");
  }
  try {
    //GETTING SUBREDDIT DATA
    const subreddit = await Subreddit.findOne({ title: req.params.subreddit });
    if (!subreddit) {
      throw new Error("this subreddit isn't found");
    }
    //ADDING DESCRIPTION OF THE SUBREDDIT
    subreddit.mainTopic = req.body.title;
    await subreddit.save();
    //SENDING RESPONSES
    res.status(201).json("Successfully updated primary topic!");
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// eslint-disable-next-line max-statements
const addSubTopics = async (req, res) => {
  //CHECKING FOR USER
  console.log("a");
  const authPayload = verifyUser(req);
  if (!authPayload) {
    throw new Error("Token may be invalid or not found");
  }
  try {
    //GETTING SUBREDDIT DATA
    console.log("b");
    const subreddit = await Subreddit.findOne({ title: req.params.subreddit });
    if (!subreddit) {
      throw new Error("this subreddit isn't found");
    }
    console.log("c");
    //ADDING DESCRIPTION OF THE SUBREDDIT
    subreddit.subTopics = req.body.title;
    console.log("d");
    await subreddit.save();
    //SENDING RESPONSES
    console.log("e");
    res.status(201).json("Community topics saved");
    console.log("f");
  } catch (err) {
    console.log("g");
    res.status(400).json({
      error: err.message,
    });
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

/* random username generator
const generateRandomUsername= async (req, res) => {
  try{
  while(true){
    int typeOfUsername= Math.floor(Math.random() * 2);
    int numOfDigits= Math.floor(Math.random() * 6);
    let RandomUsername;
    if(typeOfUsername){
    RandomUsername = generateUsername("",numOfDigits,15);
    }else{
    RandomUsername = generateUsername("-",numOfDigits,15);
    }
    const user= User.findOne(username:RandomUsername);
    if(!user){
        res.status(200).json({username:RandomUsername});
        break;
    }
  }
} catch (err) {
  res.status(400).json({error:err.message});
}
}
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
