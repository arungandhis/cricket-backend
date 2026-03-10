// backend/services/cricbuzzService.js

// Node 18+ has fetch built-in — no import needed

const BASE = "https://mapps.cricbuzz.com/cbzios";

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Cricbuzz/Android",
        Accept: "application/json"
      }
    });

    if (!res.ok) {
      console.error("CRICBUZZ HTTP ERROR:", res.status, url);
      return null;
    }

    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("CRICBUZZ JSON PARSE ERROR:", err.message);
      console.error("RAW RESPONSE:", text.slice(0, 200));
      return null;
    }
  } catch (err) {
    console.error("CRICBUZZ FETCH ERROR:", err.message);
    return null;
  }
}

export async function getLiveMatchesRaw() {
  return fetchJson(`${BASE}/match/livematches`);
}

export async function getRecentMatchesRaw() {
  return fetchJson(`${BASE}/match/recent`);
}

export async function getUpcomingMatchesRaw() {
  return fetchJson(`${BASE}/match/upcoming`);
}

export async function getMatchScoreRaw(matchId) {
  return fetchJson(`${BASE}/match/${matchId}`);
}

export async function getCommentaryRaw(matchId) {
  return fetchJson(`${BASE}/match/${matchId}/commentary`);
}
