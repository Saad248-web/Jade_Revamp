/**
 * Seed Axis night inventory ledger + push to preprod (Rohith UAT).
 * Usage:
 *   $env:MONGODB_URI="mongodb://...@200.97.161.24:27017/jadeapp?authSource=jadeapp"
 *   node scripts/seed-axis-inventory-ledger.mjs
 */

import { loadEnvLocal } from "./loadEnvLocal.mjs";
import { usePublicDnsForMongo } from "./mongoDnsFix.mjs";
import mongoose from "mongoose";

loadEnvLocal();
usePublicDnsForMongo();

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const base = (process.env.AXIS_ROOMS_API_BASE_URL || "").replace(/\/$/, "");
const accessKey = process.env.AXIS_ROOMS_API_KEY?.trim();
const channelId = process.env.AXIS_ROOMS_CHANNEL_ID?.trim();

const hotelId = "1234";
const units = 10;
const start = "2026-09-22";
const endInclusive = "2026-09-30";

function nightsInclusive(startIso, endIso) {
  const out = [];
  const d = new Date(`${startIso}T12:00:00Z`);
  const last = new Date(`${endIso}T12:00:00Z`);
  while (d <= last) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

async function post(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessKey, channelId, ...body }),
  });
  const data = await res.json().catch(() => ({}));
  return { http: res.status, data };
}

async function main() {
  if (!MONGODB_URI || !accessKey) {
    console.error("Need MONGODB_URI + AXIS_ROOMS_API_KEY");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const col = mongoose.connection.collection("axisnightinventories");

  const dates = nightsInclusive(start, endInclusive);
  // Baseline 10 for rooms 1 & 2
  for (const roomId of ["1", "2"]) {
    for (const date of dates) {
      let free = units;
      // After 2 bookings on room 2 for 26–28, Axis expects 8
      if (roomId === "2" && date >= "2026-09-26" && date <= "2026-09-28") {
        free = 8;
      }
      await col.updateOne(
        { hotelId, roomId, date },
        { $set: { free, inventoryUnits: units, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true },
      );
    }
  }
  console.log(`Ledger seeded hotel ${hotelId} rooms 1&2 · ${start}→${endInclusive}`);
  console.log("  room 2 · 26–28 Sep = 8 (matches Rohith expected after 2 bookings)");
  console.log("  all other nights = 10");

  // Push to Axis
  for (const roomId of ["1", "2"]) {
    const availability = dates.map((date) => ({
      date,
      free: roomId === "2" && date >= "2026-09-26" && date <= "2026-09-28" ? 8 : 10,
    }));
    const bulkFree = Math.min(...availability.map((a) => a.free));
    const bulk = await post("/api/inventory", {
      hotels: [
        {
          hotelId,
          rooms: [
            {
              roomId,
              startDate: start,
              endDate: endInclusive,
              availability: bulkFree,
            },
          ],
        },
      ],
    });
    const day = await post("/api/daywiseInventory", {
      hotels: [{ hotelId, rooms: [{ roomId, availability }] }],
    });
    console.log(
      `Room ${roomId}: API2 ${bulk.data?.status} · API1 ${day.data?.status} (bulk=${bulkFree})`,
    );
  }

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
