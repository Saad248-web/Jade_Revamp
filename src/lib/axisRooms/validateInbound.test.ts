import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({ connectDB: vi.fn() }));
vi.mock("@/models/Villa", () => ({
  VillaModel: { find: vi.fn() },
}));
vi.mock("./verify", () => ({
  fetchOtaAvailability: vi.fn(),
}));
vi.mock("./config", () => ({
  isAxisRoomsConfigured: vi.fn(() => true),
}));

import { VillaModel } from "@/models/Villa";
import { fetchOtaAvailability } from "./verify";
import {
  validateAxisRoomsInbound,
  verifyInboundWithAxis,
} from "./validateInbound";
import type { AxisRoomsInboundEvent } from "./types";

const baseEvent: AxisRoomsInboundEvent = {
  eventType: "create",
  bookingNo: "ARK00002EM7R",
  bookingStatus: "confirmed",
  propertyId: "12123",
  roomTypeId: "2",
  ratePlanId: "2",
  noOfRooms: 1,
  checkIn: "2026-07-06",
  checkOut: "2026-07-07",
  raw: {},
};

describe("validateAxisRoomsInbound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(VillaModel.find).mockReturnValue({
      limit: vi.fn().mockResolvedValue([]),
    } as never);
  });

  it("rejects invalid roomType id", async () => {
    const result = await validateAxisRoomsInbound({
      ...baseEvent,
      roomTypeId: "123",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("UNKNOWN_PROPERTY");
      expect(result.error).toContain("12123/123");
    }
  });

  it("rejects invalid ratePlanId when villa mapping has one", async () => {
    vi.mocked(VillaModel.find).mockReturnValue({
      limit: vi.fn().mockResolvedValue([
        {
          _id: "villa1",
          name: "Test Villa",
          slug: "test",
          axisRooms: {
            propertyId: "12123",
            roomTypeId: "2",
            ratePlanId: "2",
          },
        },
      ]),
    } as never);

    const result = await validateAxisRoomsInbound({
      ...baseEvent,
      ratePlanId: "99",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("INVALID_RATE_PLAN");
    }
  });

  it("rejects noOfRooms other than 1", async () => {
    const result = await validateAxisRoomsInbound({
      ...baseEvent,
      noOfRooms: 23,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("INVALID_ROOM_COUNT");
    }
  });

  it("accepts valid sandbox mapping", async () => {
    vi.mocked(VillaModel.find).mockReturnValue({
      limit: vi.fn().mockResolvedValue([
        {
          _id: "villa1",
          name: "Test Villa",
          slug: "diamond",
          axisRooms: {
            propertyId: "12123",
            roomTypeId: "2",
            ratePlanId: "2",
          },
        },
      ]),
    } as never);

    const result = await validateAxisRoomsInbound(baseEvent);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.mapping.propertyId).toBe("12123");
      expect(result.mapping.roomTypeId).toBe("2");
    }
  });
});

describe("verifyInboundWithAxis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fails when Axis rejects hotel/room", async () => {
    vi.mocked(fetchOtaAvailability).mockResolvedValue({
      ok: false,
      days: [],
      error: "Invalid hotelId",
    });

    const result = await verifyInboundWithAxis(baseEvent, {
      propertyId: "12123",
      roomTypeId: "2",
      ratePlanId: "2",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain("Invalid hotelId");
  });

  it("passes when Axis returns availability rows", async () => {
    vi.mocked(fetchOtaAvailability).mockResolvedValue({
      ok: true,
      days: [{ date: "2026-07-06", free: 1 }],
    });

    const result = await verifyInboundWithAxis(baseEvent, {
      propertyId: "12123",
      roomTypeId: "2",
      ratePlanId: "2",
    });

    expect(result.ok).toBe(true);
  });
});
