import sharp from "sharp";
import fs from "fs";
import path from "path";

const dirs = [
  "public/Villa_Retreats/Magnolia/3-Experiences",
  "public/Villa_Retreats/Magnolia/4-Perfect For",
];

async function convertImages() {
  console.log("Starting high-quality WEBP conversion...");
  for (const dir of dirs) {
    const absoluteDir = path.resolve(dir);
    if (!fs.existsSync(absoluteDir)) {
      console.log(`Directory not found: ${absoluteDir}`);
      continue;
    }

    const files = fs.readdirSync(absoluteDir);
    for (const file of files) {
      if (
        file.toLowerCase().endsWith(".jpg") ||
        file.toLowerCase().endsWith(".jpeg") ||
        file.toLowerCase().endsWith(".png")
      ) {
        const inputPath = path.join(absoluteDir, file);
        const outputName = path.parse(file).name + ".webp";
        const outputPath = path.join(absoluteDir, outputName);

        try {
          // Optimization settings:
          // quality: 85 (high quality, perceptually lossless)
          // effort: 6 (maximum compression effort)
          // smartSubsample: true (better for high-quality)
          await sharp(inputPath)
            .webp({
              quality: 85,
              effort: 6,
              smartSubsample: true,
            })
            .toFile(outputPath);
          console.log(`Converted & Optimized: ${file} -> ${outputName}`);
        } catch (err) {
          console.error(`Error converting ${file}:`, err);
        }
      }
    }
  }
  console.log("Conversion complete.");
}

convertImages();
