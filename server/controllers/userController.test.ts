import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";
import mockResponse from "../../utils/mocks/mockFunction";
import UserModel from "../../database/models/user";
import {
  createUser,
  loginUser,
  presentForUser,
  unBookForUser,
} from "./userController";
import PresentModel from "../../database/models/present";

jest.mock("../../database/models/user");
jest.mock("bcrypt");

describe("Given a loginUser function", () => {
  describe("When it receives a req and incorrect name", () => {
    test("Should it call next with and error", async () => {
      const req = {
        body: {
          name: "fail",
          password: "sandia",
        },
      } as Request;

      const next = jest.fn();
      const error = new Error("Credentials not valids");

      UserModel.findOne = jest.fn().mockResolvedValue(null);

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe("When it receives a req and res objects", () => {
    test("Should it called json method", async () => {
      const user = {
        name: "mariogl",
        password: "mariogl",
      };

      const req = {
        body: user,
      } as Request;

      const res = mockResponse();

      const next = jest.fn();

      const expectedtoken = "token";

      const expectedResponse = {
        token: expectedtoken,
      };
      UserModel.findOne = jest.fn().mockResolvedValue({});
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedtoken);

      await loginUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
  describe("When it receives a wrong password", () => {
    test("Should it called next function with an error", async () => {
      const user = {
        name: "mariogl",
        password: "mariogl",
      };

      const req = {
        body: user,
      } as Request;

      const next = jest.fn();

      UserModel.findOne = jest.fn().mockResolvedValue({});
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const error = new Error("Not authorized");

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 401);
    });
  });
  describe("When it reject an error", () => {
    test("Should it called next function with an error", async () => {
      const user = {
        name: "mariogl",
        password: "mariogl",
      };

      const req = {
        body: user,
      } as Request;

      const next = jest.fn();
      const error = new Error("Credentials not valids");

      UserModel.findOne = jest.fn().mockRejectedValue(error);

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 401);
    });
  });
});

describe("Given a createUser function", () => {
  describe("When it receive a request whit a name alerady in use", () => {
    test("Should it call next function with an error ", async () => {
      const req = {
        body: {
          name: "mariogl",
          password: "mariogl",
        },
      } as Request;
      const next = jest.fn();

      UserModel.findOne = jest.fn().mockResolvedValue({});

      const error = new Error("This name exits already");

      await createUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 404);
    });
  });
  describe("When it receive a request whit a name alerady in use", () => {
    test("Should it call next function with an error ", async () => {
      const req = {
        body: {
          name: "mariogl",
          password: "mariogl",
        },
      } as Request;
      const res = mockResponse();
      const next = jest.fn();
      UserModel.findOne = jest.fn().mockResolvedValue(null);
      const newUser = {
        name: "mariogl",
        password: "mariogl",
      };
      UserModel.create = jest.fn().mockResolvedValue(newUser);

      await createUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith(newUser);
    });
  });

  describe("When it reject an error", () => {
    test("Should it call next function with an error ", async () => {
      const req = {
        body: {
          name: "mariogl",
          password: "mariogl",
        },
      } as Request;

      const next = jest.fn();
      const error = new Error();
      UserModel.findOne = jest.fn().mockRejectedValue(error);

      await createUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
});

describe("Given a presentForUser function", () => {
  describe("When doesn´t find a present", () => {
    test("Should it call next function with an error ", async () => {
      const params: any = {
        id: "22",
      };
      const req = {
        params,
      };
      const next = jest.fn();
      PresentModel.findById = jest.fn().mockResolvedValue(null);
      const error = new Error("Present not found");
      await presentForUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 404);
    });
  });

  describe("When it receives a request", () => {
    test("Should it call json method", async () => {
      const params: any = {
        id: "22",
      };
      const req = {
        params,
        userInfo: { id: "22" },
      };

      const res = mockResponse();
      const next = jest.fn();
      const user = {
        save: jest.fn(),
        presentUser: [],
      };
      const present = {
        name: "aspirador",
        id: "22",
        save: jest.fn(),
      };
      PresentModel.findById = jest.fn().mockResolvedValue(present);
      UserModel.findById = jest.fn().mockResolvedValue(user);
      await presentForUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith(present);
    });
  });
  describe("When it receives a request", () => {
    test("Should it call json method", async () => {
      const params: any = {
        id: "22",
      };
      const req = {
        params,
        userInfo: { id: "22" },
      };
      const next = jest.fn();
      const present = {
        name: "aspirador",
        id: "22",
      };
      const error = new Error("There was an error during the booking");
      PresentModel.findById = jest.fn().mockResolvedValue(present);
      UserModel.findById = jest.fn().mockRejectedValue(error);

      await presentForUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a presentForUser function", () => {
  describe("When doesn´t find a present", () => {
    test("Should it call next function with an error ", async () => {
      const req = {
        params: {
          id: "22",
        },
      };
      const next = jest.fn();
      PresentModel.findById = jest.fn().mockResolvedValue(null);
      const error = new Error("Present not found");
      await unBookForUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 404);
    });
  });

  describe("When it receives a request", () => {
    test("Should it call json method with present ", async () => {
      const req = {
        params: {
          id: "22",
        },
        userInfo: { id: "22" },
      };
      const res = mockResponse();
      const next = jest.fn();
      const user = {
        save: jest.fn(),
        presentUser: { push: jest.fn() },
      };
      const present = {
        name: "aspirador",
        id: "22",
      };
      PresentModel.findById = jest.fn().mockResolvedValue(present);
      UserModel.findById = jest.fn().mockResolvedValue(user);

      await unBookForUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith(present);
    });
  });
});
