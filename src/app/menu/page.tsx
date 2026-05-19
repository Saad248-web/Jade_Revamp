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
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";

type MenuExperienceItem = {
  title: string;
  type: string;
  href: string;
  desc?: string;
  images: [string, string];
};

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
    desc: "Birthdays, pool or bachelor parties unfold across private farmhouse villas with pools, open lawns and entertainment-ready spaces.",
    images: [
      "/Experiences/Party Villas/1-Hero/Pool Parties.webp",
      "/Experiences/Party Villas/3-Addons/Movie Under The Stars-2.webp",
    ],
  },
  {
    title: "Wedding Celebrations",
    type: "UNFORGETTABLE MOMENTS",
    href: "/weddings",
    desc: "Say 'I do' under the stars in sprawling lawns or intimate poolside setups designed just for you.",
    images: [
      "/Experiences/Weddings/1-Hero/3.webp",
      "/Experiences/Weddings/2-Venue Images/DIAMOND/10.webp",
    ],
  },
  {
    title: "Corporate Offsites",
    type: "JOURNEY OF TEAMWORK",
    href: "/corporate-retreats",
    images: [
      "/Experiences/Corporate Retreats/1-Hero/xhero.webp",
      "/Experiences/Corporate Retreats/2-Formats/offsite and work....webp",
    ],
  },
  {
    title: "Wellness Retreats",
    type: "PURE REJUVENATION",
    href: "/weekend-getaways",
    images: [
      "/Experiences/Weekend Getaways/3-Addons/Private Chef Experience.webp",
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Evenings Under the Stars.webp",
    ],
  },
  {
    title: "Journeys in Caravans",
    type: "LUXURY ON ROAD",
    href: "/caravans",
    images: ["/Experiences/Caravan/1-Hero/28.webp", "/Experiences/Caravan/2-Spaces/11.webp"],
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

  return (
    <main className="relative min-h-screen bg-[#1E2023] text-white pb-16 lg:pb-0">
      {/* ── Navigation ── */}
      <Navbar />
      <MobileBottomNav />

      {/* Main content wrapper with top padding for navbar */}
      <div className="w-full h-[100svh] flex flex-col lg:flex-row relative pt-[48px] md:pt-[64px] overflow-hidden">
        {/* LEFT COLUMN: Main Menu */}
        <div className="flex-1 lg:flex-none lg:w-1/3 relative overflow-hidden h-full z-10 border-r border-transparent lg:border-white/10">
          <AnimatePresence mode="wait">
            {/* Primary Menu: Always visible on desktop, or if menuView is primary on mobile */}
            {(menuView === "primary" || true) && (
              <motion.div
                key="primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`absolute inset-0 flex flex-col px-6 md:px-12 py-4 pb-16 overflow-y-auto ${menuView !== "primary" ? "hidden lg:flex" : "flex"}`}
              >
                <span className="text-white/40 text-gh-label font-manrope font-bold tracking-[0.2em] uppercase mb-5 flex-shrink-0">
                  MENU
                </span>

                <ul className="flex flex-col space-y-2.5 lg:space-y-3">
                  <li
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => {
                      setMenuView("villas");
                      setDesktopSelectedView("villas");
                    }}
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
                    onClick={() => {
                      setMenuView("experiences");
                      setDesktopSelectedView("experiences");
                    }}
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

                <div className="flex gap-3 mt-auto pt-8">
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
              </motion.div>
            )}

            {/* MOBILE SECONDARY VIEWS */}
            {menuView === "villas" && (
              <motion.div
                key="villas"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex lg:hidden flex-col px-6 md:px-12 py-4 pb-24 overflow-y-auto bg-[#1E2023]"
              >
                <button
                  onClick={() => setMenuView("primary")}
                  className="flex items-center gap-2 text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase mb-5 hover:text-white transition-colors w-fit"
                >
                  <ArrowLeft className="w-4 h-4" /> BACK
                </button>
                <h2 className="text-gh-h1 font-philosopher text-white mb-6">
                  Villas
                </h2>
                <div className="space-y-6">
                  {VILLAS.map((villa) => (
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
                      <div className="-mx-6 md:-mx-12 px-6 md:px-12 overflow-x-auto hide-scrollbar">
                        <div className="flex gap-2 w-max pr-6">
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
              </motion.div>
            )}

            {menuView === "experiences" && (
              <motion.div
                key="experiences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex lg:hidden flex-col px-6 md:px-12 py-4 pb-24 overflow-y-auto bg-[#1E2023]"
              >
                <button
                  onClick={() => setMenuView("primary")}
                  className="flex items-center gap-2 text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase mb-5 hover:text-white transition-colors w-fit"
                >
                  <ArrowLeft className="w-4 h-4" /> BACK
                </button>
                <h2 className="text-gh-h1 font-philosopher text-white mb-6">
                  Experiences
                </h2>

                <div className="space-y-6">
                  {MENU_EXPERIENCES.slice(0, 3).map((exp, idx) => (
                    <div key={idx} className="flex flex-col group">
                      <Link href={exp.href} className="cursor-pointer">
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
                      <Link href={exp.href} className="cursor-pointer">
                        <p className="text-white/50 text-gh-label font-manrope mb-2.5 leading-relaxed pr-4 group-hover:text-[#EFCD62]/70 transition-colors">
                          {exp.desc}
                        </p>
                      </Link>
                      <div className="flex gap-2">
                        <div className="relative h-28 flex-1 aspect-[4/3]">
                          <Image
                            src={exp.images[0]}
                            alt={exp.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="relative h-28 flex-1 aspect-[4/3]">
                          <Image
                            src={exp.images[1]}
                            alt={`${exp.title} 2`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {menuView === "more" && (
              <motion.div
                key="more"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex lg:hidden flex-col px-6 md:px-12 py-4 pb-24 overflow-y-auto bg-[#1E2023]"
              >
                <button
                  onClick={() => setMenuView("primary")}
                  className="flex items-center gap-2 text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase mb-10 hover:text-white transition-colors w-fit"
                >
                  <ArrowLeft className="w-4 h-4 cursor-pointer" /> BACK
                </button>
                <h2 className="text-gh-h1 font-philosopher text-white mb-8">
                  More
                </h2>

                <ul className="flex flex-col space-y-5 pl-4">
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

        {/* RIGHT COLUMN: Desktop Hover Previews */}
        <div className="hidden lg:flex flex-1 relative h-full items-center justify-center p-12 overflow-hidden pointer-events-auto">
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
                className="absolute inset-0 flex flex-col px-12 pt-5 pb-12 pointer-events-auto overflow-y-auto hide-scrollbar"
              >
                <div className="w-full space-y-12">
                  {VILLAS.map((villa, idx) => (
                    <motion.div
                      key={villa.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
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

                      <div className="overflow-x-auto hide-scrollbar">
                        <div className="flex gap-3 w-max pr-4">
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
                className="absolute inset-0 flex flex-col px-12 pt-5 pb-12 pointer-events-auto overflow-y-auto hide-scrollbar"
              >
                <div className="w-full space-y-12">
                  {MENU_EXPERIENCES.map((exp, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
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

                      <div className="flex gap-3">
                        <Link
                          href={exp.href}
                          className="relative h-[280px] flex-1 aspect-[4/3] cursor-pointer overflow-hidden group/img"
                        >
                          <Image
                            src={exp.images[0]}
                            alt={exp.title}
                            fill
                            className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                            sizes="30vw"
                          />
                        </Link>
                        <Link
                          href={exp.href}
                          className="relative h-[280px] flex-1 aspect-[4/3] cursor-pointer overflow-hidden group/img"
                        >
                          <Image
                            src={exp.images[1]}
                            alt="experience"
                            fill
                            className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                            sizes="30vw"
                          />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
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
