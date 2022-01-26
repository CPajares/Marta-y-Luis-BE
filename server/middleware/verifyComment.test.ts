import UserModel from "../../database/models/user";
import verifyComment from "./verifyComment";

class ErrorCode extends Error {
  code: number;
}

describe("Given a verifyComment function", () => {
  /* describe("When it´s called", () => {
    test("Then should call next function without an error ", async () => {
      const req = {
        userInfo: { id: "22" },
        params: { id: "1234" },
      };
      const user = {
        comment: [{ _id: "34535" }],
      };

      user.comment.find = jest.fn().mockImplementation();
      const next = jest.fn();
      const error = new Error();
      UserModel.findById = jest
        .fn()
        .mockResolvedValue({ populate: jest.fn().mockResolvedValue(user) });

      await verifyComment(req, null, next);

      expect(next).toBeCalledWith(error);
    });
  }); */

  describe("When it´s called", () => {
    test("Then should call next function without an error ", async () => {
      const req = {
        userInfo: { id: "22" },
        params: { id: "1234" },
      };

      const next = jest.fn();
      const error = new ErrorCode("Not possible to delete the comment");
      UserModel.findById = jest
        .fn()
        .mockResolvedValue({ populate: jest.fn().mockRejectedValue(error) });

      await verifyComment(req, null, next);

      expect(next).toBeCalledWith(error);
    });
  });
});
