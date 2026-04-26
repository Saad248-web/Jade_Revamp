const fs = require("fs");
const path = require("path");

const LOG_FILE = "palatio_optimization.log";

if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  fs.appendFileSync(LOG_FILE, line + "\n");
  process.stdout.write(line + "\n");
}

async function main() {
  log("=== Palatio Villa — Image Optimization (Streaming) ===");

  let sharp;
  try {
    sharp = require("sharp");
    sharp.cache(false);
    log("sharp loaded OK");
  } catch (e) {
    log("ERROR: sharp not available — " + e.message);
    process.exit(1);
  }

  const ROOT = "public/Villa_Retreats/Palatio";
  const FOLDERS = ["3-Experiences", "4-Perfect For"];

  for (const folder of FOLDERS) {
    const dir = path.join(ROOT, folder);
    log(`\n--- Folder: ${folder} ---`);

    if (!fs.existsSync(dir)) continue;

    const entries = fs.readdirSync(dir);

    for (let filename of entries) {
      const srcPath = path.join(dir, filename);
      const ext = path.extname(filename).toLowerCase();

      if (ext === ".webp") continue;
      if (
        ext !== ".jpg" &&
        ext !== ".jpeg" &&
        ext !== ".png" &&
        ext !== ".heic"
      )
        continue;

      const stem = filename.replace(/\.(jpg|jpeg|png|heic|webp)$/i, "");
      const dstName = stem + ".webp";
      const dstPath = path.join(dir, dstName);

      log(`Converting: ${filename}  →  ${dstName}`);

      try {
        // Use path directly for streaming (memory efficient)
        await sharp(srcPath)
          .resize(2000, null, { withoutEnlargement: true })
          .webp({ quality: 80, effort: 3 })
          .toFile(dstPath);

        log(`  ✓ Created: ${dstName}`);

        if (filename !== dstName && fs.existsSync(dstPath)) {
          fs.unlinkSync(srcPath);
          log(`  ✓ Deleted original: ${filename}`);
        }
      } catch (err) {
        log(`  ✗ ERROR on ${filename}: ${err.message}`);
      }
    }
  }

  log("\n=== Done ===");
}

main().catch((err) => {
  log("FATAL: " + err.stack);
  process.exit(1);
});
