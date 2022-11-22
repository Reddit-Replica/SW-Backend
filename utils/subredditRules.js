/**
 * A function used to validate the request body to create a rule to a subreddit
 * If the request  body is valid it adds to the request the ruleObject
 * @param {Object} req Request object
 * @returns {boolean} boolean indicates if the request body is valid
 */
export function validateCreatingRuleBody(req) {
  if (!req.body.ruleName || !req.body.appliesTo) {
    console.log("ruleName or appliesTo");
    return false;
  } else if (
    req.body.appliesTo !== "posts and comments" &&
    req.body.appliesTo !== "posts only" &&
    req.body.appliesTo !== "comments only"
  ) {
    console.log("applies to wrong value");
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
}

/**
 * A function used to validate the request body to edit a rule to a subreddit
 * If the request  body is valid it adds to the request the ruleObject
 * @param {Object} req Request object
 * @returns {boolean} boolean indicates if the request body is valid
 */
export function validateEditingRuleBody(req) {
  const firstValidate = validateCreatingRuleBody(req);
  if (!firstValidate) {
    console.log("First validate");
  }
  if (!firstValidate || !req.body.ruleOrder) {
    console.log("rule order");
    return false;
  }
  req.ruleObject.ruleOrder = req.body.ruleOrder;
  return true;
}
