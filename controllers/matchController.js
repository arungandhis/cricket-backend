import fs from "fs";
import path from "path";

const settingsPath = path.join(process.cwd(), "data", "matchSettings.json");

export const saveMatchSettings = (req, res) => {
  const { matchId, apiKey, pollInterval, maxBalls, rtmp } = req.body;

  const newSettings = {
    matchId,
    apiKey,
    pollInterval,
    maxBalls,
    rtmp
  };

  fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));

  res.json({ success: true, message: "Match settings saved successfully" });
};

export const getMatchSettings = (req, res) => {
  const data = fs.readFileSync(settingsPath);
  const settings = JSON.parse(data);
  res.json(settings);
};
