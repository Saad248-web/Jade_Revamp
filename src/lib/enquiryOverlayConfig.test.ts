import { describe, expect, it } from "vitest";
import { WEEKEND_GETAWAYS_OCCASION } from "@/lib/enquiryFormOptions";
import {
  getEnquiryOverlayVariant,
  resolveEnquiryVariantId,
} from "@/lib/enquiryOverlayConfig";
import { EXPERIENCE_PAGE_PATHS } from "@/lib/enquiryReturnPath";
import { resolveEnquiryOkayReturnPath } from "@/lib/enquiryReturnPath";

describe("enquiryOverlayConfig", () => {
  it("uses weekend variant from weekend page path", () => {
    expect(resolveEnquiryVariantId(EXPERIENCE_PAGE_PATHS.weekendGetaways)).toBe(
      "weekend-getaways",
    );
    const v = getEnquiryOverlayVariant(EXPERIENCE_PAGE_PATHS.weekendGetaways);
    expect(v.defaultOccasionType).toBe(WEEKEND_GETAWAYS_OCCASION);
    expect(v.leadSource).toBe("weekend_getaways_enquiry");
    expect(v.title).toMatch(/Weekend/i);
  });

  it("OKAY returns to experience page when opened from weekend", () => {
    expect(
      resolveEnquiryOkayReturnPath(EXPERIENCE_PAGE_PATHS.weekendGetaways),
    ).toBe("/weekend-getaways");
  });

  it("OKAY falls back to experiences hub without context", () => {
    expect(resolveEnquiryOkayReturnPath(null)).toBe("/experiences");
  });
});
