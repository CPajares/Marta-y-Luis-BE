import Debug from "debug";
import { ValidationError } from "express-validation";

const debug = Debug("martayluis:error");

export const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Resource not found" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generalErrorHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({ message: "Bad request" });
  }
  debug("Ops, error detectado: ", error.message);
  const message = error.code ? error.message : "General pete";
  res.status(error.code || 500).json({ error: message });
};
