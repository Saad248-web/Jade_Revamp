/**
 * Scales external layout spacing utilities by ~20% (0.8×).
 * Skips: gap-px, w-/h-/min-h-/max-h-, py/pt/pb <= 16px (control padding).
 *
 * Usage: node scripts/scale-external-spacing.mjs [--dry-run]
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "src");
const DRY_RUN = process.argv.includes("--dry-run");
const SCALE = 0.8;

/** Tailwind step → px (default 4px grid) */
const STEP_PX = {
  px: 1,
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
};

const PX_TO_STEP = Object.fromEntries(
  Object.entries(STEP_PX).map(([k, v]) => [v, k]),
);

const LAYOUT_PREFIXES = [
  "gap",
  "space-y",
  "space-x",
  "mb",
  "mt",
  "my",
  "mx",
  "pt",
  "pb",
  "py",
];

const SECTION_PY_MIN_PX = 17; // skip py/pt/pb at 16px and below (controls)

function nearestStep(px) {
  let best = "1";
  let bestDiff = Infinity;
  for (const [step, stepPx] of Object.entries(STEP_PX)) {
    if (step === "px") continue;
    const d = Math.abs(stepPx - px);
    if (d < bestDiff) {
      bestDiff = d;
      best = step;
    }
  }
  return best;
}

function scaleStep(step) {
  if (step === "px" || step === "0") return step;
  const px = STEP_PX[step];
  if (px === undefined) return step;
  if (step === "2" && px * SCALE < 8) return "2"; // 8px floor
  if (step === "1" || step === "1.5") return step; // 4–6px floor
  return nearestStep(px * SCALE);
}

function scalePxValue(num) {
  const scaled = num * SCALE;
  if (scaled < 8 && num >= 8) return 8;
  if (scaled < 4) return Math.max(4, Math.round(scaled));
  return Math.round(scaled * 10) / 10;
}

function scaleClampString(clampStr) {
  return clampStr.replace(
    /(-?\d*\.?\d+)(px|vw|vh|vmin|vmax|rem)/g,
    (match, num, unit) => {
      const n = parseFloat(num);
      if (Number.isNaN(n)) return match;
      if (unit === "px") {
        const scaled = scalePxValue(Math.abs(n)) * (n < 0 ? -1 : 1);
        return `${scaled}${unit}`;
      }
      if (unit === "vw" || unit === "vh" || unit === "vmin" || unit === "vmax") {
        const scaled = Math.round(n * SCALE * 1000) / 1000;
        return `${scaled}${unit}`;
      }
      return match;
    },
  );
}

function transformUtility(token) {
  const m = token.match(
    /^((?:[a-z]+(?:-\[[^\]]+\])?:)*)((?:gap|space-y|space-x|mb|mt|my|mx|pt|pb|py))-(.+)$/,
  );
  if (!m) return token;

  const [, variants, prefix, suffix] = m;

  if (prefix === "gap" && suffix === "px") return token;

  if (suffix.startsWith("[") && suffix.endsWith("]")) {
    const inner = suffix.slice(1, -1);
    if (/^clamp\(/i.test(inner)) {
      return `${variants}${prefix}-[${scaleClampString(inner)}]`;
    }
    const pxMatch = inner.match(/^(-?\d*\.?\d+)px$/);
    if (pxMatch) {
      const scaled = scalePxValue(parseFloat(pxMatch[1]));
      return `${variants}${prefix}-[${scaled}px]`;
    }
    return token;
  }

  const step = suffix;
  if (!STEP_PX[step]) return token;

  if (["pt", "pb", "py"].includes(prefix)) {
    if (STEP_PX[step] < SECTION_PY_MIN_PX) return token;
  }

  const next = scaleStep(step);
  return `${variants}${prefix}-${next}`;
}

function transformClassString(str) {
  return str
    .split(/\s+/)
    .map((t) => (t ? transformUtility(t) : t))
    .join(" ");
}

