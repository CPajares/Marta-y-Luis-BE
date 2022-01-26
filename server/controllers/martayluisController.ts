import express from "express";
import CommentModel from "../../database/models/comment";
import PhotoModel from "../../database/models/photo";
import PresentModel from "../../database/models/present";
import UserModel from "../../database/models/user";

class ErrorCode extends Error {
  code: number;
}

export const publishComments = async (
  req,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const commentBody = req.body;
    const { id } = req.userInfo;
    const newComment = await CommentModel.create(commentBody);

    const user = await UserModel.findById(id);
    // eslint-disable-next-line no-underscore-dangle
    user.comment.push(newComment._id);
    user.save();
    res.status(201).json(newComment);
  } catch {
    const error = new ErrorCode(
      "There was an error when trying to create a new comment"
    );
    error.code = 400;
    next(error);
  }
};

export const getComment = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const comments = await CommentModel.find();
    res.json(comments);
  } catch {
    const error = new ErrorCode(
      "There was an error when trying to read the comments"
    );
    error.code = 400;
    next(error);
  }
};

export const deleteComment = async (
  req,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const idUser = req.userInfo.id;
    await CommentModel.findByIdAndDelete(id);
    const user = await UserModel.findById(idUser);
    user.comment = user.comment.filter((comentD) => id !== comentD.toString());
    user.save();
    res.json(`${id} deleted`);
  } catch (error) {
    error.message = "Comment not found";
    error.code = 400;
    next(error);
  }
};

export const modifyComment = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id, text } = req.body;

  try {
    const comment = await CommentModel.findById(id);
    comment.text = text;
    comment.isEdited = true;
    await comment.save();
    const newComment = await CommentModel.findOne({ _id: id });
    res.json(newComment);
  } catch (error) {
    error.code = 400;
    error.message = "Error during edited the comment";
    next(error);
  }
};

export const getPresents = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const presents = await PresentModel.find();
    res.json(presents);
  } catch {
    const error = new ErrorCode("There was an error looking for documents");
    error.code = 400;
    next(error);
  }
};

export const getHomePresent = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const presents = await PresentModel.find({ category: "casa" });
    res.json(presents);
  } catch {
    const error = new ErrorCode("There was an error looking for presents");
    error.code = 400;
    next(error);
  }
};

export const getTravelPresent = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const presents = await PresentModel.find({ category: "viaje" });
    res.json(presents);
  } catch {
    const error = new ErrorCode("There was an error looking for presents");
    error.code = 400;
    next(error);
  }
};

export const getLeisurePresent = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const presents = await PresentModel.find({ category: "ocio" });
    res.json(presents);
  } catch {
    const error = new ErrorCode("There was an error looking for presents");
    error.code = 400;
    next(error);
  }
};

export const unBookPresent = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;

  try {
    const present = await PresentModel.findById(id);
    present.isReserved = false;
    await present.save();
    const newPresent = await PresentModel.findOne({ _id: id });
    res.json(newPresent);
  } catch {
    const error = new ErrorCode("There was an error during the process");
    error.code = 400;
    next(error);
  }
};

export const infoPresent = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const present = await PresentModel.findById(id);
    res.json(present);
  } catch {
    const error = new ErrorCode("Error when looking for present");
    error.code = 400;
    next(error);
  }
};

export const getPhotos = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const photos = await PhotoModel.find().populate({
      path: "author",
      select: "name",
    });
    res.json(photos);
  } catch {
    const error = new ErrorCode("There was an error looking for photos!");
    error.code = 400;
    next(error);
  }
};

export const createPhoto = async (
  req,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { title } = req.body;
    const photoReq = req.file;
    const { id } = req.userInfo;
    const newPhoto = await PhotoModel.create({
      author: req.userInfo.id,
      title,
      photo: photoReq.fileURL,
    });
    const user = await UserModel.findById(id);
    // eslint-disable-next-line no-underscore-dangle
    user.photosUser.push(newPhoto._id);
    await user.save();

    const Photoinfo = await PhotoModel.findOne({
      photo: photoReq.fileURL,
    }).populate({
      path: "author",
      select: "name",
    });
    res.json(Photoinfo);
  } catch (error) {
    error.code = 400;
    error.message = "There was an error during the uploading";
    next(error);
  }
};
