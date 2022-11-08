import Subreddit from "../models/Community.js";
import mongoose from "mongoose";

const checkRule = (req, res, next) => {
  const ruleId = req.params.ruleId;
  const neededRule = req.subreddit.rules.find(
    (el) => el._id.toString() === ruleId
  );

  if (!neededRule) {
    res.status(404).json({
      error: "Rule not found!",
    });
  } else {
    req.neededRule = neededRule;
    next();
  }
};

const validateRuleId = (req, res, next) => {
  const ruleId = req.params.ruleId;
  if (!mongoose.Types.ObjectId.isValid(ruleId)) {
    return res.status(400).json({
      error: "Invalid id",
    });
  } else {
    next();
  }
};

export default {
  checkRule,
  validateRuleId,
};
