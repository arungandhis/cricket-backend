import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const API_KEY = process.env.CD_API_KEY;
const BASE_URL = "https://api.cricapi.com/v1";

async function fetchJson(url) {
  const res = await fetch(url);
  const json = await res.json().catch(() => null);
  return json;
}

/* ---------------------------------------------------------
   GET LIVE + RECENT MATCHES
--------------------------------------------------------- */
router.get("/matches", async (req, res) => {
  try {
    const url = `${BASE_URL}/currentMatches?apikey=${API_KEY}`;
    const data = await fetchJson(url);

    // SAFETY CHECKS
    if (!data) {
      console.error("MATCH LIST ERROR: No response from API");
      return res.json([]);
    }

    if (data.status === "error") {
      console.error("MATCH LIST ERROR:", data.message);
      return res.json([]);
    }

    if (!Array.isArray(data.data)) {
      console.error("MATCH LIST ERROR: data.data missing");
      return res.json([]);
    }

    const matches = data.data.map(m => ({
      id: m.id,
      name: `${m.teams?.[0]} vs ${m.teams?.[1]}`,
      status: m.status,
      provider: "cricketdata"
    }));

    res.json(matches);
  } catch (err) {
    console.error("MATCH LIST ERROR:", err.message);
    res.json([]);
  }
});

/* ---------------------------------------------------------
   GET SCORE
--------------------------------------------------------- */
router.get("/score/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;
    const url = `${BASE_URL}/match_scorecard?apikey=${API_KEY}&id=${matchId}`;
    const data = await fetchJson(url);

    if (!data || data.status === "error" || !data.data) {
      console.error("SCORE ERROR:", data?.message);
      return res.json({});
    }

    res.json(data.data);
  } catch (err) {
    console.error("SCORE ERROR:", err.message);
    res.json({});
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

    if (!data || data.status === "error" || !data.data) {
      console.error("COMMENTARY ERROR:", data?.message);
      return res.json({ commentary: [] });
    }

    res.json({
      commentary: data.data.commentary || []
    });
  } catch (err) {
    console.error("COMMENTARY ERROR:", err.message);
    res.json({ commentary: [] });
  }
});

export default router;
