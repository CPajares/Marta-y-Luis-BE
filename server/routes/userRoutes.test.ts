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

describe("Given an /user/login", () => {
  describe("When a POST request arrives", () => {
    test("Then it should respond with a response with code 200", async () => {
      await request
        .post("/user/login")
        .send({ name: "guest2", password: "guest2" })
        .expect(200);
    });
  });

  describe("When a POST request arrives with wrong name", () => {
    test("Then it should respond with a response with code 401", async () => {
      await request
        .post("/user/login")
        .send({ name: "g", password: "g" })
        .expect(401);
    });
  });
});

describe("Given and endpoint user/unbookpresentforuser", () => {
  describe("When a PATCH request arrives", () => {
    test("Then it should respond with a response with code 200", async () => {
      await request
        .patch("/user/unbookpresentforuser/61a0a6bced0b6e06e357aff5")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });

  describe("When a PATCH request arrives with a token", () => {
    test("Then it should respond with a code 401 with message: Error during authentification ", async () => {
      await request
        .patch("/user/unbookpresentforuser")
        .set("Authorization", `Bearer badtoken`)
        .send({ id: "61a0a6bced0b6e06e357aff5" })
        .expect(401, { error: "Error during authentification" });
    });
  });
});

describe("Given and endpoint user/presentforuser/:id", () => {
  describe("When a PATCH request arrives", () => {
    test("Then it should respond with a response with code 200", async () => {
      await request
        .patch("/user/presentforuser/61a0a6bced0b6e06e357aff5")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });

  describe("When a PATCH request arrives without an authorization header", () => {
    test("Then it should respond with a response with code 401 with message: Authorization error", async () => {
      await request
        .patch("/user/presentforuser/61a0a6bced0b6e06e357aff5")
        .expect(401, { error: "Authorization error" });
    });
  });
});
