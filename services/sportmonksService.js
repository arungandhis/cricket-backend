import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const overlayPath = path.join(__dirname, "..", "data", "overlayConfig.json");

const readOverlay = () => JSON.parse(fs.readFileSync(overlayPath, "utf-8"));
const writeOverlay = (data) =>
  fs.writeFileSync(overlayPath, JSON.stringify(data, null, 2));

export const fetchMatchList = async (apiKey) => {
  const liveUrl = `https://cricket.sportmonks.com/api/v2.0/fixtures/live?api_token=${apiKey}&include=localteam,visitorteam`;
  const upcomingUrl = `https://cricket.sportmonks.com/api/v2.0/fixtures?api_token=${apiKey}&include=localteam,visitorteam`;

  const live = await axios.get(liveUrl);
  const upcoming = await axios.get(upcomingUrl);

  const formatMatch = (m) => ({
    id: m.id,
    name: `${m.localteam?.name} vs ${m.visitorteam?.name}`,
    status: m.status,
    date: m.starting_at
  });

  return [
    ...live.data.data.map(formatMatch),
    ...upcoming.data.data.map(formatMatch)
  ];
};

export const fetchMatchData = async (matchId, apiKey) => {
  const url = `https://cricket.sportmonks.com/api/v2.0/fixtures/${matchId}?api_token=${apiKey}&include=runs,batting,bowling,balls,localteam,visitorteam`;

  const response = await axios.get(url);
  return response.data.data;
};

export const updateOverlayFromSportmonks = async (matchId, apiKey) => {
  const match = await fetchMatchData(matchId, apiKey);

  const teamA = match.localteam.name;
  const teamB = match.visitorteam.name;

  const innings = match.runs[0];

  const score = {
    runs: innings.score,
    wickets: innings.wickets,
    overs: innings.overs
  };

  const batting = match.batting.filter((b) => b.result === "notout");
  const striker = batting[0]?.batsman?.fullname || "";
  const nonStriker = batting[1]?.batsman?.fullname || "";

  const bowler = match.bowling[0]?.bowler?.fullname || "";

  const overlay = {
    teams: { teamA, teamB },
    score,
    batsmen: { striker, nonStriker },
    bowler,
    showScorebug: true
  };

  writeOverlay(overlay);
  return overlay;
};
