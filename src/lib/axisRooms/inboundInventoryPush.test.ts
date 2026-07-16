import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("./inventory", () => ({
  pushBulkInventoryForRange: vi.fn(),
  pushInventoryForRange: vi.fn(),
}));

import { pushBulkInventoryForRange, pushInventoryForRange } from "./inventory";
import {
  pushInboundInventoryAck,
  pushInboundInventoryModify,
  stayEndDate,
  hasStayNights,
  formatApi2Range,
} from "./inboundInventoryPush";

describe("inboundInventoryPush", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(pushBulkInventoryForRange).mockResolvedValue({ ok: true });
    vi.mocked(pushInventoryForRange).mockResolvedValue({ ok: true });
  });

  it("stayEndDate uses check-out exclusive nights", () => {
    expect(stayEndDate("2026-08-15", "2026-08-17")).toBe("2026-08-16");
    expect(stayEndDate("2026-08-15", "2026-08-16")).toBe("2026-08-15");
    // checkIn 21, checkOut 24 → last night 23
    expect(stayEndDate("2026-07-21", "2026-07-24")).toBe("2026-07-23");
  });

  it("pushInboundInventoryAck closes EVERY night via API 2 then API 1", async () => {
    await pushInboundInventoryAck({
      hotelId: "1303",
      roomId: "1",
      checkIn: "2026-07-21",
      checkOut: "2026-07-24",
      bookingNo: "ARK001",
      mode: "close",
    });

    // 3 nights → 3 API 2 single-day pushes
    expect(pushBulkInventoryForRange).toHaveBeenCalledTimes(3);
    expect(pushBulkInventoryForRange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        startDate: "2026-07-21",
        endDate: "2026-07-21",
        availability: 0,
      }),
    );
    expect(pushBulkInventoryForRange).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        startDate: "2026-07-22",
        endDate: "2026-07-22",
        availability: 0,
      }),
    );
    expect(pushBulkInventoryForRange).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        startDate: "2026-07-23",
        endDate: "2026-07-23",
        availability: 0,
      }),
    );
    expect(pushInventoryForRange).toHaveBeenCalledWith(
      expect.objectContaining({
        hotelId: "1303",
        roomId: "1",
        checkIn: "2026-07-21",
        checkOut: "2026-07-24",
        free: 0,
      }),
    );
  });

  it("pushInboundInventoryAck opens with availability 1", async () => {
    await pushInboundInventoryAck({
      hotelId: "12123",
      roomId: "2",
      checkIn: "2026-08-15",
      checkOut: "2026-08-16",
      bookingNo: "ARK001",
      mode: "open",
    });

    expect(pushBulkInventoryForRange).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: "2026-08-15",
        endDate: "2026-08-15",
        availability: 1,
      }),
    );
    expect(pushInventoryForRange).toHaveBeenCalledWith(
      expect.objectContaining({ free: 1 }),
    );
  });

  it("pushInboundInventoryModify opens old then closes new", async () => {
    await pushInboundInventoryModify({
      hotelId: "12123",
      roomId: "2",
      bookingNo: "ARK001",
      oldCheckIn: "2026-08-15",
      oldCheckOut: "2026-08-17",
      newCheckIn: "2026-08-20",
      newCheckOut: "2026-08-22",
    });

    // old: 2 nights open + new: 2 nights close = 4 API2; + 2 API1
    expect(pushBulkInventoryForRange).toHaveBeenCalledTimes(4);
    expect(pushInventoryForRange).toHaveBeenCalledTimes(2);
  });

  it("hasStayNights false for same-day turnover edge", () => {
    expect(hasStayNights("2026-08-15", "2026-08-15")).toBe(false);
    expect(hasStayNights("2026-08-15", "2026-08-16")).toBe(true);
  });

  it("formatApi2Range shows night count for multi-night", () => {
    expect(formatApi2Range("2026-07-21", "2026-07-24")).toBe(
      "2026-07-21 → 2026-07-23 (3 nights)",
    );
  });
});
