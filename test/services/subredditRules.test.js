import {
  checkEditRulesOrderService,
  checkDublicateRuleOrderService,
  editRulesOrderService,
} from "../../services/subredditRules.js";

import { jest } from "@jest/globals";

describe("Testing Subreddit rules services", () => {
  describe("Testing checkEditRulesOrderService all cases", () => {
    it("Testing rules number doesn't match", () => {
      expect(() => {
        const req = {
          subreddit: {
            numberOfRules: 2,
          },
          body: {
            rulesOrder: [2],
          },
        };
        checkEditRulesOrderService(req);
      }).toThrow("Number of rules doesn't match");
    });
    it("Testing rules number match", () => {
      expect(() => {
        const req = {
          subreddit: {
            numberOfRules: 2,
          },
          body: {
            rulesOrder: [2, 1],
          },
        };
        checkEditRulesOrderService(req);
      }).not.toThrow();
    });
  });

  describe("Testing checkDublicateRuleOrderService all cases", () => {
    it("Testing dublicate rule id", () => {
      expect(() => {
        const req = {
          body: {
            rulesOrder: [
              {
                ruleId: 2,
                ruleOrder: 0,
              },
              {
                ruleId: 2,
                ruleOrder: 1,
              },
            ],
          },
        };
        checkDublicateRuleOrderService(req);
      }).toThrow("dublicate rule id");
    });
    it("Testing dublicate rule order", () => {
      expect(() => {
        const req = {
          body: {
            rulesOrder: [
              {
                ruleId: 2,
                ruleOrder: 1,
              },
              {
                ruleId: 1,
                ruleOrder: 1,
              },
            ],
          },
        };
        checkDublicateRuleOrderService(req);
      }).toThrow("dublicate rule order");
    });
  });

  describe("Testing editRulesOrderService all cases", () => {
    it("Testing valid rules order", () => {
      const saveFunction = jest.fn();

      const req = {
        body: {
          rulesOrder: [
            {
              ruleId: 2,
              ruleOrder: 1,
            },
            {
              ruleId: 1,
              ruleOrder: 2,
            },
          ],
        },
        subreddit: {
          rules: [
            {
              _id: 1,
              ruleOrder: 1,
            },
            {
              _id: 2,
              ruleOrder: 2,
            },
          ],
          save: saveFunction,
        },
      };
      editRulesOrderService(req);
      expect(saveFunction).toHaveBeenCalled();
    });
    it("Testing deleted rules order", async () => {
      const saveFunction = jest.fn();
      const req = {
        body: {
          rulesOrder: [
            {
              ruleId: "2",
              ruleOrder: 2,
            },
            {
              ruleId: "1",
              ruleOrder: 0,
            },
            {
              ruleId: "0",
              ruleOrder: 1,
            },
          ],
        },
        subreddit: {
          rules: [
            {
              _id: 2,
              ruleOrder: 2,
              deletedAt: false,
            },
            {
              _id: 0,
              ruleOrder: 0,
              deletedAt: true,
            },
            {
              _id: 1,
              ruleOrder: 1,
              deletedAt: false,
            },
          ],
          save: saveFunction,
        },
      };
      await expect(editRulesOrderService(req, false)).rejects.toThrow(
        "Rule not found"
      );
    });
  });
});
