export const checkEditRulesOrderService = (req) => {
  if (req.body.rulesOrder.length !== req.subreddit.numberOfRules) {
    const error = new Error("Number of rules doesn't match");
    error.statusCode = 400;
    throw error;
  }
};

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

export const editRulesOrderService = async (req) => {
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
        i++;
      }
    }
  }
  await req.subreddit.save();
};
