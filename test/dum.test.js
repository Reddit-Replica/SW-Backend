import { addNumbers } from "./dum.js";
import { connectDatabase, closeDatabaseConnection } from "./database.js";
describe("desc", () => {
  beforeAll(async () => {
    await connectDatabase();
  });
  afterAll(() => {
    closeDatabaseConnection();
  });
  test("Testing jest", () => {
    expect(addNumbers(2, 5)).toBe(7);

    expect(1 + 2).not.toBe(5);
  });
});
