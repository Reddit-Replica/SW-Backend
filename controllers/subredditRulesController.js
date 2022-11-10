import subredditRulesUtil from "../utils/subredditRules.js";

const getSubredditRules = (req, res) => {
  const rules = [];

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
    req.ruleObject.ruleOrder = 0;
    /*
    loop through the rules array for it's end to find the last non deleted rule to know the order of the new rule
    */
    for (let i = req.subreddit.rules.length - 1; i >= 0; i--) {
      if (!req.subreddit.rules[i].deletedAt) {
        req.ruleObject.ruleOrder = req.subreddit.rules[i].ruleOrder + 1;
        break;
      }
    }

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

export default {
  getSubredditRules,
  addSubredditRule,
  editSubredditRule,
  deleteSubredditRule,
};
