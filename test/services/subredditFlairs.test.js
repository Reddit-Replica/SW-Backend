import { validateCreateOrEditFlair } from "../../services/subredditFlairs.js";

describe("Testing subreddit flairs services", () => {
  it("validateCreateOrEditFlair method should exist", () => {
    expect(validateCreateOrEditFlair).toBeDefined();
  });

  it("validateFlairType method should throw error", () => {
    const req = {
      body: {
        flairName: "Zeyad",
      },
    };
    expect(() => {
      validateCreateOrEditFlair(req);
    }).toThrow("Missing parameters");
  });

  it("validateFlairType method shouldn't throw error", () => {
    const req = {
      body: {
        flairName: "Zeyad",
        settings: {},
      },
    };
    expect(() => {
      validateCreateOrEditFlair(req);
    }).not.toThrowError();
  });
});
