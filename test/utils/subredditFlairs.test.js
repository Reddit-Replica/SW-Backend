import { compareFlairs } from "../../utils/subredditFlairs.js";

describe("Testing subreddit flairs utils", () => {
  it("compareFlairs method should exist", () => {
    expect(compareFlairs).toBeDefined();
  });

  it("compareFlairs method should return -1", () => {
    expect(compareFlairs({ flairOrder: 1 }, { flairOrder: 2 })).toBe(-1);
  });

  it("compareFlairs method should return 1", () => {
    expect(compareFlairs({ flairOrder: 4 }, { flairOrder: 2 })).toBe(1);
  });

  it("compareFlairs method should return 0", () => {
    expect(compareFlairs({ flairOrder: 4 }, { flairOrder: 4 })).toBe(0);
  });
});
