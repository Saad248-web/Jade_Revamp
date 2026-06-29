import { describe, expect, it } from "vitest";
import {
  isHiddenFromVillasDirectory,
  isVillaPubliclyHidden,
  isVillaRecordBookable,
  syncVillaVisibilityFlags,
} from "./villaVisibility";

describe("villaVisibility", () => {
  it("hides from directory when status is hidden", () => {
    expect(isHiddenFromVillasDirectory({ status: "hidden" })).toBe(true);
  });

  it("shows not-bookable villas on directory", () => {
    expect(
      isHiddenFromVillasDirectory({ status: "active", bookable: false }),
    ).toBe(false);
  });

  it("respects explicit hideFromVillasDirectory flag", () => {
    expect(
      isHiddenFromVillasDirectory({
        status: "active",
        content: { hideFromVillasDirectory: true },
      }),
    ).toBe(true);
  });

  it("404 public detail when hidden", () => {
    expect(isVillaPubliclyHidden({ status: "hidden" })).toBe(true);
    expect(isVillaPubliclyHidden({ status: "active" })).toBe(false);
  });

  it("bookable flag drives CTA", () => {
    expect(isVillaRecordBookable({ id: "x", bookable: true })).toBe(true);
    expect(isVillaRecordBookable({ id: "x", bookable: false })).toBe(false);
  });

  it("sync forces hidden flags on save", () => {
    const villa = {
      status: "hidden",
      bookable: true,
      content: {} as Record<string, unknown>,
    };
    syncVillaVisibilityFlags(villa);
    expect(villa.bookable).toBe(false);
    expect(villa.content?.hideFromVillasDirectory).toBe(true);
  });
});
