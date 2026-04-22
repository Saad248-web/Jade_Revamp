import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type FolderMedia = {
  folder: string; // relative folder inside /Experiences
  images: string[]; // public URLs
};

type ExperienceMediaResponse = {
  root: string; // e.g. "/Experiences/Weddings"
  all: string[];
  groups: FolderMedia[];
};

const SLUG_TO_FOLDER: Record<string, string> = {
  weddings: "Weddings",
  "corporate-retreats": "Corporate Retreats",
  caravans: "Caravan",
  "weekend-getaways": "Weekend Getaways",
  "party-villas": "Party Villas",
};

function safeReadDirs(absDir: string) {
  try {
    return fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function toPublicUrl(absPath: string) {
  const publicRoot = path.join(process.cwd(), "public");
  const rel = path.relative(publicRoot, absPath).replace(/\\/g, "/");
  return `/${rel}`;
}

function walk(absDir: string): string[] {
  const out: string[] = [];
  for (const ent of safeReadDirs(absDir)) {
    const full = path.join(absDir, ent.name);
    if (ent.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function getWebps(absDir: string) {
  return walk(absDir)
    .filter((f) => f.toLowerCase().endsWith(".webp"))
    .map(toPublicUrl)
    .sort();
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const folder = SLUG_TO_FOLDER[slug];
  if (!folder) {
    return NextResponse.json({ error: "Unknown experience slug" }, { status: 404 });
  }

  const absRoot = path.join(process.cwd(), "public", "Experiences", folder);
  const root = `/Experiences/${folder}`;

  const groups: FolderMedia[] = [];
  for (const ent of safeReadDirs(absRoot)) {
    if (!ent.isDirectory()) continue;
    const abs = path.join(absRoot, ent.name);
    const images = getWebps(abs);
    if (images.length) groups.push({ folder: ent.name, images });
  }

  const all = getWebps(absRoot);

  const res: ExperienceMediaResponse = {
    root,
    all,
    groups,
  };

  return NextResponse.json(res);
}

