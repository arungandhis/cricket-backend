import * as cheerio from "cheerio";

console.log("LOADED cricinfoService.js");
const LIVE_SCORES_URL =
  "https://www.espncricinfo.com/live-cricket-score";

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed HTML fetch: ${url} — status ${res.status}`);
  }

  return await res.text();
}

// ---------------- MATCH LIST ----------------

export async function fetchEspnMatchList() {
  const html = await fetchHtml(LIVE_SCORES_URL);
  const $ = cheerio.load(html);

  const matches = [];

  $("section.ds-rounded-lg.ds-mb-4").each((_, el) => {
    const title = $(el).find("span.ds-text-tight-m").first().text().trim();

    const scorecardLink = $(el)
      .find("a:contains('Scorecard')")
      .attr("href");

    if (!scorecardLink) return;

    const matchIdMatch = scorecardLink.match(/-(\d+)\/full-scorecard/);
    const matchId = matchIdMatch ? matchIdMatch[1] : null;

    if (matchId) {
      matches.push({
        id: matchId,
        name: title || `Match ${matchId}`,
        provider: "espncricinfo",
        scorecardPath: scorecardLink
      });
    }
  });

  return matches;
}

// ---------------- SCORE ----------------

export async function fetchEspnScore(matchId, scorecardPath) {
  const url = scorecardPath
    ? `https://www.espncricinfo.com${scorecardPath}`
    : `https://www.espncricinfo.com/series/_/id/${matchId}/full-scorecard`;

  const html = await fetchHtml(url);
  return extractEspnScoreFromHTML(html, matchId);
}

export function extractEspnScoreFromHTML(html, matchId) {
  const $ = cheerio.load(html);

  const status = $("span.ds-text-tight-s.ds-font-regular").first().text().trim();

  const innings = [];
  $("div.ds-rounded-lg.ds-mb-4").each((_, el) => {
    const team = $(el).find("span.ds-text-title-xs").first().text().trim();
    const summary = $(el).find("strong.ds-text-compact-m").first().text().trim();

    if (team && summary) {
      innings.push({ team, summary });
    }
  });

  return { matchId, status, innings };
}

// ---------------- COMMENTARY ----------------

export async function fetchEspnCommentary(matchId, scorecardPath) {
  const commentaryPath = scorecardPath
    ? scorecardPath.replace("full-scorecard", "ball-by-ball-commentary")
    : `/series/_/id/${matchId}/ball-by-ball-commentary`;

  const url = `https://www.espncricinfo.com${commentaryPath}`;
  const html = await fetchHtml(url);
  return extractEspnCommentaryFromHTML(html, matchId);
}

export function extractEspnCommentaryFromHTML(html, matchId) {
  const $ = cheerio.load(html);
  const commentary = [];

  $("div.ds-py-3").each((_, el) => {
    const over = $(el).find("span.ds-text-tight-xs").first().text().trim();
    const text = $(el).find("p.ds-text-tight-s").text().trim();
    if (text) commentary.push({ over, text });
  });

  return { matchId, commentary };
}
