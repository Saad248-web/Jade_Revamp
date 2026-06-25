/**
 * One-time idempotent migration: STAAH → Axis Rooms field names.
 * Run: node scripts/migrate-staah-to-axisrooms.mjs
 */
import { loadEnvLocal } from "./loadEnvLocal.mjs";
import mongoose from "mongoose";

loadEnvLocal();

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error("MONGODB_URI required");
  process.exit(1);
}

const SOURCE_MAP = {
  staah_airbnb: "axisrooms_airbnb",
  staah_booking_com: "axisrooms_booking_com",
};

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) throw new Error("No db");

  const villas = db.collection("villas");
  const bookings = db.collection("bookings");

  const villaCursor = villas.find({
    $or: [{ staah: { $exists: true } }, { "staah.propertyId": { $exists: true } }],
  });
  let villaCount = 0;
  for await (const v of villaCursor) {
    const staah = v.staah ?? {};
    const axis = v.axisRooms ?? {};
    const merged = {
      propertyId: axis.propertyId ?? staah.propertyId ?? "",
      roomTypeId: axis.roomTypeId ?? staah.roomTypeId ?? "",
      ratePlanId: axis.ratePlanId ?? staah.ratePlanId ?? "",
    };
    await villas.updateOne(
      { _id: v._id },
      {
        $set: { axisRooms: merged },
        $unset: { staah: "" },
      },
    );
    villaCount += 1;
  }

  const bookingUpdates = [
    ["staahSynced", "axisRoomsSynced"],
    ["staahCancelSynced", "axisRoomsCancelSynced"],
    ["staahSyncAttempts", "axisRoomsSyncAttempts"],
    ["staahLastError", "axisRoomsLastError"],
    ["staahReservationId", "axisRoomsReservationId"],
  ];

  let bookingCount = 0;
  const bookingCursor = bookings.find({
    $or: [
      { staahSynced: { $exists: true } },
      { source: { $in: Object.keys(SOURCE_MAP) } },
    ],
  });

  for await (const b of bookingCursor) {
    const $set = {};
    const $unset = {};
    for (const [oldKey, newKey] of bookingUpdates) {
      if (b[oldKey] !== undefined && b[newKey] === undefined) {
        $set[newKey] = b[oldKey];
        $unset[oldKey] = "";
      } else if (b[oldKey] !== undefined) {
        $unset[oldKey] = "";
      }
    }
    if (b.source && SOURCE_MAP[b.source]) {
      $set.source = SOURCE_MAP[b.source];
    }
    if (Object.keys($set).length || Object.keys($unset).length) {
      await bookings.updateOne(
        { _id: b._id },
        {
          ...(Object.keys($set).length ? { $set } : {}),
          ...(Object.keys($unset).length ? { $unset } : {}),
        },
      );
      bookingCount += 1;
    }
  }

  console.log(`Migrated ${villaCount} villas, ${bookingCount} bookings.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
