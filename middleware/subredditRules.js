import mongoose from "mongoose";

/**
 * A middleware used to make sure that the provided ruleId name exists
 * If that rule exists it adds it to the request object to make the next middleware access it
 * It it doesn't exist then it returns a response with status code 404 and error message
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */


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

/**
 * A middleware used to make sure that the provided ruleId is a valid mongo ObjectId
 * If that RuleId is valid it make the next middleware access it
 * It it is not valid then it returns a response with status code 400 and error message
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {function} next Next function
 * @returns {void}
 */


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
