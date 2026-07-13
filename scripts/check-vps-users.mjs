/**
 * List dashboard users on target Mongo (VPS or local).
 *   $env:MONGODB_URI='mongodb://...'; node scripts/check-vps-users.mjs
 */
import { MongoClient } from "mongodb";
import { loadEnvLocal } from "./loadEnvLocal.mjs";

loadEnvLocal();

const uri =
  process.env.MONGODB_URI_VPS?.trim() ||
  process.env.MONGODB_URI?.trim();

if (!uri) {
  console.error("Set MONGODB_URI or MONGODB_URI_VPS");
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15_000 });
await client.connect();
const users = await client
  .db("jadeapp")
  .collection("users")
  .find({ isDeleted: { $ne: true } })
  .project({ email: 1, role: 1, status: 1, passwordHash: 1 })
  .toArray();

console.log(`\n${users.length} users on ${uri.replace(/:([^:@/]+)@/, ":***@")}\n`);
for (const u of users) {
  console.log(
    `  ${u.email}  role=${u.role}  status=${u.status ?? "active"}  hash=${u.passwordHash ? "yes" : "MISSING"}`,
  );
}
await client.close();
