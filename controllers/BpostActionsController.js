import { body } from "express-validator";

const postActionsValidator = [
  body("id").not().isEmpty().withMessage("Id can not be empty"),
];

const markSpoiler = async (req, res) => {
  try {
    // check if the post already marked as spoiler
    if (req.post.spoiler) {
      return res.status(409).json("Post content already blurred");
    }

    // else mark it as spoiler and save
    req.post.spoiler = true;
    await req.post.save();
    res.json("Spoiler set successfully");
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

const unmarkSpoiler = async (req, res) => {
  try {
    // check if the post already unmarked as spoiler
    if (!req.post.spoiler) {
      return res.status(409).json("Post spoiler already turned off");
    }

    // else unmark it and save
    req.post.spoiler = false;
    await req.post.save();
    res.json("Post spoiler turned off successfully");
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

const markNSFW = async (req, res) => {
  try {
    // check if the post already marked as nsfw
    if (req.post.nsfw) {
      return res.status(409).json("Post already marked NSFW");
    }

    // else mark it as nsfw and save
    req.post.nsfw = true;
    await req.post.save();
    res.json("Post marked NSFW successfully");
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

const unmarkNSFW = async (req, res) => {
  try {
    // check if the post already marked as nsfw
    if (!req.post.nsfw) {
      return res.status(409).json("NSFW mark already removed");
    }

    // else mark it as nsfw and save
    req.post.nsfw = false;
    await req.post.save();
    res.json("NSFW unmarked successfully");
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

export default {
  postActionsValidator,
  markSpoiler,
  unmarkSpoiler,
  markNSFW,
  unmarkNSFW,
};
