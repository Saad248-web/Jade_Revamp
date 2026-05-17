"use client";

import { useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useAnimation } from "@/context/AnimationContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const pathname = usePathname() ?? "";
  const { isSplashComplete, navbarTheme } = useAnimation();
  const { count: wishlistCount } = useWishlist();
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

  // Check if it's a detail page for villas or weddings (resorts)
  const isDetailPage = /^\/(?:villas|weddings)\/[^/]+$/.test(pathname);

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
        <div className="w-full bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-5 md:px-8 lg:px-10 xl:px-12 py-4 md:py-5 flex items-center justify-between relative">
          {/* ── LEFT: Menu link + inline nav links (desktop only) ── */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            <Link
              href="/menu"
              className="flex items-center gap-2.5 text-white/60 hover:text-jade-gold transition-colors group p-2 min-h-[44px]"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span className="flex flex-col gap-[5px] w-5">
                  <span className="block h-[1px] w-5 bg-current transition-all" />
                  <span className="block h-[1px] w-3 bg-current transition-all group-hover:w-5" />
                </span>
              </div>
              <span className="text-gh-label font-manrope tracking-[0.25em] uppercase">
                Menu
              </span>
            </Link>

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
                  className={`text-gh-label font-manrope tracking-[0.18em] uppercase transition-colors p-2 min-h-[44px] flex items-center ${
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
                  priority
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
                  priority
                />
              </div>
            </Link>
          </div>

          {/* ── RIGHT: Contact CTA ── */}
          <div className="flex items-center justify-end flex-1 gap-4">
            {isDetailPage ? (
              <Link
                href="/book"
                className="bg-white/[0.05] backdrop-blur-sm hover:bg-jade-gold hover:text-black text-white text-gh-label font-manrope font-semibold tracking-[0.2em] uppercase px-4 md:px-5 rounded-none border border-white/20 transition-all duration-300 flex items-center justify-center min-h-[44px]"
              >
                BOOK NOW
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/book"
                  className="bg-white/[0.05] backdrop-blur-sm hover:bg-jade-gold text-white hover:text-black flex items-center justify-center min-w-[44px] min-h-[44px] rounded-none border border-white/20 transition-all duration-300 group shrink-0"
                  aria-label="Book a villa"
                  title="Book a villa"
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

                {/* Wishlist icon with badge */}
                <Link
                  href="/wishlist"
                  className="relative bg-white/[0.05] backdrop-blur-sm hover:bg-jade-gold text-white hover:text-black flex items-center justify-center min-w-[44px] min-h-[44px] rounded-none border border-white/20 transition-all duration-300 shrink-0"
                  aria-label="Wishlist"
                >
                  <Heart className="w-[18px] h-[18px]" strokeWidth={1.25} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full leading-none">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>
                {pathname?.startsWith("/experiences") ? (
                  <Link
                    href="/book"
                    className="bg-white/[0.05] backdrop-blur-sm hover:bg-jade-gold hover:text-black text-white text-gh-label font-manrope font-semibold tracking-[0.2em] uppercase px-4 md:px-5 rounded-none border border-white/20 transition-all duration-300 flex items-center justify-center min-h-[44px] whitespace-nowrap"
                  >
                    BOOK NOW
                  </Link>
                ) : (
                  <Link
                    href="/book"
                    className="bg-white/[0.05] backdrop-blur-sm hover:bg-jade-gold hover:text-black text-white text-gh-label font-manrope font-semibold tracking-[0.2em] uppercase px-4 md:px-5 rounded-none border border-white/20 transition-all duration-300 flex items-center justify-center min-h-[44px] whitespace-nowrap"
                  >
                    BOOK
                  </Link>
                )}
              </div>
            )}
          </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
