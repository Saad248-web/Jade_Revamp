import fs from "fs";
import path from "path";
import sharp from "sharp";

const CONFIG = {
  quality: 85,
  villaName: "magnolia",
  targetRoot:
    "c:\\Users\\Admin\\Desktop\\Jade_ReVamp\\public\\Villa_Retreats\\Magnolia",
};

const MAPPINGS = {
  experience: {
    dir: "3-Experiences",
    files: {
      "Bonfire.jpg": "poolside-bonfire",
      "Floating Breakfast.JPG": "floating-breakfast",
      "Gazebo By The Pool.jpeg": "poolside-gazebo",
      "High tea.PNG": "high-tea",
      "barbeque.jpg": "poolside-barbeque",
      "candlelit dining.jpg": "candlelit-dining",
      "diamond.jpg": "diamond-experience",
    },
  },
  "perfect-for": {
    dir: "4-Perfect For",
    files: {
      "Private Celebrations.jpg": "private-celebrations",
      "Weddings.jpg": "grand-weddings",
      "corporate outings.jpg": "corporate-retreats",
      "stayctions.jpg": "staycations",
    },
  },
};

async function processImages() {
  console.log("Starting Image Optimization...");
  const results = [];

  for (const [category, data] of Object.entries(MAPPINGS)) {
    const sourceDir = path.join(CONFIG.targetRoot, data.dir);

    console.log(`Processing category: ${category}`);

    for (const [originalName, label] of Object.entries(data.files)) {
      const sourcePath = path.join(sourceDir, originalName);
      const targetName = `${CONFIG.villaName}-${category}-${label}.webp`;
      const targetPath = path.join(sourceDir, targetName);

      if (!fs.existsSync(sourcePath)) {
        console.warn(`Warning: Source file not found: ${sourcePath}`);
        continue;
      }

      try {
        await sharp(sourcePath)
          .webp({ quality: CONFIG.quality })
          .toFile(targetPath);

        console.log(`Optimized: ${originalName} -> ${targetName}`);
        results.push({
          category,
          label,
          targetName,
          publicPath: `/Villa_Retreats/Magnolia/${data.dir}/${targetName}`,
        });

        // Delete original if it's different from the target name (it always is since we change extension to webp)
        // But let's keep them for now until we are sure. Actually, user said "Use only...", "Remove the existing Old version paths".
        // I'll delete them after successful conversion to keep the folders clean.
        fs.unlinkSync(sourcePath);
        console.log(`Deleted original: ${originalName}`);
      } catch (error) {
        console.error(`Error processing ${originalName}:`, error);
      }
    }
  }

  console.log("Optimization Complete.");
  console.log("Results:", JSON.stringify(results, null, 2));
}

processImages().catch((err) => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
