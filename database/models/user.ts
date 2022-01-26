import { model, ObjectId, Schema, Types } from "mongoose";

interface Comment {
  text: string;
  author: string;
  like?: number;
  isEdited?: boolean;
  _id?: ObjectId;
}
interface User {
  name: string;
  password: string;
  presentUser?: Array<string>;
  photosUser?: Array<string>;
  comment?: Array<Comment>;
}

const schemaUser: Schema<User> = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  presentUser: { type: [Types.ObjectId], ref: "Present" },
  photosUser: { type: [Types.ObjectId], ref: "Photo" },
  comment: { type: [Object], ref: "Comment" },
});

const UserModel = model<User>("User", schemaUser, "users");

export default UserModel;
