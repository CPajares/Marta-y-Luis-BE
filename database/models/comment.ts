import { model, Schema } from "mongoose";

interface Comment {
  text: string;
  author: string;
  likes?: number;
  isEdited?: boolean;
  date?: any;
  _id;
}

const schemaComment: Schema<Comment> = new Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  likes: { type: Number, default: 0 },
  isEdited: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const CommentModel = model<Comment>("Comment", schemaComment, "comments");

export default CommentModel;
