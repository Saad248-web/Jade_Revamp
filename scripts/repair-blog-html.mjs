/**
 * Restores blog HTML sections when rawHtml was dropped (e.g. stale Mongoose model on hot reload).
 * Usage: node scripts/repair-blog-html.mjs [slug]
 */
import mongoose from "mongoose";
import DOMPurify from "isomorphic-dompurify";
import { loadEnvLocal } from "./loadEnvLocal.mjs";
import { usePublicDnsForMongo } from "./mongoDnsFix.mjs";

loadEnvLocal();
usePublicDnsForMongo();

const sanitize = (raw) => {
  const styleBlocks = [];
  const withoutStyles = raw.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (match) => {
    styleBlocks.push(
      match
        .replace(/expression\s*\(/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/@import\b/gi, "")
        .replace(/behavior\s*:/gi, ""),
    );
    return "";
  });
  const body = DOMPurify.sanitize(withoutStyles, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["link"],
    ADD_ATTR: [
      "target", "rel", "class", "id", "style", "href", "src", "alt",
      "width", "height", "loading", "decoding",
    ],
  });
  const styles = styleBlocks.join("\n");
  return styles ? `${styles}\n${body}` : body;
};

const slugFilter = process.argv[2];
await mongoose.connect(process.env.MONGODB_URI.trim());
const col = mongoose.connection.collection("contentpages");

const query = slugFilter
  ? { pageKey: `blog/${slugFilter}` }
  : { pageKey: /^blog\// };

const pages = await col.find(query).toArray();
let repaired = 0;

for (const page of pages) {
  const sections = page.sections ?? [];
  const versions = page.versions ?? [];
  let sourceSections = null;
  for (let i = versions.length - 1; i >= 0; i--) {
    const snap = versions[i]?.snapshot?.sections;
    if (snap?.some((s) => s.type === "html" && s.rawHtml?.trim())) {
      sourceSections = snap;
      break;
    }
  }
  if (!sourceSections) {
    console.warn(`No HTML snapshot for ${page.pageKey}`);
    continue;
  }

  const needsRepair = sections.some((s) => {
    if (s.type !== "html") return false;
    if (!s.rawHtml?.trim()) return true;
    const source = sourceSections.find((x) => x.type === "html");
    if (!source?.rawHtml) return false;
    return (
      /<style/i.test(source.rawHtml) && !/<style/i.test(s.rawHtml ?? "")
    );
  });
  if (!needsRepair) continue;

  const nextSections = sections.map((section, idx) => {
    if (section.type !== "html") return section;
    const source =
      sourceSections[idx] ?? sourceSections.find((s) => s.type === "html");
    if (!source?.rawHtml?.trim()) return section;
    const missingStyles =
      /<style/i.test(source.rawHtml) && !/<style/i.test(section.rawHtml ?? "");
    if (section.rawHtml?.trim() && !missingStyles) return section;
    return {
      ...section,
      type: "html",
      rawHtml: sanitize(source.rawHtml),
    };
  });

  await col.updateOne(
    { _id: page._id },
    { $set: { sections: nextSections } },
  );
  console.log(`Repaired ${page.pageKey}`);
  repaired += 1;
}

console.log(`Done. Repaired ${repaired} page(s).`);
await mongoose.disconnect();
