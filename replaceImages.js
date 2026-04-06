const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "src", "data", "retreats");
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".ts"));

files.forEach((f) => {
  const filePath = path.join(dataDir, f);
  let content = fs.readFileSync(filePath, "utf-8");

  // Replace the image paths but keep the quotes: ""
  // e.g. "/X/Wonderland/HERO.webp" -> ""
  content = content.replace(/"\/X\/[^"]+"/g, '""');

  fs.writeFileSync(filePath, content);
  console.log("Updated", f);
});
