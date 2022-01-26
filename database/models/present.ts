import { model, Schema } from "mongoose";

interface Present {
  name: string;
  description1: string;
  description2: string;
  isReserved: boolean;
  category: string;
  img: string;
  url: string;
}

const schemaPresent: Schema<Present> = new Schema({
  name: { type: String, required: true },
  description1: { type: String, required: true },
  description2: { type: String, required: true },
  isReserved: { type: Boolean, required: true },
  category: { type: String, required: true },
  img: { type: String, required: true },
  url: { type: String, required: true },
});

const PresentModel = model<Present>("Present", schemaPresent, "presents");

export default PresentModel;
