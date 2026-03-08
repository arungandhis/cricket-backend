import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Path to settings file
const settingsFile = path.join(process.cwd(), "matchSettings.json");

// GET /api/match/settings
router.get("/settings", (req, res) => {
  try {
    if (!fs.existsSync(settingsFile)) {
      return res.json({
        matchId: "",
        apiKey: "",
        pollInterval: 10,
        maxBalls: 6,
        rtmp: ""
      });
    }

    const data = JSON.parse(fs.readFileSync(settingsFile, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("LOAD SETTINGS ERROR:", err);
    res.status(500).json({ error: "Failed to load settings" });
  }
});

// POST /api/match/settings
router.post("/settings", (req, res) => {
  try {
    const { matchId, apiKey, pollInterval, maxBalls, rtmp } = req.body;

    const data = {
      matchId,
      apiKey,
      pollInterval,
      maxBalls,
      rtmp
    };

    fs.writeFileSync(settingsFile, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("SAVE SETTINGS ERROR:", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
