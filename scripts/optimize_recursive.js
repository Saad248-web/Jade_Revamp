import sharp from "sharp";
import fs from "fs";
import path from "path";

const targetDir = process.argv[2];

if (!targetDir) {
  console.error("Usage: node scripts/optimize_recursive.js <path_to_folder>");
  process.exit(1);
}

const absDir = path.isAbsolute(targetDir)
  ? targetDir
  : path.resolve(process.cwd(), targetDir);

if (!fs.existsSync(absDir)) {
  console.error(`Directory not found: ${absDir}`);
  process.exit(1);
}

const extensions = /\.(jpe?g|png|heic|cr2|tiff?)$/i;

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (extensions.test(entry.name)) {
      await processImage(fullPath);
    }
  }
}

async function processImage(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const outputPath = path.join(
    path.dirname(inputPath),
    path.parse(inputPath).name + ".webp",
  );

  // Skip if webp already exists and is newer? No, let's just convert.

  try {
    console.log(`Processing: ${inputPath}...`);
    // CR2 might fail, let's see. tiff might work.
    await sharp(inputPath).webp({ quality: 80, effort: 6 }).toFile(outputPath);

    fs.unlinkSync(inputPath);
    console.log(
      `Successfully converted: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`,
    );
  } catch (err) {
    console.error(`Failed to process ${inputPath}:`, err.message);
  }
}

async function main() {
  console.log(`Starting recursive optimization in: ${absDir}`);
  await walk(absDir);
  console.log("Optimization complete.");
}

main().catch((err) => {
  console.error("Critical error:", err);
  process.exit(1);
});
