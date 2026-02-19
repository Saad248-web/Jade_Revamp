const fs = require("fs");
const path = "src/app/villas/[id]/page.tsx";
const content = fs.readFileSync(path, "utf8");
const lines = content.split(/\r?\n/);

let duplicateFound = false;
for (let i = 700; i < 710; i++) {
  const line = lines[i];
  if (line && line.trim() === "</section>") {
    const nextLine = lines[i + 1];
    if (nextLine && nextLine.trim() === "</section>") {
      console.log("Duplicate found at line " + i);
      lines.splice(i, 1);
      duplicateFound = true;
      fs.writeFileSync(path, lines.join("\n"));
      console.log("Fixed duplicate section tag.");
      break;
    }
  }
}

if (!duplicateFound) {
  console.log("No duplicate found.");
}
