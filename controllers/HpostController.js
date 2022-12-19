/* eslint-disable max-len */
import { body, check, query } from "express-validator";
import {
  checkSameUserEditing,
  editPostService,
} from "../services/postServices.js";
import { homePostsListing } from "../services/PostListing.js";
import { searchForUserService } from "../services/userServices.js";
import {
  checkUserPinnedPosts,
  getPinnedPostDetails,
  setPinnedPostsFlags,
} from "../services/getPinnedPosts.js";
const postIdValidator = [
  query("id").not().isEmpty().withMessage("Id can't be empty"),
];

const pinPostValidator = [
  body("id").not().isEmpty().withMessage("Id can't be empty"),
  body("pin").not().isEmpty().withMessage("Pin/unpin flag is required"),
];

const submitValidator = [
  body("kind").not().isEmpty().withMessage("Post kind can't be empty"),
  check("kind").isIn(["hybrid", "link", "image", "video", "post"]),
  body("title").not().isEmpty().withMessage("Post title can't be empty"),
  body("inSubreddit").not().isEmpty().withMessage("Post place can't be empty"),
];

const editValidator = [
  body("content").not().isEmpty().withMessage("Content can't be empty"),
  body("postId").not().isEmpty().withMessage("postId can't be empty"),
];

const submit = async (req, res) => {
  const user = req.user;
  const post = req.post;
  try {
    await post.save();
    await user.save();
    res.status(201).json({
      id: post.id.toString(),
    });
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

const pinPost = async (req, res) => {
  const user = req.user;
  const postId = req.postId;
  try {
    if (req.body.pin) {
      user.pinnedPosts.push(postId);
      await user.save();
      res.status(200).json("Post pinned successfully!");
    } else {
      user.pinnedPosts = user.pinnedPosts.filter(
        (id) => id.toString() !== postId
      );
      await user.save();
      res.status(200).json("Post unpinned successfully!");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

// eslint-disable-next-line max-statements
const getPinnedPosts = async (req, res) => {
  const userId = req.payload?.userId;
  try {
    let { loggedInUser, user } = await checkUserPinnedPosts(
      req.loggedIn,
      userId,
      req.query.username
    );
    user.pinnedPosts = user.pinnedPosts.filter((post) => !post.deletedAt);
    const pinnedPosts = user.pinnedPosts.map((post) => {
      let vote = 0,
        yourPost = false,
        inYourSubreddit = false;
      if (req.loggedIn) {
        const result = setPinnedPostsFlags(loggedInUser, post);
        vote = result.vote;
        yourPost = result.yourPost;
        inYourSubreddit = result.inYourSubreddit;
      }
      return getPinnedPostDetails(post, { vote, yourPost, inYourSubreddit });
    });
    return res.status(200).json({
      pinnedPosts: pinnedPosts,
    });
  } catch (error) {
    console.log(error.message);
    if (error.statusCode) {
      if (error.statusCode === 400) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(error.statusCode).json(error.message);
      }
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const postDetails = async (req, res) => {
  return res.status(200).json(req.postObj);
};

const postInsights = async (req, res) => {
  try {
    return res.status(200).json({
      totalViews: req.post.numberOfViews,
      upvoteRate: req.post.insights.upvoteRate,
      communityKarma: req.post.insights.communityKarma,
      totalShares: req.post.insights.totalShares,
    });
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

const editPost = async (req, res) => {
  try {
    const neededPost = await checkSameUserEditing(
      req.body.postId,
      req.payload.userId
    );
    await editPostService(neededPost, req.body.content);
    res.status(200).json("Post edited successfully");
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getNewPosts = async (req, res) => {
  try {
    let user;
    if (req.loggedIn) {
      user = await searchForUserService(req.payload.username);
    }
    const { before, after, limit } = req.query;
    const result = await homePostsListing(
      user,
      { before, after, limit },
      "new",
      req.loggedIn
    );
    res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getHotPosts = async (req, res) => {
  try {
    let user;
    if (req.loggedIn) {
      user = await searchForUserService(req.payload.username);
    }
    const { before, after, limit } = req.query;
    const result = await homePostsListing(
      user,
      { before, after, limit },
      "hot",
      req.loggedIn
    );
    res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getBestPosts = async (req, res) => {
  try {
    let user;
    if (req.loggedIn) {
      user = await searchForUserService(req.payload.username);
    }
    const { before, after, limit } = req.query;
    const result = await homePostsListing(
      user,
      { before, after, limit },
      "best",
      req.loggedIn
    );
    res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getTopPosts = async (req, res) => {
  try {
    let user;
    if (req.loggedIn) {
      user = await searchForUserService(req.payload.username);
    }
    const { before, after, limit, time } = req.query;
    const result = await homePostsListing(
      user,
      { before, after, limit, time },
      "top",
      req.loggedIn
    );
    res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

const getTrendingPosts = async (req, res) => {
  try {
    let user;
    if (req.loggedIn) {
      user = await searchForUserService(req.payload.username);
    }
    const { before, after, limit } = req.query;
    const result = await homePostsListing(
      user,
      { before, after, limit },
      "trending",
      req.loggedIn
    );
    res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

export default {
  postIdValidator,
  pinPostValidator,
  submitValidator,
  submit,
  pinPost,
  getPinnedPosts,
  postDetails,
  postInsights,
  editPost,
  editValidator,
  getNewPosts,
  getBestPosts,
  getHotPosts,
  getTopPosts,
  getTrendingPosts,
};