function shouldSkipLine(line) {
  if (/<button\b/i.test(line)) return true;
  if (/\bPrimaryButton\b/.test(line)) return true;
  if (/\bGlassButton\b/.test(line)) return true;
  if (/<input\b/i.test(line)) return true;
  if (/<textarea\b/i.test(line)) return true;
  if (/<select\b/i.test(line)) return true;
  if (/\btype=["']button["']/i.test(line)) return true;
  return false;
}

function transformContent(content, filePath) {
  let changes = 0;
  let out = content;

  // className="..." or className={'...'} or cn("...")
  out = out.replace(
    /className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{"([^"]*)"\})/g,
    (full, a, b, c, d) => {
      const lineStart = content.lastIndexOf("\n", content.indexOf(full)) + 1;
      const lineEnd = content.indexOf("\n", content.indexOf(full));
      const line = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
      if (shouldSkipLine(line)) return full;

      const cls = a ?? b ?? c ?? d;
      const next = transformClassString(cls);
      if (next === cls) return full;
      changes++;
      if (a !== undefined) return `className="${next}"`;
      if (b !== undefined) return `className='${next}'`;
      if (c !== undefined) return `className={\`${next}\`}`;
      return `className={"${next}"}`;
    },
  );

  // Template literals in className={cn(`...`)}
  out = out.replace(
    /className=\{cn\(\s*`([^`]*)`/g,
    (full, cls) => {
      const next = transformClassString(cls);
      if (next === cls) return full;
      changes++;
      return `className={cn(\`${next}\``;
    },
  );

  // Quoted layout classes inside template literals / concatenation
  out = out.replace(
    /"([^"]*\b(?:gap|space-y|space-x|mb|mt|my|mx|pt|pb|py)-[^"]*)"/g,
    (full, cls) => {
      if (!/\b(gap|space-y|space-x|mb|mt|my|mx|pt|pb|py)-/.test(cls)) return full;
      const next = transformClassString(cls);
      if (next === cls) return full;
      changes++;
      return `"${next}"`;
    },
  );

  // inline style marginBottom / marginTop / gap with clamp
  out = out.replace(
    /(margin(?:Bottom|Top)|gap):\s*"(clamp\([^"]+\))"/g,
    (full, prop, clampStr) => {
      const next = scaleClampString(clampStr);
      if (next === clampStr) return full;
      changes++;
      return `${prop}: "${next}"`;
    },
  );

  // style={{ marginBottom: "clamp(...)" }} or height spacers
  out = out.replace(
    /(marginBottom|marginTop|margin|gap|height):\s*"(clamp\([^"]+\))"/g,
    (full, prop, clampStr) => {
      if (prop === "height" && !/clamp\(\d/.test(clampStr)) return full;
      const next = scaleClampString(clampStr);
      if (next === clampStr) return full;
      changes++;
      return `${prop}: "${next}"`;
    },
  );

  if (filePath.endsWith(".css")) {
    out = out.replace(
      /^(\s*--space-fluid-[^:]+:\s*)clamp\([^)]+\)/gm,
      (line, prefix) => {
        const clampMatch = line.match(/clamp\([^)]+\)/);
        if (!clampMatch) return line;
        const next = scaleClampString(clampMatch[0]);
        if (next === clampMatch[0]) return line;
        changes++;
        return line.replace(clampMatch[0], next);
      },
    );
  }

  return { out, changes };
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p, files);
    } else if (/\.(tsx|ts|css)$/.test(name) && !name.endsWith(".test.ts")) {
      if (name === "layoutSpacing.ts") continue;
      if (name === "villaDetailSpacing.ts") continue;
      if (name === "experienceCarouselLayout.ts") continue;
      files.push(p);
    }
  }
  return files;
}

let totalFiles = 0;
let totalChanges = 0;

for (const file of walk(ROOT)) {
  const content = fs.readFileSync(file, "utf8");
  const { out, changes } = transformContent(content, file);
  if (changes > 0) {
    totalFiles++;
    totalChanges += changes;
    if (!DRY_RUN) fs.writeFileSync(file, out, "utf8");
    console.log(`${DRY_RUN ? "[dry] " : ""}${path.relative(process.cwd(), file)} (${changes})`);
  }
}

console.log(
  `\n${DRY_RUN ? "Would update" : "Updated"} ${totalFiles} files, ${totalChanges} regions.`,
);
