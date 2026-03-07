import express from "express";
import { saveMatchSettings, getMatchSettings } from "../controllers/matchController.js";

const router = express.Router();

router.post("/settings", saveMatchSettings);
router.get("/settings", getMatchSettings);

export default router;
