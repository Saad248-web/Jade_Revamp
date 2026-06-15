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
import { VILLAS } from "@/lib/mockData";
import { sortVillasForDirectory } from "@/lib/villasDirectoryOrder";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { MenuDesktopCarouselSection } from "@/components/menu/MenuDesktopCarouselSection";
import { MenuMobileImageRail } from "@/components/menu/MenuMobileImageRail";
import { VILLA_DETAIL_SPACING } from "@/components/villa/villaDetailSpacing";
import { GLOBAL_NAVBAR_OFFSET_TOP_CLASS } from "@/lib/scrollChromeLayout";

const vd = VILLA_DETAIL_SPACING;

/** VILLAS hidden from menu villa section only (still bookable via direct URL). */
const MENU_VILLA_EXCLUDED_IDS = new Set(["vannani", "lemon-tree"]);
const MENU_VILLAS = sortVillasForDirectory(
  VILLAS.filter(
    (v) =>
      !MENU_VILLA_EXCLUDED_IDS.has(v.id) &&
      !(v as { hideFromVillasDirectory?: boolean }).hideFromVillasDirectory,
  ),
);

type MenuExperienceItem = {
  title: string;
  type: string;
  href: string;
  desc?: string;
  images: string[];
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
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Outdoor dining.webp",
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Evenings Under the Stars.webp",
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Nature & Nearby Escapes.webp",
      "/Experiences/Weekend Getaways/3-Addons/Bonfire Nights.webp",
      "/Experiences/Weekend Getaways/3-Addons/Candlelight Dinner.webp",
      "/Experiences/Weekend Getaways/3-Addons/Live Music _ DJ.webp",
    ],
  },
  {
    title: "Celebrations & Parties",
    type: "LUXURY PRIVATE STAYS",
    href: "/party-villas",
    desc: "Birthdays, pool parties and bachelor celebrations unfold across private farmhouse villas with pools, open lawns, and entertainment-ready spaces.",
    images: [
      "/Experiences/Party Villas/1-Hero/Pool Parties.webp",
      "/Experiences/Party Villas/2-Party Type/Pool Parties.webp",
      "/Experiences/Party Villas/2-Party Type/Birthdays & Anniversaries.webp",
      "/Experiences/Party Villas/2-Party Type/Bachelor_Bachelorette Parties.webp",
      "/Experiences/Party Villas/3-Addons/DJ & Music Setup.webp",
      "/Experiences/Party Villas/3-Addons/Bonfire Nights.webp",
      "/Experiences/Party Villas/3-Addons/Movie Under The Stars-2.webp",
      "/Experiences/Party Villas/3-Addons/Themed Decor and Styling.webp",
    ],
  },
  {
    title: "Weddings",
    type: "UNFORGETTABLE MOMENTS",
    href: "/weddings",
    desc: "Intimate ceremonies to grand, multi-day wedding celebrations, set amid private gardens, sprawling lawns, and luxury rooms.",
    images: [
      "/Experiences/Weddings/1-Hero/2 (1).webp",
      "/Experiences/Weddings/1-Hero/3.webp",
      "/Experiences/Weddings/2-Venue Images/DIAMOND/10.webp",
      "/Experiences/Weddings/2-Venue Images/DIAMOND/12.webp",
      "/Experiences/Weddings/2-Venue Images/MAGNOLIA/10.webp",
      "/Experiences/Weddings/2-Venue Images/MAGNOLIA/17.webp",
      "/Experiences/Weddings/2-Venue Images/HAVEN/10.webp",
      "/Experiences/Weddings/5-Pre Wedding/Haldi.webp",
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
      "/Experiences/Corporate Retreats/2-Formats/corporate team outings.webp",
      "/Experiences/Corporate Retreats/2-Formats/Conference and....webp",
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
      "/Experiences/Weekend Getaways/3-Addons/Private Chef Experience.webp",
      "/Experiences/Weekend Getaways/3-Addons/Candlelight Dinner.webp",
    ],
  },
  {
    title: "Journeys in Caravans",
    type: "LUXURY ON ROAD",
    href: "/caravans",
    desc: "Luxury motor caravans carry the idea of private retreat onto the road, offering comfort and privacy for glamping, pilgrimages or evolving journeys.",
    images: [
      "/Experiences/Caravan/1-Hero/6.webp",
      "/Experiences/Caravan/1-Hero/14.webp",
      "/Experiences/Caravan/1-Hero/28.webp",
      "/Experiences/Caravan/2-Spaces/11.webp",
      "/Experiences/Caravan/2-Spaces/18.webp",
      "/Experiences/Caravan/2-Spaces/24.webp",
      "/Experiences/Caravan/2-Spaces/29.webp",
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
      "/Experiences/Weekend Getaways/1-Hero/casual stays.webp",
      "/Experiences/Party Villas/1-Hero/Pool Parties.webp",
    ],
  },
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

