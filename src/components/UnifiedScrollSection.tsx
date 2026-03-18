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
  {
    lines: [
      "Private villa's transform into",
      "venues for celebration,",
      "immersive retreats, and",
      "bespoke gatherings, adapting",
      "to the moment they are meant",
      "to host.",
    ],
    button: {
      label: "VIEW ALL VILLA RETREATS",
      href: "/villas",
    },
  },
  {
    lines: [
      "From high-energy parties and",
      "destination weddings to",
      "corporate offsites, wellness",
      "retreats, and private",
      "getaways, Jade's spaces are",
      "designed to evolve with every",
      "occasion.",
    ],
    button: {
      label: "VIEW EXPERIENCES AT JADE",
      href: "/experiences",
    },
  },
];

export default function UnifiedScrollSection() {
  return <ScrollSectionComposer slides={slides} height="400vh" />;
}
