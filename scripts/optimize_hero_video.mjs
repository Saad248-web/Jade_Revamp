import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FFMPEG_PATH = ffmpegInstaller.path;

const INPUT_FILE = path.join(__dirname, "../public/Hero_Video/Hero Video.mp4");
const OUTPUT_FILE = path.join(
  __dirname,
  "../public/Hero_Video/Hero Video.webm",
);

async function convertToWebm() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  console.log(`Starting conversion: ${INPUT_FILE} -> ${OUTPUT_FILE}`);
  console.log("Using high-quality VP9 settings (CRF 15)...");

  // FFmpeg command for high-quality VP9 conversion
  // -c:v libvpx-vp9: Use VP9 codec
  // -crf 15: Constant Rate Factor (0-63, lower is better quality, 15 is very high)
  // -b:v 0: Required when using CRF with VP9
  // -deadline good: Balance between speed and quality
  // -cpu-used 1: Better compression (slower)
  // -c:a libopus: Use Opus audio codec
  const ffmpeg = spawn(FFMPEG_PATH, [
    "-i",
    INPUT_FILE,
    "-c:v",
    "libvpx-vp9",
    "-crf",
    "15",
    "-b:v",
    "0",
    "-deadline",
    "good",
    "-cpu-used",
    "1",
    "-c:a",
    "libopus",
    "-y", // Overwrite output file
    OUTPUT_FILE,
  ]);

  ffmpeg.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  ffmpeg.stderr.on("data", (data) => {
    // FFmpeg outputs progress to stderr
    const output = data.toString();
    if (output.includes("time=")) {
      process.stdout.write(
        `\rProgress: ${output.split("time=")[1].split(" ")[0]}`,
      );
    }
  });

  ffmpeg.on("close", (code) => {
    if (code === 0) {
      console.log("\nConversion completed successfully!");
      const stats = fs.statSync(OUTPUT_FILE);
      console.log(
        `WebM file size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
      );
    } else {
      console.error(`\nFFmpeg process exited with code ${code}`);
      console.log(
        "Please ensure FFmpeg is installed and added to your system PATH.",
      );
    }
  });
}

convertToWebm();
