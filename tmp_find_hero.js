const fs = require("fs");
const path = require("path");

const baseDir = path.join(
  "c:",
  "Users",
  "Admin",
  "Desktop",
  "Jade_ReVamp",
  "public",
  "Villa_Retreats",
);

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.toLowerCase().includes("hero") && file.endsWith(".webp")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(baseDir);
const publicPaths = files.map((f) =>
  f.slice(baseDir.length - 15).replace(/\\/g, "/"),
);
console.log(JSON.stringify(publicPaths, null, 2));
