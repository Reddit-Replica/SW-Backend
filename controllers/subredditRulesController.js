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

export default {
  getSubredditRules,
};
