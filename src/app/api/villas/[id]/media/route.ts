import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { VILLAS } from "@/lib/mockData";

type MediaResponse = {
  hero: string[];
  spaces: string[];
  experiences: string[];
  perfectFor: string[];
  other: string[];
  categorizedSpaces: Array<{
    id: string;
    title: string;
    category: string;
    amenities: string[];
    images: string[];
  }>;
};

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function toPublicUrl(absPath: string) {
  const publicRoot = path.join(process.cwd(), "public");
  const rel = path.relative(publicRoot, absPath).replace(/\\/g, "/");
  return `/${rel}`;
}

function safeReadDirs(absDir: string) {
  try {
    return fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function walkFiles(absDir: string): string[] {
  const out: string[] = [];
  for (const ent of safeReadDirs(absDir)) {
    const full = path.join(absDir, ent.name);
    if (ent.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function extractRetreatFoldersFromPath(url: string) {
  const m = url.match(/^\/Villa_Retreats\/([^/]+)\//);
  return m?.[1] ? [m[1]] : [];
}

function collectCandidateFolders(villa: any) {
  const candidates: string[] = [];
  const addFrom = (s?: string) => {
    if (!s || typeof s !== "string") return;
    candidates.push(...extractRetreatFoldersFromPath(s));
  };
  addFrom(villa.image);
  addFrom(villa.thumbnail);
  (villa.images || []).forEach(addFrom);
  (villa.spaces || []).forEach((x: any) => addFrom(x?.image));
  (villa.activities || []).forEach((x: any) => addFrom(x?.image));
  (villa.categorizedSpaces || []).forEach((g: any) =>
    (g?.images || []).forEach(addFrom),
  );
  return uniq(candidates);
}

function classify(url: string) {
  const u = url.toLowerCase();
  if (u.includes("/1-hero/") || u.includes("/hero/")) return "hero";
  if (u.includes("/2-spaces/") || u.includes("/spaces/")) return "spaces";
  if (u.includes("/3-experiences") || u.includes("/experiences/"))
    return "experiences";
  if (u.includes("/4-perfect")) return "perfectFor";
  return "other";
}

function filenameTitle(url: string) {
  const base = decodeURIComponent(url.split("/").pop() || "")
    .replace(/\.webp$/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
  return base.length ? base : "Space";
}

type AdvancedCategory =
  | "Bedrooms"
  | "Bathrooms"
  | "Living & Dining"
  | "Kitchen & Bar"
  | "Pool & Water"
  | "Outdoors & Lawns"
  | "Entrances & Paths"
  | "Views & Exteriors"
  | "Other";

function detectAdvancedCategory(title: string): AdvancedCategory {
  const t = title.toLowerCase();
  const has = (s: string) => t.includes(s);

  // Bathrooms (most specific, prevents jacuzzi shots being treated as outdoors)
  if (
    has("bath") ||
    has("bathroom") ||
    has("toilet") ||
    has("jacuzzi") ||
    has("tub") ||
    has("shower")
  )
    return "Bathrooms";

  // Bedrooms
  if (has("bed") || has("bedroom") || has("suite") || has("master"))
    return "Bedrooms";

  // Kitchen / Bar
  if (has("kitchen") || has("bar") || has("counter") || has("dry kitchen"))
    return "Kitchen & Bar";

  // Living / Dining
  if (
    has("living") ||
    has("lounge") ||
    has("dining") ||
    has("hall") ||
    has("family") ||
    has("theatre") ||
    has("theater") ||
    has("home theatre") ||
    has("tv") ||
    has("room")
  )
    return "Living & Dining";

  // Pool / Water
  if (
    has("pool") ||
    has("water") ||
    has("plunge") ||
    has("jacuzzi") ||
    has("waterfall")
  )
    return "Pool & Water";

  // Outdoors / Lawns
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

  // Entrances / Paths
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

  // Views / Exteriors
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

function metaForCategory(cat: AdvancedCategory): { title: string; amenities: string[] } {
  switch (cat) {
    case "Bedrooms":
      return { title: "Bedrooms", amenities: ["Beds", "Sleep comfort", "Storage", "AC"] };
    case "Bathrooms":
      return { title: "Bathrooms", amenities: ["Baths", "Jacuzzi", "Shower", "Toiletries"] };
    case "Living & Dining":
      return { title: "Living & Dining", amenities: ["Living spaces", "Dining", "Lounges", "Interiors"] };
    case "Kitchen & Bar":
      return { title: "Kitchen & Bar", amenities: ["Kitchen", "Bar counter", "Utilities", "Tableware"] };
    case "Pool & Water":
      return { title: "Pool & Water", amenities: ["Pool", "Plunge", "Water features", "Deck"] };
    case "Outdoors & Lawns":
      return { title: "Outdoors & Lawns", amenities: ["Lawns", "Garden zones", "Open-air seating", "Activities"] };
    case "Entrances & Paths":
      return { title: "Entrances & Paths", amenities: ["Walkways", "Entrances", "Courtyards", "Landscaping"] };
    case "Views & Exteriors":
      return { title: "Views & Exteriors", amenities: ["Exterior views", "Property facade", "Scenic views", "Approach"] };
    default:
      return { title: "Other", amenities: ["Spaces", "Details", "Ambience", "Highlights"] };
  }
}

function buildCategorizedSpaces(spaceUrls: string[], villaId: string) {
  const buckets: Record<string, string[]> = {};

  for (const url of spaceUrls) {
    const title = filenameTitle(url);
    let cat = detectAdvancedCategory(title);

    // Targeted fixes:
    // - Wonderland has many indoor shots with garden-ish filenames; treat "Dining" and "Bedroom" explicitly.
    // - Diamond has many "spaces_##" that are mixed; bias by directory structure when available.
    const lowerUrl = url.toLowerCase();
    if (villaId === "wonderland") {
      if (title.toLowerCase().includes("dining")) cat = "Living & Dining";
      if (title.toLowerCase().includes("bed")) cat = "Bedrooms";
      if (title.toLowerCase().includes("jacuzzi")) cat = "Bathrooms";
    }
    if (villaId === "diamond") {
      if (lowerUrl.includes("/spaces/") && title.toLowerCase().includes("pool")) cat = "Pool & Water";
    }

    const key = cat;
    buckets[key] = buckets[key] || [];
    buckets[key].push(url);
  }

  const order: AdvancedCategory[] = [
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const villa = VILLAS.find((v: any) => v.id === id);
  if (!villa) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const retreatFolders = collectCandidateFolders(villa);
  const media: Omit<MediaResponse, "categorizedSpaces"> = {
    hero: [],
    spaces: [],
    experiences: [],
    perfectFor: [],
    other: [],
  };

  for (const folder of retreatFolders) {
    const abs = path.join(process.cwd(), "public", "Villa_Retreats", folder);
    const files = walkFiles(abs).filter((f) => f.toLowerCase().endsWith(".webp"));
    for (const f of files) {
      const url = toPublicUrl(f);
      const bucket = classify(url) as keyof typeof media;
      media[bucket].push(url);
    }
  }

  const hero = uniq(media.hero);
  const spaces = uniq(media.spaces);
  const experiences = uniq(media.experiences);
  const perfectFor = uniq(media.perfectFor);
  const other = uniq(media.other);

  const res: MediaResponse = {
    hero,
    spaces,
    experiences,
    perfectFor,
    other,
    categorizedSpaces: buildCategorizedSpaces(spaces, id),
  };

  return NextResponse.json(res);
}

