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
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isSplashComplete } = useAnimation();
  const { isMenuOpen, setMenuOpen } = useAnimation();
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

      <motion.nav
        className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px] mt-[2px]"
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        initial="visible"
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* ====================
            DESKTOP LEFT SECTION 
            [Logo] | [Divider] | [Menu Icon]
           ==================== */}
        <div className="hidden lg:flex items-center gap-8 z-10">
          <Link href="/">
            <div className="relative w-16 h-8 flex items-center justify-center">
              <Image
                src="/assets/Golden_Logo.png"
                alt="Jade Logo"
                width={64}
                height={32}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-white/20" />

          {/* Menu Icon */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center text-white hover:text-jade-gold transition-colors"
          >
            <Menu className="w-6 h-6 stroke-[1.5]" />
            <span className="ml-3 text-[10px] tracking-[0.2em] font-manrope uppercase opacity-60">
              MENU
            </span>
          </button>
        </div>

        {/* ====================
             MOBILE LEFT SECTION 
             [Logo]
           ==================== */}
        <div className="lg:hidden relative z-10 flex items-center gap-6">
          <Link href="/">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image
                src="/assets/Golden_Logo.png"
                alt="Jade Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* ====================
            RIGHT SECTION 
            [Contact Button]
           ==================== */}
        <div className="relative z-10 flex items-center gap-4">
          <Link
            href="/contact"
            className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white text-[10px] md:text-xs font-manrope tracking-widest uppercase px-6 py-3 rounded-none border border-white/20 transition-all duration-300"
          >
            CONTACT US
          </Link>
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
