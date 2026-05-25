"use client";

import ScrollSectionComposer, { ScrollSlide } from "./ScrollSectionComposer";
import LiveBackground from "./LiveBackground";

const slides: ScrollSlide[] = [
  {
    label: "OUR PHILOSOPHY",
    lines: [
      "Hospitainment is the blend of hospitality and entertainment through private, exclusive and experiential retreats.",
      "At Jade, guests enjoy curated villa stays brought to life through culinary, wellness and entertainment experiences.",
    ],
  },
];

/** Home page section 2 — philosophy scroll panel (OUR PHILOSOPHY). */
export default function UnifiedScrollSection() {
  return (
    <ScrollSectionComposer
      slides={slides}
      height="260vh"
      fadeTiming="early"
      scrollEffects="performance"
      background={<LiveBackground variant="static" />}
      showScrollIndicator
      scrollIndicatorText="SCROLL TO EXPERIENCES"
    />
  );
}

