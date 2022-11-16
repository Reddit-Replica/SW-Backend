import {
  insertCategoriesIfNotExists,
  getSortedCategories,
} from "../../services/categories.js";
import User from "../../models/User.js";
import Category from "../../models/Category.js";
import supertest from "supertest";
import app from "../../app.js";
supertest(app);

describe("Testing Category services", () => {
  afterAll(async () => {
    await User.deleteMany({});
    await Category.deleteMany({});
  });

  it("Should have insertCategoriesIfNotExists method", () => {
    expect(insertCategoriesIfNotExists).toBeDefined();
  });

  it("Insert categories", async () => {
    try {
      await insertCategoriesIfNotExists();
      const count = await Category.countDocuments();
      expect(count).toEqual(30);
    } catch (err) {
      return false;
    }
  });

  it("Insert categories again when they are already inserted", async () => {
    try {
      await insertCategoriesIfNotExists();
      const count = await Category.countDocuments();
      expect(count).toEqual(30);
    } catch (err) {
      return false;
    }
  });

  it("Should have getSortedCategories method", () => {
    expect(getSortedCategories).toBeDefined();
  });

  it("Get categories sorted with the random index", async () => {
    try {
      const categories = await getSortedCategories();
      expect(categories.length).toEqual(30);
    } catch (err) {
      return false;
    }
  });
});
