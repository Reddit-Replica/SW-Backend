import {
  validateCreatingRuleBody,
  validateEditingRuleBody,
} from "../utils/subredditRules.js";

import {
  checkEditRulesOrderService,
  editRulesOrderService,
  checkDublicateRuleOrderService,
} from "../services/subredditRules.js";

const getSubredditRules = (req, res) => {
  const rules = [];

  const compare = (a, b) => {
    if (a.ruleOrder < b.ruleOrder) {
      return -1;
    }
    if (a.ruleOrder > b.ruleOrder) {
      return 1;
    }
    return 0;
  };

  req.subreddit.rules.forEach((el) => {
    if (!el.deletedAt) {
      rules.push({
        ruleId: el._id,
        ruleName: el.ruleTitle,
        ruleOrder: el.ruleOrder,
        createdAt: new Date(el.createdAt),
        appliesTo: el.appliesTo,
        reportReason: el.reportReason ? el.reportReason : null,
        description: el.ruleDescription ? el.ruleDescription : null,
      });
    }
  });
  rules.sort(compare);
  res.status(200).json({
    rules: rules,
  });
};

const addSubredditRule = async (req, res) => {
  const validationResult = validateCreatingRuleBody(req);

  if (!validationResult) {
    res.status(400).json({
      error: "Bad request",
    });
  } else if (req.subreddit.numberOfRules === 15) {
    res.status(400).json({
      error: "Maximum number of rules!",
    });
  } else {
    req.ruleObject.ruleOrder = req.subreddit.numberOfRules;
    req.subreddit.numberOfRules++;

    req.ruleObject.createdAt = new Date().toISOString();

    req.subreddit.rules.push(req.ruleObject);

    try {
      await req.subreddit.save();

      res.status(201).json("Created");
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
};

// eslint-disable-next-line max-statements
const editSubredditRule = async (req, res) => {
  const validationResult = validateEditingRuleBody(req);
  if (!validationResult) {
    res.status(400).json({
      error: "Bad request",
    });
  } else if (req.neededRule.ruleOrder.toString() !== req.ruleObject.ruleOrder) {
    {
      res.status(400).json({
        error: "Rule id and rule order don't match",
      });
    }
  } else {
    req.neededRule.ruleTitle = req.ruleObject.ruleTitle;
    req.neededRule.appliesTo = req.ruleObject.appliesTo;
    if (req.ruleObject.reportReason) {
      req.neededRule.reportReason = req.ruleObject.reportReason;
    }
    if (req.ruleObject.ruleDescription) {
      req.neededRule.ruleDescription = req.ruleObject.ruleDescription;
    }
    try {
      req.neededRule.updatedAt = new Date().toISOString();
      // console.log(req.neededRule);
      await req.subreddit.save();
      res.status(200).json("Updated successfully");
    } catch (err) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
};

const deleteSubredditRule = async (req, res) => {
  req.neededRule.deletedAt = new Date().toISOString();
  req.subreddit.numberOfRules--;
  const neededRuleOrder = req.neededRule.ruleOrder;
  req.subreddit.rules.forEach((element) => {
    if (Number(element.ruleOrder) > Number(neededRuleOrder)) {
      element.ruleOrder--;
    }
  });
  try {
    await req.subreddit.save();
    res.status(200).json("Deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const editRulesOrder = async (req, res) => {
  try {
    checkEditRulesOrderService(req);
    checkDublicateRuleOrderService(req);
    await editRulesOrderService(req);
    res.status(200).json("Accepted");
  } catch (err) {
    console.log(err.message);
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json("Internal server error");
    }
  }
};

export default {
  getSubredditRules,
  addSubredditRule,
  editSubredditRule,
  deleteSubredditRule,
  editRulesOrder,
};
