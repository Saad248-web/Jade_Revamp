import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const SRC_DIR = path.join(ROOT, "src");
const APP_DIR = path.join(SRC_DIR, "app");
const PUBLIC_DIR = path.join(ROOT, "public");

const TEXT_EXTS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".mdx",
  ".html",
  ".htm",
  ".css",
]);

function walk(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur) continue;
    let entries;
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const p = path.join(cur, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue;
        stack.push(p);
      } else if (e.isFile()) {
        out.push(p);
      }
    }
  }
  return out;
}

function stripQueryAndHash(p) {
  return p.split("#")[0].split("?")[0];
}

function isInternalPath(p) {
  return typeof p === "string" && p.startsWith("/") && !p.startsWith("//");
}

function looksLikeAsset(p) {
  const base = stripQueryAndHash(p);
  const ext = path.posix.extname(base);
  return ext.length > 1;
}

function safeDecode(uriPath) {
  try {
    return decodeURIComponent(uriPath);
  } catch {
    return uriPath;
  }
}

function pathCandidatesFromPublic(internalPath) {
  const clean = stripQueryAndHash(internalPath);
  const rel = clean.replace(/^\/+/, "");
  const decoded = safeDecode(rel);
  // Check both "as written" and decoded (handles %20 etc.)
  const candidates = new Set([
    path.join(PUBLIC_DIR, rel.split("/").join(path.sep)),
    path.join(PUBLIC_DIR, decoded.split("/").join(path.sep)),
  ]);
  return [...candidates];
}

function fileExists(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function normalizeRoute(p) {
  const clean = stripQueryAndHash(p);
  if (!clean.startsWith("/")) return clean;
  // remove trailing slash except root
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean;
}

function buildRouteMatchers() {
  const routes = new Set();
  const matchers = [];

  const files = walk(APP_DIR).filter((f) => /[\\\/]page\.tsx$/.test(f));
  for (const f of files) {
    const rel = path.relative(APP_DIR, f);
    const parts = rel.split(path.sep);
    parts.pop(); // page.tsx
    const routeParts = parts.map((seg) => seg);

    // Skip Next.js group segments like (group)
    const cleaned = routeParts.filter((s) => !(s.startsWith("(") && s.endsWith(")")));
    const route = "/" + cleaned.join("/").replaceAll("\\", "/");
    const normalized = normalizeRoute(route === "/" ? "/" : route);
    routes.add(normalized);

    // Build a regex for dynamic segments: [id] -> ([^/]+)
    const reSrc =
      "^" +
      normalized
        .split("/")
        .map((seg) => {
          if (!seg) return "";
          if (seg.startsWith("[") && seg.endsWith("]")) return "[^/]+";
          return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        })
        .join("/") +
      "$";
    matchers.push({ route: normalized, re: new RegExp(reSrc) });
  }

  // Also treat the implicit root page.tsx as "/"
  if (!routes.has("/")) routes.add("/");

  return { routes, matchers };
}

function extractInternalRefs(text) {
  const refs = new Set();

  // HTML/JSX attributes
  const attrRe = /\b(?:href|src)\s*=\s*(?:\{)?["']([^"']+)["'](?:\})?/g;
  for (const m of text.matchAll(attrRe)) {
    const v = m[1];
    if (isInternalPath(v)) refs.add(v);
  }

  // Markdown links: ](/path) and ](</path>)
  const mdRe = /\]\(\s*<?(\/[^)\s>]+)>?\s*\)/g;
  for (const m of text.matchAll(mdRe)) {
    const v = m[1];
    if (isInternalPath(v)) refs.add(v);
  }

  // CSS url(/path)
  const cssUrlRe = /url\(\s*["']?(\/[^"')\s]+)["']?\s*\)/g;
  for (const m of text.matchAll(cssUrlRe)) {
    const v = m[1];
    if (isInternalPath(v)) refs.add(v);
  }

  return [...refs];
}

function main() {
  const { routes, matchers } = buildRouteMatchers();
  const selfPath = path.resolve(process.argv[1] ?? "");
  const textFiles = walk(ROOT).filter((f) => {
    if (!TEXT_EXTS.has(path.extname(f).toLowerCase())) return false;
    // Avoid false positives from the audit script's own regex examples/comments.
    if (path.resolve(f) === selfPath) return false;
    return true;
  });

  const occurrences = new Map(); // ref -> [{file,line}]
  for (const f of textFiles) {
    let content;
    try {
      content = fs.readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const refs = extractInternalRefs(content);
    if (refs.length === 0) continue;

    // line mapping for context
    const lines = content.split(/\r?\n/);
    for (const ref of refs) {
      let firstLine = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(ref)) {
          firstLine = i + 1;
          break;
        }
      }
      const rel = path.relative(ROOT, f).split(path.sep).join("/");
      const arr = occurrences.get(ref) ?? [];
      arr.push({ file: rel, line: firstLine });
      occurrences.set(ref, arr);
    }
  }

  const refs = [...occurrences.keys()].sort();
  const assets = [];
  const routesRef = [];

  for (const ref of refs) {
    const clean = normalizeRoute(stripQueryAndHash(ref));
    if (clean.startsWith("/api/")) continue;
    if (looksLikeAsset(clean)) assets.push(ref);
    else routesRef.push(ref);
  }

  const missingAssets = [];
  const presentAssets = [];

  for (const ref of assets) {
    const candidates = pathCandidatesFromPublic(ref);
    const ok = candidates.some(fileExists);
    const item = { path: ref, exists: ok, candidates, usedAt: occurrences.get(ref) ?? [] };
    if (ok) presentAssets.push(item);
    else missingAssets.push(item);
  }

  const brokenRoutes = [];
  const okRoutes = [];
  for (const ref of routesRef) {
    const clean = normalizeRoute(stripQueryAndHash(ref));
    if (clean === "/") {
      okRoutes.push({ path: ref, usedAt: occurrences.get(ref) ?? [] });
      continue;
    }
    const ok =
      routes.has(clean) ||
      matchers.some((m) => m.re.test(clean)) ||
      // tolerate /foo?bar=... already stripped above, and hash-only links like "/#section"
      clean.startsWith("/#");
    const item = { path: ref, normalized: clean, exists: ok, usedAt: occurrences.get(ref) ?? [] };
    if (ok) okRoutes.push(item);
    else brokenRoutes.push(item);
  }

  const result = {
    generatedAt: new Date().toISOString(),
    projectRoot: ROOT,
    detectedRoutes: [...routes].sort(),
    counts: {
      refs: refs.length,
      assetRefs: assets.length,
      routeRefs: routesRef.length,
      missingAssets: missingAssets.length,
      brokenRoutes: brokenRoutes.length,
    },
    missingAssets,
    brokenRoutes,
    notes: {
      limitations: [
        "Only detects string-literal href/src (and basic markdown/css url()). Template-string routes and computed paths may be missed.",
        "External URLs are not validated (networkless audit).",
        "Next/Image remotePatterns and runtime API responses are not crawled.",
      ],
    },
  };

  const outPath = path.join(ROOT, "tmp", "audit-links.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
  console.log(`Wrote ${outPath}`);
  console.log(
    `Refs=${result.counts.refs} assets=${result.counts.assetRefs} missingAssets=${result.counts.missingAssets} brokenRoutes=${result.counts.brokenRoutes}`,
  );
}

main();

