import { spawn, execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FFMPEG_PATH = ffmpegInstaller.path;
const FFPROBE_PATH = FFMPEG_PATH.replace("ffmpeg.exe", "ffprobe.exe");

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

async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ffmpeg ${args.join(" ")}`);
    const proc = spawn(command, args);

    proc.stderr.on("data", (data) => {
      const output = data.toString();
      if (output.includes("time=")) {
        process.stdout.write(
          `\rProgress: ${output.split("time=")[1].split(" ")[0]}`,
        );
      }
    });

    proc.on("close", (code) => {
      if (code === 0) {
        console.log("\nCommand completed successfully.");
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function optimizeVideos() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  // Get duration
  const duration = parseFloat(
    execSync(
      `${FFPROBE_PATH} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${INPUT_FILE}"`,
    )
      .toString()
      .trim(),
  );
  console.log(`Video duration: ${duration.toFixed(2)} seconds`);

  // --- MP4 OPTIMIZATION (Target ~45MB) ---
  // 45MB = 377,487,360 bits
  const targetMp4SizeBits = 45 * 1024 * 1024 * 8;
  const mp4Bitrate = Math.floor(targetMp4SizeBits / duration) - 128000;

  console.log(
    `\n--- Optimizing MP4 (Target 45MB, Bitrate: ${Math.floor(mp4Bitrate / 1000)}k) ---`,
  );
  await runCommand(FFMPEG_PATH, [
    "-y",
    "-i",
    INPUT_FILE,
    "-c:v",
    "libx264",
    "-b:v",
    `${mp4Bitrate}`,
    "-maxrate",
    `${mp4Bitrate * 1.5}`,
    "-bufsize",
    `${mp4Bitrate * 2}`,
    "-preset",
    "slower",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    OUTPUT_MP4,
  ]);

  // --- WEBM OPTIMIZATION (Target ~95MB, Two-Pass) ---
  // 95MB = 796,917,760 bits
  const targetWebmSizeBits = 95 * 1024 * 1024 * 8;
  const webmBitrate = Math.floor(targetWebmSizeBits / duration) - 128000;

  console.log(`\n--- Optimizing WebM (Target 95MB, Pass 1) ---`);
  await runCommand(FFMPEG_PATH, [
    "-y",
    "-i",
    INPUT_FILE,
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    `${webmBitrate}`,
    "-pass",
    "1",
    "-an",
    "-f",
    "null",
    "NUL",
  ]);

  console.log(`\n--- Optimizing WebM (Target 95MB, Pass 2) ---`);
  await runCommand(FFMPEG_PATH, [
    "-y",
    "-i",
    INPUT_FILE,
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    `${webmBitrate}`,
    "-pass",
    "2",
    "-c:a",
    "libopus",
    "-b:a",
    "128k",
    OUTPUT_WEBM,
  ]);

  // Cleanup logs
  if (fs.existsSync("ffmpeg2pass-0.log")) fs.unlinkSync("ffmpeg2pass-0.log");
  if (fs.existsSync("vp9_spatial_layer_0.log"))
    fs.unlinkSync("vp9_spatial_layer_0.log");

  // Rename compressed mp4 to final name
  fs.renameSync(OUTPUT_MP4, FINAL_MP4);

  console.log("\nAll optimizations completed!");
  const mp4Stats = fs.statSync(FINAL_MP4);
  const webmStats = fs.statSync(OUTPUT_WEBM);
  console.log(
    `Final MP4 size: ${(mp4Stats.size / (1024 * 1024)).toFixed(2)} MB`,
  );
  console.log(
    `Final WebM size: ${(webmStats.size / (1024 * 1024)).toFixed(2)} MB`,
  );
}

optimizeVideos().catch((err) => {
  console.error("Optimization failed:", err);
});
