"use client";

import { useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAnimation } from "@/context/AnimationContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isSplashComplete } = useAnimation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isOpen, setIsOpen] = useState(false);

  if (!isSplashComplete) return null;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Experiences", href: "#experiences" },
    { name: "Villas", href: "#villas" },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-8 md:py-6 flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-[2px]"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Scroll Progress Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] w-full bg-white/5">
          <motion.div
            className="h-full bg-jade-gold origin-left"
            style={{ scaleX }}
          />
        </div>

        {/* LEFT SECTION: Menu & Links */}
        <div className="flex items-center">
          {/* Hamburger Icon */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-white hover:text-jade-gold transition-colors"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
          </button>

          {/* Vertical Divider */}
          <div className="h-4 w-[1px] bg-white/20 mx-8 hidden md:block" />

          {/* Nav Links (Text Only) */}
          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-xs font-manrope font-medium tracking-widest text-white/80 hover:text-white transition-colors uppercase"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CENTER SECTION: Logo */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link href="/">
            <div className="relative w-16 h-16 md:w-32 md:h-24 flex items-center justify-center">
              {/* Using the White Logo */}
              <Image
                src="/assets/White_Logo.png"
                alt="Jade Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* RIGHT SECTION: CTA Button */}
        <div>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-manrope tracking-widest uppercase px-4 py-2 md:px-6 md:py-3 rounded-full border border-white/10 transition-all duration-300">
            <span className="md:hidden">CONTACT</span>
            <span className="hidden md:inline">CONTACT US</span>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] bg-[#1a1a1a] flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 left-4 text-white hover:text-jade-gold transition-colors"
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
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-philosopher text-white hover:text-jade-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-philosopher text-white hover:text-jade-gold transition-colors"
                >
                  Contact
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
