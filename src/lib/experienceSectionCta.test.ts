import { describe, expect, it } from "vitest";
import {
  EXPERIENCE_SECTION_CTA_BUTTON_CLASS,
  EXPERIENCE_SECTION_CTA_CONTAINER_CLASS,
  EXPERIENCE_SECTION_CTA_DIMENSIONS_MD,
} from "@/lib/experienceSectionCta";

describe("experienceSectionCta tokens", () => {
  it("keeps mobile full-width 54px height", () => {
    expect(EXPERIENCE_SECTION_CTA_BUTTON_CLASS).toContain("w-full");
    expect(EXPERIENCE_SECTION_CTA_BUTTON_CLASS).toContain("h-[54px]");
  });

  it("standardizes desktop height and padding", () => {
    expect(EXPERIENCE_SECTION_CTA_BUTTON_CLASS).toContain("md:h-[56px]");
    expect(EXPERIENCE_SECTION_CTA_BUTTON_CLASS).toContain("md:px-10");
    expect(EXPERIENCE_SECTION_CTA_BUTTON_CLASS).toContain("lg:px-12");
    expect(EXPERIENCE_SECTION_CTA_BUTTON_CLASS).toContain("md:min-w-[22rem]");
  });

  it("centers CTAs in a shared lane on desktop", () => {
    expect(EXPERIENCE_SECTION_CTA_CONTAINER_CLASS).toContain("flex");
    expect(EXPERIENCE_SECTION_CTA_CONTAINER_CLASS).toContain("justify-center");
    expect(EXPERIENCE_SECTION_CTA_CONTAINER_CLASS).toContain("md:max-w-xl");
  });

  it("aligns glass CTA dimensions with PrimaryButton at md+", () => {
    expect(EXPERIENCE_SECTION_CTA_DIMENSIONS_MD).toContain("md:h-[56px]");
    expect(EXPERIENCE_SECTION_CTA_DIMENSIONS_MD).toContain("md:min-w-[22rem]");
  });
});
