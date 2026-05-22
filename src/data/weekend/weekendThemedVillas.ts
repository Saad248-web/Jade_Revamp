/** Simple villa cards for the Weekend Getaways themed-villa-retreats section. */

import { domeVillas } from "@/data/retreats/dome";
import { magnolia } from "@/data/retreats/magnolia";
import { haven } from "@/data/retreats/haven";
import { tranquil } from "@/data/retreats/tranquil";

export type WeekendThemedVillaCard = {
  name: string;
  tag: string;
  image: string;
  href: string;
};

export const WEEKEND_THEMED_VILLAS: WeekendThemedVillaCard[] = [
  {
    name: "Dome Villa",
    tag: "HOBBIT-INSPIRED PRIVATE RETREAT",
    image: domeVillas.image,
    href: `/villa-retreats/${domeVillas.id}`,
  },
  {
    name: magnolia.name,
    tag: "CONTEMPORARY GLASS FARM VILLA",
    image: magnolia.image,
    href: `/villa-retreats/${magnolia.id}`,
  },
  {
    name: haven.name,
    tag: "BOUTIQUE LUXURY VILLA",
    image: haven.image,
    href: `/villa-retreats/${haven.id}`,
  },
  {
    name: tranquil.name,
    tag: "FOREST RETREAT",
    image: tranquil.image,
    href: `/villa-retreats/${tranquil.id}`,
  },
];
