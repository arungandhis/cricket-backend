import express from "express";
import {
  fetchMatchList,
  fetchScore,
  fetchCommentary
} from "../services/cricketDataService.js";

const router = express.Router();

router.get("/matches", async (req, res) => {
  try {
    const matches = await fetchMatchList();
    res.json(matches);
  } catch (err) {
    console.error("MATCH LIST ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch match list" });
  }
});

router.get("/score/:matchId", async (req, res) => {
  try {
    const score = await fetchScore(req.params.matchId);
    res.json(score);
  } catch (err) {
    console.error("SCORE ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

router.get("/commentary/:matchId", async (req, res) => {
  try {
    const commentary = await fetchCommentary(req.params.matchId);
    res.json(commentary);
  } catch (err) {
    console.error("COMMENTARY ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch commentary" });
  }
});

router.get("/matches/upcoming", async (req, res) => {
  try {
    const url = `${BASE_URL}/matches?apikey=${API_KEY}`;
    const data = await fetchJson(url);

    const upcoming = data.data
      .filter(m => m.status === "Not Started" || m.status === "Scheduled")
      .map(m => ({
        id: m.id,
        name: `${m.teams[0]} vs ${m.teams[1]}`,
        status: m.status,
        provider: "cricketdata"
      }));

    res.json(upcoming);
  } catch (err) {
    console.error("UPCOMING MATCHES ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch upcoming matches" });
  }
});


export default router;
