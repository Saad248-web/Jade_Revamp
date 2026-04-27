import fs from "fs";
import path from "path";
import sharp from "sharp";

async function extractAndConvert(cr2Path) {
  const webpPath = cr2Path.replace(/\.cr2$/i, ".webp");
  console.log(`Attempting to extract JPEG from: ${cr2Path}`);

  const buffer = fs.readFileSync(cr2Path);

  // Search for JPEG SOI (FF D8)
  // CR2 usually has multiple JPEGs. We want the largest one.
  let lastSoi = -1;
  let foundImages = [];

  for (let i = 0; i < buffer.length - 1; i++) {
    if (buffer[i] === 0xff && buffer[i + 1] === 0xd8) {
      // Found a potential JPEG start
      // Now search for the next EOI (FF D9)
      for (let j = i + 2; j < buffer.length - 1; j++) {
        if (buffer[j] === 0xff && buffer[j + 1] === 0xd9) {
          const length = j + 2 - i;
          if (length > 10000) {
            // Ignore tiny thumbnails
            foundImages.push({ offset: i, length });
          }
          i = j; // Skip to end of this JPEG
          break;
        }
      }
    }
  }

  if (foundImages.length === 0) {
    throw new Error("No JPEG preview found in CR2");
  }

  // Sort by length descending
  foundImages.sort((a, b) => b.length - a.length);

  let success = false;
  for (const img of foundImages) {
    try {
      console.log(`Trying JPEG of size ${img.length} at offset ${img.offset}`);
      const jpegBuffer = buffer.slice(img.offset, img.offset + img.length);
      await sharp(jpegBuffer).webp({ quality: 80, effort: 6 }).toFile(webpPath);
      console.log(`Successfully converted using JPEG at offset ${img.offset}`);
      success = true;
      break;
    } catch (err) {
      console.warn(`Failed image at offset ${img.offset}: ${err.message}`);
    }
  }

  if (!success) {
    throw new Error(
      "None of the embedded JPEGs could be processed (likely all are high-precision raw previews)",
    );
  }
}

const file = process.argv.slice(2).join(" ").replace(/"/g, "").trim();
if (file) {
  extractAndConvert(file).catch((err) => console.error(err));
}
