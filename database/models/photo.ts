import { model, Schema, Types } from "mongoose";

interface Photo {
  author: object;
  title: string;
  comments: string;
  likes: number;
  photo: string;
}

const schemaPhoto: Schema<Photo> = new Schema({
  author: { type: Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  comments: { type: String },
  likes: { type: Number, default: 0 },
  photo: { type: String, required: true },
});

const PhotoModel = model<Photo>("Photo", schemaPhoto, "photos");

export default PhotoModel;
