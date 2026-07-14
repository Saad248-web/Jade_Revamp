/**
 * Clear operational collections then re-seed staff users.
 *
 * Local (default .env.local MONGODB_URI):
 *   node scripts/clear-users-bookings-audit.mjs
 *
 * Remote VPS / Vercel DB (pass URI explicitly — never commit secrets):
 *   $env:MONGODB_URI="mongodb://...@200.97.161.24:27017/jadeapp?authSource=jadeapp"
 *   node scripts/clear-users-bookings-audit.mjs
 *
 * Does NOT wipe villas, media, SEO, content pages.
 */
import { MongoClient } from "mongodb";
import { loadEnvLocal } from "./loadEnvLocal.mjs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

loadEnvLocal();

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error("BLOCKED: MONGODB_URI not set");
  process.exit(1);
}

const isRemote = !/127\.0\.0\.1|localhost/i.test(uri);
const hostHint = uri.replace(/:([^:@/]+)@/, ":***@").replace(/\?.*/, "");

const CLEAR = [
  "users",
  "bookings",
  "auditlogs",
  "villanightlocks",
  "webhookevents",
  "ratelimitbuckets",
  "careers",
  "leads",
  "partnerleads",
];

console.log(`\nTarget: ${hostHint}`);
console.log(`Remote: ${isRemote ? "YES" : "no (local)"}\n`);

if (isRemote && process.env.CONFIRM_REMOTE_CLEAR !== "YES") {
  console.error(
    'BLOCKED: Refusing remote wipe without CONFIRM_REMOTE_CLEAR=YES\n' +
      '  PowerShell: $env:CONFIRM_REMOTE_CLEAR="YES"; $env:MONGODB_URI="..."; node scripts/clear-users-bookings-audit.mjs\n',
  );
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 20_000 });
await client.connect();
const db = client.db("jadeapp");

console.log("Before clear:");
for (const name of CLEAR) {
  const n = await db.collection(name).countDocuments();
  console.log(`  ${name}: ${n}`);
}

for (const name of CLEAR) {
  const res = await db.collection(name).deleteMany({});
  console.log(`Cleared ${name}: deleted ${res.deletedCount}`);
}

await client.close();

const root = path.dirname(fileURLToPath(import.meta.url));
const seed = spawnSync(process.execPath, [path.join(root, "seed-users.mjs")], {
  stdio: "inherit",
  env: { ...process.env, MONGODB_URI: uri },
});
if (seed.status !== 0) process.exit(seed.status ?? 1);

console.log(
  "\nDone. For Vercel: sign out, clear site cookies, login again with seed admin.\n",
);
