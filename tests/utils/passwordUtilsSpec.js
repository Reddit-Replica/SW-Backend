import User from "../../models/User.js";
import supertest from "supertest";
import { hashPassword, comparePasswords } from "../../utils/passwordUtils.js";
import bcrypt from "bcryptjs";
import app from "../../app.js";
supertest(app);

describe("Testing Password utilities", () => {
  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should have hashPassword method", () => {
    expect(hashPassword).toBeDefined();
  });

  it("check if hashPassword returns a valid hashed password", () => {
    const hashedPassword = hashPassword("12345678");
    const result = bcrypt.compareSync(
      "12345678" + process.env.BCRYPT_PASSWORD,
      hashedPassword
    );
    expect(result).toBeTruthy();
  });

  it("should have comparePasswords method", () => {
    expect(comparePasswords).toBeDefined();
  });

  // eslint-disable-next-line max-len
  it("check if passwords are compared correctly", async () => {
    const hashedPass = bcrypt.hashSync(
      "987654321" + process.env.BCRYPT_PASSWORD,
      parseInt(process.env.SALT_ROUNDS)
    );
    const result = comparePasswords("987654321", hashedPass);
    expect(result).toBeTruthy();
  });

  it("check if function returns false if passwords don't match", async () => {
    const hashedPass = bcrypt.hashSync(
      "987654321" + process.env.BCRYPT_PASSWORD,
      parseInt(process.env.SALT_ROUNDS)
    );
    const result = comparePasswords("123456789", hashedPass);
    expect(result).toBeFalsy();
  });
});
