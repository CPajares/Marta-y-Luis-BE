import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../../database/models/user";
import PresentModel from "../../database/models/present";

class ErrorCode extends Error {
  code: number;
}

export const createUser = async (
  req,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const user = req.body;
    const { name } = req.body;
    const userCheck = await UserModel.findOne({ name });
    if (userCheck !== null) {
      const error: any = new Error("This name exits already");
      error.code = 404;
      next(error);
    } else {
      const userHashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await UserModel.create({
        ...user,
        password: userHashedPassword,
      });

      res.json(newUser);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

export const loginUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { name, password } = req.body;
  try {
    const user = await UserModel.findOne({ name });
    if (!user) {
      const error = new ErrorCode("Credentials not valids");
      error.code = 401;
      next(error);
    } else {
      const authPassword = await bcrypt.compare(password, user.password);
      if (!authPassword) {
        const error = new ErrorCode("Not authorized");
        error.code = 401;
        next(error);
      } else {
        const token = jwt.sign(
          { name: user.name, id: user.id, presents: user.presentUser },
          process.env.JWT_SECRET
        );

        res.json({ token });
      }
    }
  } catch (error) {
    error.message = "Credentials not valids";
    error.code = 401;
    next(error);
  }
};

export const presentForUser = async (
  req,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  const present = await PresentModel.findById(id);
  if (present === null) {
    const error: any = new Error("Present not found");
    error.code = 404;
    next(error);
  }

  try {
    const user = await UserModel.findById(req.userInfo.id);
    if (!user.presentUser.length) {
      user.presentUser.push(id);
      await user.save();
      present.isReserved = true;
      await present.save();
      res.json(present);
    } else {
      const error: any = new Error("You have already one present booked");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.message = "There was an error during the booking";
    error.code = 406;
    next(error);
  }
};

export const unBookForUser = async (
  req,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  const present = await PresentModel.findById(id);
  if (!present) {
    const error: any = new Error("Present not found");
    error.code = 404;
    next(error);
  }

  try {
    const user = await UserModel.findById(req.userInfo.id);
    user.presentUser = [];
    await user.save();
    res.json(present);
  } catch (error) {
    error.message = "There was an error, not possible to unbook";
    error.code = 401;
    next(error);
  }
};

export const getUser = async (
  req,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    res.json(user);
  } catch {
    const error: any = new Error("Present not found");
    error.code = 404;
    next(error);
  }
};
