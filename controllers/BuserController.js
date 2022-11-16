import { body } from "express-validator";
import {
  getUserFromJWTService,
  searchForUserService,
  blockUserService,
  followUserService,
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

const blockUser = async (req, res) => {
  try {
    // here we have user to block in req.foundUser
    await searchForUserService(req);

    // here we get the user in the jwt
    await getUserFromJWTService(req);

    const result = await blockUserService(
      req.user,
      req.foundUser,
      req.body.block
    );
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
    // here we have user to follow in req.foundUser
    await searchForUserService(req);

    // here we get the user in the jwt
    await getUserFromJWTService(req);

    const result = await followUserService(
      req.user,
      req.foundUser,
      req.body.block
    );
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

export default {
  blockUserValidator,
  blockUser,
  followUserValidator,
  followUser,
};
