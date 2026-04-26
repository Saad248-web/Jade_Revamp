const fs = require("fs");
const path = require("path");

const logFile =
  "c:\\Users\\Admin\\Desktop\\Jade_ReVamp\\optimization_debug.log";
function log(msg) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
  console.log(msg);
}

log("Script started");

try {
  log("Attempting to require sharp");
  const sharp = require("sharp");
  log("sharp required successfully");

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
        "stayctions.jpg": "stayctions",
      },
    },
  };

  async function run() {
    for (const [category, data] of Object.entries(MAPPINGS)) {
      const sourceDir = path.join(CONFIG.targetRoot, data.dir);
      log(`Processing category: ${category}`);

      for (const [originalName, label] of Object.entries(data.files)) {
        const sourcePath = path.join(sourceDir, originalName);
        const targetName = `${CONFIG.villaName}-${category}-${label}.webp`;
        const targetPath = path.join(sourceDir, targetName);

        if (!fs.existsSync(sourcePath)) {
          log(`Warning: Source file not found: ${sourcePath}`);
          continue;
        }

        try {
          log(`Processing: ${originalName} -> ${targetName}`);
          await sharp(sourcePath)
            .webp({ quality: CONFIG.quality })
            .toFile(targetPath);
          log(`Success: ${targetName} created`);

          fs.unlinkSync(sourcePath);
          log(`Original deleted: ${originalName}`);
        } catch (err) {
          log(`Error processing ${originalName}: ${err.message}`);
        }
      }
    }
    log("Script finished successfully");
  }

  run().catch((err) => {
    log(`Fatal Error in run(): ${err.stack}`);
  });
} catch (err) {
  log(`Fatal Error requiring sharp: ${err.stack}`);
}
