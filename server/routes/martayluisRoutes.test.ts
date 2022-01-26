import dotenv from "dotenv";

dotenv.config();
import Debug from "debug";
import chalk from "chalk";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import supertest from "supertest";

import { app, initializeServer } from "..";
import initiateDB from "../../database";
import UserModel from "../../database/models/user";

const debug = Debug("martayluis:testingroutes");

const request = supertest(app);
jest.setTimeout(20000);

let server;
let token;

beforeAll(async () => {
  await initiateDB(process.env.MONGO_DB_TEST);
  server = await initializeServer(process.env.SERVER_PORT_TEST);
  await UserModel.deleteMany({});
  await UserModel.create({
    name: "guest",
    password: await bcrypt.hash("guest", 10),
  });
  const loginResponse = await request
    .post("/user/login")
    .send({ name: "guest", password: "guest" })
    .expect(200);
  token = loginResponse.body.token;
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    debug(chalk.red("Server conection ended"));
    done();
  });
});

beforeEach(async () => {
  await UserModel.create({
    name: "guest2",
    password: await bcrypt.hash("guest2", 10),
  });
});

describe("Given and endpoint martayluis/comments", () => {
  describe("When a GET request arrives", () => {
    test("Then it should respond with a response with code 200", async () => {
      await request
        .get("/martayluis/comments")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });

  describe("When a GET request arrives without a token", () => {
    test("Then it should respond with an error with code 401 and message: Authorization not valid", async () => {
      await request
        .get("/martayluis/comments")
        .set("Authorization", `Bearer65456654`)
        .expect(401, { error: "Authorization not valid" });
    });
  });
});
