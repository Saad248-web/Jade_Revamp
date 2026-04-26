import fs from "fs";
import path from "path";
import sharp from "sharp";

const OPTIMIZATION_CONFIG = {
  quality: 85,
  stripMetadata: true,
  villaName: "magnolia",
};

const SOURCE_DIRS = {
  experience:
    "c:\\Users\\Admin\\Desktop\\Jade_ReVamp\\public\\Villa_Retreats\\Magnolia\\3-Experiences",
  "perfect-for":
    "c:\\Users\\Admin\\Desktop\\Jade_ReVamp\\public\\Villa_Retreats\\Magnolia\\4-Perfect For",
};

const MAPPING = {
  experience: {
    "Bonfire.jpg": "poolside-bonfire",
    "Floating Breakfast.JPG": "floating-breakfast",
    "Gazebo By The Pool.jpeg": "poolside-gazebo",
    "High tea.PNG": "high-tea",
    "barbeque.jpg": "poolside-barbeque",
    "candlelit dining.jpg": "candlelit-dining",
    "diamond.jpg": "exclusive-diamond-stay",
  },
  "perfect-for": {
    "Private Celebrations.jpg": "private-celebrations",
    "Weddings.jpg": "grand-weddings",
    "corporate outings.jpg": "corporate-retreats",
    "stayctions.jpg": "staycations",
  },
};

const TARGET_ROOT =
  "c:\\Users\\Admin\\Desktop\\Jade_ReVamp\\public\\Villa_Retreats\\Magnolia";

async function optimizeImages() {
  console.log("Starting Magnolia image optimization...");
  const results = [];

  for (const [category, dirPath] of Object.entries(SOURCE_DIRS)) {
    const categoryMapping = MAPPING[category];
    const targetDirName =
      category === "experience" ? "3-Experiences" : "4-Perfect For";
    const targetDirPath = path.join(TARGET_ROOT, targetDirName);

    if (!fs.existsSync(targetDirPath)) {
      fs.mkdirSync(targetDirPath, { recursive: true });
    }

    for (const [originalName, label] of Object.entries(categoryMapping)) {
      const sourcePath = path.join(dirPath, originalName);
      const targetName = `${OPTIMIZATION_CONFIG.villaName}-${category}-${label}.webp`;
      const targetPath = path.join(targetDirPath, targetName);

      if (!fs.existsSync(sourcePath)) {
        console.warn(`Source file not found: ${sourcePath}`);
        continue;
      }

      try {
        await sharp(sourcePath)
          .webp({ quality: OPTIMIZATION_CONFIG.quality })
          .toFile(targetPath);

        console.log(`Optimized: ${originalName} -> ${targetName}`);
        results.push({
          file_name: targetName,
          category: category,
          label: label,
          path: `/Villa_Retreats/Magnolia/${targetDirName}/${targetName}`,
        });
      } catch (error) {
        console.error(`Error optimizing ${originalName}:`, error);
      }
    }
  }

  console.log("\nOptimization Results:");
  console.table(results);

  // Write result to temporary file for reporting
  fs.writeFileSync(
    "C:\\Users\\Admin\\Desktop\\Jade_ReVamp\\tmp\\optimization_results.json",
    JSON.stringify(results, null, 2),
  );
}

optimizeImages();
