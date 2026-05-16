"use client";

import ScrollSectionComposer, { ScrollSlide } from "./ScrollSectionComposer";

const slides: ScrollSlide[] = [
  {
    label: "OUR PHILOSOPHY",
    lines: [
      "Hospitainment is the blend of hospitality and entertainment through private, exclusive and experiential retreats.",
      "At Jade, guests enjoy curated villa stays brought to life through culinary, wellness and entertainment experiences.",
    ],
  },
];

export default function UnifiedScrollSection() {
  return (
    <ScrollSectionComposer
      slides={slides}
      height="150vh"
      showScrollIndicator={false}
    />
  );
}

