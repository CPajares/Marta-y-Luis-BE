import morgan from "morgan";
import cors from "cors";
import Debug from "debug";
import chalk from "chalk";
import express from "express";
import { generalErrorHandler, notFoundErrorHandler } from "./middleware/errors";
import userRoutes from "./routes/userRoutes";
import martayluisRoutes from "./routes/martayluisRoutes";

const debug = Debug("martayluis:server");

export const app = express();

export const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.yellow(`Server on, lisen at ${port}`));
      resolve(server);
    });
    server.on("error", (error) => {
      if (error.message === "EADDRINUSE") {
        debug(chalk.red(`port${port} it´s already block`));
      }
      debug(chalk.red("Error tring to conect the server"));
      reject();
    });
  });

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/martayluis", martayluisRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);
