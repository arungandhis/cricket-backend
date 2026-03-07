import express from "express";
import {
  saveStreamKey,
  connectStream,
  startStream,
  stopStream,
  streamStatus
} from "../controllers/streamController.js";

const router = express.Router();

router.post("/save-key", saveStreamKey);
router.post("/connect", connectStream);
router.post("/start", startStream);
router.post("/stop", stopStream);
router.get("/status", streamStatus);

export default router;
