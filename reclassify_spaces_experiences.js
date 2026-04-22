const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "public", "Villa_Retreats");

const EXPERIENCE_KEYWORDS = [
  "movie",
  "bonfire",
  "bornfire",
  "barbeque",
  "barbecue",
  "bbq",
  "picnic",
  "floating",
  "candle",
  "dj",
  "cocktail",
  "haldi",
  "mehendi",
  "sangeet",
];

function isExperienceLike(filename) {
  const s = filename.toLowerCase();
  return EXPERIENCE_KEYWORDS.some((k) => s.includes(k));
}

function safeMkdir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function listDirs(p) {
  if (!fs.existsSync(p)) return [];
  return fs
    .readdirSync(p)
    .map((name) => path.join(p, name))
    .filter((full) => {
      try {
        return fs.statSync(full).isDirectory();
      } catch {
        return false;
      }
    });
}

function listFiles(p) {
  if (!fs.existsSync(p)) return [];
  const out = [];
  for (const entry of fs.readdirSync(p)) {
    const full = path.join(p, entry);
    let st;
    try {
      st = fs.statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

function relFromPublic(absPath) {
  const publicRoot = path.join(__dirname, "public");
  return "/" + path.relative(publicRoot, absPath).replace(/\\/g, "/");
}

function moveFile(from, toDir) {
  safeMkdir(toDir);
  const to = path.join(toDir, path.basename(from));
  fs.renameSync(from, to);
  return to;
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error("Missing public/Villa_Retreats");
    process.exit(1);
  }

  const report = [];

  for (const retreatDir of listDirs(ROOT)) {
    const spacesDir = path.join(retreatDir, "Spaces");
    if (!fs.existsSync(spacesDir)) continue;

    const candidates = listFiles(spacesDir).filter((f) =>
      f.toLowerCase().endsWith(".webp"),
    );
    const toMove = candidates.filter((f) => isExperienceLike(path.basename(f)));
    if (toMove.length === 0) continue;

    const expDir = path.join(retreatDir, "Experiences");
    for (const from of toMove) {
      const before = relFromPublic(from);
      const to = moveFile(from, expDir);
      const after = relFromPublic(to);
      report.push({ retreat: path.basename(retreatDir), before, after });
    }
  }

  // Write report
  const lines = [];
  lines.push(`# Spaces → Experiences Move Report`);
  lines.push(``);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(``);
  if (report.length === 0) {
    lines.push(`No files matched the experience keyword rules.`);
  } else {
    for (const row of report) {
      lines.push(`- **${row.retreat}**: \`${row.before}\` → \`${row.after}\``);
    }
  }
  lines.push(``);

  const outPath = path.join(__dirname, "spaces-to-experiences-report.md");
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");

  console.log(`Moved ${report.length} file(s).`);
  console.log(`Report written: ${outPath}`);
}

main();

