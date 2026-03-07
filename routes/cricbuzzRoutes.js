import express from "express";
import {
  fetchCricbuzzMatchList,
  fetchCricbuzzScore,
  fetchCricbuzzCommentary
} from "../services/cricbuzzService.js";

const router = express.Router();

router.get("/matches", async (req, res) => {
  try {
    const matches = await fetchCricbuzzMatchList();
    res.json(matches);
  } catch (err) {
    console.error("MATCH LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load Cricbuzz matches" });
  }
});

router.get("/score/:matchId", async (req, res) => {
  try {
    const score = await fetchCricbuzzScore(req.params.matchId);
    res.json(score);
  } catch (err) {
    console.error("SCORE ERROR:", err);
    res.status(500).json({ error: "Failed to load Cricbuzz score" });
  }
});

router.get("/commentary/:matchId", async (req, res) => {
  try {
    const commentary = await fetchCricbuzzCommentary(req.params.matchId);
    res.json(commentary);
  } catch (err) {
    console.error("COMMENTARY ERROR:", err);
    res.status(500).json({ error: "Failed to load Cricbuzz commentary" });
  }
});

export default router;
