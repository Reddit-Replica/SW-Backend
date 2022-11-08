import subredditRulesUtil from "../utils/subredditRules.js";

const getSubredditRules = (req, res) => {
  const rules = req.subreddit.rules.map((el) => {
    return {
      ruleId: el._id,
      ruleName: el.ruleTitle,
      ruleOrder: el.ruleOrder,
      createdAt: new Date(el.createdAt),
      appliesTo: el.appliesTo,
      reportReason: el.reportReason ? el.reportReason : null,
      description: el.ruleDescription ? el.ruleDescription : null,
    };
  });
  // console.log(rules);
  res.status(200).json({
    rules: rules,
  });
};

const addSubredditRule = async (req, res) => {
  const validationResult = subredditRulesUtil.validateCreatingRuleBody(req);

  if (!validationResult) {
    res.status(400).json({
      error: "Bad request",
    });
  } else {
    req.ruleObject.ruleOrder = req.subreddit.rules.length;

    req.ruleObject.createdAt = new Date().toISOString();

    req.subreddit.rules.push(req.ruleObject);

    try {
      await req.subreddit.save();

      res.status(200).json(req.subreddit.rules);
    } catch (err) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
};

// eslint-disable-next-line max-statements
const editSubredditRule = async (req, res) => {
  const validationResult = subredditRulesUtil.validateEditingRuleBody(req);
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
      req.neededRule.updatedAt = Date.now();
      console.log(req.neededRule);
      await req.subreddit.save();
      res.status(200).json("Accepted");
    } catch (err) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
};

export default {
  getSubredditRules,
  addSubredditRule,
  editSubredditRule,
};
