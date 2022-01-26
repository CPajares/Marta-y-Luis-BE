import dotenv from "dotenv";

dotenv.config();

import jwt from "jsonwebtoken";

class ErrorCode extends Error {
  code: number | undefined;
}

const autho = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error = new ErrorCode("Authorization error");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new ErrorCode("Authorization not valid");
      error.code = 401;
      next(error);
    } else {
      try {
        const { id, name } = jwt.verify(token, process.env.JWT_SECRET);
        req.userInfo = { id, name };
        next();
      } catch {
        const error = new ErrorCode("Error during authentification");
        error.code = 401;
        next(error);
      }
    }
  }
};
export default autho;
