"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAnimation } from "@/context/AnimationContext";
import {
  ChevronRight,
  ArrowLeft,
  Facebook,
  Instagram,
  Youtube,
  Phone,
} from "lucide-react";
import { VILLAS, CATEGORIES } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import {
  MenuSectionChipTabs,
  MenuVillasExperiencesSwitcher,
  type MenuTabItem,
} from "@/components/menu/MenuPanelTabs";

/** Villas hidden from menu villa section only (still bookable via direct URL). */
const MENU_VILLA_EXCLUDED_IDS = new Set(["vannani", "lemon-tree"]);
const MENU_VILLAS = VILLAS.filter(
  (v) =>
    !MENU_VILLA_EXCLUDED_IDS.has(v.id) &&
    !(v as { hideFromVillasDirectory?: boolean }).hideFromVillasDirectory,
);

/** Canonical landing route per villa directory category (matches site experience pages). */
function villaCategoryHref(category: string): string {
  const dedicated: Record<string, string> = {
    All: "/villas",
    Weddings: "/weddings",
    "Pre-wedding": "/weddings",
    "Corporate Retreats": "/corporate-retreats",
    "Weekend Getaways": "/weekend-getaways",
    "Party Venues": "/party-villas",
    "Wellness Retreats": "/villas?category=Wellness Retreats",
  };
  if (dedicated[category]) return dedicated[category];
  return `/villas?category=${encodeURIComponent(category)}`;
}

const MENU_VILLA_CATEGORY_TABS: MenuTabItem[] = CATEGORIES.filter(
  (cat) =>
    cat === "All" ||
    MENU_VILLAS.some((v) =>
      v.categories?.some((c: string) => c.toLowerCase() === cat.toLowerCase()),
    ),
).map((cat) => ({
  id: cat,
  label: cat,
  href: villaCategoryHref(cat),
}));

type MenuExperienceItem = {
  title: string;
  type: string;
  href: string;
  desc?: string;
  images: [string, string];
};

/** Aligned with ExperiencesScrollSection / HorizontalScrollSection canonical routes. */
const MENU_EXPERIENCES: MenuExperienceItem[] = [
  {
    title: "Weekend Getaways",
    type: "JOURNEY OF WELLNESS",
    href: "/weekend-getaways",
    desc: "A day or two with your friends and family away from the bustling city in the wilderness is truly on everyone's wishlist.",
    images: [
      "/Experiences/Weekend Getaways/1-Hero/casual stays.webp",
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Poolside Mornings.webp",
    ],
  },
  {
    title: "Celebrations & Parties",
    type: "LUXURY PRIVATE STAYS",
    href: "/party-villas",
    desc: "Birthdays, pool parties and bachelor celebrations unfold across private farmhouse villas with pools, open lawns, and entertainment-ready spaces.",
    images: [
      "/Experiences/Party Villas/1-Hero/Pool Parties.webp",
      "/Experiences/Party Villas/3-Addons/Movie Under The Stars-2.webp",
    ],
  },
  {
    title: "Weddings",
    type: "UNFORGETTABLE MOMENTS",
    href: "/weddings",
    desc: "Intimate ceremonies to grand, multi-day wedding celebrations, set amid private gardens, sprawling lawns, and luxury rooms.",
    images: [
      "/Experiences/Weddings/1-Hero/2 (1).webp",
      "/Experiences/Weddings/2-Venue Images/DIAMOND/10.webp",
    ],
  },
  {
    title: "Corporate Offsites",
    type: "JOURNEY OF TEAMWORK",
    href: "/corporate-retreats",
    desc: "Unwinding and ice-breaking sessions with colleagues, away from cubicles and glass walls, in private farmhouses ideal for offsites or workations.",
    images: [
      "/Experiences/Corporate Retreats/1-Hero/xhero.webp",
      "/Experiences/Corporate Retreats/2-Formats/offsite and work....webp",
    ],
  },
  {
    title: "Wellness Retreats",
    type: "PURE REJUVENATION",
    href: "/villas?category=Wellness Retreats",
    desc: "Element-led wellness restoration through mud baths, massages, spa and aroma therapies, designed for deep rejuvenation.",
    images: [
      "/Home Page/2-Experiences/Wellness.webp",
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Nature & Nearby Escapes.webp",
    ],
  },
  {
    title: "Journeys in Caravans",
    type: "LUXURY ON ROAD",
    href: "/caravans",
    desc: "Luxury motor caravans carry the idea of private retreat onto the road, offering comfort and privacy for glamping, pilgrimages or evolving journeys.",
    images: [
      "/Experiences/Caravan/1-Hero/6.webp",
      "/Experiences/Caravan/2-Spaces/11.webp",
    ],
  },
  {
    title: "Private Villas",
    type: "CURATED COLLECTION",
    href: "/villas",
    desc: "A curated collection of fully private farmhouses, suited for everything from quiet stays to vibrant celebrations and bespoke experiences.",
    images: [
      "/Villa_Retreats/Magnolia/Hero/hero.webp",
      "/Villa_Retreats/Magnolia/Hero/Hero 1.webp",
    ],
  },
];

