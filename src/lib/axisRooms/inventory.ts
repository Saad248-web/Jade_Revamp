import { expandNightDates } from "@/lib/bookingDates";
import { auditLog } from "@/lib/audit/auditLog";
import {
  axisRoomsApiUrl,
  getAxisRoomsAccessKey,
  getAxisRoomsChannelId,
} from "./config";
import type { AxisRoomsPushResult } from "./types";

type InventoryPushParams = {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  /** 0 = booked/closed, 1 = open */
  free: 0 | 1;
  auditTargetId?: string;
  auditTargetType?: string;
};

async function postDaywiseInventory(body: Record<string, unknown>): Promise<{
  ok: boolean;
  error?: string;
  status?: number;
}> {
  const accessKey = getAxisRoomsAccessKey();
  const channelId = getAxisRoomsChannelId();
  if (!accessKey || !channelId) {
    return { ok: false, error: "Axis Rooms not configured" };
  }

  try {
    const res = await fetch(axisRoomsApiUrl("/api/daywiseInventory"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessKey, channelId, ...body }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Inventory push failed (${res.status})`,
        status: res.status,
      };
    }

    const data = (await res.json().catch(() => ({}))) as {
      status?: string;
      message?: string;
      errorCode?: string;
    };
    if (data.status?.toLowerCase() === "failure" || data.status === "Error") {
      return {
        ok: false,
        error: data.message || `errorCode ${data.errorCode ?? "unknown"}`,
      };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Inventory push failed",
    };
  }
}

/** Push day-wise inventory for a date range (check-out exclusive). */
export async function pushInventoryForRange(
  params: InventoryPushParams,
): Promise<AxisRoomsPushResult> {
  const nights = expandNightDates(params.checkIn, params.checkOut);
  if (nights.length === 0) {
    return { ok: true };
  }

  const result = await postDaywiseInventory({
    hotels: [
      {
        hotelId: params.hotelId,
        rooms: [
          {
            roomId: params.roomId,
            availability: nights.map((date) => ({
              date,
              free: params.free,
            })),
          },
        ],
      },
    ],
  });

  await auditLog({
    action: params.free === 0 ? "axisrooms.inventory.close" : "axisrooms.inventory.open",
    targetType: params.auditTargetType ?? "booking",
    targetId: params.auditTargetId,
    metadata: {
      hotelId: params.hotelId,
      roomId: params.roomId,
      nights: nights.length,
      free: params.free,
      ok: result.ok,
      error: result.error,
    },
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  return { ok: true };
}
