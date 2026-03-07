import { spawn } from "child_process";

let ffmpegProcess = null;

export const startFFmpeg = (rtmpUrl, streamKey) => {
  if (ffmpegProcess) return { error: "FFmpeg already running" };

  const fullUrl = `${rtmpUrl}/${streamKey}`;

  ffmpegProcess = spawn("ffmpeg", [
    "-re",
    "-i", "overlay/output.mkv",   //  "test/test.mp4",     // your rendered overlay video
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-b:v", "3000k",
    "-maxrate", "3000k",
    "-bufsize", "6000k",
    "-pix_fmt", "yuv420p",
    "-g", "50",
    "-c:a", "aac",
    "-b:a", "128k",
    "-f", "flv",
    fullUrl
  ]);

  ffmpegProcess.stderr.on("data", (data) => {
    console.log("FFmpeg:", data.toString());
  });

  ffmpegProcess.on("close", () => {
    console.log("FFmpeg stopped");
    ffmpegProcess = null;
  });

  return { success: true };
};

export const stopFFmpeg = () => {
  if (!ffmpegProcess) return { error: "FFmpeg not running" };

  ffmpegProcess.kill("SIGINT");
  ffmpegProcess = null;

  return { success: true };
};

export const isStreaming = () => !!ffmpegProcess;