const MENU_EXPERIENCE_TABS: MenuTabItem[] = [
  { id: "all", label: "All", href: "/experiences" },
  ...MENU_EXPERIENCES.map((exp) => ({
    id: exp.href,
    label: exp.title,
    href: exp.href,
  })),
];

const FALLBACK_MENU_IMAGE = "/Villa_Retreats/Magnolia/Hero/Hero 1.webp";
function safeMenuImage(src?: string) {
  return src && src.trim().length > 0 ? src : FALLBACK_MENU_IMAGE;
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function getMenuVillaCarouselImages(villa: any) {
  const all: string[] = Array.isArray(villa?.images)
    ? villa.images
    : uniq([
        villa?.image,
        ...(Array.isArray(villa?.spaces) ? villa.spaces.map((s: any) => s?.image) : []),
      ]).filter(Boolean);

  const isHero = (p: string) => /\/hero\//i.test(p) || /\/1-hero\//i.test(p);
  const isSpace = (p: string) =>
    /\/spaces\//i.test(p) || /\/2-spaces\//i.test(p) || /\/space\//i.test(p);

  const heroes = all.filter((p) => typeof p === "string" && isHero(p));
  if (heroes.length >= 2) return uniq(heroes).map(safeMenuImage);

  const spaces = all.filter((p) => typeof p === "string" && isSpace(p));
  const fallback = all.filter((p) => typeof p === "string");

  // If only 0-1 hero image exists, append a few space images (or any other images).
  const combined = uniq([
    ...heroes,
    ...spaces.slice(0, 6),
    ...fallback.slice(0, 6),
  ]).slice(0, 10);

  return combined.map(safeMenuImage);
}

/** < md: full-width phone panels use px-6 */
const MENU_BLEED_RIGHT_MOBILE = "-mr-6 w-[calc(100%+1.5rem)]";
/** md+ preview column: matches scroll area px-4 / md:px-6 / lg:px-8 */
const MENU_BLEED_RIGHT_DESKTOP =
  "-mr-4 md:-mr-6 lg:-mr-8 w-[calc(100%+1rem)] md:w-[calc(100%+1.5rem)] lg:w-[calc(100%+2rem)]";

function MenuExperienceImages({
  exp,
  variant,
}: {
  exp: MenuExperienceItem;
  variant: "mobile" | "desktop";
}) {
  const bleed =
    variant === "mobile" ? MENU_BLEED_RIGHT_MOBILE : MENU_BLEED_RIGHT_DESKTOP;
  const height = variant === "mobile" ? "h-28" : "h-[280px]";
  const gap = variant === "mobile" ? "gap-2" : "gap-3";
  const imgHover =
    variant === "desktop"
      ? "group-hover/img:scale-105 transition-transform duration-700"
      : "";

  return (
    <div className={`flex ${gap} ${bleed}`}>
      {exp.images.map((src, imgIdx) => (
        <Link
          key={`${exp.href}-${imgIdx}`}
          href={exp.href}
          className={`relative ${height} min-w-0 flex-1 overflow-hidden ${variant === "desktop" ? "cursor-pointer group/img" : ""}`}
        >
          <Image
            src={src}
            alt={imgIdx === 0 ? exp.title : `${exp.title} ${imgIdx + 1}`}
            fill
            className={`object-cover ${imgHover}`}
            sizes={
              variant === "mobile"
                ? "(max-width: 1024px) 50vw, 33vw"
                : "30vw"
            }
          />
        </Link>
      ))}
    </div>
  );
}

export default function MenuPage() {
  const { setPartnerOverlayOpen } = useAnimation();

  // Local state for driving secondary menus (mobile)
  const [menuView, setMenuView] = useState<
    "primary" | "villas" | "experiences" | "more"
  >("primary");

  // Local state for Desktop split view hover
  const [desktopHoverView, setDesktopHoverView] = useState<
    "default" | "villas" | "experiences" | "more"
  >("default");

  const [desktopSelectedView, setDesktopSelectedView] = useState<
    "default" | "villas" | "experiences" | "more"
  >("default");

  const openVillasSection = () => {
    setMenuView("villas");
    setDesktopSelectedView("villas");
    setDesktopHoverView("villas");
  };

  const openExperiencesSection = () => {
    setMenuView("experiences");
    setDesktopSelectedView("experiences");
    setDesktopHoverView("experiences");
  };

  return (
    <main className="relative min-h-screen bg-[#1E2023] text-white pb-16 md:pb-0">
      {/* ── Navigation ── */}
      <Navbar />
      <MobileBottomNav />

      {/* Main content wrapper with top padding for navbar */}
      <div className="w-full h-[100svh] min-h-0 flex flex-col md:flex-row relative pt-[48px] md:pt-[64px] overflow-hidden">
        {/* LEFT COLUMN: Main Menu */}
        <div className="flex-1 min-h-0 md:flex-none md:w-1/3 relative overflow-hidden h-full z-10 border-r border-transparent md:border-white/10">
          <AnimatePresence mode="wait">
            {/* Primary Menu: Always visible on desktop, or if menuView is primary on mobile */}
            {(menuView === "primary" || true) && (
              <motion.div
                key="primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`absolute inset-0 flex flex-col min-h-0 overflow-hidden px-6 md:px-12 py-4 ${menuView !== "primary" ? "hidden md:flex" : "flex"}`}
              >
                <span className="text-white/40 text-gh-label font-manrope font-bold tracking-[0.2em] uppercase mb-5 flex-shrink-0">
                  MENU
                </span>

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain flex flex-col" data-lenis-prevent>
                <ul className="flex flex-col space-y-2.5 md:space-y-3 pb-4">
                  <li
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={openVillasSection}
                    onMouseEnter={() => setDesktopHoverView("villas")}
                    onMouseLeave={() =>
                      setDesktopHoverView(desktopSelectedView)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-gh-h2 lg:text-gh-h2 leading-none py-2 font-philosopher font-light text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] transition-all duration-500 ease-out group-hover:bg-left ${ desktopSelectedView === "villas" ? "bg-left text-[#EFCD62]" : "bg-right" }`}
                      >
                        Villas
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-colors ${ desktopSelectedView === "villas" ? "text-[#EFCD62]" : "text-white/50 group-hover:text-[#EFCD62]" }`}
                      />
                    </div>
                  </li>
                  <li
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={openExperiencesSection}
                    onMouseEnter={() => setDesktopHoverView("experiences")}
                    onMouseLeave={() =>
                      setDesktopHoverView(desktopSelectedView)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-gh-h2 lg:text-gh-h2 leading-none py-2 font-philosopher font-light text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] transition-all duration-500 ease-out group-hover:bg-left ${ desktopSelectedView === "experiences" ? "bg-left text-[#EFCD62]" : "bg-right" }`}
                      >
                        Experiences
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-colors ${ desktopSelectedView === "experiences" ? "text-[#EFCD62]" : "text-white/50 group-hover:text-[#EFCD62]" }`}
                      />
                    </div>
                  </li>
                  <li>
                    <Link href="/about">
                      <span className="block text-gh-h2 lg:text-gh-h2 leading-none py-2 font-philosopher font-light text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] bg-right hover:bg-left transition-all duration-500 ease-out">
                        About us
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers">
                      <span className="block text-gh-h2 lg:text-gh-h2 leading-none py-2 font-philosopher font-light text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] bg-right hover:bg-left transition-all duration-500 ease-out">
                        Careers
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blogs">
                      <span className="block text-gh-h2 lg:text-gh-h2 leading-none py-2 font-philosopher font-light text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] bg-right hover:bg-left transition-all duration-500 ease-out">
                        Blogs
                      </span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setPartnerOverlayOpen(true);
                      }}
                      className="text-left"
                    >
                      <span className="block text-gh-h2 lg:text-gh-h2 leading-none py-2 font-philosopher font-light text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] bg-right hover:bg-left transition-all duration-500 ease-out">
                        Partner with us
                      </span>
                    </button>
                  </li>
                  <li
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => {
                      setMenuView("more");
                      setDesktopSelectedView("more");
                    }}
                    onMouseEnter={() => setDesktopHoverView("more")}
                    onMouseLeave={() =>
                      setDesktopHoverView(desktopSelectedView)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-gh-h2 lg:text-gh-h2 leading-none py-2 font-philosopher font-light text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] transition-all duration-500 ease-out group-hover:bg-left ${ desktopSelectedView === "more" ? "bg-left text-[#EFCD62]" : "bg-right" }`}
                      >
                        More
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-colors ${ desktopSelectedView === "more" ? "text-[#EFCD62]" : "text-white/50 group-hover:text-[#EFCD62]" }`}
                      />
                    </div>
                  </li>
                </ul>

                <div className="flex gap-3 flex-shrink-0 pt-8 mt-auto">
                  {[
                    {
                      Icon: Facebook,
                      href: "https://www.facebook.com/jadehospitainment/",
                    },
                    {
                      Icon: Instagram,
                      href: "https://www.instagram.com/jadehospitainment/?hl=en",
                    },
                    {
                      Icon: Youtube,
                      href: "https://www.youtube.com/@jade_hospitainment",
                    },
                  ].map(({ Icon, href }, idx) => (
                    <a
                      key={idx}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                  <a
                    href="tel:08970663366"
                    className="w-10 h-10 border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
                </div>
              </motion.div>
            )}

            {/* MOBILE SECONDARY VIEWS */}
            {menuView === "villas" && (
              <motion.div
                key="villas"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex md:hidden flex-col min-h-0 overflow-hidden px-6 py-4 bg-[#1E2023]"
              >
                <button
                  onClick={() => setMenuView("primary")}
                  className="flex-shrink-0 flex items-center gap-2 text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase mb-4 hover:text-white transition-colors w-fit"
                >
                  <ArrowLeft className="w-4 h-4" /> BACK
                </button>
                <MenuVillasExperiencesSwitcher
                  active="villas"
                  onVillas={openVillasSection}
                  onExperiences={openExperiencesSection}
                />
                <div className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-y-contain pb-24" data-lenis-prevent>
                <MenuSectionChipTabs
                  tabs={MENU_VILLA_CATEGORY_TABS}
                  bleedClassName={MENU_BLEED_RIGHT_MOBILE}
                />
                <div className="space-y-6 pr-1">
                  {MENU_VILLAS.map((villa) => (
                    <Link
                      key={villa.id}
                      href={`/villas/${villa.id}`}
                      className="flex flex-col cursor-pointer group"
                    >
                      <p className="text-white/40 text-[10px] font-manrope font-medium tracking-[0.2em] uppercase mb-1">
                        {villa.type}
                      </p>
                      <div className="flex items-center justify-between mb-2.5">
                        <h3
                          style={{ fontWeight: 200 }}
                          className="text-gh-scroll font-manrope text-white group-hover:text-[#EFCD62] transition-colors leading-none tracking-wide"
                        >
                          {villa.name}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-[#EFCD62] transition-colors" />
                      </div>
                      <div className={`${MENU_BLEED_RIGHT_MOBILE} overflow-x-auto hide-scrollbar`}>
                        <div className="flex gap-2 w-max">
                          {getMenuVillaCarouselImages(villa).map((src, imgIdx) => (
                            <div
                              key={`${villa.id}-${imgIdx}`}
                              className="relative h-36 w-[280px] shrink-0 overflow-hidden"
                            >
                              <Image
                                src={src}
                                alt={`${villa.name} image ${imgIdx + 1}`}
                                fill
                                className="object-cover"
                                sizes="280px"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                </div>
              </motion.div>
            )}

            {menuView === "experiences" && (
              <motion.div
                key="experiences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex md:hidden flex-col min-h-0 overflow-hidden px-6 py-4 bg-[#1E2023]"
              >
                <button
                  onClick={() => setMenuView("primary")}
                  className="flex-shrink-0 flex items-center gap-2 text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase mb-4 hover:text-white transition-colors w-fit"
                >
                  <ArrowLeft className="w-4 h-4" /> BACK
                </button>
                <MenuVillasExperiencesSwitcher
                  active="experiences"
                  onVillas={openVillasSection}
                  onExperiences={openExperiencesSection}
                />

                <div className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-y-contain pb-24" data-lenis-prevent>
                <MenuSectionChipTabs
                  tabs={MENU_EXPERIENCE_TABS}
                  bleedClassName={MENU_BLEED_RIGHT_MOBILE}
                />
                <div className="space-y-6 pr-1">
                  {MENU_EXPERIENCES.map((exp) => (
                    <div key={exp.href + exp.title} className="flex flex-col group">
                      <Link href={exp.href} className="cursor-pointer">
                        <p className="text-white/40 text-[10px] font-manrope font-medium tracking-[0.2em] uppercase mb-1">
                          {exp.type}
                        </p>
                        <div className="flex items-center justify-between mb-1">
                          <h3
                            style={{ fontWeight: 200 }}
                            className="text-gh-scroll font-manrope text-white group-hover:text-[#EFCD62] transition-colors tracking-wide"
                          >
                            {exp.title}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-[#EFCD62] transition-colors" />
                        </div>
                      </Link>
                      {exp.desc ? (
                        <Link href={exp.href} className="cursor-pointer">
                          <p className="text-white/50 text-gh-label font-manrope mb-2.5 leading-relaxed group-hover:text-[#EFCD62]/70 transition-colors">
                            {exp.desc}
                          </p>
                        </Link>
                      ) : (
                        <div className="mb-2.5" />
                      )}
                      <MenuExperienceImages exp={exp} variant="mobile" />
                    </div>
                  ))}
                </div>
                </div>
              </motion.div>
            )}

            {menuView === "more" && (
              <motion.div
                key="more"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex md:hidden flex-col min-h-0 overflow-hidden px-6 py-4 bg-[#1E2023]"
              >
                <button
                  onClick={() => setMenuView("primary")}
                  className="flex items-center gap-2 text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase mb-10 hover:text-white transition-colors w-fit"
                >
                  <ArrowLeft className="w-4 h-4 cursor-pointer" /> BACK
                </button>
                <h2 className="text-gh-h1 font-philosopher text-white mb-8 flex-shrink-0">
                  More
                </h2>

                <ul className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain flex flex-col space-y-5 pl-4 pb-24" data-lenis-prevent>
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="block text-[14px] font-manrope text-white/70 hover:text-[#EFCD62] transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-conditions"
                      className="block text-[14px] font-manrope text-white/70 hover:text-[#EFCD62] transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/refund-policy"
                      className="block text-[14px] font-manrope text-white/70 hover:text-[#EFCD62] transition-colors"
                    >
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Tablet/desktop previews (md+) */}
        <div className="hidden md:flex flex-1 min-h-0 relative h-full overflow-hidden pointer-events-auto md:p-8 lg:p-12">
          <AnimatePresence mode="wait">
            {(desktopHoverView === "default"
              ? desktopSelectedView
              : desktopHoverView) === "default" && (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="relative w-full max-w-[500px] aspect-square opacity-5">
                  <Image
                    src="/assets/Golden_Logo.png"
                    alt="Jade"
                    fill
                    className="object-contain"
                    sizes="500px"
                    priority
                  />
                </div>
              </motion.div>
            )}

            {(desktopHoverView === "default"
              ? desktopSelectedView
              : desktopHoverView) === "villas" && (
              <motion.div
                key="desktop-villas"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                data-lenis-prevent
                className="absolute inset-0 flex flex-col min-h-0 overflow-hidden pointer-events-auto"
              >
                <div className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-y-contain px-4 md:px-6 lg:px-8 pt-5 pb-20">
                <MenuSectionChipTabs
                  tabs={MENU_VILLA_CATEGORY_TABS}
                  bleedClassName={MENU_BLEED_RIGHT_DESKTOP}
                  className="-mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8"
                />
                <div className="w-full space-y-12">
                  {MENU_VILLAS.map((villa, idx) => (
                    <motion.div
                      key={villa.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.4), duration: 0.35 }}
                      className="w-full flex flex-col group"
                    >
                      <div className="flex justify-between items-start mb-5 pr-2">
                        <Link
                          href={`/villas/${villa.id}`}
                          className="flex flex-col cursor-pointer"
                        >
                          <p className="text-white/40 text-gh-label uppercase font-manrope font-medium tracking-[0.2em] mb-1.5">
                            {villa.type}
                          </p>
                          <div className="flex items-center gap-2 group/title">
                            <h3
                              style={{ fontWeight: 200 }}
                              className="text-gh-scroll lg:text-gh-h2 font-manrope text-white transition-colors capitalize tracking-wide"
                            >
                              {villa.name}
                            </h3>
                            <ChevronRight className="w-5 h-5 text-white/50 group-hover/title:text-[#EFCD62] transition-colors" />
                          </div>
                        </Link>
                      </div>

                      <div className={`${MENU_BLEED_RIGHT_DESKTOP} overflow-x-auto hide-scrollbar`}>
                        <div className="flex gap-3 w-max">
                          {getMenuVillaCarouselImages(villa).map((src, imgIdx) => (
                            <Link
                              key={`${villa.id}-desktop-${imgIdx}`}
                              href={`/villas/${villa.id}`}
                              className="relative h-[280px] w-[420px] shrink-0 overflow-hidden cursor-pointer group/img"
                            >
                              <Image
                                src={src}
                                alt={`${villa.name} image ${imgIdx + 1}`}
                                fill
                                className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                                sizes="420px"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                </div>
              </motion.div>
            )}

            {(desktopHoverView === "default"
              ? desktopSelectedView
              : desktopHoverView) === "experiences" && (
              <motion.div
                key="desktop-experiences"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                data-lenis-prevent
                className="absolute inset-0 flex flex-col min-h-0 overflow-hidden pointer-events-auto"
              >
                <div className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-y-contain px-4 md:px-6 lg:px-8 pt-5 pb-20">
                <MenuSectionChipTabs
                  tabs={MENU_EXPERIENCE_TABS}
                  bleedClassName={MENU_BLEED_RIGHT_DESKTOP}
                  className="-mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8"
                />
                <div className="w-full space-y-12">
                  {MENU_EXPERIENCES.map((exp, idx) => (
                    <motion.div
                      key={exp.href + exp.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.4), duration: 0.35 }}
                      className="w-full flex flex-col group"
                    >
                      <div className="flex justify-between items-start mb-5 pr-2">
                        <Link
                          href={exp.href}
                          className="flex flex-col cursor-pointer"
                        >
                          <p className="text-white/40 text-gh-label uppercase font-manrope font-bold tracking-[0.2em] mb-1.5 group-hover:text-[#EFCD62]/60 transition-colors">
                            {exp.type}
                          </p>
                          <div className="flex items-center gap-2 group/title">
                            <h3
                              style={{ fontWeight: 200 }}
                              className="text-gh-scroll lg:text-gh-h2 font-manrope text-white group-hover:text-[#EFCD62] transition-colors tracking-wide"
                            >
                              {exp.title}
                            </h3>
                            <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-[#EFCD62] transition-colors" />
                          </div>
                        </Link>
                      </div>

                      <MenuExperienceImages exp={exp} variant="desktop" />
                    </motion.div>
                  ))}
                </div>
                </div>
              </motion.div>
            )}
            {(desktopHoverView === "default"
              ? desktopSelectedView
              : desktopHoverView) === "more" && (
              <motion.div
                key="desktop-more"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center p-12 pointer-events-auto overflow-hidden bg-[#1E2023]"
              >
                <div className="w-full h-full flex items-center gap-12 max-w-6xl">
                  {/* Links Section */}
                  <div className="flex-[1.2] flex flex-col gap-8">
                    {[
                      { name: "Privacy Policy", href: "/privacy-policy" },
                      { name: "Terms & Conditions", href: "/terms-conditions" },
                      { name: "Refund Policy", href: "/refund-policy" },
                    ].map((policy, idx) => (
                      <Link
                        key={idx}
                        href={policy.href}
                        className="group flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EFCD62] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-gh-scroll font-manrope text-white/50 group-hover:text-white transition-all transform group-hover:translate-x-2">
                          {policy.name}
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Banner Image Section */}
                  <div className="flex-[2] relative h-[400px] overflow-hidden group/banner shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
                    <Image
                      src={FALLBACK_MENU_IMAGE}
                      alt="Jade Banner"
                      fill
                      className="object-cover opacity-60 group-hover/banner:scale-105 group-hover/banner:opacity-100 transition-all duration-1000 grayscale group-hover/banner:grayscale-0"
                      sizes="40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-40 h-40 opacity-20 group-hover/banner:opacity-40 transition-opacity duration-700">
                        <Image
                          src="/assets/White_Logo.png"
                          alt="Jade logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
