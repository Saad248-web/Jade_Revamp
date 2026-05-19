import type { LucideIcon } from "lucide-react";
import {
  Bath,
  Bell,
  Car,
  ChefHat,
  Coffee,
  Dribbble,
  HandPlatter,
  Heart,
  Home,
  Info,
  LayoutGrid,
  Leaf,
  Mic,
  Music,
  Mountain,
  PartyPopper,
  Phone,
  Presentation,
  Search,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Sun,
  Trees,
  User,
  Waves,
  Wind,
  Zap,
  Check,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Wifi: Wind,
  Car,
  Wind,
  Waves,
  Dribbble,
  Presentation,
  Trees,
  Mountain,
  PartyPopper,
  Bath,
  Home,
  Sun,
  ChefHat,
  SprayCan,
  User,
  Phone,
  Check,
  Zap,
  LayoutGrid,
  Leaf,
  HandPlatter,
  Bell,
  Sparkles,
  ShieldCheck,
  Heart,
  Coffee,
  Search,
  Mic,
  Music,
};

export function getVillaDetailIcon(iconName?: string, title?: string) {
  const name = iconName?.toLowerCase() || "";
  const t = title?.toLowerCase() || "";

  if (iconName && ICONS[iconName]) return ICONS[iconName];

  if (name.includes("chef") || t.includes("chef") || t.includes("cooking"))
    return ChefHat;
  if (name.includes("butler") || t.includes("butler") || t.includes("service"))
    return HandPlatter;
  if (
    name.includes("housekeeping") ||
    t.includes("housekeeping") ||
    t.includes("cleaning")
  )
    return Sparkles;
  if (
    name.includes("concierge") ||
    t.includes("concierge") ||
    t.includes("help") ||
    t.includes("phone")
  )
    return Bell;
  if (name.includes("security") || t.includes("security")) return ShieldCheck;
  if (name.includes("wellness") || t.includes("wellness") || t.includes("spa"))
    return Heart;
  if (
    name.includes("breakfast") ||
    t.includes("breakfast") ||
    t.includes("coffee")
  )
    return Coffee;

  return Info;
}

export function splitAmenityLabel(label: string) {
  const words = label.trim().split(/\s+/);
  if (words.length <= 1) return { line1: label, line2: "" };
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(" "),
    line2: words.slice(mid).join(" "),
  };
}
