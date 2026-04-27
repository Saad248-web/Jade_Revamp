const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Use a simple way to find ffmpeg/ffprobe
let ffmpegPath = "ffmpeg";
try {
  const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
  ffmpegPath = ffmpegInstaller.path;
} catch (e) {
  console.log("ffmpeg-installer not found, using system ffmpeg");
}

const ffprobePath = ffmpegPath
  .replace("ffmpeg.exe", "ffprobe.exe")
  .replace("ffmpeg", "ffprobe");

const INPUT_FILE = path.join(__dirname, "../public/Hero_Video/Hero Video.mp4");
const OUTPUT_WEBM = path.join(
  __dirname,
  "../public/Hero_Video/Hero Video.webm",
);
const OUTPUT_MP4 = path.join(
  __dirname,
  "../public/Hero_Video/Hero Video_compressed.mp4",
);
const FINAL_MP4 = path.join(__dirname, "../public/Hero_Video/Hero Video.mp4");

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(" ")}`);
    const proc = spawn(command, args);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Failed with code ${code}`));
    });
  });
}

async function start() {
  console.log("Starting simplified optimization...");

  // Use a very safe bitrate that targets ~40MB for 1 minute
  // 40MB in 60s = 5.3 Mbps. We'll use 5M.
  const mp4Bitrate = "5M";
  // 90MB in 60s = 12 Mbps. We'll use 11M.
  const webmBitrate = "11M";

  console.log(`Using fixed bitrates: MP4=${mp4Bitrate}, WebM=${webmBitrate}`);

  console.log("\n--- Optimizing MP4 ---");
  await runCommand(ffmpegPath, [
    "-y",
    "-i",
    INPUT_FILE,
    "-c:v",
    "libx264",
    "-b:v",
    mp4Bitrate,
    "-preset",
    "medium",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    OUTPUT_MP4,
  ]);

  console.log("\n--- Optimizing WebM (Pass 1) ---");
  await runCommand(ffmpegPath, [
    "-y",
    "-i",
    INPUT_FILE,
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    webmBitrate,
    "-pass",
    "1",
    "-an",
    "-f",
    "null",
    "NUL",
  ]);

  console.log("\n--- Optimizing WebM (Pass 2) ---");
  await runCommand(ffmpegPath, [
    "-y",
    "-i",
    INPUT_FILE,
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    webmBitrate,
    "-pass",
    "2",
    "-c:a",
    "libopus",
    "-b:a",
    "128k",
    OUTPUT_WEBM,
  ]);

  fs.renameSync(OUTPUT_MP4, FINAL_MP4);
  console.log("\nOptimization complete!");
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
