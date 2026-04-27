import sharp from "sharp";
import fs from "fs";
import path from "path";

const targetDir = process.argv[2];

if (!targetDir) {
  console.error(
    "Usage: node scripts/optimize_villa_folder.js <path_to_folder>",
  );
  process.exit(1);
}

const absDir = path.isAbsolute(targetDir)
  ? targetDir
  : path.resolve(process.cwd(), targetDir);

if (!fs.existsSync(absDir)) {
  console.error(`Directory not found: ${absDir}`);
  process.exit(1);
}

async function optimize() {
  const files = fs.readdirSync(absDir).filter((f) => /\.(jpe?g|png)$/i.test(f));

  if (files.length === 0) {
    console.log("No images to convert in " + absDir);
    return;
  }

  console.log(`Found ${files.length} images to optimize in ${absDir}`);

  for (const file of files) {
    const inputPath = path.join(absDir, file);
    const outputPath = path.join(absDir, path.parse(file).name + ".webp");

    try {
      console.log(`Processing: ${file}...`);
      await sharp(inputPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);

      fs.unlinkSync(inputPath);
      console.log(`Done: ${file} -> ${path.basename(outputPath)}`);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }

  console.log("Optimization complete.");
}

optimize();
