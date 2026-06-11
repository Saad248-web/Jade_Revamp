import { describe, expect, it } from "vitest";
import { spaceMatchesCategory, villaMatchesCategory } from "@/lib/villaCategoryMatch";

describe("villaMatchesCategory", () => {
  it("matches categories on the villa record", () => {
    expect(
      villaMatchesCategory(
        { categories: ["Luxury Stays", "Weekend Getaways"] },
        "Luxury Stays",
      ),
    ).toBe(true);
  });

  it("matches perfectForTags via alias map", () => {
    expect(
      villaMatchesCategory(
        {
          categories: ["Luxury Stays"],
          perfectForTags: ["Boutique Stays", "Family Gatherings"],
        },
        "Weekend Getaways",
      ),
    ).toBe(true);
  });

  it("matches perfectForCards titles", () => {
    expect(
      villaMatchesCategory(
        {
          perfectForCards: [{ title: "Corporate Outings", image: "" }],
        },
        "Corporate Retreats",
      ),
    ).toBe(true);
  });

  it("returns true for All", () => {
    expect(villaMatchesCategory({ categories: [] }, "All")).toBe(true);
  });
});

describe("spaceMatchesCategory", () => {
  it("matches case-insensitively", () => {
    expect(
      spaceMatchesCategory("Views & Exteriors", "views & exteriors"),
    ).toBe(true);
  });
});
