import { describe, expect, it } from "vitest";
import {
  enquiryFieldErrors,
  footerFieldErrors,
  isEnquiryFormValid,
  validateGuestCount,
} from "@/lib/leadFormValidation";

describe("leadFormValidation", () => {
  it("enquiryFieldErrors flags empty email", () => {
    const errs = enquiryFieldErrors(
      {
        fullName: "Asha Verma",
        phoneNumber: "9876543210",
        email: "",
        guests: "4",
        occasionType: "Wedding",
      },
      new Date(2026, 5, 1),
    );
    expect(errs.email).toBe("Please enter your email address.");
  });

  it("footerFieldErrors requires check-in date", () => {
    const errs = footerFieldErrors(
      {
        fullName: "Asha Verma",
        phoneNumber: "9876543210",
        noOfGuests: "4",
        occasionType: "Wedding",
      },
      null,
      true,
    );
    expect(errs.preferredDate).toBeDefined();
  });

  it("isEnquiryFormValid is false without date", () => {
    expect(
      isEnquiryFormValid(
        {
          fullName: "Asha Verma",
          phoneNumber: "9876543210",
          email: "a@b.com",
          guests: "2",
          occasionType: "Wedding",
        },
        null,
      ),
    ).toBe(false);
  });

  it("validateGuestCount rejects zero", () => {
    expect(validateGuestCount("0")).toBeDefined();
  });
});
