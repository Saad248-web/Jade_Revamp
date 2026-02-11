"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LiveBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {/* 1. Base Image with Slow Pan/Zoom Animation (Breathe Effect) */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.0, opacity: 0.6 }}
        animate={{
          scale: [1.0, 1.15, 1.0], // Slightly more zoom
          x: [0, -30, 0], // More movement
          y: [0, -15, 0],
        }}
        transition={{
          duration: 18, // Faster cycle
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <Image
          src="/assets/constellation_bg.png"
          alt="Constellation Background"
          fill
          className="object-cover opacity-80"
          quality={100}
          priority
        />
      </motion.div>

      {/* 2. Floating Particles Overlay (Code-generated) - Increased Count */}
      <div className="absolute inset-0 z-10 opacity-60">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-jade-gold rounded-full blur-[1px]"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -150, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* 3. Noise Overlay for Texture (CSS) */}
      <div
        className="absolute inset-0 z-20 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 4. Gradient Vignette */}
      <div className="absolute inset-0 z-30 bg-radial-gradient from-transparent via-[#0A0A0A]/20 to-[#0A0A0A]/90" />
    </div>
  );
}
