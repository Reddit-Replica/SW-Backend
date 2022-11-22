import { body, param } from "express-validator";
import { listingUserProfileService } from "../services/userProfileListing.js";
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

const usernameValidator = [
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
    const user = await getUserFromJWTService(req.payload.userId);

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
    const result = await getUserAboutDataService(
      req.params.username,
      req.userId
    );

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

const userPosts = async (req, res) => {
  try {
    const { sort, time, before, after, limit } = req.query;

    const userToShow = await searchForUserService(req.params.username);
    const user = await getUserFromJWTService(req.userId);

    const result = await listingUserProfileService(userToShow, user, "posts", {
      sort,
      time,
      before,
      after,
      limit,
    });

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

const userUpvotedPosts = async (req, res) => {
  try {
    if (req.params.username !== req.payload.username) {
      return res.status(401).json("Access Denied");
    }
    const { sort, time, before, after, limit } = req.query;
    const userToShow = await searchForUserService(req.params.username);
    const user = await getUserFromJWTService(req.payload.userId);

    const result = await listingUserProfileService(
      userToShow,
      user,
      "upvotedPosts",
      { sort, time, before, after, limit }
    );

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

const userDownvotedPosts = async (req, res) => {
  try {
    if (req.params.username !== req.payload.username) {
      return res.status(401).json("Access Denied");
    }
    const { sort, time, before, after, limit } = req.query;
    const userToShow = await searchForUserService(req.params.username);
    const user = await getUserFromJWTService(req.payload.userId);

    const result = await listingUserProfileService(
      userToShow,
      user,
      "downvotedPosts",
      { sort, time, before, after, limit }
    );

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

const userHiddenPosts = async (req, res) => {
  try {
    if (req.params.username !== req.payload.username) {
      return res.status(401).json("Access Denied");
    }
    const { sort, time, before, after, limit } = req.query;
    const userToShow = await searchForUserService(req.params.username);
    const user = await getUserFromJWTService(req.payload.userId);

    const result = await listingUserProfileService(
      userToShow,
      user,
      "hiddenPosts",
      { sort, time, before, after, limit }
    );

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

const userHistoryPosts = async (req, res) => {
  try {
    if (req.params.username !== req.payload.username) {
      return res.status(401).json("Access Denied");
    }
    const { sort, time, before, after, limit } = req.query;
    const userToShow = await searchForUserService(req.params.username);
    const user = await getUserFromJWTService(req.payload.userId);

    const result = await listingUserProfileService(
      userToShow,
      user,
      "historyPosts",
      { sort, time, before, after, limit }
    );

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
  usernameValidator,
  aboutUser,
  userPosts,
  userUpvotedPosts,
  userDownvotedPosts,
  userHiddenPosts,
  userHistoryPosts,
};
