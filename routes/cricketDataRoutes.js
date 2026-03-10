// backend/routes/cricketDataRoutes.js
import express from "express";
import {
  getLiveMatchesRaw,
  getRecentMatchesRaw,
  getUpcomingMatchesRaw,
  getMatchScoreRaw,
  getCommentaryRaw
} from "../services/cricbuzzService.js";

const router = express.Router();

/* ---------------------------------------------------------
   NORMALIZERS
--------------------------------------------------------- */

function normalizeMatch(m, source = "unknown") {
  if (!m) return null;

  const id =
    m.match_id ||
    m.id ||
    m.matchId;

  const team1 =
    m.team1?.name ||
    m.team1_name ||
    m.team1?.s_name ||
    m.team1?.fn ||
    m.team1;

  const team2 =
    m.team2?.name ||
    m.team2_name ||
    m.team2?.s_name ||
    m.team2?.fn ||
    m.team2;

  const status =
    m.header?.status ||
    m.status ||
    m.state ||
    source;

  if (!id || !team1 || !team2) return null;

  return {
    id,
    name: `${team1} vs ${team2}`,
    status,
    provider: "cricbuzz"
  };
}

function normalizeScore(raw) {
  if (!raw) return {};

  const header = raw.header || {};
  const teams = raw.team || raw.teams || [];
  const scorecards = raw.scorecard || raw.innings || [];

  const score = scorecards.map((sc) => ({
    inning:
      sc.innings_name ||
      sc.inning_name ||
      sc.innings ||
      sc.batteam ||
      "Innings",
    runs: sc.runs ?? sc.score ?? null,
    wickets: sc.wkts ?? sc.wickets ?? null,
    overs: sc.overs ?? sc.overs_done ?? null
  }));

  const normTeams = teams.map((t) => ({
    id: t.id || t.team_id,
    name: t.name || t.team_name || t.s_name
  }));

  return {
    status: header.status || raw.status || "Unknown",
    teams: normTeams,
    score
  };
}

function normalizeCommentary(raw) {
  if (!raw) return { commentary: [] };

  const lines =
    raw.commentary ||
    raw.comm_lines ||
    raw.data ||
    [];

  const commentary = lines
    .map((c) => {
      const text =
        c.comm ||
        c.c_text ||
        c.text ||
        c.commentary ||
        "";

      const over =
        c.o_no ||
        c.over ||
        c.ov ||
        null;

      if (!text) return null;
      if (over) return `Over ${over}: ${text}`;
      return text;
    })
    .filter(Boolean);

  return { commentary };
}

/* ---------------------------------------------------------
   ROUTES
--------------------------------------------------------- */

// GET /api/cricket/matches  → Live + Recent + Upcoming
router.get("/matches", async (req, res) => {
  try {
    const [live, recent, upcoming] = await Promise.all([
      getLiveMatchesRaw(),
      getRecentMatchesRaw(),
      getUpcomingMatchesRaw()
    ]);

    const liveList = (live?.matches || live?.match || []).map(m => normalizeMatch(m, "Live"));
    const recentList = (recent?.matches || recent?.match || []).map(m => normalizeMatch(m, "Completed"));
    const upcomingList = (upcoming?.matches || upcoming?.match || []).map(m => normalizeMatch(m, "Upcoming"));

    const all = [...liveList, ...recentList, ...upcomingList].filter(Boolean);

    res.json(all);
  } catch (err) {
    console.error("MATCH LIST ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch match list" });
  }
});

// GET /api/cricket/score/:matchId
router.get("/score/:matchId", async (req, res) => {
  try {
    const raw = await getMatchScoreRaw(req.params.matchId);
    const score = normalizeScore(raw);
    res.json(score);
  } catch (err) {
    console.error("SCORE ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

// GET /api/cricket/commentary/:matchId
router.get("/commentary/:matchId", async (req, res) => {
  try {
    const raw = await getCommentaryRaw(req.params.matchId);
    const commentary = normalizeCommentary(raw);
    res.json(commentary);
  } catch (err) {
    console.error("COMMENTARY ERROR:", err.message);
    res.status(500).json({ commentary: [] });
  }
});

export default router;
