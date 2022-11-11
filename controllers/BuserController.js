import { body } from "express-validator";
import User from "./../models/User.js";

const blockUserValidator = [
  body("username")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Username can not be empty"),
  body("block").not().isEmpty().withMessage("Block flag can not be empty"),
];

const followUserValidator = [
  body("username")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Username can not be empty"),
  body("follow").not().isEmpty().withMessage("Follow flag can not be empty"),
];

// eslint-disable-next-line max-statements
const blockUser = async (req, res) => {
  try {
    const { username, block } = req.body;

    const userToBlock = await User.findOne({ username: username });
    if (!userToBlock) {
      return res.status(404).json("Didn't find a user with that username");
    }

    const { userId } = req.payload;
    const user = await User.findById(userId);

    // get the index of the id of the user to be blocked if he was blocked before
    const index = user.blockedUsers.findIndex(
      (elem) => elem.toString() === userToBlock._id.toString()
    );

    if (block) {
      if (index === -1) {
        user.blockedUsers.push(userToBlock._id);
        await user.save();
      }
      res.status(200).json("User blocked successfully");
    } else {
      if (index !== -1) {
        user.blockedUsers.splice(index, 1);
        await user.save();
      }
      res.status(200).json("User unblocked successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
const followUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export default {
  blockUserValidator,
  blockUser,
  followUserValidator,
  followUser,
};
