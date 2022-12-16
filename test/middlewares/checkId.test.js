import { checkId } from "../../middleware/checkId";
import { jest } from "@jest/globals";

describe("Testing checkId middleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
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

  it("should have checkId function", () => {
    expect(checkId).toBeDefined();
  });

  it("try to send an invalid id in the params", () => {
    mockRequest = {
      params: {
        id: "lol",
      },
      body: {},
    };
    checkId(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });
  it("try to send an invalid id in the body", () => {
    mockRequest = {
      params: {},
      body: { id: "lol" },
    };
    checkId(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("try to send a valid id in the params", () => {
    mockRequest = {
      params: {
        id: "6398e23a159be70e26e54dd5",
      },
      body: {},
    };
    checkId(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
  it("try to send a valid id in the body", () => {
    mockRequest = {
      params: {},
      body: {
        id: "6398e23a159be70e26e54dd5",
      },
    };
    checkId(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
