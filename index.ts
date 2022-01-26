import dotenv from "dotenv";

dotenv.config();

import initiateDB from "./database";
import { initializeServer } from "./server";

const port = process.env.PORT ?? process.env.SERVER_PORT ?? 6666;

(async () => {
  try {
    await initializeServer(port);
    await initiateDB(process.env.MONGO_DB);
  } catch (error) {
    process.exit(1);
  }
})();
