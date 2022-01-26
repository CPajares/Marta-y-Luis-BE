import express from "express";
import {
  loginUser,
  createUser,
  presentForUser,
  unBookForUser,
  getUser,
} from "../controllers/userController";
import autho from "../middleware/autho";

const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/getuser/:id", autho, getUser);
router.patch("/presentforuser/:id", autho, presentForUser);
router.patch("/unbookpresentforuser/:id", autho, unBookForUser);

export default router;
