import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src/data/retreats");
const files = fs
  .readdirSync(root)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts");

const importLine =
  'import { amenityHighlightsFrom, perfectForTagsFromCards, splitLegacyPerfectFor } from "@/lib/villaDetailData";\n\n';

for (const file of files) {
  const fp = path.join(root, file);
  let s = fs.readFileSync(fp, "utf8");
  if (!s.includes("perfectFor:")) continue;

  const exportMatch = s.match(/export const (\w+) = \{/);
  if (!exportMatch) continue;
  const varName = exportMatch[1];

  const pfRe = /  perfectFor: (\[[\s\S]*?\]),\r?\n/;
  const m = s.match(pfRe);
  if (!m) {
    console.log("no pf", file);
    continue;
  }
  const pfBlock = m[1];
  const isObject = pfBlock.includes("title:");
  const pfConstName = `${varName}PerfectForLegacy`;

  if (isObject) {
    s = s.replace(
      pfRe,
      `  perfectForCards: ${pfBlock},\n  perfectForTags: perfectForTagsFromCards(${pfBlock}),\n`,
    );
  } else {
    s = s.replace(pfRe, "");
    s = s.replace(
      /export const \w+ = \{/,
      `const ${pfConstName} = ${pfBlock};\n\nconst ${varName}Base = {`,
    );
  }

  if (!isObject) {
    s = s.replace(/export const \w+ = \{/, `const ${varName}Base = {`);
  } else {
    s = s.replace(/export const \w+ = \{/, `const ${varName}Base = {`);
  }

  const tail = isObject
    ? `export const ${varName} = {
  ...${varName}Base,
  amenityHighlights: amenityHighlightsFrom(${varName}Base.amenities),
};
`
    : `const ${varName}PerfectFor = splitLegacyPerfectFor(
  ${pfConstName},
  (${varName}Base.images?.length ? ${varName}Base.images : [${varName}Base.image].filter(Boolean)) as string[],
);

export const ${varName} = {
  ...${varName}Base,
  amenityHighlights: amenityHighlightsFrom(${varName}Base.amenities),
  perfectForTags: ${varName}PerfectFor.perfectForTags,
  perfectForCards: ${varName}PerfectFor.perfectForCards,
};
`;

  s = s.replace(/};\s*$/, `};\n\n${tail}`);

  if (file === "diamond.ts") {
    s = s.replace(/\s*perfectForEvents:[^\n]+\n/, "\n");
  }

  if (!s.startsWith("import")) {
    s = importLine + s;
  }

  fs.writeFileSync(fp, s);
  console.log("ok", file, isObject ? "object" : "strings");
}
