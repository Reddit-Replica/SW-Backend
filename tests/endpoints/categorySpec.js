import supertest from "supertest";
import app from "../../app.js";
import Category from "../../models/Category.js";

const request = supertest(app);

fdescribe("Testing category endpoints", () => {
  afterAll(async () => {
    await Category.deleteMany({});
  });

  it("Get all categories", async () => {
    const response = await request.get("/saved-categories");
    const categoriesCount = await Category.countDocuments();
    expect(response.statusCode).toEqual(200);
    expect(categoriesCount).toEqual(30);
  });
});
