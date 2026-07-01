/**
 * Map Axis Rooms sandbox test hotel to a Jade portfolio villa for UAT.
 *
 * Sandbox (from Axis Rooms email 2026-07-01):
 *   hotelId 12123 · roomId 1 or 2 · ratePlanId 1 or 2
 *
 * Usage:
 *   node scripts/seed-axis-sandbox.mjs
 *   node scripts/seed-axis-sandbox.mjs --slug=jade-735 --room=2 --rate=2
 */

import mongoose from "mongoose";
import { loadEnvLocal } from "./loadEnvLocal.mjs";
import { usePublicDnsForMongo } from "./mongoDnsFix.mjs";

loadEnvLocal();

const MONGODB_URI = process.env.MONGODB_URI?.trim();

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
}

async function main() {
  if (!MONGODB_URI) {
    console.error("BLOCKED: MONGODB_URI not set in .env.local");
    process.exit(1);
  }

  const slug = arg("slug", "diamond");
  const roomId = arg("room", "1");
  const ratePlanId = arg("rate", "1");
  const hotelId = arg("hotel", "12123");

  usePublicDnsForMongo();
  await mongoose.connect(MONGODB_URI);

  const Villa =
    mongoose.models.Villa ??
    mongoose.model(
      "Villa",
      new mongoose.Schema({}, { strict: false, timestamps: true }),
    );

  const villa = await Villa.findOneAndUpdate(
    { slug, isDeleted: false },
    {
      $set: {
        axisRooms: {
          propertyId: hotelId,
          roomTypeId: roomId,
          ratePlanId: ratePlanId,
        },
      },
    },
    { new: true },
  );

  if (!villa) {
    console.error(`Villa not found: ${slug}. Run: node scripts/seed-villas.mjs`);
    process.exit(1);
  }

  console.log("\nAxis Rooms sandbox mapping applied:\n");
  console.log(`  Villa slug     : ${slug}`);
  console.log(`  hotelId        : ${hotelId}`);
  console.log(`  roomId         : ${roomId}`);
  console.log(`  ratePlanId     : ${ratePlanId}`);
  console.log("\nEnsure .env.local has:");
  console.log("  AXIS_ROOMS_API_BASE_URL=https://sandbox2.axisrooms.com");
  console.log("  AXIS_ROOMS_CHANNEL_ID=227");
  console.log("  AXIS_ROOMS_API_KEY=<accessKey from Axis email>");
  console.log("  AXIS_ROOMS_PMS_NAME=Jade Host PMS");
  console.log("\nThen run: npm run axis:test");
  console.log(
    "\nInbound webhook URL to share with Axis (API 9):\n  https://<your-domain>/api/webhooks/axisrooms\n",
  );

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
