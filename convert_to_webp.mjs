import sharp from "sharp";
import fs from "fs";
import path from "path";

const ROOT = "C:\\Users\\Admin\\Desktop\\Jade_ReVamp\\public\\X";
const QUALITY = 82;
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

let converted = 0;
let skipped = 0;
const errors = [];

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!EXTENSIONS.has(ext)) {
        skipped++;
        continue;
      }
      processFile(fullPath);
    }
  }
}

async function processFile(src) {
  const dst = src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  try {
    const srcSize = fs.statSync(src).size;
    await sharp(src).webp({ quality: QUALITY, effort: 6 }).toFile(dst);
    const dstSize = fs.statSync(dst).size;
    const reduction = ((1 - dstSize / srcSize) * 100).toFixed(1);
    const rel = path.relative(ROOT, src);
    console.log(
      `[OK] ${rel}  ${Math.round(srcSize / 1024)}KB -> ${Math.round(dstSize / 1024)}KB  (${reduction}% smaller)`,
    );
    fs.unlinkSync(src); // delete original
    converted++;
  } catch (e) {
    errors.push({ src, err: e.message });
    console.error(`[ERR] ${src}: ${e.message}`);
  }
}

// Collect all files first, then process
async function main() {
  const files = [];

  function collect(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collect(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!EXTENSIONS.has(ext)) {
          skipped++;
        } else {
          files.push(fullPath);
        }
      }
    }
  }

  collect(ROOT);
  console.log(`Found ${files.length} images to convert...\n`);

  for (const f of files) {
    await processFile(f);
  }

  console.log("\n" + "=".repeat(60));
  console.log(`  Converted : ${converted} images`);
  console.log(`  Skipped   : ${skipped} files (non-image)`);
  console.log(`  Errors    : ${errors.length}`);
  if (errors.length) {
    for (const { src, err } of errors) {
      console.log(`    - ${src}: ${err}`);
    }
  }
  console.log("=".repeat(60));
}

main().catch(console.error);
