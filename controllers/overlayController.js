import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "..", "data", "overlayConfig.json");

export const getOverlayState = (req, res) => {
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    console.error("Error reading overlayConfig.json", err);
    res.status(500).json({ error: "Failed to read overlay state" });
  }
};

export const updateOverlayState = (req, res) => {
  try {
    const incoming = req.body;

    const raw = fs.readFileSync(configPath, "utf-8");
    const current = JSON.parse(raw);

    const updated = {
      ...current,
      ...incoming,
      teams: {
        ...current.teams,
        ...(incoming.teams || {})
      },
      score: {
        ...current.score,
        ...(incoming.score || {})
      },
      batsmen: {
        ...current.batsmen,
        ...(incoming.batsmen || {})
      }
    };

    fs.writeFileSync(configPath, JSON.stringify(updated, null, 2));
    res.json({ success: true, state: updated });
  } catch (err) {
    console.error("Error writing overlayConfig.json", err);
    res.status(500).json({ error: "Failed to update overlay state" });
  }
};
