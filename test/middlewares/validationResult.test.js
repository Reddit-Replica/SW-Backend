import { check } from "express-validator";
import { validateRequestSchema } from "./../../middleware/validationResult.js";
import { jest } from "@jest/globals";

const testExpressValidatorMiddleware = async (req, res, middlewares) => {
  await Promise.all(
    middlewares.map(async (middleware) => {
      await middleware(req, res, () => undefined);
    })
  );
};

describe("Testing validationResult middleware", () => {
  let mockResponse;
  let nextFunction = jest.fn();
  beforeEach(() => {
    mockResponse = {
      status: () => {
        jest.fn();
        return mockResponse;
      },
      json: () => {
        jest.fn();
        return mockResponse;
      },
    };
  });

  it("try to send an empty paramerters to validateResult middleware", async () => {
    const req = {
      body: {
        postId: "",
        commentId: "",
      },
    };
    const postMsg = "postId can not be empty";
    const commentMsg = "commentId can not be empty";
    await testExpressValidatorMiddleware(req, mockResponse, [
      check("postId").not().isEmpty().withMessage(postMsg),
      check("commentId").not().isEmpty().withMessage(commentMsg),
    ]);

    validateRequestSchema(req, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("try to send correct parameters to validateResult middleware", async () => {
    const req = {
      body: {
        postId: "id",
        commentId: "id",
      },
    };
    const postMsg = "postId can not be empty";
    const commentMsg = "commentId can not be empty";
    await testExpressValidatorMiddleware(req, mockResponse, [
      check("postId").not().isEmpty().withMessage(postMsg),
      check("commentId").not().isEmpty().withMessage(commentMsg),
    ]);

    validateRequestSchema(req, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
