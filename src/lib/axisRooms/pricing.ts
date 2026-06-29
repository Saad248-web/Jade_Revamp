import { auditLog } from "@/lib/audit/auditLog";
import {
  axisRoomsApiUrl,
  getAxisRoomsAccessKey,
  getAxisRoomsChannelId,
} from "./config";
import type { AxisRoomsPushResult } from "./types";

type PricePushParams = {
  hotelId: string;
  roomId: string;
  ratePlanId: string;
  /** Rupees (Axis expects Double occupancy price) */
  doublePriceRupees: number;
  dates: string[];
  auditTargetId?: string;
};

/** API 6 — daywise price update. */
export async function pushDaywisePrice(
  params: PricePushParams,
): Promise<AxisRoomsPushResult> {
  const accessKey = getAxisRoomsAccessKey();
  const channelId = getAxisRoomsChannelId();
  if (!accessKey || !channelId) {
    return { ok: false, error: "Axis Rooms not configured" };
  }
  if (params.dates.length === 0 || params.doublePriceRupees <= 0) {
    return { ok: true };
  }

  const body = {
    accessKey,
    channelId,
    hotels: [
      {
        hotelId: params.hotelId,
        rooms: [
          {
            roomId: params.roomId,
            rateplans: [
              {
                rateplanId: params.ratePlanId,
                priceDetails: params.dates.map((date) => ({
                  date,
                  price: { Double: params.doublePriceRupees },
                })),
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(axisRoomsApiUrl("/api/daywisePrice"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      return { ok: false, error: `Price push failed (${res.status})` };
    }

    const data = (await res.json().catch(() => ({}))) as {
      status?: string;
      message?: string;
    };
    if (data.status?.toLowerCase() === "failure" || data.status === "Error") {
      return { ok: false, error: data.message ?? "Price push failed" };
    }

    await auditLog({
      action: "axisrooms.price.push",
      targetType: "villa",
      targetId: params.auditTargetId,
      metadata: { hotelId: params.hotelId, dates: params.dates.length },
    });

    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Price push failed",
    };
  }
}
