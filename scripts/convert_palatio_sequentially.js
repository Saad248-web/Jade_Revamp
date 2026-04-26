const fs = require("fs");
const path = require("path");

const LOG_FILE = "palatio_sequential_optimization.log";

if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  fs.appendFileSync(LOG_FILE, line + "\n");
  process.stdout.write(line + "\n");
}

async function main() {
  log("=== Palatio Villa — Sequential Image Optimization ===");

  let sharp, heicConvert;

  try {
    sharp = require("sharp");
    sharp.concurrency(1);
    sharp.cache(false);
    log("sharp loaded OK (concurrency=1, cache=false)");
  } catch (e) {
    log("ERROR: sharp not available — " + e.message);
    process.exit(1);
  }

  try {
    heicConvert = require("heic-convert");
    log("heic-convert loaded OK");
  } catch (e) {
    log("WARN: heic-convert not available");
    heicConvert = null;
  }

  const ROOT = "public/Villa_Retreats/Palatio";
  const FOLDERS = ["3-Experiences", "4-Perfect For"];

  const filesToProcess = [];

  for (const folder of FOLDERS) {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) {
      log(`WARN: Directory not found: ${dir}`);
      continue;
    }
    const entries = fs.readdirSync(dir);
    for (const filename of entries) {
      const ext = path.extname(filename).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".heic"].includes(ext)) {
        filesToProcess.push(path.join(dir, filename));
      }
    }
  }

  log(`Found ${filesToProcess.length} files to process.`);

  for (const srcPath of filesToProcess) {
    const filename = path.basename(srcPath);
    const dir = path.dirname(srcPath);
    const ext = path.extname(filename).toLowerCase();

    // Specifically handle the bbbq.jpg.webp case if it exists
    const stem = filename.endsWith(".jpg.webp")
      ? filename.replace(".jpg.webp", "")
      : path.basename(filename, ext);

    const dstName = stem + ".webp";
    const dstPath = path.join(dir, dstName);

    log(`\n>>> Processing: ${filename}  →  ${dstName}`);

    try {
      let inputBuffer;
      if (ext === ".heic" && heicConvert) {
        log(`  Converting HEIC to JPEG buffer...`);
        const heicBuffer = fs.readFileSync(srcPath);
        const jpegBuffer = await heicConvert({
          buffer: heicBuffer,
          format: "JPEG",
          quality: 0.9,
        });
        inputBuffer = Buffer.from(jpegBuffer);
      } else {
        log(`  Reading ${ext} file...`);
        inputBuffer = fs.readFileSync(srcPath);
      }

      log(`  Converting to WebP with Sharp (resize to 2000px max)...`);
      await sharp(inputBuffer)
        .resize(2000, null, { withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toFile(dstPath);

      log(`  ✓ Successfully created: ${dstName}`);

      // Verify the new file exists and has size
      const stats = fs.statSync(dstPath);
      if (stats.size > 0) {
        if (srcPath !== dstPath) {
          fs.unlinkSync(srcPath);
          log(`  ✓ Deleted original: ${filename}`);
        }
      } else {
        log(`  ! ERROR: Created file is empty. Keeping original.`);
      }
    } catch (err) {
      log(`  ✗ ERROR on ${filename}: ${err.message}`);
    }
  }

  log("\n=== Sequential Optimization Complete ===");
}

main().catch((err) => {
  log("FATAL: " + err.stack);
  process.exit(1);
});
