/**
 * A function used to validate the request body, if the number of rules doesn't match it throws an error
 * @param {Object} req Request object
 * @returns {void}
 */

export const checkEditRulesOrderService = (req) => {
  if (req.body.rulesOrder.length !== req.subreddit.numberOfRules) {
    const error = new Error("Number of rules doesn't match");
    error.statusCode = 400;
    throw error;
  }
};

/**
 * A function used to validate the request body, if the rule order or the rule id is dublicated it throws an error
 * @param {Object} req Request object
 * @returns {void}
 */

export const checkDublicateRuleOrderService = (req) => {
  const ruleOrders = new Map();
  const ruleIds = new Map();
  req.body.rulesOrder.forEach((element) => {
    if (ruleOrders.has(element.ruleOrder)) {
      const error = new Error("dublicate rule order");
      error.statusCode = 400;
      throw error;
    } else if (ruleIds.has(element.ruleId)) {
      const error = new Error("dublicate rule id");
      error.statusCode = 400;
      throw error;
    } else {
      ruleOrders.set(element.ruleOrder, 1);
      ruleIds.set(element.ruleId, 1);
    }
  });
};

/**
 * A function used to update the rules orders of the subreddit
 * @param {Object} req Request object
 * @returns {void}
 */

export const editRulesOrderService = async (req) => {
  // loop through the subreddit rules and the request body rules
  for (let i = 0; i < req.subreddit.rules.length; i++) {
    for (let j = 0; j < req.body.rulesOrder.length; j++) {
      if (
        req.subreddit.rules[i]._id.toString() ===
          req.body.rulesOrder[j].ruleId &&
        req.subreddit.rules[i].deletedAt
      ) {
        const error = new Error("Rule not found");
        error.statusCode = 400;
        throw error;
      } else if (
        req.subreddit.rules[i]._id.toString() === req.body.rulesOrder[j].ruleId
      ) {
        req.subreddit.rules[i].ruleOrder = req.body.rulesOrder[j].ruleOrder;
      }
    }
  }
  await req.subreddit.save();
};
