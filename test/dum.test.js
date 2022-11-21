import { addNumbers } from "./dum.js";
test("Testing jest", () => {
  expect(addNumbers(2, 5)).toBe(7);
  expect(1 + 2).not.toBe(5);
});
