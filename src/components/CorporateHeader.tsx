"use client";

import React from "react";
import { ArrowLeft, Headset } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CorporateHeader() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 pointer-events-none">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="p-2 bg-black/20 backdrop-blur-md rounded-none border border-white/10 text-white pointer-events-auto hover:bg-white/10 transition-colors"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Mobile: Dialer */}
      <motion.a
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        href="tel:08970663366"
        className="md:hidden p-2 bg-black/20 backdrop-blur-md rounded-none border border-white/10 text-white pointer-events-auto hover:bg-white/10 transition-colors flex items-center justify-center"
        aria-label="Call support"
      >
        <Headset className="w-5 h-5" />
      </motion.a>

      {/* Desktop: Contact Page */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block"
      >
        <Link
          href="/contact"
          className="p-2 bg-black/20 backdrop-blur-md rounded-none border border-white/10 text-white pointer-events-auto hover:bg-white/10 transition-colors flex items-center justify-center"
          aria-label="Contact support"
        >
          <Headset className="w-5 h-5" />
        </Link>
      </motion.div>
    </header>
  );
}
