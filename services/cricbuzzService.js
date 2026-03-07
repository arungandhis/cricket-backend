import * as cheerio from "cheerio";

import fs from "fs";

const LIVE_SCORES_URL =
  "https://www.cricbuzz.com/cricket-match/live-scores";

const SCORECARD_BASE_URL =
  "https://www.cricbuzz.com/live-cricket-scorecard/";

const COMMENTARY_BASE_URL =
  "https://www.cricbuzz.com/live-cricket-full-commentary/";

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

// ---------------- MATCH LIST (HTML) ----------------

export async function fetchCricbuzzMatchList() {


  const html = await fetchHtml(LIVE_SCORES_URL);


fs.writeFileSync("cricbuzz_debug.html", html.substring(0, 5000));

  console.log("WROTE DEBUG FILE: cricbuzz_debug.html");


  const $ = cheerio.load(html);
console.log("USING HTML SCRAPER — NOT JSON");
console.log("=== HTML LENGTH ===", html.length);
  console.log("=== HTML SNIPPET ===");

  const matches = [];

  $("a.cb-lv-scrs-link").each((_, el) => {
    const link = $(el).attr("href") || "";
    const title = $(el).text().trim();

    const matchIdMatch = link.match(/live-cricket-scorecard\/(\d+)/);
    const matchId = matchIdMatch ? matchIdMatch[1] : null;

    if (matchId) {
      matches.push({
        id: matchId,
        name: title || `Match ${matchId}`,
        provider: "cricbuzz"
      });
    }
  });

  return matches;
}

// ---------------- SCORE (HTML) ----------------

export async function fetchCricbuzzScore(matchId) {
  const html = await fetchHtml(`${SCORECARD_BASE_URL}${matchId}`);
  return extractCricbuzzScoreFromHTML(html, matchId);
}

export function extractCricbuzzScoreFromHTML(html, matchId) {
  const $ = cheerio.load(html);

  const status = $(".cb-scrcrd-status").text().trim();

  const innings = [];
  $(".cb-scrd-hdr-rw").each((_, el) => {
    const team = $(el).find("span").first().text().trim();
    const summary = $(el).next(".cb-scrd-lft-col").text().trim();

    if (team) {
      innings.push({ team, summary });
    }
  });

  return { matchId, status, innings };
}

// ---------------- COMMENTARY (HTML) ----------------

export async function fetchCricbuzzCommentary(matchId) {
  const html = await fetchHtml(`${COMMENTARY_BASE_URL}${matchId}`);
  return extractCricbuzzCommentaryFromHTML(html, matchId);
}

export function extractCricbuzzCommentaryFromHTML(html, matchId) {
  const $ = cheerio.load(html);
  const commentary = [];

  $(".cb-col.cb-col-90.cb-com-ln").each((_, el) => {
    const over = $(el).find(".cb-ovr-num").text().trim();
    const text = $(el).text().trim();
    if (text) commentary.push({ over, text });
  });

  return { matchId, commentary };
}
