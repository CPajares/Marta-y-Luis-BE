import { generalErrorHandler, notFoundErrorHandler } from "./errors";

interface IResponseTest {
  status: () => void;
  json: () => void;
}

const mockResponse = () => {
  const res: IResponseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("Given a notFoundErrorHandler function", () => {
  describe("When an endpoint is not found ", () => {
    test("Then it should invoke the method json with a status 404 and an error message", () => {
      const errorStatus = 404;
      const errorMessage = "Resource not found";
      const error = {
        error: errorMessage,
      };

      const res = mockResponse();

      notFoundErrorHandler(null, res);
      expect(res.status).toHaveBeenCalledWith(errorStatus);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a generalErrorHandler function", () => {
  describe("When it receives an error", () => {
    test("Then it should invoke the method json with the error message and the method status with 500", () => {
      const errorCode = 500;
      const errorMessage = "General pete";
      const error = {
        error: errorMessage,
      };
      const next = jest.fn();

      const res = mockResponse();

      generalErrorHandler(error, null, res, next);
      expect(res.status).toHaveBeenCalledWith(errorCode);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
