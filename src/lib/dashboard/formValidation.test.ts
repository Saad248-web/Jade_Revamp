import { describe, expect, it } from "vitest";
import { validateManualBooking, validateManualBlock } from "./formValidation";

describe("validateManualBooking", () => {
  const base = {
    villaSlug: "magnolia",
    checkIn: "2026-06-24",
    checkOut: "2026-06-27",
    fullName: "Tharun Kumar",
    email: "tharun@gmail.com",
    phone: "9876543210",
    guests: 4,
    maxGuests: 40,
  };

  it("accepts valid input", () => {
    expect(validateManualBooking(base)).toEqual({});
  });

  it("rejects guests above villa max", () => {
    const errors = validateManualBooking({ ...base, guests: 200 });
    expect(errors.guests).toMatch(/Maximum 40/);
  });

  it("rejects invalid date range", () => {
    const errors = validateManualBooking({
      ...base,
      checkOut: "2026-06-24",
    });
    expect(errors.checkOut).toBeDefined();
  });

  it("rejects short phone", () => {
    expect(validateManualBooking({ ...base, phone: "123" }).phone).toBeDefined();
  });
});

describe("validateManualBlock", () => {
  it("rejects overlapping dates", () => {
    const errors = validateManualBlock({
      villaSlug: "magnolia",
      checkIn: "2026-06-27",
      checkOut: "2026-06-24",
      reason: "Owner hold",
    });
    expect(errors.checkOut).toBeDefined();
  });
});
