const BASE_URL = "https://api.cricapi.com/v1";
const API_KEY = process.env.CRIC_API_KEY; // free key

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed fetch: ${url} — ${res.status}`);
  return res.json();
}

// ---------------- MATCH LIST ----------------

export async function fetchMatchList() {
  const url = `${BASE_URL}/currentMatches?apikey=${API_KEY}`;
  const data = await fetchJson(url);

  return data.data.map(m => ({
    id: m.id,
    name: `${m.teams[0]} vs ${m.teams[1]}`,
    status: m.status,
    provider: "cricketdata"
  }));
}

// ---------------- SCORE ----------------

export async function fetchScore(matchId) {
  const url = `${BASE_URL}/match_info?apikey=${API_KEY}&id=${matchId}`;
  const data = await fetchJson(url);

  return {
    id: matchId,
    status: data.data.status,
    score: data.data.score,
    teams: data.data.teams
  };
}

// ---------------- COMMENTARY ----------------

export async function fetchCommentary(matchId) {
  const url = `${BASE_URL}/match_commentary?apikey=${API_KEY}&id=${matchId}`;
  const data = await fetchJson(url);

  return {
    id: matchId,
    commentary: data.data.commentary
  };
}
