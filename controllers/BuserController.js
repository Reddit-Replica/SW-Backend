import { body, param } from "express-validator";
import {
  getUserFromJWTService,
  searchForUserService,
  blockUserService,
  followUserService,
  getUserAboutDataService,
} from "../services/userServices.js";

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

const aboutUserValidator = [
  param("username")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Username can not be empty"),
];

const blockUser = async (req, res) => {
  try {
    // here we have user to block
    const userToBlock = await searchForUserService(req.body.username);

    // here we get the user in the jwt
    const user = await getUserFromJWTService(req.payload.userId);

    const result = await blockUserService(user, userToBlock, req.body.block);
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

// eslint-disable-next-line max-statements
const followUser = async (req, res) => {
  try {
    // here we have user to follow
    const userToFollow = await searchForUserService(req.body.username);

    // here we get the user in the jwt
    const user = await getUserFromJWTService(req, req.payload.userId);

    const result = await followUserService(user, userToFollow, req.body.block);
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

const aboutUser = async (req, res) => {
  try {
    // get the user of the current profile
    let result = await getUserAboutDataService(req.params.username, req.userId);

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
  blockUserValidator,
  blockUser,
  followUserValidator,
  followUser,
  aboutUserValidator,
  aboutUser,
};
