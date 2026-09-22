/**
 * UAT reset: clear ALL Axis villa mappings, then map BOTH preprod rooms for hotel 1234.
 *
 * Rohith (2026-09-22): hotelId 1234 · Room IDs 1 & 2 · Rate Plan IDs 1 & 2
 *
 *   diamond  → 1234 / room 1 / rate 1
 *   jade-735 → 1234 / room 2 / rate 2
 *
 * Usage:
 *   $env:MONGODB_URI="mongodb://...@200.97.161.24:27017/jadeapp?authSource=jadeapp"
 *   node scripts/reset-axis-uat-mapping.mjs
 */

import mongoose from "mongoose";
import { loadEnvLocal } from "./loadEnvLocal.mjs";
import { usePublicDnsForMongo } from "./mongoDnsFix.mjs";

loadEnvLocal();

const MONGODB_URI = process.env.MONGODB_URI?.trim();

const MAPS = [
  {
    slug: "diamond",
    hotelId: "1234",
    roomId: "1",
    ratePlanId: "1",
    ratePlanName: "BAR",
    inventoryUnits: 20,
  },
  {
    slug: "jade-735",
    hotelId: "1234",
    roomId: "2",
    ratePlanId: "2",
    ratePlanName: "CP",
    inventoryUnits: 20,
  },
];

async function main() {
  if (!MONGODB_URI) {
    console.error("BLOCKED: MONGODB_URI not set");
    process.exit(1);
  }

  usePublicDnsForMongo();
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });

  const Villa =
    mongoose.models.Villa ??
    mongoose.model(
      "Villa",
      new mongoose.Schema({}, { strict: false, timestamps: true }),
    );

  const clear = await Villa.updateMany(
    { isDeleted: false },
    {
      $set: { channelMode: "website_only" },
      $unset: { axisRooms: "" },
    },
  );
  console.log(`\nCleared Axis mappings on ${clear.modifiedCount} villa(s)`);

  for (const m of MAPS) {
    const villa = await Villa.findOneAndUpdate(
      { slug: m.slug, isDeleted: false },
      {
        $set: {
          channelMode: "channel_managed",
          axisRooms: {
            propertyId: m.hotelId,
            roomTypeId: m.roomId,
            ratePlanId: m.ratePlanId,
            ratePlanName: m.ratePlanName,
            inventoryUnits: m.inventoryUnits,
          },
        },
      },
      { returnDocument: "after" },
    );
    if (!villa) {
      console.error(`Villa not found: ${m.slug}`);
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log(
      `  ${m.slug} → hotel ${m.hotelId} · room ${m.roomId} · rate ${m.ratePlanId} · units ${m.inventoryUnits} · channel_managed`,
    );
  }

  console.log("\nAll other villas: unmapped + website_only\n");
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
