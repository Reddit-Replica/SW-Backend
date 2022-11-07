const validateCreatingRuleBody = (req) => {
  if (!req.body.ruleName || !req.body.appliesTo) {
    return false;
  } else if (
    req.body.appliesTo !== "posts and comments" &&
    req.body.appliesTo !== "posts only" &&
    req.body.appliesTo !== "comments only"
  ) {
    return false;
  } else {
    const ruleObject = {
      ruleTitle: req.body.ruleName,
      appliesTo: req.body.appliesTo,
    };
    if (req.body.description) {
      ruleObject.ruleDescription = req.body.description;
    }
    if (req.body.reportReason) {
      ruleObject.reportReason = req.body.reportReason;
    }

    req.ruleObject = ruleObject;
    return true;
  }
};

export default {
  validateCreatingRuleBody,
};
