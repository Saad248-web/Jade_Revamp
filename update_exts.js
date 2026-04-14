const fs = require("fs");
const path = require("path");

const files = [
  path.join(__dirname, "src", "data", "retreats", "palatio.ts"),
  path.join(__dirname, "src", "data", "retreats", "royalty.ts"),
];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  // Simple regex to replace image extensions that are in the folder paths
  content = content.replace(/\.(jpg|jpeg|JPG|HEIC|heic)/g, ".webp");
  fs.writeFileSync(file, content);
  console.log(`Updated paths in ${path.basename(file)}`);
}
