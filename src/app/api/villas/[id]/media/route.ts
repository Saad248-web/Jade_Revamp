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
    category: "Outdoors" | "Indoors" | "Bed & Bath";
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

function detectSpaceCategory(title: string): "Outdoors" | "Indoors" | "Bed & Bath" {
  const t = title.toLowerCase();
  const has = (s: string) => t.includes(s);

  // Bed & Bath first (most specific)
  if (
    has("bed") ||
    has("bedroom") ||
    has("bath") ||
    has("bathroom") ||
    has("toilet") ||
    has("jacuzzi") ||
    has("tub") ||
    has("shower") ||
    has("suite")
  )
    return "Bed & Bath";

  // Indoors indicators
  if (
    has("living") ||
    has("lounge") ||
    has("dining") ||
    has("kitchen") ||
    has("bar") ||
    has("theatre") ||
    has("theater") ||
    has("room") ||
    has("hall") ||
    has("corridor") ||
    has("stairs") ||
    has("stair") ||
    has("artifacts") ||
    has("unit") ||
    has("tv") ||
    has("indoor")
  )
    return "Indoors";

  // Outdoors indicators
  if (
    has("pool") ||
    has("lawn") ||
    has("garden") ||
    has("yard") ||
    has("sit out") ||
    has("sitout") ||
    has("outdoor") ||
    has("walk") ||
    has("gazebo") ||
    has("entrance") ||
    has("court") ||
    has("patio") ||
    has("bbq") ||
    has("barbeque") ||
    has("bonfire") ||
    has("picnic") ||
    has("camp") ||
    has("villa") // exterior shots often named "villa"
  )
    return "Outdoors";

  // Default to Indoors (safer than misclassifying indoors as outdoors)
  return "Indoors";
}

function buildCategorizedSpaces(spaceUrls: string[]) {
  const buckets: Record<"Outdoors" | "Indoors" | "Bed & Bath", string[]> = {
    Outdoors: [],
    Indoors: [],
    "Bed & Bath": [],
  };
  for (const url of spaceUrls) {
    const title = filenameTitle(url);
    const cat = detectSpaceCategory(title);
    buckets[cat].push(url);
  }

  return (Object.keys(buckets) as Array<keyof typeof buckets>)
    .filter((k) => buckets[k].length > 0)
    .map((k) => ({
      id: k.toLowerCase().replace(/[^a-z]+/g, "-"),
      title: k,
      category: k,
      amenities:
        k === "Outdoors"
          ? ["Lawns", "Pool", "Open-air seating", "Garden zones"]
          : k === "Indoors"
            ? ["Living spaces", "Dining", "Lounges", "Interiors"]
            : ["Bedrooms", "Bathrooms", "Comfort amenities"],
      images: buckets[k],
    }));
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
    categorizedSpaces: buildCategorizedSpaces(spaces),
  };

  return NextResponse.json(res);
}

