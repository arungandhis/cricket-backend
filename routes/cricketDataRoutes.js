import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const API_KEY = process.env.CD_API_KEY; // your CricketData API key
const BASE_URL = "https://api.cricapi.com/v1";

// Helper to fetch JSON safely
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ---------------------------------------------------------
   GET LIVE + RECENT MATCHES
--------------------------------------------------------- */
router.get("/matches", async (req, res) => {
  try {
    const url = `${BASE_URL}/currentMatches?apikey=${API_KEY}`;
    const data = await fetchJson(url);

    const matches = (data.data || []).map(m => ({
      id: m.id,
      name: `${m.teams[0]} vs ${m.teams[1]}`,
      status: m.status,
      provider: "cricketdata"
    }));

    res.json(matches);
  } catch (err) {
    console.error("MATCH LIST ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

/* ---------------------------------------------------------
   GET UPCOMING MATCHES
--------------------------------------------------------- */
router.get("/matches/upcoming", async (req, res) => {
  try {
    const url = `${BASE_URL}/matches?apikey=${API_KEY}`;
    const data = await fetchJson(url);

    const upcoming = (data.data || [])
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

/* ---------------------------------------------------------
   GET LIVE SCORE
--------------------------------------------------------- */
router.get("/score/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;
    const url = `${BASE_URL}/match_scorecard?apikey=${API_KEY}&id=${matchId}`;
    const data = await fetchJson(url);

    res.json(data.data || {});
  } catch (err) {
    console.error("SCORE ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

/* ---------------------------------------------------------
   GET COMMENTARY
--------------------------------------------------------- */
router.get("/commentary/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;
    const url = `${BASE_URL}/match_commentary?apikey=${API_KEY}&id=${matchId}`;
    const data = await fetchJson(url);

    res.json({
      commentary: data.data?.commentary || []
    });
  } catch (err) {
    console.error("COMMENTARY ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch commentary" });
  }
});

export default router;
