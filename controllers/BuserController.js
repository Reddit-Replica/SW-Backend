import { body } from "express-validator";

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

const blockUser = async (req, res) => {
  try {
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
