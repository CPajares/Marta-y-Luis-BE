import chalk from "chalk";
import mongoose from "mongoose";
import Debug from "debug";

const debug = Debug("martayluis:index");

const initiateDB = (conectingString) =>
  new Promise<void>((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret.__v;
      },
    });
    mongoose.connect(conectingString, (error) => {
      if (error) {
        debug(chalk.red("Not possible to conect DB."));
        debug(chalk.red(error.message));
        reject(error);
      }

      debug(chalk.green("in the funcking DB"));
    });

    resolve();
  });

export default initiateDB;
