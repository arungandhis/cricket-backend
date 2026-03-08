import * as cheerio from "cheerio";

const LIVE_SCORES_URL =
  "https://www.espncricinfo.com/live-cricket-score";

const SCORECARD_BASE_URL =
  "https://www.espncricinfo.com/series/_/id/";

const COMMENTARY_BASE_URL =
  "https://www.espncricinfo.com/series/_/id/";

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

// ------------- MATCH LIST -------------

export async function fetchEspnMatchList() {
  const html = await fetchHtml(LIVE_SCORES_URL);
  const $ = cheerio.load(html);

  const matches = [];

  // Each match card
  $("section.ds-rounded-lg.ds-mb-4").each((_, el) => {
    const title = $(el).find("span.ds-text-tight-m").first().text().trim();

    // Link to scorecard
    const scorecardLink = $(el)
      .find("a:contains('Scorecard')")
      .attr("href");

    if (!scorecardLink) return;

    // Example: /series/india-tour-of-australia-2024-25-1234567/australia-vs-india-1st-test-1234568/full-scorecard
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

// ------------- SCORE -------------

export async function fetchEspnScore(matchId, scorecardPath) {
  const url = scorecardPath
    ? `https://www.espncricinfo.com${scorecardPath}`
    : `${SCORECARD_BASE_URL}${matchId}/full-scorecard`;

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

// ------------- COMMENTARY -------------

export async function fetchEspnCommentary(matchId, scorecardPath) {
  const commentaryPath = scorecardPath
    ? scorecardPath.replace("full-scorecard", "ball-by-ball-commentary")
    : `${SCORECARD_BASE_URL}${matchId}/ball-by-ball-commentary`;

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
