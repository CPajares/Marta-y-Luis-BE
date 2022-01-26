import express from "express";
import multer from "multer";
import path from "path";
import {
  publishComments,
  getComment,
  deleteComment,
  modifyComment,
  getPresents,
  unBookPresent,
  infoPresent,
  getPhotos,
  createPhoto,
  getHomePresent,
  getTravelPresent,
  getLeisurePresent,
} from "../controllers/martayluisController";
import autho from "../middleware/autho";
import firebase from "../middleware/firebase";
import verifyComment from "../middleware/verifyComment";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: "images",
    filename: (req, file, callback) => {
      const oldFilename = file.originalname;
      const oldFilenameExtension = path.extname(oldFilename);
      const oldFilenameWithoutExtension = oldFilename.replace(
        oldFilenameExtension,
        ""
      );

      const newFilename = `${oldFilenameWithoutExtension}-${Date.now()}-${oldFilenameExtension}`;
      callback(null, newFilename);
    },
  }),
});

router.get("/comments", getComment);
router.post("/publishcomment", autho, publishComments);
router.delete("/deletecomment/:id", autho, verifyComment, deleteComment);
router.patch("/modifycomment", autho, modifyComment);

router.get("/presents", getPresents);
router.get("/presents/home", autho, getHomePresent);
router.get("/presents/travel", autho, getTravelPresent);
router.get("/presents/leisure", autho, getLeisurePresent);
router.patch("/unbookpresent/:id", autho, unBookPresent);
router.get("/infopresent/:id", infoPresent);

router.get("/photos", getPhotos);
router.post(
  "/photoupload",
  autho,
  upload.single("photo"),
  firebase,
  createPhoto
);

export default router;
