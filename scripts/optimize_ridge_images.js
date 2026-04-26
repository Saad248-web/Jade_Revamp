/**
 * optimize_ridge_images.js
 * Converts Retreat on the Ridge experience & perfect-for images to WebP.
 * - HEIC  → heic-convert  → sharp → webp
 * - CR2   → sharp (libvips can decode some RAW formats)
 * - PNG/JPG → sharp → webp
 * Original files are deleted after successful conversion.
 * Filename stems are preserved exactly (as per user requirement).
 */

const fs = require("fs");
const path = require("path");

const LOG_FILE =
  "C:\\Users\\Admin\\Desktop\\Jade_ReVamp\\ridge_optimization.log";

// Clear previous log
if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  fs.appendFileSync(LOG_FILE, line + "\n");
  process.stdout.write(line + "\n");
}

async function main() {
  log("=== Retreat on the Ridge — Image Optimization ===");

  let sharp, heicConvert;

  try {
    sharp = require("sharp");
    log("sharp loaded OK");
  } catch (e) {
    log("ERROR: sharp not available — " + e.message);
    process.exit(1);
  }

  try {
    heicConvert = require("heic-convert");
    log("heic-convert loaded OK");
  } catch (e) {
    log(
      "WARN: heic-convert not available — HEIC files will be tried via sharp only",
    );
    heicConvert = null;
  }

  const ROOT =
    "C:\\Users\\Admin\\Desktop\\Jade_ReVamp\\public\\Villa_Retreats\\Retreat on the ridge";

  const FOLDERS = ["3-Experiences_", "4-Perfect for"];

  for (const folder of FOLDERS) {
    const dir = path.join(ROOT, folder);
    log(`\n--- Folder: ${folder} ---`);

    let entries;
    try {
      entries = fs.readdirSync(dir);
    } catch (e) {
      log(`ERROR reading dir: ${e.message}`);
      continue;
    }

    for (const filename of entries) {
      const ext = path.extname(filename).toLowerCase();
      if (ext === ".webp") {
        log(`SKIP (already WebP): ${filename}`);
        continue;
      }

      const srcPath = path.join(dir, filename);
      const stem = path.basename(filename, path.extname(filename));
      const dstName = stem + ".webp";
      const dstPath = path.join(dir, dstName);

      log(`Converting: ${filename}  →  ${dstName}`);

      try {
        if ((ext === ".heic" || ext === ".heif") && heicConvert) {
          // HEIC → JPEG buffer → sharp → webp
          const inputBuffer = fs.readFileSync(srcPath);
          const jpegBuffer = await heicConvert({
            buffer: inputBuffer,
            format: "JPEG",
            quality: 0.95,
          });
          await sharp(Buffer.from(jpegBuffer))
            .webp({ quality: 85, effort: 6 })
            .toFile(dstPath);
        } else if (ext === ".cr2" || ext === ".cr3") {
          // Canon RAW — sharp/libvips cannot decode CR2 directly.
          // CR2 files embed a full-resolution JPEG internally.
          // Extract it by finding the first SOI (0xFFD8) and last EOI (0xFFD9).
          const rawBuf = fs.readFileSync(srcPath);
          let soi = -1;
          for (let i = 0; i < rawBuf.length - 1; i++) {
            if (rawBuf[i] === 0xff && rawBuf[i + 1] === 0xd8) {
              soi = i;
              break; // first SOI = start of embedded full-res JPEG in CR2
            }
          }
          let eoi = -1;
          for (let i = rawBuf.length - 2; i >= 0; i--) {
            if (rawBuf[i] === 0xff && rawBuf[i + 1] === 0xd9) {
              eoi = i + 2;
              break;
            }
          }
          if (soi < 0 || eoi < 0)
            throw new Error("No embedded JPEG found in CR2");
          const jpegBuf = rawBuf.slice(soi, eoi);
          await sharp(jpegBuf).webp({ quality: 85, effort: 6 }).toFile(dstPath);
        } else {
          // PNG, JPG, etc. — sharp handles natively
          await sharp(srcPath).webp({ quality: 85, effort: 6 }).toFile(dstPath);
        }

        log(`  ✓ Created: ${dstName}`);

        // Delete original
        fs.unlinkSync(srcPath);
        log(`  ✓ Deleted: ${filename}`);
      } catch (err) {
        log(`  ✗ ERROR on ${filename}: ${err.message}`);
      }
    }
  }

  log("\n=== Done ===");
}

main().catch((err) => {
  process.stdout.write("FATAL: " + err.stack + "\n");
  fs.appendFileSync(LOG_FILE, "FATAL: " + err.stack + "\n");
  process.exit(1);
});
