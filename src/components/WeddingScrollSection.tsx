"use client";

import ScrollSectionComposer, { ScrollSlide } from "./ScrollSectionComposer";

const slides: ScrollSlide[] = [
  {
    lines: [
      "Hospitainment is the art of",
      "hosting experiences not just",
      "stays. At Jade, hospitality sets",
      "the foundation and",
      "entertainment activates the",
      "space.",
    ],
  },
];

export default function WeddingScrollSection() {
  return <ScrollSectionComposer slides={slides} height="250vh" />;
}
