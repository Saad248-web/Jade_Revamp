import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("./inventory", () => ({
  pushBulkInventoryForRange: vi.fn(),
}));

import { pushBulkInventoryForRange } from "./inventory";
import {
  pushInboundInventoryAck,
  pushInboundInventoryModify,
  stayEndDate,
  hasStayNights,
} from "./inboundInventoryPush";

describe("inboundInventoryPush", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(pushBulkInventoryForRange).mockResolvedValue({ ok: true });
  });

  it("stayEndDate uses check-out exclusive nights", () => {
    expect(stayEndDate("2026-08-15", "2026-08-17")).toBe("2026-08-16");
    expect(stayEndDate("2026-08-15", "2026-08-16")).toBe("2026-08-15");
  });

  it("pushInboundInventoryAck closes with availability 0", async () => {
    await pushInboundInventoryAck({
      hotelId: "12123",
      roomId: "2",
      checkIn: "2026-08-15",
      checkOut: "2026-08-17",
      bookingNo: "ARK001",
      mode: "close",
    });

    expect(pushBulkInventoryForRange).toHaveBeenCalledWith(
      expect.objectContaining({
        hotelId: "12123",
        roomId: "2",
        startDate: "2026-08-15",
        endDate: "2026-08-16",
        availability: 0,
        auditTargetType: "axisrooms_inbound",
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
      expect.objectContaining({ availability: 1 }),
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

    expect(pushBulkInventoryForRange).toHaveBeenCalledTimes(2);
    expect(pushBulkInventoryForRange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        startDate: "2026-08-15",
        endDate: "2026-08-16",
        availability: 1,
      }),
    );
    expect(pushBulkInventoryForRange).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        startDate: "2026-08-20",
        endDate: "2026-08-21",
        availability: 0,
      }),
    );
  });

  it("hasStayNights false for same-day turnover edge", () => {
    expect(hasStayNights("2026-08-15", "2026-08-15")).toBe(false);
    expect(hasStayNights("2026-08-15", "2026-08-16")).toBe(true);
  });
});
