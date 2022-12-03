import {
  validateCreatingRuleBody,
  validateEditingRuleBody,
} from "../../utils/subredditRules.js";

describe("Testing subreddit rules utils", () => {
  it("validateCreatingRuleBody method should exist", () => {
    expect(validateCreatingRuleBody).toBeDefined();
  });

  it("validateEditingRuleBody method should exist", () => {
    expect(validateEditingRuleBody).toBeDefined();
  });

  it("Testing a body with missing required params", () => {
    const req = {
      body: {
        ruleName: "test rule",
      },
    };
    expect(validateCreatingRuleBody(req)).toBe(false);
  });

  it("Testing a body with appliesTo invalid value", () => {
    const req = {
      body: {
        ruleName: "test rule",
        appliesTo: "any invalid value",
      },
    };
    expect(validateCreatingRuleBody(req)).toBe(false);
  });

  it("Testing a body with appliesTo valid value", () => {
    const req = {
      body: {
        ruleName: "test rule",
        appliesTo: "comments only",
      },
    };
    expect(validateCreatingRuleBody(req)).toBe(true);
  });

  it("Testing a body with all params", () => {
    const req = {
      body: {
        ruleName: "test rule",
        appliesTo: "comments only",
        description: "test desc",
        reportReason: "test reason",
      },
    };
    expect(validateCreatingRuleBody(req)).toBe(true);
  });

  it("Testing a edit body without the rule order", () => {
    const req = {
      body: {
        ruleName: "test rule",
        appliesTo: "comments only",
        description: "test desc",
        reportReason: "test reason",
      },
    };
    expect(validateEditingRuleBody(req)).toBe(false);
  });

  it("Testing a edit body with the rule order", () => {
    const req = {
      body: {
        ruleName: "test rule",
        appliesTo: "comments only",
        description: "test desc",
        reportReason: "test reason",
        ruleOrder: 2,
      },
    };
    expect(validateEditingRuleBody(req)).toBe(true);
  });
});
