const fs = require("fs");
const path = require("path");

const LOG_FILE =
  "C:\\Users\\Admin\\Desktop\\Jade_ReVamp\\wonderland_optimization.log";

if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  fs.appendFileSync(LOG_FILE, line + "\n");
  process.stdout.write(line + "\n");
}

async function main() {
  log("=== Wonderland Villa — Image Optimization ===");

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
    log("WARN: heic-convert not available");
    heicConvert = null;
  }

  const ROOT =
    "C:\\Users\\Admin\\Desktop\\Jade_ReVamp\\public\\Villa_Retreats\\Wonderland";

  const FOLDERS = ["Experiences", "Perfect For"];

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
          const rawBuf = fs.readFileSync(srcPath);
          let soi = -1;
          for (let i = 0; i < rawBuf.length - 1; i++) {
            if (rawBuf[i] === 0xff && rawBuf[i + 1] === 0xd8) {
              soi = i;
              break;
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
            throw new Error("No embedded JPEG found in RAW/CR2");
          await sharp(rawBuf.slice(soi, eoi))
            .webp({ quality: 85, effort: 6 })
            .toFile(dstPath);
        } else {
          await sharp(srcPath).webp({ quality: 85, effort: 6 }).toFile(dstPath);
        }

        log(`  ✓ Created: ${dstName}`);
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
