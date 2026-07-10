/**
 * Export jade-axisrooms-properties.csv from MongoDB villa mappings.
 * Usage: node scripts/export-axisrooms-csv.mjs
 */

import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { loadEnvLocal } from "./loadEnvLocal.mjs";
import { usePublicDnsForMongo } from "./mongoDnsFix.mjs";

loadEnvLocal();

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const OUT = path.join(process.cwd(), "docs", "jade-axisrooms-properties.csv");

function csvEsc(s) {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  if (!MONGODB_URI) {
    console.error("BLOCKED: MONGODB_URI not set");
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

  const villas = await Villa.find({ isDeleted: false }).lean();

  const sorted = villas
    .map((v) => {
      const axis = v.axisRooms ?? {};
      const hotelId = axis.propertyId ?? "";
      return { v, axis, hotelIdNum: Number(hotelId) || 0 };
    })
    .sort((a, b) => a.hotelIdNum - b.hotelIdNum || (a.v.name ?? "").localeCompare(b.v.name ?? ""));

  const header = "hotelId,hotelName,roomId,ratePlanId,ratePlanName,noOfRooms";
  const lines = sorted.map(({ v, axis }) => {
    return [
      csvEsc(axis.propertyId ?? ""),
      csvEsc(v.name ?? v.slug ?? ""),
      csvEsc(axis.roomTypeId ?? "1"),
      csvEsc(axis.ratePlanId ?? "1"),
      csvEsc(axis.ratePlanName ?? "Best Available Rate"),
      "1",
    ].join(",");
  });

  const csv = [header, ...lines].join("\n");
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, csv, "utf8");

  console.log(`Wrote ${villas.length} rows → ${OUT}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
