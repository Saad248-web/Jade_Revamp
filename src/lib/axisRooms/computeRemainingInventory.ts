import { connectDB } from "@/lib/db";
import { expandNightDates, rangesOverlap } from "@/lib/bookingDates";
import { BookingModel } from "@/models/Booking";

const OCCUPYING_STATUSES = ["pending", "on_hold", "confirmed"] as const;

/**
 * Remaining Axis inventory for a stay range.
 * inventoryUnits=1 (whole villa) → 0 when any occupying booking overlaps, else 1.
 * inventoryUnits=10 + 1 booking → 9 (Rohith preprod expectation).
 */
export async function computeRemainingInventory(params: {
  villaId: string;
  checkIn: string;
  checkOut: string;
  inventoryUnits?: number;
  /** Exclude a booking id (e.g. when opening after cancel already soft-deleted). */
  excludeBookingId?: string;
}): Promise<number> {
  const units = Math.max(1, Math.floor(params.inventoryUnits ?? 1));
  const nights = expandNightDates(params.checkIn, params.checkOut);
  if (nights.length === 0) return units;

  await connectDB();

  const query: Record<string, unknown> = {
    villaId: params.villaId,
    isDeleted: false,
    status: { $in: [...OCCUPYING_STATUSES] },
    checkIn: { $lt: params.checkOut },
    checkOut: { $gt: params.checkIn },
  };
  if (params.excludeBookingId) {
    query._id = { $ne: params.excludeBookingId };
  }

  const bookings = await BookingModel.find(query)
    .select({ checkIn: 1, checkOut: 1 })
    .lean();

  let maxOccupied = 0;
  for (const night of nights) {
    const nightEnd = (() => {
      const d = new Date(`${night}T12:00:00Z`);
      d.setUTCDate(d.getUTCDate() + 1);
      return d.toISOString().slice(0, 10);
    })();
    let occupied = 0;
    for (const b of bookings) {
      if (
        typeof b.checkIn === "string" &&
        typeof b.checkOut === "string" &&
        rangesOverlap(b.checkIn, b.checkOut, night, nightEnd)
      ) {
        occupied += 1;
      }
    }
    if (occupied > maxOccupied) maxOccupied = occupied;
  }

  return Math.max(0, units - maxOccupied);
}
