import express from "express";
import {
  getOverlayState,
  updateOverlayState
} from "../controllers/overlayController.js";

const router = express.Router();

router.get("/state", getOverlayState);
router.post("/update", updateOverlayState);

export default router;
