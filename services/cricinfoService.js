import * as cheerio from "cheerio";

export const extractMatchesFromHTML = (html) => {
  const $ = cheerio.load(html);
  const scriptTag = $('#__NEXT_DATA__').html();
  if (!scriptTag) return [];

  const json = JSON.parse(scriptTag);
  const matches = json?.props?.pageProps?.data?.content?.matches || {};

  const result = [];
  const push = (list, status) => {
    if (!Array.isArray(list)) return;
    list.forEach((m) =>
      result.push({
        id: m.objectId,
        name: m.series?.longName || m.slug,
        status
      })
    );
  };

  push(matches.live, "LIVE");
  push(matches.upcoming, "UPCOMING");
  push(matches.recent, "RECENT");

  return result;
};

export const extractScoreFromHTML = (html) => {
  const $ = cheerio.load(html);
  // TODO: refine once we see real HTML
  return {};
};

export const extractCommentaryFromHTML = (html) => {
  const $ = cheerio.load(html);
  // TODO: refine once we see real HTML
  return [];
};
