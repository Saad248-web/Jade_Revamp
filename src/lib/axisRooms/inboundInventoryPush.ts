import { expandNightDates } from "@/lib/bookingDates";
import {
  pushBulkInventoryForRange,
  pushInventoryForRange,
} from "./inventory";
import type { AxisRoomsPushResult } from "./types";

export type InboundInventoryPushParams = {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  bookingNo: string;
  bookingId?: string;
  /** close = availability 0 (booked), open = availability 1 (free) */
  mode: "close" | "open";
};

/** Last stay night for API 2 bulk range (check-out exclusive). */
export function stayEndDate(checkIn: string, checkOut: string): string {
  const nights = expandNightDates(checkIn, checkOut);
  if (nights.length === 0) return checkIn;
  return nights[nights.length - 1]!;
}

/**
 * After API 9 save: push inventory back to Axis.
 * - API 2 bulk range (primary CM ack)
 * - API 1 daywise for the same nights (calendar-visible free:0/1)
 *
 * Example create checkIn 2026-07-21 / checkOut 2026-07-24
 * → closes nights 2026-07-21, 2026-07-22, 2026-07-23 (checkout day free).
 */
export async function pushInboundInventoryAck(
  params: InboundInventoryPushParams,
): Promise<AxisRoomsPushResult> {
  const endDate = stayEndDate(params.checkIn, params.checkOut);
  const availability = params.mode === "close" ? 0 : 1;
  const free: 0 | 1 = availability === 0 ? 0 : 1;
  const audit = {
    auditTargetId: params.bookingId ?? params.bookingNo,
    auditTargetType: "axisrooms_inbound",
  };

  const bulk = await pushBulkInventoryForRange({
    hotelId: params.hotelId,
    roomId: params.roomId,
    startDate: params.checkIn,
    endDate,
    availability,
    ...audit,
  });
  if (!bulk.ok) return bulk;

  const daywise = await pushInventoryForRange({
    hotelId: params.hotelId,
    roomId: params.roomId,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    free,
    ...audit,
  });
  return daywise;
}

/** Modify: API 2 open old stay range, then close new stay range. */
export async function pushInboundInventoryModify(params: {
  hotelId: string;
  roomId: string;
  bookingNo: string;
  bookingId?: string;
  oldCheckIn: string;
  oldCheckOut: string;
  newCheckIn: string;
  newCheckOut: string;
}): Promise<AxisRoomsPushResult> {
  if (
    params.oldCheckIn === params.newCheckIn &&
    params.oldCheckOut === params.newCheckOut
  ) {
    return { ok: true };
  }

  const openResult = await pushInboundInventoryAck({
    hotelId: params.hotelId,
    roomId: params.roomId,
    checkIn: params.oldCheckIn,
    checkOut: params.oldCheckOut,
    bookingNo: params.bookingNo,
    bookingId: params.bookingId,
    mode: "open",
  });
  if (!openResult.ok) return openResult;

  return pushInboundInventoryAck({
    hotelId: params.hotelId,
    roomId: params.roomId,
    checkIn: params.newCheckIn,
    checkOut: params.newCheckOut,
    bookingNo: params.bookingNo,
    bookingId: params.bookingId,
    mode: "close",
  });
}

/** Convenience when only payload dates are known (e.g. cancel with no local booking). */
export function inboundDatesFromPayload(
  checkIn: string,
  checkOut: string,
): { startDate: string; endDate: string } {
  return { startDate: checkIn, endDate: stayEndDate(checkIn, checkOut) };
}

/** Guard: skip API 2 when check-out is same day as check-in with no nights. */
export function hasStayNights(checkIn: string, checkOut: string): boolean {
  return expandNightDates(checkIn, checkOut).length > 0;
}

/** For logging — human-readable API 2 range. */
export function formatApi2Range(checkIn: string, checkOut: string): string {
  const end = stayEndDate(checkIn, checkOut);
  return end === checkIn ? checkIn : `${checkIn} → ${end}`;
}

export { addDays } from "@/lib/bookingDates";
