import { connectDB } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { VillaModel } from "@/models/Villa";
import { villaAxisRoomsMapping, isAxisRoomsMapped } from "./mapBooking";
import { pushInventoryForRange } from "./inventory";
import { pushDaywisePrice } from "./pricing";
import { pushCmRestrictions } from "./restrictions";
import type { AxisRoomsPushResult } from "./types";
import { addDays, todayIST } from "@/lib/bookingDates";

type BookingDoc = {
  _id: unknown;
  villaId: unknown;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  axisRoomsSynced?: boolean;
  source?: string;
};

async function loadVillaForBooking(booking: BookingDoc) {
  await connectDB();
  const villa = await VillaModel.findById(booking.villaId).lean();
  if (!villa || !isAxisRoomsMapped(villa)) return null;
  return { villa, mapping: villaAxisRoomsMapping(villa) };
}

/** Close inventory on OTAs for a booking (free: 0). */
export async function syncBookingInventoryClose(
  booking: BookingDoc,
): Promise<AxisRoomsPushResult> {
  if (
    booking.source?.startsWith("axisrooms_") &&
    booking.axisRoomsSynced
  ) {
    return { ok: true };
  }
  if (!booking.checkIn || !booking.checkOut) {
    return { ok: false, error: "Missing dates" };
  }

  const ctx = await loadVillaForBooking(booking);
  if (!ctx) return { ok: false, error: "Villa not mapped to Axis Rooms" };

  return pushInventoryForRange({
    hotelId: ctx.mapping.propertyId!,
    roomId: ctx.mapping.roomTypeId!,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    free: 0,
    auditTargetId: String(booking._id),
    auditTargetType: "booking",
  });
}

/** Open inventory on OTAs (free: 1) — cancel / release hold. */
export async function syncBookingInventoryOpen(
  booking: BookingDoc,
): Promise<AxisRoomsPushResult> {
  if (!booking.checkIn || !booking.checkOut) {
    return { ok: false, error: "Missing dates" };
  }

  const ctx = await loadVillaForBooking(booking);
  if (!ctx) return { ok: false, error: "Villa not mapped to Axis Rooms" };

  return pushInventoryForRange({
    hotelId: ctx.mapping.propertyId!,
    roomId: ctx.mapping.roomTypeId!,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    free: 1,
    auditTargetId: String(booking._id),
    auditTargetType: "booking",
  });
}

export async function syncBlockInventory(
  block: {
    _id: unknown;
    villaId: unknown;
    checkIn: string;
    checkOut: string;
  },
  free: 0 | 1,
): Promise<AxisRoomsPushResult> {
  await connectDB();
  const villa = await VillaModel.findById(block.villaId).lean();
  if (!villa || !isAxisRoomsMapped(villa)) {
    return { ok: false, error: "Villa not mapped" };
  }
  const mapping = villaAxisRoomsMapping(villa);
  return pushInventoryForRange({
    hotelId: mapping.propertyId!,
    roomId: mapping.roomTypeId!,
    checkIn: block.checkIn,
    checkOut: block.checkOut,
    free,
    auditTargetId: String(block._id),
    auditTargetType: "villa_block",
  });
}

export async function syncVillaChannelState(villa: {
  _id: unknown;
  slug?: string;
  status?: string;
  bookable?: boolean;
  basePricePaise?: number;
  axisRooms?: { propertyId?: string; roomTypeId?: string; ratePlanId?: string };
}): Promise<{ price?: AxisRoomsPushResult; restrictions?: AxisRoomsPushResult }> {
  if (!isAxisRoomsMapped(villa)) return {};

  const mapping = villaAxisRoomsMapping(villa);
  const start = todayIST();
  const end = addDays(start, 90);
  const dates: string[] = [];
  let cur = start;
  while (cur <= end) {
    dates.push(cur);
    cur = addDays(cur, 1);
  }

  const results: {
    price?: AxisRoomsPushResult;
    restrictions?: AxisRoomsPushResult;
  } = {};

  if (villa.basePricePaise && villa.basePricePaise > 0 && mapping.ratePlanId) {
    results.price = await pushDaywisePrice({
      hotelId: mapping.propertyId!,
      roomId: mapping.roomTypeId!,
      ratePlanId: mapping.ratePlanId,
      doublePriceRupees: Math.round(villa.basePricePaise / 100),
      dates,
      auditTargetId: String(villa._id),
    });
  }

  const hidden = villa.status === "hidden";
  const notBookable = villa.bookable === false;
  if ((hidden || notBookable) && mapping.ratePlanId) {
    results.restrictions = await pushCmRestrictions({
      hotelId: mapping.propertyId!,
      roomId: mapping.roomTypeId!,
      ratePlanId: mapping.ratePlanId,
      reStatus: "close",
      auditTargetId: String(villa._id),
    });
  } else if (mapping.ratePlanId) {
    results.restrictions = await pushCmRestrictions({
      hotelId: mapping.propertyId!,
      roomId: mapping.roomTypeId!,
      ratePlanId: mapping.ratePlanId,
      reStatus: "open",
      auditTargetId: String(villa._id),
    });
  }

  return results;
}

export async function markBookingSyncResult(
  bookingId: string,
  result: AxisRoomsPushResult,
  mode: "close" | "open",
): Promise<void> {
  await connectDB();
  const doc = await BookingModel.findById(bookingId);
  if (!doc) return;

  if (result.ok) {
    if (mode === "close") {
      doc.axisRoomsSynced = true;
      doc.axisRoomsLastError = undefined;
    } else {
      doc.axisRoomsCancelSynced = true;
      doc.axisRoomsLastError = undefined;
    }
  } else {
    doc.axisRoomsLastError = result.error;
    doc.axisRoomsSyncAttempts = (doc.axisRoomsSyncAttempts ?? 0) + 1;
  }
  await doc.save();
}

export async function queueBookingInventorySync(
  bookingId: string,
  mode: "close" | "open",
): Promise<AxisRoomsPushResult> {
  await connectDB();
  const doc = await BookingModel.findById(bookingId);
  if (!doc) return { ok: false, error: "Booking not found" };

  const result =
    mode === "close"
      ? await syncBookingInventoryClose(doc)
      : await syncBookingInventoryOpen(doc);

  await markBookingSyncResult(bookingId, result, mode);
  return result;
}
