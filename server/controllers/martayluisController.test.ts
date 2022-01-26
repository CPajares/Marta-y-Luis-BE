import { Request } from "express";
import CommentModel from "../../database/models/comment";
import PhotoModel from "../../database/models/photo";
import PresentModel from "../../database/models/present";
import UserModel from "../../database/models/user";
import mockResponse from "../../utils/mocks/mockFunction";
import {
  createPhoto,
  deleteComment,
  getComment,
  getHomePresent,
  getLeisurePresent,
  getPhotos,
  getPresents,
  getTravelPresent,
  infoPresent,
  modifyComment,
  publishComments,
  unBookPresent,
} from "./martayluisController";

describe("Given a getComment controller", () => {
  describe("When it receives an object res", () => {
    test("Then it should call the method json", async () => {
      const comments = [
        { text: "aaa", likes: 2, author: "mariogl" },
        { text: "eee", likes: 1, author: "mariogl" },
      ];

      CommentModel.find = jest.fn().mockResolvedValue(comments);
      const res = mockResponse();

      await getComment(null, res, null);

      expect(CommentModel.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(comments);
    });
  });

  describe("When it reject an error", () => {
    test("Then it should call next", async () => {
      const error = new Error(
        "There was an error when trying to read the comments"
      );
      CommentModel.find = jest.fn().mockRejectedValue(error);
      const next = jest.fn();

      await getComment(null, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
});

describe("Given a publishComments controller", () => {
  describe("When it receive a request", () => {
    test("Then it should call json method with comment", async () => {
      const comment = {
        author: "mariogl",
        text: "comentario1",
      };
      const req = {
        userInfo: { id: "22" },
        body: comment,
      };
      const res = mockResponse();

      CommentModel.create = jest.fn().mockResolvedValue(comment);
      UserModel.findById = jest
        .fn()
        .mockResolvedValue({ save: jest.fn(), comment: { push: jest.fn() } });

      await publishComments(req, res, null);

      expect(res.json).toHaveBeenCalledWith(comment);
    });
  });

  describe("When it reject an error", () => {
    test("Then it should call next function with an error", async () => {
      const error = new Error(
        "There was an error when trying to create a new comment"
      );
      CommentModel.find = jest.fn().mockRejectedValue(error);
      const next = jest.fn();

      await publishComments(null, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
});

describe("Given a deleteComment controller", () => {
  const params: any = {
    id: "22",
  };
  const req = {
    params,
    userInfo: { id: "22" },
  };
  describe("When it receive a request", () => {
    test("Then it should call json method", async () => {
      const next = jest.fn();
      const res = mockResponse();
      CommentModel.findByIdAndDelete = jest.fn().mockResolvedValue({});
      UserModel.findById = jest
        .fn()
        .mockResolvedValue({ save: jest.fn(), comment: { filter: jest.fn() } });

      await deleteComment(req, res, next);

      expect(res.json).toBeCalledWith(`${params.id} deleted`);
    });
  });
  describe("When it reject an error", () => {
    test("Then it should call next function with an error", async () => {
      const next = jest.fn();
      const error = new Error();
      CommentModel.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await deleteComment(req, null, next);

      expect(next).toBeCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Comment not found"
      );
    });
  });
});

describe("Given a modifyComment controller", () => {
  describe("When it receive a request", () => {
    test("Then it should call json method", async () => {
      const next = jest.fn();
      const res = mockResponse();
      const body: any = {
        text: "hola caracola",
        id: "22",
      };
      const req = {
        body,
      } as Request;
      CommentModel.findById = jest.fn().mockResolvedValue({ save: jest.fn() });
      CommentModel.findOne = jest.fn().mockResolvedValue({});

      await modifyComment(req, res, next);

      expect(res.json).toBeCalled();
    });
  });
  describe("When it reject an error", () => {
    test("Then it should call next function", async () => {
      const next = jest.fn();
      const body: any = {
        text: "hola caracola",
        id: "22",
      };
      const req = {
        body,
      } as Request;
      const error = new Error();
      CommentModel.findById = jest.fn().mockRejectedValue(error);

      await modifyComment(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getPresents controller", () => {
  describe("When it receive a request", () => {
    test("Then it should call json method", async () => {
      const res = mockResponse();
      const next = jest.fn();
      const present = {
        name: "aspirador",
      };
      PresentModel.find = jest.fn().mockResolvedValue(present);

      await getPresents(null, res, next);

      expect(res.json).toBeCalledWith(present);
    });
  });

  describe("When it receive a request", () => {
    test("Then it should call json method", async () => {
      const next = jest.fn();
      const error = new Error("There was an error looking for documents");
      PresentModel.find = jest.fn().mockRejectedValue(error);

      await getPresents(null, null, next);

      expect(next).toBeCalledWith(error);
    });
  });
});

describe("Given a unBookPresent controller", () => {
  describe("When it receive a request", () => {
    test("Then it should call json method with a present object with property isReserved:false", async () => {
      const res = mockResponse();
      const next = jest.fn();
      const params: any = {
        id: "22",
      };
      const req = {
        params,
      } as Request;
      const present = {
        name: "aspirador",
        isReserved: true,
        save: jest.fn(),
      };

      PresentModel.findById = jest.fn().mockResolvedValue(present);
      PresentModel.findOne = jest.fn().mockResolvedValue(present);

      await unBookPresent(req, res, next);

      expect(res.json).toBeCalledWith(present);
      expect(present).toHaveProperty("isReserved", false);
    });
  });

  describe("When it reject an error", () => {
    test("Then it should call next function with an error", async () => {
      const next = jest.fn();
      const params: any = {
        id: "22",
      };
      const req = {
        params,
      } as Request;

      const error = new Error("There was an error during the process");

      PresentModel.findById = jest.fn().mockRejectedValue(error);

      await unBookPresent(req, null, next);

      expect(next).toBeCalledWith(error);
    });
  });
});

describe("Given a infoPresent controller", () => {
  describe("When it receive a request", () => {
    test("Then it should call json method", async () => {
      const res = mockResponse();
      const next = jest.fn();
      const params: any = {
        id: "22",
      };
      const req = {
        params,
      } as Request;

      PresentModel.findById = jest.fn().mockResolvedValue({});

      await infoPresent(req, res, next);

      expect(res.json).toBeCalled();
    });
  });

  describe("When it receive a request", () => {
    test("Then it should call json method", async () => {
      const next = jest.fn();
      const params: any = {
        id: "22",
      };
      const req = {
        params,
      } as Request;
      const error = new Error("Error when looking for present");
      PresentModel.findById = jest.fn().mockRejectedValue(error);

      await infoPresent(req, null, next);

      expect(next).toBeCalledWith(error);
    });
  });
});

describe("Given a getPhotos controller", () => {
  describe("When it receive a request", () => {
    test("Then it should call json method", async () => {
      const res = mockResponse();
      const next = jest.fn();
      const photos = [
        {
          id: "1",
          title: "vivan los novios",
        },
        {
          id: "2",
          title: "te casaste la cagaste",
        },
      ];

      PhotoModel.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(photos) });

      await getPhotos(null, res, next);

      expect(res.json).toBeCalled();
    });
  });
  describe("When it reject an error", () => {
    test("Then it should call next with error", async () => {
      const next = jest.fn();

      const error = new Error("There was an error looking for photos!");
      PhotoModel.find = jest
        .fn()
        .mockResolvedValue({ populate: jest.fn().mockReturnValue("") });

      await getPhotos(null, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
});

describe("Given a getPhotos controller", () => {
  describe("When it receive a request", () => {
    test("Then it should call json method with photo", async () => {
      const res = mockResponse();
      const req = {
        body: {
          title: "vivan los novios",
        },
        userInfo: { id: "22" },
        file: "htttp...",
      };
      const next = jest.fn();
      const createdPhoto = {
        id: "1",
        author: { id: "12345" },
        title: "vivan los novios",
      };
      const responsePhoto = {
        id: "1",
        author: { name: "mario", id: "12345" },
        title: "vivan los novios",
      };

      PhotoModel.create = jest.fn().mockResolvedValue(createdPhoto);
      UserModel.findById = jest.fn().mockResolvedValue({
        photosUser: { push: jest.fn() },
        save: jest.fn(),
      });
      PhotoModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue(responsePhoto),
      });
      await createPhoto(req, res, next);

      expect(res.json).toHaveBeenCalledWith(responsePhoto);
    });
  });

  describe("When it reject an error", () => {
    test("Then it should call next function with an error", async () => {
      const res = mockResponse();
      const req = {
        body: {
          title: "vivan los novios",
        },
        userInfo: { id: "22" },
        file: "htttp...",
      };
      const next = jest.fn();
      const error = new Error("There was an error during the uploading");
      PhotoModel.create = jest.fn().mockRejectedValue(error);

      await createPhoto(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getHomePresent controller", () => {
  describe("When it reject an error", () => {
    test("Then it should call next function with an error", async () => {
      const res = mockResponse();
      const req = {} as Request;
      const next = jest.fn();
      const presents = {
        name: "aspirador",
        category: "home",
      };
      PresentModel.find = jest.fn().mockResolvedValue(presents);

      await getHomePresent(req, res, next);

      expect(res.json).toHaveBeenCalledWith(presents);
    });
  });

  describe("When it receive a request", () => {
    test("Then it should call json method with a present", async () => {
      const req = {} as Request;
      const next = jest.fn();
      const error = new Error("There was an error looking for presents");
      PresentModel.find = jest.fn().mockRejectedValue(error);

      await getHomePresent(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
});

describe("Given a getTravelPresent controller", () => {
  describe("When it receive a request", () => {
    test("Then it should call json method with a present", async () => {
      const res = mockResponse();
      const req = {} as Request;
      const next = jest.fn();
      const presents = {
        name: "maletas",
        category: "travel",
      };
      PresentModel.find = jest.fn().mockResolvedValue(presents);

      await getTravelPresent(req, res, next);

      expect(res.json).toHaveBeenCalledWith(presents);
    });
  });

  describe("When it reject an error", () => {
    test("Then it should call next function with an error", async () => {
      const req = {} as Request;
      const next = jest.fn();
      const error = new Error("There was an error looking for presents");
      PresentModel.find = jest.fn().mockRejectedValue(error);

      await getTravelPresent(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
});

describe("Given a getLeisurePresent controller", () => {
  describe("When it receive a request", () => {
    test("Then it should call json method with a present", async () => {
      const res = mockResponse();
      const req = {} as Request;
      const next = jest.fn();
      const presents = {
        name: "PS5",
        category: "ocio",
      };
      PresentModel.find = jest.fn().mockResolvedValue(presents);

      await getLeisurePresent(req, res, next);

      expect(res.json).toHaveBeenCalledWith(presents);
    });
  });

  describe("When it reject an error", () => {
    test("Then it should call next function with an error", async () => {
      const req = {} as Request;
      const next = jest.fn();
      const error = new Error("There was an error looking for presents");
      PresentModel.find = jest.fn().mockRejectedValue(error);

      await getLeisurePresent(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
});
