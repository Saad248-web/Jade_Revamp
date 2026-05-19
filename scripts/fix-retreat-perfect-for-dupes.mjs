import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src/data/retreats");

for (const file of fs.readdirSync(root)) {
  if (!file.endsWith(".ts") || file === "index.ts") continue;
  const fp = path.join(root, file);
  let s = fs.readFileSync(fp, "utf8");
  if (!s.includes("perfectForTags: perfectForTagsFromCards([")) continue;

  const varBase = file.replace(".ts", "").replace(/-/g, "_");
  const cardsConst = `${varBase}PerfectForCards`;

  const cardsMatch = s.match(/  perfectForCards: (\[[\s\S]*?\]),\r?\n  perfectForTags: perfectForTagsFromCards\(\[/);
  if (!cardsMatch) {
    console.log("skip pattern", file);
    continue;
  }

  const cardsArray = cardsMatch[1];

  s = s.replace(
    /  perfectForCards: \[[\s\S]*?\],\r?\n  perfectForTags: perfectForTagsFromCards\(\[[\s\S]*?\]\),/,
    `  perfectForCards: ${cardsConst},\n  perfectForTags: perfectForTagsFromCards(${cardsConst}),`,
  );

  if (!s.includes(`const ${cardsConst}`)) {
    s = s.replace(
      /import[^\n]+\n\n/,
      (m) => `${m}const ${cardsConst} = ${cardsArray};\n\n`,
    );
  }

  fs.writeFileSync(fp, s);
  console.log("fixed", file);
}
