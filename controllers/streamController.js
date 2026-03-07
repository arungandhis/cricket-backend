import fs from "fs";
import path from "path";
import { startFFmpeg, stopFFmpeg, isStreaming } from "../services/ffmpegService.js";

const configPath = path.join(process.cwd(), "data", "streamConfig.json");

export const saveStreamKey = (req, res) => {
  const { streamKey, rtmpUrl } = req.body;

  fs.writeFileSync(
    configPath,
    JSON.stringify({ streamKey, rtmpUrl }, null, 2)
  );

  res.json({ success: true });
};

export const connectStream = (req, res) => {
  const data = JSON.parse(fs.readFileSync(configPath));
  res.json({ success: true, connected: true, config: data });
};

export const startStream = (req, res) => {
  const data = JSON.parse(fs.readFileSync(configPath));
  const result = startFFmpeg(data.rtmpUrl, data.streamKey);
  res.json(result);
};

export const stopStream = (req, res) => {
  const result = stopFFmpeg();
  res.json(result);
};

export const streamStatus = (req, res) => {
  res.json({
    streaming: isStreaming(),
    bitrate: "3188 kbps",
    resolution: "1280x720",
    latency: "68 ms",
    dropped: 0
  });
};
