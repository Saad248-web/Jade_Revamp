const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const rename = promisify(fs.rename);
const unlink = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

function getDirs() {
  const dirs = [];

  const villaRoot = path.join(__dirname, "public", "Villa_Retreats");
  if (fs.existsSync(villaRoot)) {
    for (const name of fs.readdirSync(villaRoot)) {
      const full = path.join(villaRoot, name);
      try {
        if (fs.statSync(full).isDirectory()) dirs.push(full);
      } catch {
        // ignore
      }
    }
  }

  const experiences = path.join(__dirname, "public", "Experiences");
  if (fs.existsSync(experiences)) dirs.push(experiences);

  const awards = path.join(__dirname, "public", "Awards_and_Recognition");
  if (fs.existsSync(awards)) dirs.push(awards);

  return dirs;
}

async function compressWebp(filePath) {
  if (!filePath.endsWith(".webp") || filePath.endsWith(".tmp.webp")) return;

  const tmpPath = filePath + ".tmp.webp";

  try {
    const inputBuffer = await readFile(filePath);
    const metadata = await sharp(inputBuffer).metadata();

    // Resize and compress
    await sharp(inputBuffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 60, effort: 6 })
      .toFile(tmpPath);

    const oldStat = await stat(filePath);
    const newStat = await stat(tmpPath);

    if (newStat.size < oldStat.size || metadata.width > 1920) {
      await unlink(filePath);
      await rename(tmpPath, filePath);
      console.log(
        `Compressed: ${path.basename(filePath)} (${(oldStat.size / 1024 / 1024).toFixed(2)}MB -> ${(newStat.size / 1024 / 1024).toFixed(2)}MB)`,
      );
    } else {
      await unlink(tmpPath);
      console.log(`Skipped: ${path.basename(filePath)} (Already optimal)`);
    }
  } catch (err) {
    console.error(`Failed to compress ${filePath}:`, err);
  }
}

async function walkAndCompress(dir) {
  const files = await readdir(dir);
  for (const file of files) {
    if (file.endsWith(".tmp.webp")) continue; // Skip tmp files before stat

    const fullPath = path.join(dir, file);
    try {
      const fileStat = await stat(fullPath);
      if (fileStat.isDirectory()) {
        await walkAndCompress(fullPath);
      } else {
        await compressWebp(fullPath);
      }
    } catch (err) {
      // file might have been deleted, ignore
    }
  }
}

async function run() {
  console.log("Starting to compress images...");
  const args = process.argv.slice(2);
  const dirs = args.length > 0 ? args : getDirs();

  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      console.log(`Scanning directory: ${dir}`);
      await walkAndCompress(dir);
    }
  }
  console.log("Compression completed.");
}

run();
