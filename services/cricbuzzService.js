// backend/services/cricbuzzService.js
import fetch from "node-fetch";

const BASE = "https://mapps.cricbuzz.com/cbzios";

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      // mimic mobile app a bit
      "User-Agent": "Cricbuzz/Android",
      Accept: "application/json"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getLiveMatchesRaw() {
  // Live + recent matches
  return fetchJson(`${BASE}/match/livematches`);
}

export async function getMatchScoreRaw(matchId) {
  return fetchJson(`${BASE}/match/${matchId}`);
}

export async function getCommentaryRaw(matchId) {
  return fetchJson(`${BASE}/match/${matchId}/commentary`);
}
