"use client";

import { useState } from "react";
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
import { X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isSplashComplete, isMenuOpen, setMenuOpen, navbarTheme } =
    useAnimation();
  const { scrollY } = useScroll();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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
        <div className="mx-auto px-8 py-5 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm relative">
          {/* ── LEFT: Menu toggle + inline nav links (desktop only) ── */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2.5 text-white/60 hover:text-jade-gold transition-colors group"
            >
              <span className="flex flex-col gap-[5px] w-5">
                <span className="block h-[1px] w-5 bg-current transition-all" />
                <span className="block h-[1px] w-3 bg-current transition-all group-hover:w-5" />
              </span>
              <span className="text-[10px] font-manrope tracking-[0.25em] uppercase">
                Menu
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
            <Link
              href="/contact"
              className="bg-white/8 hover:bg-jade-gold hover:text-black text-white text-[10px] font-manrope font-semibold tracking-[0.2em] uppercase px-5 py-2.5 rounded-none border border-white/20 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[70] bg-[#1a1a1a] flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 left-6 text-white hover:text-jade-gold transition-colors"
            >
              <X className="w-8 h-8 stroke-[1.5]" />
            </button>

            {/* Menu Items */}
            <ul className="flex flex-col items-center space-y-8">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-philosopher text-white hover:text-jade-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
