import express from "express";
import {
  fetchEspnMatchList,
  fetchEspnScore,
  fetchEspnCommentary
} from "../services/espnService.js";

const router = express.Router();

// GET /api/espn/matches
router.get("/matches", async (req, res) => {
  try {
    const matches = await fetchEspnMatchList();
    res.json(matches);
  } catch (err) {
    console.error("ESPN MATCH LIST ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch ESPN match list" });
  }
});

// GET /api/espn/score/:matchId
router.get("/score/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;
    const { scorecardPath } = req.query; // optional
    const score = await fetchEspnScore(matchId, scorecardPath);
    res.json(score);
  } catch (err) {
    console.error("ESPN SCORE ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch ESPN score" });
  }
});

// GET /api/espn/commentary/:matchId
router.get("/commentary/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;
    const { scorecardPath } = req.query; // optional
    const commentary = await fetchEspnCommentary(matchId, scorecardPath);
    res.json(commentary);
  } catch (err) {
    console.error("ESPN COMMENTARY ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch ESPN commentary" });
  }
});

export default router;
