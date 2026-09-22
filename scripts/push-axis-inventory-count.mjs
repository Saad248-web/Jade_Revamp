/**
 * Push inventory count for Rohith UAT (hotel 1234, rooms 1&2).
 * Usage:
 *   $env:MONGODB_URI="mongodb://...@200.97.161.24:27017/jadeapp?authSource=jadeapp"
 *   node scripts/push-axis-inventory-count.mjs --count=20 --start=2026-09-22 --end=2026-09-30
 */

import { loadEnvLocal } from "./loadEnvLocal.mjs";
import { usePublicDnsForMongo } from "./mongoDnsFix.mjs";
import mongoose from "mongoose";

loadEnvLocal();
usePublicDnsForMongo();

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
}

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const base = (process.env.AXIS_ROOMS_API_BASE_URL || "").replace(/\/$/, "");
const accessKey = process.env.AXIS_ROOMS_API_KEY?.trim();
const channelId = process.env.AXIS_ROOMS_CHANNEL_ID?.trim();

const hotelId = "1234";
const free = Number(arg("count", "20"));
const start = arg("start", "2026-09-22");
const end = arg("end", "2026-09-30");

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
  if (!Number.isFinite(free) || free < 0) {
    console.error("Invalid --count");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const Villa = mongoose.connection.collection("villas");
  const ledger = mongoose.connection.collection("axisnightinventories");
  const dates = nightsInclusive(start, end);

  const villaUpdate = await Villa.updateMany(
    { slug: { $in: ["diamond", "jade-735"] }, isDeleted: false },
    { $set: { "axisRooms.inventoryUnits": free } },
  );
  console.log(
    `Villa inventoryUnits → ${free} (matched ${villaUpdate.matchedCount})`,
  );

  for (const roomId of ["1", "2"]) {
    for (const date of dates) {
      await ledger.updateOne(
        { hotelId, roomId, date },
        {
          $set: {
            free,
            inventoryUnits: free,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true },
      );
    }

    const availability = dates.map((date) => ({ date, free }));
    const bulk = await post("/api/inventory", {
      hotels: [
        {
          hotelId,
          rooms: [
            {
              roomId,
              startDate: start,
              endDate: end,
              availability: free,
            },
          ],
        },
      ],
    });
    const day = await post("/api/daywiseInventory", {
      hotels: [{ hotelId, rooms: [{ roomId, availability }] }],
    });
    console.log(
      `Room ${roomId}: API2 ${bulk.data?.status} · API1 ${day.data?.status}`,
    );
    if (String(bulk.data?.status).toLowerCase() !== "success") {
      console.log("  API2 body:", JSON.stringify(bulk.data));
    }
    if (String(day.data?.status).toLowerCase() !== "success") {
      console.log("  API1 body:", JSON.stringify(day.data));
    }
  }

  console.log(`\nDONE count=${free} · hotel ${hotelId} · ${start} → ${end}`);
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
