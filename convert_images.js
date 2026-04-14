const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const heicConvert = require("heic-convert");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const DIRS = [
  path.join(__dirname, "public", "Villa_Retreats", "Palatio"),
  path.join(__dirname, "public", "Villa_Retreats", "Royalty"),
];

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".heic", ".JPG"].includes(ext)) {
    const webpPath =
      filePath.substring(0, filePath.length - ext.length) + ".webp";

    // Skip if already webp
    if (ext === ".webp") return;

    try {
      let inputBuffer = await readFile(filePath);
      let sharpInput = inputBuffer;

      // Handle HEIC
      if (ext === ".heic") {
        console.log(`Converting HEIC to JPEG buffer first: ${filePath}`);
        sharpInput = await heicConvert({
          buffer: inputBuffer,
          format: "JPEG",
          quality: 1,
        });
      }

      await sharp(sharpInput).webp({ quality: 80 }).toFile(webpPath);

      console.log(`Converted to WEBP: ${webpPath}`);
      await unlink(filePath);
      console.log(`Deleted original: ${filePath}`);
    } catch (err) {
      console.error(`Failed to convert ${filePath}:`, err);
    }
  }
}

async function walkAndConvert(dir) {
  const files = await readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const fileStat = await stat(fullPath);
    if (fileStat.isDirectory()) {
      await walkAndConvert(fullPath);
    } else {
      await convertFile(fullPath);
    }
  }
}

async function run() {
  for (const dir of DIRS) {
    if (fs.existsSync(dir)) {
      console.log(`Scanning directory: ${dir}`);
      await walkAndConvert(dir);
    } else {
      console.log(`Directory not found: ${dir}`);
    }
  }
  console.log("Conversion completed.");
}

run();
