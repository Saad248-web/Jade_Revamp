import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const VILLA_ROOT = path.join(PUBLIC_DIR, "Villa_Retreats");
const EXP_ROOT = path.join(PUBLIC_DIR, "Experiences");

function safeReadDir(absDir) {
  try {
    return fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function walk(absDir) {
  const out = [];
  for (const ent of safeReadDir(absDir)) {
    const full = path.join(absDir, ent.name);
    if (ent.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function toPublicUrl(absPath) {
  const rel = path.relative(PUBLIC_DIR, absPath).replace(/\\/g, "/");
  return `/${rel}`;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function collectWebps(absDir) {
  return walk(absDir)
    .filter((f) => {
      const base = path.basename(f).toLowerCase();
      return base.endsWith(".webp") && base !== ".webp";
    })
    .map(toPublicUrl)
    .sort();
}

function classifyVilla(url) {
  const u = url.toLowerCase();
  if (u.includes("/1-hero/") || u.includes("/hero/")) return "hero";
  if (u.includes("/2-spaces/") || u.includes("/spaces/")) return "spaces";
  // Accept common variations like:
  // - /3-Experiences/
  // - /3-Experience/ or /3-Experienceee/
  // - /Experiences/
  if (
    u.includes("/3-experiences") ||
    u.includes("/3-experience") ||
    u.includes("/experiences/")
  )
    return "experiences";
  // Accept common variations like:
  // - /4-Perfect For/
  // - /Perfect For/
  // - /perfect-for/
  if (
    u.includes("/4-perfect") ||
    u.includes("/perfect for/") ||
    u.includes("/perfect-for/")
  )
    return "perfectFor";
  return "other";
}

function filenameTitle(url) {
  const base = decodeURIComponent(url.split("/").pop() || "")
    .replace(/\.webp$/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
  return base.length ? base : "Space";
}

function detectAdvancedCategory(title) {
  const t = title.toLowerCase();
  const has = (s) => t.includes(s);

  if (
    has("bath") ||
    has("bathroom") ||
    has("toilet") ||
    has("jacuzzi") ||
    has("tub") ||
    has("shower")
  )
    return "Bathrooms";

  if (
    has("bed") ||
    has("bedroom") ||
    has("suite") ||
    has("master") ||
    has("occupancy") ||
    has("stay")
  )
    return "Bedrooms";

  if (has("kitchen") || has("bar") || has("counter") || has("dry kitchen"))
    return "Kitchen & Bar";

  if (
    has("living") ||
    has("lounge") ||
    has("dining") ||
    has("hall") ||
    has("family") ||
    has("theatre") ||
    has("theater") ||
    has("home theatre") ||
    has("tv")
  )
    return "Living & Dining";

  if (has("pool") || has("water") || has("plunge") || has("waterfall"))
    return "Pool & Water";

  if (
    has("lawn") ||
    has("garden") ||
    has("yard") ||
    has("outdoor") ||
    has("sit out") ||
    has("sitout") ||
    has("gazebo") ||
    has("bonfire") ||
    has("bbq") ||
    has("barbeque") ||
    has("camp") ||
    has("picnic") ||
    has("amphitheater") ||
    has("court yard") ||
    has("courtyard")
  )
    return "Outdoors & Lawns";

  if (
    has("entrance") ||
    has("walk") ||
    has("walkway") ||
    has("path") ||
    has("corridor") ||
    has("stairs") ||
    has("stair") ||
    has("gate")
  )
    return "Entrances & Paths";

  if (
    has("view") ||
    has("hill") ||
    has("sunset") ||
    has("villa") ||
    has("front") ||
    has("exterior") ||
    has("side view")
  )
    return "Views & Exteriors";

  return "Other";
}

function metaForCategory(cat) {
  switch (cat) {
    case "Bedrooms":
      return {
        title: "Bedrooms",
        amenities: ["Beds", "Sleep comfort", "Storage", "AC"],
      };
    case "Bathrooms":
      return {
        title: "Bathrooms",
        amenities: ["Baths", "Jacuzzi", "Shower", "Toiletries"],
      };
    case "Living & Dining":
      return {
        title: "Living & Dining",
        amenities: ["Living spaces", "Dining", "Lounges", "Interiors"],
      };
    case "Kitchen & Bar":
      return {
        title: "Kitchen & Bar",
        amenities: ["Kitchen", "Bar counter", "Utilities", "Tableware"],
      };
    case "Pool & Water":
      return {
        title: "Pool & Water",
        amenities: ["Pool", "Plunge", "Water features", "Deck"],
      };
    case "Outdoors & Lawns":
      return {
        title: "Outdoors & Lawns",
        amenities: ["Lawns", "Garden zones", "Open-air seating", "Activities"],
      };
    case "Entrances & Paths":
      return {
        title: "Entrances & Paths",
        amenities: ["Walkways", "Entrances", "Courtyards", "Landscaping"],
      };
    case "Views & Exteriors":
      return {
        title: "Views & Exteriors",
        amenities: [
          "Exterior views",
          "Property facade",
          "Scenic views",
          "Approach",
        ],
      };
    default:
      return {
        title: "Other",
        amenities: ["Spaces", "Details", "Ambience", "Highlights"],
      };
  }
}

function buildCategorizedSpaces(spaceUrls, villaId) {
  const buckets = {};
  for (const url of spaceUrls) {
    const title = filenameTitle(url);
    let cat = detectAdvancedCategory(title);
    const lowerUrl = url.toLowerCase();
    if (villaId === "wonderland") {
      if (title.toLowerCase().includes("dining")) cat = "Living & Dining";
      if (title.toLowerCase().includes("bed")) cat = "Bedrooms";
      if (title.toLowerCase().includes("jacuzzi")) cat = "Bathrooms";
    }
    if (villaId === "diamond") {
      if (lowerUrl.includes("/spaces/") && title.toLowerCase().includes("pool"))
        cat = "Pool & Water";
    }
    buckets[cat] = buckets[cat] || [];
    buckets[cat].push(url);
  }
  const order = [
    "Views & Exteriors",
    "Outdoors & Lawns",
    "Pool & Water",
    "Living & Dining",
    "Kitchen & Bar",
    "Bedrooms",
    "Bathrooms",
    "Entrances & Paths",
    "Other",
  ];
  return order
    .filter((k) => (buckets[k] || []).length > 0)
    .map((k) => {
      const meta = metaForCategory(k);
      return {
        id: k.toLowerCase().replace(/[^a-z]+/g, "-"),
        title: meta.title,
        category: meta.title,
        amenities: meta.amenities,
        images: buckets[k],
      };
    });
}

function buildVillasManifest() {
  const villas = {};
  for (const ent of safeReadDir(VILLA_ROOT)) {
    if (!ent.isDirectory()) continue;
    const villaFolder = ent.name;
    const abs = path.join(VILLA_ROOT, villaFolder);
    const files = collectWebps(abs);

    const media = {
      hero: [],
      spaces: [],
      experiences: [],
      perfectFor: [],
      other: [],
    };
    for (const url of files) {
      media[classifyVilla(url)].push(url);
    }
    media.hero = uniq(media.hero);
    media.spaces = uniq(media.spaces);
    media.experiences = uniq(media.experiences);
    media.perfectFor = uniq(media.perfectFor);
    media.other = uniq(media.other);

    // Map public folder name → villa id (used for targeted categorization fixes).
    const folderToVillaId = {
      Wonderland: "wonderland",
      Diamond: "diamond",
    };
    const villaId = folderToVillaId[villaFolder] || "";

    villas[villaFolder] = {
      ...media,
      categorizedSpaces: buildCategorizedSpaces(media.spaces, villaId),
    };
  }
  return villas;
}

function buildExperiencesManifest() {
  const experiences = {};
  for (const ent of safeReadDir(EXP_ROOT)) {
    if (!ent.isDirectory()) continue;
    const folder = ent.name;
    const absRoot = path.join(EXP_ROOT, folder);
    const all = collectWebps(absRoot);
    const groups = [];
    for (const sub of safeReadDir(absRoot)) {
      if (!sub.isDirectory()) continue;
      const abs = path.join(absRoot, sub.name);
      const images = collectWebps(abs);
      if (images.length) groups.push({ folder: sub.name, images });
    }
    experiences[folder] = { root: `/Experiences/${folder}`, all, groups };
  }
  return experiences;
}

function writeTs(outPath, data) {
  const content = `/* eslint-disable */
// AUTO-GENERATED by scripts/generate_media_manifest.mjs
// Do not edit manually.

export const MEDIA_MANIFEST = ${JSON.stringify(data, null, 2)} as const;
`;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, "utf8");
}

function main() {
  if (!fs.existsSync(VILLA_ROOT)) {
    console.error("Missing public/Villa_Retreats");
    process.exit(1);
  }
  if (!fs.existsSync(EXP_ROOT)) {
    console.error("Missing public/Experiences");
    process.exit(1);
  }

  const villasByFolder = buildVillasManifest();
  const experiencesByFolder = buildExperiencesManifest();

  const out = {
    generatedAt: new Date().toISOString(),
    villasByFolder,
    experiencesByFolder,
  };

  const outPath = path.join(ROOT, "src", "generated", "mediaManifest.ts");
  writeTs(outPath, out);
  console.log(`Wrote ${outPath}`);
}

main();
