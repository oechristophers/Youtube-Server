import express from "express";
import {
  addVideo,
  addView,
  deleteVideo,
  getVideo,
  getbyTag,
  random,
  search,
  sub,
  trend,
  updateVideo,
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//creaet a video
router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.put("/view/:id", addView);
router.get("/trend", trend);
router.get("/random", random);
router.get("/tags", getbyTag);
router.get("/search", search);
router.get("/sub", verifyToken, sub);

export default router;