/** md+ preview column: matches scroll area px-4 / md:px-6 / lg:px-8 */
// On Windows, the vertical scroll container can reserve a small gutter for the scrollbar,
// so we bleed a touch more on the right to visually touch the edge.
const MENU_BLEED_X_DESKTOP =
  "-ml-4 md:-ml-6 lg:-ml-8 -mr-[calc(1rem+0.5rem)] md:-mr-[calc(1.5rem+0.5rem)] lg:-mr-[calc(2rem+0.5rem)] w-[calc(100%+2rem+0.5rem)] md:w-[calc(100%+3rem+0.5rem)] lg:w-[calc(100%+4rem+0.5rem)]";

/** Right-bleed variant (desktop experience row only). */
const MENU_BLEED_RIGHT_DESKTOP = "pr-4 md:pr-6 lg:pr-8";

function MenuExperienceImages({
  exp,
  variant,
}: {
  exp: MenuExperienceItem;
  variant: "mobile" | "desktop";
}) {
  const imgHover = "group-hover/img:scale-105 transition-transform duration-700";

  if (variant === "mobile") {
    return (
      <MenuMobileImageRail>
        {exp.images.map((src, imgIdx) => (
          <Link
            key={`${exp.href}-mobile-${imgIdx}`}
            href={exp.href}
            className="relative h-40 w-[min(58vw,220px)] shrink-0 overflow-hidden"
          >
            <Image
              src={safeMenuImage(src)}
              alt={imgIdx === 0 ? exp.title : `${exp.title} ${imgIdx + 1}`}
              fill
              className="object-cover"
              sizes="280px"
            />
          </Link>
        ))}
      </MenuMobileImageRail>
    );
  }

  return (
    <div className={`flex gap-3 ${MENU_BLEED_RIGHT_DESKTOP}`}>
      {exp.images.map((src, imgIdx) => (
        <Link
          key={`${exp.href}-${imgIdx}`}
          href={exp.href}
          className="group/img relative h-[280px] min-w-0 flex-1 cursor-pointer overflow-hidden"
        >
          <Image
            src={src}
            alt={imgIdx === 0 ? exp.title : `${exp.title} ${imgIdx + 1}`}
            fill
            className={`object-cover ${imgHover}`}
            sizes="30vw"
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
  >("villas");

  const [desktopSelectedView, setDesktopSelectedView] = useState<
    "default" | "villas" | "experiences" | "more"
  >("villas");

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

  /** Primary menu links — 32px on phone/tablet; fluid h2 at lg+ (desktop split). */
  const MENU_PRIMARY_OPTION_TYPE =
    "max-lg:text-[32px] max-lg:leading-[1.1] lg:text-gh-h2 leading-none py-2 font-philosopher font-light";

  const MENU_PRIMARY_STATIC_LINK_CLASS = `${MENU_PRIMARY_OPTION_TYPE} block text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] bg-right transition-all duration-500 ease-out hover:bg-left`;

  /** Mobile secondary panels — Figma page title (Villas / Experiences). */
  const MENU_MOBILE_SECTION_TITLE_CLASS =
    "mb-6 font-philosopher text-[32px] font-light leading-[1.1] text-white capitalize";

  const menuPanelNavLabelClass = (
    section: "villas" | "experiences" | "more",
  ) =>
    `${MENU_PRIMARY_OPTION_TYPE} bg-[length:200%_100%] bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% text-transparent transition-all duration-500 ease-out ${
      desktopSelectedView === section
        ? "bg-left"
        : "bg-right group-hover:bg-left"
    }`;

  const menuPanelNavChevronClass = (
    section: "villas" | "experiences" | "more",
  ) =>
    `max-lg:h-5 max-lg:w-5 h-4 w-4 transition-colors ${
      desktopSelectedView === section
        ? "text-[#EFCD62]"
        : "text-white/50 group-hover:text-[#EFCD62]"
    }`;

  return (
    <main className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-[#1E2023] text-white">
      {/* ── Navigation ── */}
      <Navbar />
      <MobileBottomNav />

      {/* Main content — flex height clears navbar + mobile bottom nav */}
      <div
        className={`relative flex min-h-0 w-full flex-1 flex-col overflow-hidden pt-[48px] pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:flex-row md:pb-0 ${GLOBAL_NAVBAR_OFFSET_TOP_CLASS}`}
      >
        {/* LEFT COLUMN: Main Menu */}
        <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col overflow-x-visible overflow-y-hidden border-r border-transparent max-lg:overflow-y-hidden md:w-[28%] md:max-w-[380px] md:flex-none md:overflow-hidden lg:w-1/4 lg:max-w-[400px] md:border-white/10">
          <AnimatePresence mode="wait">
            {/* Primary Menu: Always visible on desktop, or if menuView is primary on mobile */}
            {(menuView === "primary" || true) && (
              <motion.div
                key="primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`absolute inset-0 flex min-h-0 flex-col py-5 max-lg:pt-7 ${vd.gutterX} ${menuView !== "primary" ? "hidden md:flex" : "flex"}`}
              >
                <span className="mb-0 flex-shrink-0 font-manrope text-gh-label font-bold uppercase tracking-[0.2em] text-white/40 max-lg:mt-1 md:mb-0">
                  MENU
                </span>

                <div
                  className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] touch-pan-y md:overflow-visible"
                  data-lenis-prevent
                >
                <div className="flex min-h-0 flex-1 flex-col justify-start pb-6 md:justify-center md:pb-0">
                <ul className="flex flex-col space-y-2 max-lg:space-y-3 md:space-y-2">
                  <li
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={openVillasSection}
                    onMouseEnter={() => setDesktopHoverView("villas")}
                    onMouseLeave={() =>
                      setDesktopHoverView(desktopSelectedView)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className={menuPanelNavLabelClass("villas")}>
                        Villas
                      </span>
                      <ChevronRight
                        className={menuPanelNavChevronClass("villas")}
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
                      <span className={menuPanelNavLabelClass("experiences")}>
                        Experiences
                      </span>
                      <ChevronRight
                        className={menuPanelNavChevronClass("experiences")}
                      />
                    </div>
                  </li>
                  <li>
                    <Link href="/about">
                      <span className={MENU_PRIMARY_STATIC_LINK_CLASS}>
                        About us
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers">
                      <span className={MENU_PRIMARY_STATIC_LINK_CLASS}>
                        Careers
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blogs">
                      <span className={MENU_PRIMARY_STATIC_LINK_CLASS}>
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
                      <span className={MENU_PRIMARY_STATIC_LINK_CLASS}>
                        Partner with us
                      </span>
                    </button>
                  </li>
                  <li
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => {
                      setMenuView("more");
                      setDesktopSelectedView("more");
                      setDesktopHoverView("more");
                    }}
                    onMouseEnter={() => setDesktopHoverView("more")}
                    onMouseLeave={() =>
                      setDesktopHoverView(desktopSelectedView)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className={menuPanelNavLabelClass("more")}>
                        More
                      </span>
                      <ChevronRight
                        className={menuPanelNavChevronClass("more")}
                      />
                    </div>
                  </li>
                </ul>
                </div>

                <div className="mt-auto flex flex-shrink-0 gap-3 pt-6 pb-2 md:pt-8">
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
                className="absolute inset-0 flex min-h-0 flex-col bg-[#1E2023] pb-4 pt-6 md:hidden"
              >
                <div className="flex-shrink-0 px-6">
                <button
                  onClick={() => setMenuView("primary")}
                  className="mb-5 mt-1 flex w-fit items-center gap-2 font-manrope text-gh-label font-bold uppercase tracking-[0.2em] text-[#EFCD62] transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" /> BACK
                </button>
                <h1 className={MENU_MOBILE_SECTION_TITLE_CLASS}>Villas</h1>
                </div>
                <div
                  className="min-h-0 flex-1 overflow-x-visible overflow-y-auto overscroll-y-contain pb-6 [-webkit-overflow-scrolling:touch]"
                  data-lenis-prevent
                >
                <div className="space-y-6">
                  {MENU_VILLAS.map((villa) => (
                    <div
                      key={villa.id}
                      className="group flex flex-col"
                    >
                      <Link
                        href={`/villas/${villa.id}`}
                        className="cursor-pointer px-6"
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
                      </Link>
                      <MenuMobileImageRail>
                        {getMenuVillaCarouselImages(villa).map((src, imgIdx) => (
                          <Link
                            key={`${villa.id}-${imgIdx}`}
                            href={`/villas/${villa.id}`}
                            className="relative h-40 w-[min(58vw,220px)] shrink-0 overflow-hidden"
                          >
                            <Image
                              src={src}
                              alt={`${villa.name} image ${imgIdx + 1}`}
                              fill
                              className="object-cover"
                              sizes="280px"
                            />
                          </Link>
                        ))}
                      </MenuMobileImageRail>
                    </div>
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
                className="absolute inset-0 flex min-h-0 flex-col bg-[#1E2023] pb-4 pt-6 md:hidden"
              >
                <div className="flex-shrink-0 px-6">
                <button
                  onClick={() => setMenuView("primary")}
                  className="mb-5 mt-1 flex w-fit items-center gap-2 font-manrope text-gh-label font-bold uppercase tracking-[0.2em] text-[#EFCD62] transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" /> BACK
                </button>
                <h1 className={MENU_MOBILE_SECTION_TITLE_CLASS}>Experiences</h1>
                </div>

                <div
                  className="min-h-0 flex-1 overflow-x-visible overflow-y-auto overscroll-y-contain pb-6 [-webkit-overflow-scrolling:touch]"
                  data-lenis-prevent
                >
                <div className="space-y-6">
                  {MENU_EXPERIENCES.map((exp) => (
                    <div key={exp.href + exp.title} className="flex flex-col group">
                      <Link href={exp.href} className="cursor-pointer px-6">
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
                        <Link href={exp.href} className="cursor-pointer px-6">
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
                className="absolute inset-0 flex min-h-0 flex-col bg-[#1E2023] px-6 py-4 md:hidden"
              >
                <button
                  onClick={() => setMenuView("primary")}
                  className="mb-10 flex w-fit items-center gap-2 font-manrope text-gh-label font-bold uppercase tracking-[0.2em] text-[#EFCD62] transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 cursor-pointer" /> BACK
                </button>
                <h2 className="mb-8 flex-shrink-0 font-philosopher text-gh-h1 text-white">
                  More
                </h2>

                <ul
                  className="flex min-h-0 flex-1 flex-col space-y-5 overflow-y-auto overscroll-y-contain pl-4 pb-6 [-webkit-overflow-scrolling:touch] touch-pan-y"
                  data-lenis-prevent
                >
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
        <div className="menu-desktop-preview pointer-events-auto relative hidden h-full min-h-0 flex-1 flex-col md:flex">
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
                key="desktop-VILLAS"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                data-lenis-prevent
                className="pointer-events-auto absolute inset-0 flex min-h-0 flex-col overflow-x-visible overflow-y-hidden"
              >
                <div className="min-h-0 flex-1 touch-pan-y overflow-x-visible overflow-y-auto overscroll-y-contain pb-12 pt-6 [-webkit-overflow-scrolling:touch]">
                  <div className="flex w-full flex-col gap-10 lg:gap-12">
                    {MENU_VILLAS.map((villa, idx) => (
                      <motion.div
                        key={villa.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: Math.min(idx * 0.05, 0.4),
                          duration: 0.35,
                        }}
                      >
                        <MenuDesktopCarouselSection
                          eyebrow={villa.type}
                          title={villa.name}
                          href={`/villas/${villa.id}`}
                          images={getMenuVillaCarouselImages(villa)}
                          imageAltPrefix={villa.name}
                        />
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
                className="pointer-events-auto absolute inset-0 flex min-h-0 flex-col overflow-x-visible overflow-y-hidden"
              >
                <div className="min-h-0 flex-1 touch-pan-y overflow-x-visible overflow-y-auto overscroll-y-contain pb-12 pt-6 [-webkit-overflow-scrolling:touch]">
                  <div className="flex w-full flex-col gap-10 lg:gap-12">
                    {MENU_EXPERIENCES.map((exp, idx) => (
                      <motion.div
                        key={exp.href + exp.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: Math.min(idx * 0.05, 0.4),
                          duration: 0.35,
                        }}
                      >
                        <MenuDesktopCarouselSection
                          eyebrow={exp.type}
                          title={exp.title}
                          href={exp.href}
                          images={exp.images.map(safeMenuImage)}
                          imageAltPrefix={exp.title}
                        />
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
