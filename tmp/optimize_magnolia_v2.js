const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

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
  console.log("Starting Magnolia image optimization (v2)...");
  const results = [];

  for (const [category, dirPath] of Object.entries(SOURCE_DIRS)) {
    const categoryMapping = MAPPING[category];
    const targetDirName =
      category === "experience" ? "3-Experiences" : "4-Perfect For";
    const targetDirPath = path.join(TARGET_ROOT, targetDirName);

    if (!fs.existsSync(targetDirPath)) {
      console.log(`Creating target directory: ${targetDirPath}`);
      fs.mkdirSync(targetDirPath, { recursive: true });
    }

    // Read all files in source directory to ensure we "use all Images"
    const files = fs.readdirSync(dirPath);
    console.log(`Processing ${files.length} images in ${category}...`);

    for (const originalName of files) {
      const sourcePath = path.join(dirPath, originalName);
      if (!fs.statSync(sourcePath).isFile()) continue;

      let label = categoryMapping[originalName];
      if (!label) {
        // Fallback for unexpected files
        const base = path
          .parse(originalName)
          .name.toLowerCase()
          .replace(/[^a-z0-9]/g, "-");
        label = base;
        console.log(`Auto-labeled: ${originalName} -> ${label}`);
      }

      const targetName = `${OPTIMIZATION_CONFIG.villaName}-${category}-${label}.webp`;
      const targetPath = path.join(targetDirPath, targetName);

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
  console.log(JSON.stringify(results, null, 2));

  // Write result to temporary file for reporting
  const resultsPath =
    "c:\\Users\\Admin\\Desktop\\Jade_ReVamp\\tmp\\optimization_results.json";
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${resultsPath}`);
}

optimizeImages().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
