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

    if (userId === userToBlock._id.toString()) {
      return res.status(400).json({ error: "User can not block himself" });
    }

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

// eslint-disable-next-line max-statements
const followUser = async (req, res) => {
  try {
    const { username, follow } = req.body;

    const userToFollow = await User.findOne({ username: username });
    if (!userToFollow) {
      return res.status(404).json("Didn't find a user with that username");
    }

    const { userId } = req.payload;
    const user = await User.findById(userId);

    if (userId === userToFollow._id.toString()) {
      return res.status(400).json({ error: "User can not follow himself" });
    }

    // get the index of the id of the current user in followers list for the user to follow
    const index = userToFollow.followers.findIndex(
      (elem) => elem.toString() === user._id.toString()
    );

    if (follow) {
      if (index === -1) {
        userToFollow.followers.push(user._id);
        await userToFollow.save();
      }
      res.status(200).json("User followed successfully");
    } else {
      if (index !== -1) {
        userToFollow.followers.splice(index, 1);
        await userToFollow.save();
      }
      res.status(200).json("User unfollowed successfully");
    }
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
