import ffmpeg from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
console.log("FFMPEG_PATH:", ffmpeg.path);
const ffprobePath = ffmpeg.path
  .replace("ffmpeg.exe", "ffprobe.exe")
  .replace("ffmpeg", "ffprobe");
console.log("FFPROBE_PATH:", ffprobePath);
console.log("FFPROBE exists:", fs.existsSync(ffprobePath));
