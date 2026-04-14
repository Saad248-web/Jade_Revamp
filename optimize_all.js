const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const heicConvert = require("heic-convert");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const rename = promisify(fs.rename);
const unlink = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

const ROOT_DIR = path.join(__dirname, "public", "Villa_Retreats");

async function processImage(filePath) {
  if (filePath.endsWith(".tmp.webp")) return;

  const ext = path.extname(filePath).toLowerCase();
  const validExts = [".jpg", ".jpeg", ".png", ".heic", ".webp"];

  if (!validExts.includes(ext)) return;

  const isWebp = ext === ".webp";
  const targetPath = isWebp
    ? filePath
    : filePath.substring(0, filePath.length - ext.length) + ".webp";
  const tmpPath = targetPath + ".tmp.webp";

  try {
    const inputBuffer = await readFile(filePath);
    let sharpInput = inputBuffer;

    if (ext === ".heic") {
      sharpInput = await heicConvert({
        buffer: inputBuffer,
        format: "JPEG",
        quality: 1,
      });
    }

    const metadata = await sharp(sharpInput).metadata();

    await sharp(sharpInput)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 60, effort: 6 })
      .toFile(tmpPath);

    const oldStat = await stat(filePath);
    const newStat = await stat(tmpPath);

    if (!isWebp) {
      await rename(tmpPath, targetPath);
      await unlink(filePath);
      console.log(
        `Converted: ${path.basename(filePath)} -> ${path.basename(targetPath)}`,
      );
    } else {
      if (newStat.size < oldStat.size || metadata.width > 1920) {
        await unlink(filePath);
        await rename(tmpPath, targetPath);
        console.log(
          `Compressed: ${path.basename(filePath)} (${(oldStat.size / 1024 / 1024).toFixed(2)}MB -> ${(newStat.size / 1024 / 1024).toFixed(2)}MB)`,
        );
      } else {
        await unlink(tmpPath);
      }
    }
  } catch (err) {
    console.error(`Failed to process ${filePath}:`, err.message);
    if (fs.existsSync(tmpPath)) await unlink(tmpPath).catch(() => {});
  }
}

async function walk(dir) {
  const files = await readdir(dir);
  for (const file of files) {
    if (file.endsWith(".tmp.webp")) continue;

    const fullPath = path.join(dir, file);
    try {
      const fileStat = await stat(fullPath);
      if (fileStat.isDirectory()) {
        await walk(fullPath);
      } else {
        await processImage(fullPath);
      }
    } catch (err) {}
  }
}

async function run() {
  console.log("Starting universal image optimization...");
  if (fs.existsSync(ROOT_DIR)) {
    await walk(ROOT_DIR);
  }
  console.log("Image optimization completed.");
}

run();
