import fs from "fs";
import path from "path";
import sharp from "sharp";
import convert from "heic-convert";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const TARGET_DIRS = [
  path.join(PUBLIC_DIR, "Villa_Retreats", "Dome", "3-Experienceee"),
  path.join(PUBLIC_DIR, "Villa_Retreats", "Dome", "Perfect For"),
];

const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png", ".heic"]);

function listFiles(absDir) {
  try {
    return fs
      .readdirSync(absDir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => path.join(absDir, d.name));
  } catch {
    return [];
  }
}

async function readAsImageBuffer(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const input = await fs.promises.readFile(filePath);
  if (ext === ".heic") {
    const out = await convert({
      buffer: input,
      format: "PNG",
      quality: 1,
    });
    return Buffer.from(out);
  }
  return input;
}

async function convertOne(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTS.has(ext)) return { skipped: true };

  const outPath = filePath.replace(new RegExp(`${ext}$`, "i"), ".webp");
  if (fs.existsSync(outPath)) return { already: true, outPath };

  const inputBuffer = await readAsImageBuffer(filePath);

  // For photographic assets, 82 is a good balance for web.
  await sharp(inputBuffer)
    .rotate()
    .webp({ quality: 82 })
    .toFile(outPath);

  return { converted: true, outPath };
}

async function main() {
  const files = TARGET_DIRS.flatMap(listFiles);
  const candidates = files.filter((f) =>
    SUPPORTED_EXTS.has(path.extname(f).toLowerCase()),
  );

  const results = [];
  for (const f of candidates) {
    // eslint-disable-next-line no-await-in-loop
    results.push({ file: f, ...(await convertOne(f)) });
  }

  // Delete originals when a .webp exists.
  for (const r of results) {
    const ext = path.extname(r.file).toLowerCase();
    if (ext === ".webp") continue;
    const outPath =
      r.outPath || r.file.replace(new RegExp(`${ext}$`, "i"), ".webp");
    if (fs.existsSync(outPath)) {
      // eslint-disable-next-line no-await-in-loop
      await fs.promises.unlink(r.file);
    }
  }

  const summary = results.reduce(
    (acc, r) => {
      if (r.converted) acc.converted += 1;
      else if (r.already) acc.already += 1;
      else if (r.skipped) acc.skipped += 1;
      return acc;
    },
    { converted: 0, already: 0, skipped: 0 },
  );

  // eslint-disable-next-line no-console
  console.log(
    `Dome convert done. Converted: ${summary.converted}, already: ${summary.already}, skipped: ${summary.skipped}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

