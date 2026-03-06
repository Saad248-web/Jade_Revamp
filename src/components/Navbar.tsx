"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAnimation } from "@/context/AnimationContext";
import {
  X,
  ChevronRight,
  ArrowLeft,
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Headset,
} from "lucide-react"; // Import new icons
import { VILLAS, CATEGORIES } from "@/data/villas"; // For Villas/Experiences data

export default function Navbar() {
  const pathname = usePathname();
  const {
    isSplashComplete,
    isMenuOpen,
    setMenuOpen,
    setPartnerOverlayOpen,
    navbarTheme,
  } = useAnimation();
  const { scrollY } = useScroll();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // New state for driving secondary menus
  const [menuView, setMenuView] = useState<
    "primary" | "villas" | "experiences" | "more"
  >("primary");

  // New state for Desktop split view hover
  const [desktopHoverView, setDesktopHoverView] = useState<
    "default" | "villas" | "experiences" | "more"
  >("default");

  const [desktopSelectedView, setDesktopSelectedView] = useState<
    "default" | "villas" | "experiences" | "more"
  >("default");

  // Reset menuView to primary when menu closes
  useMotionValueEvent(useSpring(isMenuOpen ? 1 : 0), "change", (latest) => {
    if (latest === 0) {
      setTimeout(() => {
        setMenuView("primary");
        setDesktopHoverView("default");
        setDesktopSelectedView("default");
      }, 500); // Wait for exit animation
    }
  });

  // Body scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      // If lenis exists, stop it
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      // If lenis exists, start it
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Smart Scroll Logic
  useMotionValueEvent(scrollY, "change", (latest: number) => {
    const previous = lastScrollY;
    if (latest > previous && latest > 150) {
      setIsHidden(true); // Scroll Down -> Hide
    } else {
      setIsHidden(false); // Scroll Up -> Show
    }
    setLastScrollY(latest);
  });

  // Scroll Progress (Filler Line)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Only hide navbar on home page if splash isn't complete
  if (pathname === "/" && !isSplashComplete) return null;

  // Check if it's a detail page for villas or weddings (resorts)
  const isDetailPage = /^\/(?:villas|weddings)\/[^/]+$/.test(pathname);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Experiences", href: "/experiences" },
    { name: "Villas", href: "/villas" },
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Scroll Progress Line ("Filler Line") - LOCKED TO TOP */}
      <div className="fixed top-0 left-0 right-0 h-[2px] w-full z-[60] bg-white/5">
        <motion.div
          className="h-full bg-jade-gold origin-left"
          style={{ scaleX }}
        />
      </div>

      {/* ═══════════════════════════════════════════
           NAVBAR
      ══════════════════════════════════════════ */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-50 mt-[2px]"
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        initial="visible"
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Glass bar */}
        <div className="mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm relative">
          {/* ── LEFT: Menu toggle + inline nav links (desktop only) ── */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2.5 text-white/60 hover:text-jade-gold transition-colors group"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!isMenuOpen ? (
                    <motion.span
                      key="menu-icon"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      className="flex flex-col gap-[5px] w-5"
                    >
                      <span className="block h-[1px] w-5 bg-current transition-all" />
                      <span className="block h-[1px] w-3 bg-current transition-all group-hover:w-5" />
                    </motion.span>
                  ) : (
                    <motion.div
                      key="close-icon"
                      initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    >
                      <X className="w-5 h-5 text-[#EFCD62]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-[10px] font-manrope tracking-[0.25em] uppercase">
                {isMenuOpen ? "Close" : "Menu"}
              </span>
            </button>

            {/* Thin divider */}
            <span className="h-4 w-px bg-white/15" />

            {/* Inline nav links */}
            <nav className="flex items-center gap-7">
              {[
                { name: "Experiences", href: "/experiences" },
                { name: "Villas", href: "/villas" },
                { name: "About", href: "/about" },
                { name: "Careers", href: "/careers" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[11px] font-manrope tracking-[0.18em] uppercase transition-colors ${
                    pathname === item.href
                      ? "text-jade-gold"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── MOBILE LEFT: Logo ── */}
          <div className="lg:hidden flex items-center">
            <Link href="/">
              <div className="relative w-9 h-9">
                <Image
                  src={
                    navbarTheme === "white"
                      ? "/assets/White_Logo.png"
                      : "/assets/Golden_Logo.png"
                  }
                  alt="Jade Logo"
                  fill
                  className="object-contain"
                  sizes="36px"
                />
              </div>
            </Link>
          </div>

          {/* ── CENTER: Logo — absolute center on desktop ── */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center">
            <Link href="/">
              <div className="relative w-14 h-14 hover:opacity-80 transition-opacity">
                <Image
                  src={
                    navbarTheme === "white"
                      ? "/assets/White_Logo.png"
                      : "/assets/Golden_Logo.png"
                  }
                  alt="Jade Hospitainment"
                  fill
                  className="object-contain"
                  sizes="56px"
                />
              </div>
            </Link>
          </div>

          {/* ── RIGHT: Contact CTA ── */}
          <div className="flex items-center justify-end flex-1 gap-4">
            {isDetailPage ? (
              <Link
                href="/contact"
                className="bg-white/[0.05] backdrop-blur-sm hover:bg-jade-gold hover:text-black text-white text-[10px] font-manrope font-semibold tracking-[0.2em] uppercase px-4 md:px-5 rounded-none border border-white/20 transition-all duration-300 flex items-center justify-center h-[35px] md:h-[38px]"
              >
                CONTACT US
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/contact"
                  className="bg-white/[0.05] backdrop-blur-sm hover:bg-jade-gold text-white hover:text-black flex items-center justify-center w-[35px] h-[35px] md:w-[38px] md:h-[38px] rounded-none border border-white/20 transition-all duration-300 group shrink-0"
                  aria-label="Contact Us"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-colors drop-shadow-sm"
                  >
                    <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3V11z" />
                    <path d="M21 11h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3v-7z" />
                    <path d="M3 11V9a9 9 0 0 1 18 0v2" />
                    <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
                    <path d="M9 10h6v4H9z" />
                    <path d="M10 12h.01M12 12h.01M14 12h.01" />
                  </svg>
                </Link>
                {pathname?.startsWith("/experiences") ? (
                  <button
                    onClick={() => setPartnerOverlayOpen(true)}
                    className="bg-white/[0.05] backdrop-blur-sm hover:bg-jade-gold hover:text-black text-white text-[10px] font-manrope font-semibold tracking-[0.2em] uppercase px-4 md:px-5 rounded-none border border-white/20 transition-all duration-300 flex items-center justify-center h-[35px] md:h-[38px] whitespace-nowrap"
                  >
                    ENQUIRE NOW
                  </button>
                ) : (
                  <Link
                    href="/book"
                    className="bg-white/[0.05] backdrop-blur-sm hover:bg-jade-gold hover:text-black text-white text-[10px] font-manrope font-semibold tracking-[0.2em] uppercase px-4 md:px-5 rounded-none border border-white/20 transition-all duration-300 flex items-center justify-center h-[35px] md:h-[38px] whitespace-nowrap"
                  >
                    BOOK NOW
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Updated Slide-out Sidebar Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[40] bg-[#1E2023] flex pt-[80px] lg:pt-[100px]" // Static header overlap
          >
            {/* Main content wrapper with padding matching the screens */}
            <div className="w-full h-full flex flex-col lg:flex-row relative overflow-hidden bg-[#1E2023]">
              {/* Common Top Nav within menu (Mobile Only) */}
              <div className="lg:hidden flex items-center justify-between p-4 md:p-8 shrink-0">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <div className="relative w-10 h-10">
                    <Image
                      src="/assets/Golden_Logo.png"
                      alt="Jade Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="bg-transparent text-white/70 hover:text-white flex items-center justify-center w-[35px] h-[35px] rounded-none border border-white/10 transition-colors shrink-0"
                  >
                    <Headset className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/book"
                    onClick={() => setMenuOpen(false)}
                    className="bg-transparent hover:bg-white/5 text-white/90 text-[10px] font-manrope font-semibold tracking-[0.2em] uppercase px-4 h-[35px] rounded-none border border-white/10 transition-colors flex items-center justify-center"
                  >
                    BOOK NOW
                  </Link>
                </div>
              </div>

              {/* Views container with AnimatePresence for smooth transitions */}
              {/* LEFT COLUMN: Main Menu */}
              <div className="flex-1 lg:flex-none lg:w-1/3 relative overflow-hidden h-full z-10 border-r border-transparent lg:border-white/10">
                <AnimatePresence mode="wait">
                  {/* Primary Menu: Always visible on desktop, or if menuView is primary on mobile */}
                  {(menuView === "primary" ||
                    (typeof window !== "undefined" &&
                      window.innerWidth >= 1024)) && (
                    <motion.div
                      key="primary"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`absolute inset-0 flex flex-col px-6 md:px-12 py-4 pb-32 overflow-y-auto ${menuView !== "primary" ? "hidden lg:flex" : "flex"}`}
                    >
                      <span className="text-white/40 text-[10px] font-manrope font-bold tracking-[0.2em] uppercase mb-6">
                        MENU
                      </span>

                      <ul className="flex flex-col space-y-3 lg:space-y-4">
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
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-3xl lg:text-4xl font-philosopher text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] transition-all duration-500 ease-out group-hover:bg-left ${
                                desktopSelectedView === "villas"
                                  ? "bg-left text-[#EFCD62]"
                                  : "bg-right"
                              }`}
                            >
                              Villas
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 transition-colors ${
                                desktopSelectedView === "villas"
                                  ? "text-[#EFCD62]"
                                  : "text-white/50 group-hover:text-[#EFCD62]"
                              }`}
                            />
                          </div>
                        </li>
                        <li
                          className="flex items-center justify-between cursor-pointer group"
                          onClick={() => {
                            setMenuView("experiences");
                            setDesktopSelectedView("experiences");
                          }}
                          onMouseEnter={() =>
                            setDesktopHoverView("experiences")
                          }
                          onMouseLeave={() =>
                            setDesktopHoverView(desktopSelectedView)
                          }
                        >
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-3xl lg:text-4xl font-philosopher text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] transition-all duration-500 ease-out group-hover:bg-left ${
                                desktopSelectedView === "experiences"
                                  ? "bg-left text-[#EFCD62]"
                                  : "bg-right"
                              }`}
                            >
                              Experiences
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 transition-colors ${
                                desktopSelectedView === "experiences"
                                  ? "text-[#EFCD62]"
                                  : "text-white/50 group-hover:text-[#EFCD62]"
                              }`}
                            />
                          </div>
                        </li>
                        <li>
                          <Link
                            href="/about"
                            onClick={() => setMenuOpen(false)}
                          >
                            <span className="block text-3xl lg:text-4xl font-philosopher text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] bg-right hover:bg-left transition-all duration-500 ease-out">
                              About us
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/careers"
                            onClick={() => setMenuOpen(false)}
                          >
                            <span className="block text-3xl lg:text-4xl font-philosopher text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] bg-right hover:bg-left transition-all duration-500 ease-out">
                              Careers
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/blogs"
                            onClick={() => setMenuOpen(false)}
                          >
                            <span className="block text-3xl lg:text-4xl font-philosopher text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] bg-right hover:bg-left transition-all duration-500 ease-out">
                              Blogs
                            </span>
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setTimeout(
                                () => setPartnerOverlayOpen(true),
                                300,
                              );
                            }}
                            className="text-left"
                          >
                            <span className="block text-3xl lg:text-4xl font-philosopher text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] bg-right hover:bg-left transition-all duration-500 ease-out">
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
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-3xl lg:text-4xl font-philosopher text-transparent bg-clip-text bg-gradient-to-r from-[#EFCD62] from-50% to-white to-50% bg-[length:200%_100%] transition-all duration-500 ease-out group-hover:bg-left ${
                                desktopSelectedView === "more"
                                  ? "bg-left text-[#EFCD62]"
                                  : "bg-right"
                              }`}
                            >
                              More
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 transition-colors ${
                                desktopSelectedView === "more"
                                  ? "text-[#EFCD62]"
                                  : "text-white/50 group-hover:text-[#EFCD62]"
                              }`}
                            />
                          </div>
                        </li>
                      </ul>

                      {/* Social Icons mapped to bottom */}
                      <div className="flex gap-4 mt-auto pt-10">
                        {[Facebook, Instagram, Youtube].map((Icon, idx) => (
                          <a
                            key={idx}
                            href="#"
                            className="w-10 h-10 border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                          </a>
                        ))}
                        {/* WhatsApp specific placeholder, assuming Phone icon or custom svg usually */}
                        <a
                          href="#"
                          className="w-10 h-10 border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}

                  {/* MOBILE SECONDARY VIEWS */}
                  {/* These only render on mobile where menuView drives the full screen replace */}
                  {menuView === "villas" && (
                    <motion.div
                      key="villas"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute inset-0 flex lg:hidden flex-col px-6 md:px-12 py-4 pb-32 overflow-y-auto bg-[#1E2023]"
                    >
                      <button
                        onClick={() => setMenuView("primary")}
                        className="flex items-center gap-2 text-[#EFCD62] text-[10px] font-manrope font-bold tracking-[0.2em] uppercase mb-6 hover:text-white transition-colors w-fit"
                      >
                        <ArrowLeft className="w-4 h-4" /> BACK
                      </button>
                      <h2 className="text-4xl font-philosopher text-white mb-8">
                        Villas
                      </h2>
                      <div className="space-y-8">
                        {VILLAS.slice(0, 3).map((villa) => (
                          <div
                            key={villa.id}
                            className="flex flex-col cursor-pointer group"
                            onClick={() => {
                              setMenuOpen(false);
                              window.location.href = `/villas?villa=${villa.id}`;
                            }}
                          >
                            <p className="text-white/40 text-[9px] font-manrope font-bold tracking-[0.2em] uppercase mb-1">
                              {villa.type}
                            </p>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-manrope text-white group-hover:text-[#EFCD62] transition-colors">
                                {villa.name}
                              </h3>
                              <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-[#EFCD62] transition-colors" />
                            </div>
                            <div className="flex gap-2">
                              <div className="relative h-24 flex-1 aspect-[4/3]">
                                <Image
                                  src={villa.image}
                                  alt={villa.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              {villa.spaces?.[1]?.image && (
                                <div className="relative h-24 flex-1 aspect-[4/3]">
                                  <Image
                                    src={villa.spaces[1].image}
                                    alt="space"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
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
                      className="absolute inset-0 flex lg:hidden flex-col px-6 md:px-12 py-4 pb-32 overflow-y-auto bg-[#1E2023]"
                    >
                      <button
                        onClick={() => setMenuView("primary")}
                        className="flex items-center gap-2 text-[#EFCD62] text-[10px] font-manrope font-bold tracking-[0.2em] uppercase mb-6 hover:text-white transition-colors w-fit"
                      >
                        <ArrowLeft className="w-4 h-4" /> BACK
                      </button>
                      <h2 className="text-4xl font-philosopher text-white mb-8">
                        Experiences
                      </h2>

                      <div className="space-y-8">
                        {/* Hardcoding the 3 categories for experiences sidebar matching mockup */}
                        {[
                          {
                            title: "Weekend Getaways",
                            desc: "A day or two with your friends and family away from the bustling city in the wilderness is truly on everyone's wishlist.",
                            img1: "/assets/wellness_retreat.png",
                            img2: "/assets/Bathing_Girls.png",
                          },
                          {
                            title: "Celebrations & Parties",
                            desc: "Birthdays, pool or bachelor parties unfold across private farmhouse villas with pools, open lawns and entertainment-ready spaces.",
                            img1: "/assets/corporate_retreat.png",
                            img2: "/assets/casual_stays.png",
                          },
                          {
                            title: "Wedding Celebrations",
                            desc: "Say 'I do' under the stars in sprawling lawns or intimate poolside setups designed just for you.",
                            img1: "/assets/Wedding_for_Both.png",
                            img2: "/assets/Jade_735_for_Desktop.png",
                          },
                        ].map((exp, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col cursor-pointer group"
                            onClick={() => {
                              setMenuOpen(false);
                              window.location.href = `/experiences`;
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-lg font-manrope text-white group-hover:text-[#EFCD62] transition-colors">
                                {exp.title}
                              </h3>
                              <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-[#EFCD62] transition-colors" />
                            </div>
                            <p className="text-white/50 text-[11px] font-manrope mb-3 leading-relaxed pr-4">
                              {exp.desc}
                            </p>
                            <div className="flex gap-2">
                              <div className="relative h-28 flex-1 aspect-[4/3]">
                                <Image
                                  src={exp.img1}
                                  alt={exp.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="relative h-28 flex-1 aspect-[4/3]">
                                <Image
                                  src={exp.img2}
                                  alt={`${exp.title} 2`}
                                  fill
                                  className="object-cover"
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
                      className="absolute inset-0 flex lg:hidden flex-col px-6 md:px-12 py-4 pb-32 overflow-y-auto bg-[#1E2023]"
                    >
                      <button
                        onClick={() => setMenuView("primary")}
                        className="flex items-center gap-2 text-[#EFCD62] text-[10px] font-manrope font-bold tracking-[0.2em] uppercase mb-12 hover:text-white transition-colors w-fit"
                      >
                        <ArrowLeft className="w-4 h-4 cursor-pointer" /> BACK
                      </button>
                      <h2 className="text-5xl font-philosopher text-white mb-10">
                        More
                      </h2>

                      <ul className="flex flex-col space-y-10">
                        <li>
                          <Link
                            href="/privacy"
                            onClick={() => setMenuOpen(false)}
                            className="block text-2xl font-manrope text-white/70 hover:text-[#EFCD62] transition-colors"
                          >
                            Privacy Policy
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/terms"
                            onClick={() => setMenuOpen(false)}
                            className="block text-2xl font-manrope text-white/70 hover:text-[#EFCD62] transition-colors"
                          >
                            Terms & Conditions
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/refund"
                            onClick={() => setMenuOpen(false)}
                            className="block text-2xl font-manrope text-white/70 hover:text-[#EFCD62] transition-colors"
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
              <div className="hidden lg:flex flex-1 relative h-full items-center justify-center p-12 overflow-hidden pointer-events-none group-hover:pointer-events-auto">
                <AnimatePresence mode="wait">
                  {/* Prioritize hover, fallback to selected */}
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
                      className="absolute inset-0 flex flex-col px-12 pt-6 pb-16 pointer-events-auto overflow-y-auto hide-scrollbar"
                    >
                      <div className="w-full space-y-16">
                        {VILLAS.map((villa, idx) => (
                          <motion.div
                            key={villa.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="w-full flex flex-col group"
                          >
                            <div className="flex justify-between items-start mb-6 pr-2">
                              <div
                                className="flex flex-col cursor-pointer"
                                onClick={() => {
                                  setMenuOpen(false);
                                  window.location.href = `/villas?villa=${villa.id}`;
                                }}
                              >
                                <p className="text-white/40 text-[9px] lg:text-[10px] uppercase font-manrope font-bold tracking-[0.2em] mb-1.5">
                                  {villa.type}
                                </p>
                                <div className="flex items-center gap-2 group/title">
                                  <h3 className="text-2xl lg:text-3xl font-philosopher text-white transition-colors capitalize">
                                    {villa.name}
                                  </h3>
                                  <ChevronRight className="w-5 h-5 text-white/50 group-hover/title:text-[#EFCD62] transition-colors" />
                                </div>
                              </div>
                              <div className="flex gap-2.5 pt-1">
                                <button className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/5 transition-colors">
                                  <ArrowLeft className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors">
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-4">
                              <div
                                className="relative h-[280px] flex-1 aspect-[4/3] cursor-grab active:cursor-grabbing overflow-hidden group/img"
                                onClick={() => {
                                  setMenuOpen(false);
                                  window.location.href = `/villas?villa=${villa.id}`;
                                }}
                              >
                                <Image
                                  src={villa.image}
                                  alt={villa.name}
                                  fill
                                  className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                                />
                              </div>
                              <div
                                className="relative h-[280px] flex-1 aspect-[4/3] cursor-grab active:cursor-grabbing overflow-hidden group/img"
                                onClick={() => {
                                  setMenuOpen(false);
                                  window.location.href = `/villas?villa=${villa.id}`;
                                }}
                              >
                                <Image
                                  src={villa.spaces?.[1]?.image || villa.image}
                                  alt="space"
                                  fill
                                  className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                                />
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
                      className="absolute inset-0 flex flex-col px-12 pt-6 pb-16 pointer-events-auto overflow-y-auto hide-scrollbar"
                    >
                      <div className="w-full space-y-16">
                        {[
                          {
                            title: "Weekend Getaways",
                            type: "JOURNEY OF WELLNESS",
                            img1: "/assets/wellness_retreat.png",
                            img2: "/assets/Bathing_Girls.png",
                          },
                          {
                            title: "Celebrations & Parties",
                            type: "LUXURY PRIVATE STAYS",
                            img1: "/assets/corporate_retreat.png",
                            img2: "/assets/casual_stays.png",
                          },
                          {
                            title: "Wedding Celebrations",
                            type: "UNFORGETTABLE MOMENTS",
                            img1: "/assets/Wedding_for_Both.png",
                            img2: "/assets/Jade_735_for_Desktop.png",
                          },
                          {
                            title: "Corporate Offsites",
                            type: "JOURNEY OF TEAMWORK",
                            img1: "/assets/corporate_retreat.png",
                            img2: "/assets/Jade_735_for_Desktop.png",
                          },
                          {
                            title: "Wellness Retreats",
                            type: "PURE REJUVENATION",
                            img1: "/assets/wellness_retreat.png",
                            img2: "/assets/Bathing_Girls.png",
                          },
                          {
                            title: "Journeys in Caravans",
                            type: "LUXURY ON ROAD",
                            img1: "/assets/caravan_journey.png",
                            img2: "/assets/Dome_Villa.png",
                          },
                        ].map((exp, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="w-full flex flex-col group"
                          >
                            <div className="flex justify-between items-start mb-6 pr-2">
                              <div
                                className="flex flex-col cursor-pointer"
                                onClick={() => {
                                  setMenuOpen(false);
                                  window.location.href = `/experiences`;
                                }}
                              >
                                <p className="text-white/40 text-[9px] lg:text-[10px] uppercase font-manrope font-bold tracking-[0.2em] mb-1.5">
                                  {exp.type}
                                </p>
                                <div className="flex items-center gap-2 group/title">
                                  <h3 className="text-2xl lg:text-3xl font-philosopher text-white transition-colors">
                                    {exp.title}
                                  </h3>
                                  <ChevronRight className="w-5 h-5 text-white/50 group-hover/title:text-[#EFCD62] transition-colors" />
                                </div>
                              </div>
                              <div className="flex gap-2.5 pt-1">
                                <button className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/5 transition-colors">
                                  <ArrowLeft className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors">
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-4">
                              <div className="relative h-[280px] flex-1 aspect-[4/3] cursor-grab active:cursor-grabbing overflow-hidden group/img">
                                <Image
                                  src={exp.img1}
                                  alt={exp.title}
                                  fill
                                  className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                                />
                              </div>
                              <div className="relative h-[280px] flex-1 aspect-[4/3] cursor-grab active:cursor-grabbing overflow-hidden group/img">
                                <Image
                                  src={exp.img2}
                                  alt="experience"
                                  fill
                                  className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                                />
                              </div>
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
                      <div className="w-full h-full flex items-center gap-16 max-w-6xl">
                        {/* Links Section */}
                        <div className="flex-[1.2] flex flex-col gap-10">
                          {[
                            { name: "Privacy Policy", href: "/privacy" },
                            { name: "Terms & Conditions", href: "/terms" },
                            { name: "Refund Policy", href: "/refund" },
                          ].map((policy, idx) => (
                            <Link
                              key={idx}
                              href={policy.href}
                              onClick={() => setMenuOpen(false)}
                              className="group flex items-center gap-4 cursor-pointer"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EFCD62] opacity-0 group-hover:opacity-100 transition-opacity" />
                              <span className="text-2xl font-manrope text-white/50 group-hover:text-white transition-all transform group-hover:translate-x-2">
                                {policy.name}
                              </span>
                            </Link>
                          ))}
                        </div>

                        {/* Banner Image Section */}
                        <div className="flex-[2] relative h-[400px] overflow-hidden group/banner shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
                          <Image
                            src="/assets/Wedding_for_Both.png"
                            alt="Jade Banner"
                            fill
                            className="object-cover opacity-60 group-hover/banner:scale-105 group-hover/banner:opacity-100 transition-all duration-1000 grayscale group-hover/banner:grayscale-0"
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

              {/* Add close button X mirroring the exact mobile UI look if needed, but normally MobileBottomNav handles it or top bar */}
            </div>

            {/* Embedded Mobile Bottom Nav specifically for Menu mode - Hidden on Desktop */}
            <div className="absolute lg:hidden bottom-0 left-0 right-0 border-t border-white/10 bg-[#2C2E31] z-10 flex">
              <div className="flex-1 py-4 flex flex-col items-center gap-1.5 opacity-50 cursor-pointer">
                <div className="relative w-6 h-6">
                  <Image
                    src="/assets/White_Logo.png"
                    alt="Home"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[9px] font-manrope text-white">Home</span>
              </div>
              <div className="flex-1 py-4 flex flex-col items-center gap-1.5 opacity-50 cursor-pointer">
                <div className="relative w-5 h-5">
                  <Image
                    src="/assets/pool_icon.svg"
                    alt="Experiences"
                    fill
                    className="object-contain"
                  />{" "}
                  {/* Safe fallback rendering for dummy */}{" "}
                </div>
                <span className="text-[9px] font-manrope text-white">
                  Experiences
                </span>
              </div>
              <div className="flex-1 py-4 flex flex-col items-center gap-1.5 opacity-50 cursor-pointer">
                <div className="relative w-5 h-5">
                  <Image
                    src="/assets/house_icon.svg"
                    alt="Villas"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[9px] font-manrope text-white">
                  Villa Retreats
                </span>
              </div>
              <div
                className="flex-1 py-4 flex flex-col items-center gap-1.5 cursor-pointer text-[#EFCD62]"
                onClick={() => setMenuOpen(false)}
              >
                <X className="w-5 h-5" />
                <span className="text-[9px] font-manrope">Close Menu</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
