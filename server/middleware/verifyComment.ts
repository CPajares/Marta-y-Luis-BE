import express from "express";
import UserModel from "../../database/models/user";

class ErrorCode extends Error {
  code: number;
}

const verifyComment = async (
  req,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.userInfo;
    const user = await UserModel.findById(id).populate({ path: "comment" });
    const result = user.comment.find(
      // eslint-disable-next-line no-underscore-dangle
      (idComment) => idComment._id.toString() === req.params.id
    );
    if (!result) {
      const error = new ErrorCode("Not authorized");
      error.code = 401;
      next(error);
    }
    next();
  } catch {
    const error = new ErrorCode("Not possible to delete the comment");
    error.code = 401;
    next(error);
  }
};

export default verifyComment;
