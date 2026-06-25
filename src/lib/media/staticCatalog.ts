import fs from "fs";
import path from "path";
import { MEDIA_MANIFEST } from "@/generated/mediaManifest";

export type StaticMediaItem = {
  id: string;
  storage: "static";
  publicUrl: string;
  filename: string;
  folderPath: string;
  mime: string;
  size?: number;
  width?: number;
  height?: number;
};

export type StaticMediaTree = {
  name: string;
  path: string;
  children: StaticMediaTree[];
  files: StaticMediaItem[];
};

const IMAGE_EXT = new Set([
  ".webp",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".svg",
]);

/** Top-level public folders hidden from the Media Library browser. */
export const EXCLUDED_PUBLIC_FOLDERS = new Set(["assets"]);

function folderPathFromUrl(url: string): string {
  const parts = url.split("/").filter(Boolean);
  parts.pop();
  return parts.join("/") || "root";
}

function isImagePath(value: string): boolean {
  return (
    value.startsWith("/") &&
    IMAGE_EXT.has(path.extname(value.split("?")[0]).toLowerCase())
  );
}

/** Recursively collect image URL strings from manifest JSON (handles categorizedSpaces, etc.). */
function collectStringsDeep(value: unknown, urls: Set<string>) {
  if (typeof value === "string") {
    if (isImagePath(value)) urls.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStringsDeep(item, urls);
    return;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value as Record<string, unknown>)) {
      collectStringsDeep(v, urls);
    }
  }
}

function collectManifestUrls(): string[] {
  const urls = new Set<string>();
  collectStringsDeep(MEDIA_MANIFEST, urls);
  return Array.from(urls).sort();
}

function walkPublicDir(absDir: string, publicRoot: string): string[] {
  const out: string[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const full = path.join(absDir, ent.name);
    if (ent.isDirectory()) {
      out.push(...walkPublicDir(full, publicRoot));
    } else if (IMAGE_EXT.has(path.extname(ent.name).toLowerCase())) {
      const rel = path.relative(publicRoot, full).replace(/\\/g, "/");
      out.push(`/${rel}`);
    }
  }
  return out;
}

/** Top-level image folders under `public/` (excludes assets). */
export function listPublicRootFolders(): { name: string; path: string }[] {
  const publicRoot = path.join(process.cwd(), "public");
  try {
    return fs
      .readdirSync(publicRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !EXCLUDED_PUBLIC_FOLDERS.has(d.name))
      .map((d) => ({ name: d.name, path: d.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

/**
 * Image URLs from manifest + filesystem.
 * When `rootFolder` is set, only scan that subtree (faster for Media Library).
 */
export function listStaticMediaUrls(rootFolder?: string): string[] {
  const publicRoot = path.join(process.cwd(), "public");
  const fromManifest = collectManifestUrls();

  let scanned: string[] = [];
  if (rootFolder) {
    const safe = rootFolder.replace(/^\/+/, "").replace(/\.\./g, "");
    const subDir = path.join(publicRoot, safe);
    if (subDir.startsWith(publicRoot) && fs.existsSync(subDir)) {
      scanned = walkPublicDir(subDir, publicRoot);
    }
    const prefix = `/${safe}`;
    const fromManifestInFolder = fromManifest.filter(
      (u) => u === prefix || u.startsWith(`${prefix}/`),
    );
    return Array.from(new Set([...fromManifestInFolder, ...scanned])).sort();
  }

  scanned = walkPublicDir(publicRoot, publicRoot);
  return Array.from(new Set([...fromManifest, ...scanned])).sort();
}

export function staticItemFromUrl(url: string): StaticMediaItem {
  const safeUrl = typeof url === "string" ? url : String(url);
  const filename = decodeURIComponent(safeUrl.split("/").pop() ?? "image");
  const ext = path.extname(filename).toLowerCase();
  const mime =
    ext === ".svg"
      ? "image/svg+xml"
      : ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".gif"
            ? "image/gif"
            : "image/webp";

  return {
    id: `static:${safeUrl}`,
    storage: "static",
    publicUrl: safeUrl,
    filename,
    folderPath: folderPathFromUrl(safeUrl),
    mime,
  };
}

export function buildStaticMediaTree(urls: string[]): StaticMediaTree {
  const root: StaticMediaTree = { name: "public", path: "", children: [], files: [] };
  const nodeMap = new Map<string, StaticMediaTree>([["", root]]);

  for (const url of urls) {
    if (typeof url !== "string") continue;
    const item = staticItemFromUrl(url);
    const segments = item.folderPath.split("/").filter(Boolean);
    let currentPath = "";
    let parent = root;

    for (const seg of segments) {
      currentPath = currentPath ? `${currentPath}/${seg}` : seg;
      if (!nodeMap.has(currentPath)) {
        const node: StaticMediaTree = {
          name: seg,
          path: currentPath,
          children: [],
          files: [],
        };
        parent.children.push(node);
        nodeMap.set(currentPath, node);
      }
      parent = nodeMap.get(currentPath)!;
    }
    parent.files.push(item);
  }

  const sortTree = (node: StaticMediaTree) => {
    node.children.sort((a, b) => a.name.localeCompare(b.name));
    node.files.sort((a, b) => a.filename.localeCompare(b.filename));
    node.children.forEach(sortTree);
  };
  sortTree(root);
  return root;
}

export function filterStaticItems(
  urls: string[],
  opts: {
    q?: string;
    folder?: string;
    mime?: string;
  },
): StaticMediaItem[] {
  let items = urls
    .filter((u): u is string => typeof u === "string" && u.length > 0)
    .map(staticItemFromUrl);

  const q = opts.q?.trim().toLowerCase();
  if (q) {
    items = items.filter(
      (i) =>
        i.filename.toLowerCase().includes(q) ||
        i.publicUrl.toLowerCase().includes(q) ||
        i.folderPath.toLowerCase().includes(q),
    );
  }
  if (opts.mime) {
    items = items.filter((i) => i.mime.includes(opts.mime!));
  }
  return items;
}
