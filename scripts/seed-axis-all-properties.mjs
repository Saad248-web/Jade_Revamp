/**
 * Assign Axis Rooms sandbox IDs to all Jade portfolio villas.
 *
 * Scheme: hotelId 1301–1316, roomId 1, ratePlanId 1, ratePlanName "Best Available Rate"
 * Whole-villa model: one room per property (noOfRooms: 1 on inbound API 9).
 *
 * Usage:
 *   npm run axis:seed-all
 *   node scripts/seed-axis-all-properties.mjs --dry-run
 *
 * Production (Vercel uses VPS MongoDB — not local 127.0.0.1):
 *   PowerShell:
 *     $env:MONGODB_URI="mongodb://jadeapp_user:...@200.97.161.24:27017/jadeapp?authSource=jadeapp"
 *     npm run axis:seed-all
 */

import mongoose from "mongoose";
import { loadEnvLocal } from "./loadEnvLocal.mjs";
import { usePublicDnsForMongo } from "./mongoDnsFix.mjs";

loadEnvLocal();

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const HOTEL_ID_START = 1301;
const ROOM_ID = "1";
const RATE_PLAN_ID = "1";
const RATE_PLAN_NAME = "Best Available Rate";

const dryRun = process.argv.includes("--dry-run");

async function main() {
  if (!MONGODB_URI) {
    console.error("BLOCKED: MONGODB_URI not set in .env.local");
    process.exit(1);
  }

  usePublicDnsForMongo();
  await mongoose.connect(MONGODB_URI);

  const Villa =
    mongoose.models.Villa ??
    mongoose.model(
      "Villa",
      new mongoose.Schema({}, { strict: false, timestamps: true }),
    );

  const villas = await Villa.find({ isDeleted: false }).sort({ name: 1 }).lean();

  if (villas.length === 0) {
    console.error("No villas found. Run: npm run db:seed");
    process.exit(1);
  }

  console.log(`\nAxis Rooms bulk mapping (${dryRun ? "DRY RUN" : "APPLY"})`);
  console.log(`  Villas found : ${villas.length}`);
  console.log(`  hotelId range: ${HOTEL_ID_START}–${HOTEL_ID_START + villas.length - 1}`);
  console.log(`  roomId       : ${ROOM_ID}`);
  console.log(`  ratePlanId   : ${RATE_PLAN_ID}`);
  console.log(`  ratePlanName : ${RATE_PLAN_NAME}\n`);

  const rows = [];

  for (let i = 0; i < villas.length; i++) {
    const villa = villas[i];
    const hotelId = String(HOTEL_ID_START + i);
    const channelMode =
      villa.bookable && (villa.basePricePaise ?? 0) > 0
        ? "channel_managed"
        : "website_only";

    rows.push({
      hotelId,
      slug: villa.slug,
      name: villa.name ?? villa.slug,
      roomId: ROOM_ID,
      ratePlanId: RATE_PLAN_ID,
      ratePlanName: RATE_PLAN_NAME,
      channelMode,
    });

    if (!dryRun) {
      const result = await Villa.updateOne(
        { slug: villa.slug, isDeleted: false },
        {
          $set: {
            axisRooms: {
              propertyId: hotelId,
              roomTypeId: ROOM_ID,
              ratePlanId: RATE_PLAN_ID,
              ratePlanName: RATE_PLAN_NAME,
            },
            channelMode,
          },
        },
      );
      if (result.matchedCount === 0) {
        console.warn(`WARN: no match for slug=${villa.slug}`);
      }
    }
  }

  console.log("hotelId | slug                  | channelMode");
  console.log("--------|-----------------------|----------------");
  for (const r of rows) {
    console.log(
      `${r.hotelId.padEnd(7)} | ${r.slug.padEnd(21)} | ${r.channelMode}`,
    );
  }

  console.log(
    `\n${dryRun ? "Would update" : "Updated"} ${rows.length} villa(s).`,
  );
  console.log(
    "\nExport CSV: Dashboard → Settings → Axis Rooms → Export CSV",
  );
  console.log(
    "Inbound webhook: https://jade-revamp.vercel.app/api/webhooks/axisrooms\n",
  );

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
