/**
 * Removes Mongo data for removed CMS features (Puck page editor, landing/meta CMS).
 * Keeps blog/* content pages and all operational collections.
 *
 * Usage: node scripts/cleanup-removed-cms-data.mjs
 */
import mongoose from "mongoose";
import { loadEnvLocal } from "./loadEnvLocal.mjs";
import { usePublicDnsForMongo } from "./mongoDnsFix.mjs";

loadEnvLocal();
usePublicDnsForMongo();

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

await mongoose.connect(uri);
const db = mongoose.connection.db;

const collections = {
  editablePages: db.collection("editablepages"),
  pageVersions: db.collection("pageversions"),
  routeRedirects: db.collection("routeredirects"),
  contentPages: db.collection("contentpages"),
};

async function count(name, filter = {}) {
  return collections[name].countDocuments(filter);
}

async function remove(name, filter, label) {
  const before = await count(name, filter);
  if (before === 0) {
    console.log(`${label}: 0 documents (skip)`);
    return 0;
  }
  const result = await collections[name].deleteMany(filter);
  console.log(`${label}: deleted ${result.deletedCount} of ${before}`);
  return result.deletedCount;
}

console.log("Cleaning removed CMS / Puck data…\n");

const stats = {
  editablePages: await remove(
    "editablePages",
    {},
    "editablepages (Puck pages)",
  ),
  pageVersions: await remove(
    "pageVersions",
    {},
    "pageversions (Puck versions)",
  ),
  routeRedirects: await remove(
    "routeRedirects",
    {},
    "routeredirects (URL redirects)",
  ),
  metaContent: await remove(
    "contentPages",
    { pageKey: { $regex: /^meta\// } },
    'contentpages (meta/*)',
  ),
  landingContent: await remove(
    "contentPages",
    { pageKey: { $regex: /^landing\// } },
    'contentpages (landing/*)',
  ),
};

const blogRemaining = await count("contentPages", {
  pageKey: { $regex: /^blog\// },
});
const otherContent = await count("contentPages", {
  pageKey: { $not: { $regex: /^(blog|meta|landing)\// } },
});

console.log("\nRemaining contentpages:");
console.log(`  blog/*: ${blogRemaining}`);
if (otherContent > 0) {
  const samples = await collections.contentPages
    .find({ pageKey: { $not: { $regex: /^(blog|meta|landing)\// } } })
    .project({ pageKey: 1 })
    .limit(10)
    .toArray();
  console.log(`  other:  ${otherContent} (kept)`, samples.map((d) => d.pageKey));
}

const totalDeleted =
  stats.editablePages +
  stats.pageVersions +
  stats.routeRedirects +
  stats.metaContent +
  stats.landingContent;

console.log(`\nDone. ${totalDeleted} document(s) removed.`);
await mongoose.disconnect();
