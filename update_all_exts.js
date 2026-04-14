const fs = require("fs");
const path = require("path");

const RETREATS_DIR = path.join(__dirname, "src", "data", "retreats");

fs.readdir(RETREATS_DIR, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    if (file.endsWith(".ts")) {
      const fullPath = path.join(RETREATS_DIR, file);
      let content = fs.readFileSync(fullPath, "utf8");

      const newContent = content.replace(
        /\.(jpg|jpeg|JPG|HEIC|heic|png|PNG)/g,
        ".webp",
      );

      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated extensions in: ${file}`);
      }
    }
  }
  console.log("Finished updating data files.");
});
