import subredditRules from "../utils/subredditRules.js";

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
  const validationResult = subredditRules.validateCreatingRuleBody(req);

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

export default {
  getSubredditRules,
  addSubredditRule,
};
