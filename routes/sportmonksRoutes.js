import express from "express";
import {
  fetchMatchList,
  updateOverlayFromSportmonks
} from "../services/sportmonksService.js";

const router = express.Router();

router.post("/matches", async (req, res) => {
  const { apiKey } = req.body;

  try {
    const matches = await fetchMatchList(apiKey);
    res.json({ success: true, matches });
  } catch (err) {
    console.error("Sportmonks match list error:", err);
    res.status(500).json({ error: "Failed to load matches" });
  }
});

router.post("/update", async (req, res) => {
  const { matchId, apiKey } = req.body;

  try {
    const state = await updateOverlayFromSportmonks(matchId, apiKey);
    res.json({ success: true, state });
  } catch (err) {
    console.error("Sportmonks update error:", err);
    res.status(500).json({ error: "Failed to fetch Sportmonks data" });
  }
});

export default router;
