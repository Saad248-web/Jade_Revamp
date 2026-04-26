import sharp from "sharp";
import fs from "fs";
import path from "path";

const dirs = [
  "public/Villa_Retreats/Magnolia/3-Experiences",
  "public/Villa_Retreats/Magnolia/4-Perfect For",
];

async function convertImages() {
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
          await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
          console.log(`Converted: ${file} -> ${outputName}`);
        } catch (err) {
          console.error(`Error converting ${file}:`, err);
        }
      }
    }
  }
}

convertImages();
