"use client";

import { motion } from "framer-motion";

export default function LiveBackground() {
  return (
    <div className="absolute inset-0 bg-[#25282c] overflow-hidden">
      {/* ===== Glow Layer ===== */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_25%,rgba(239,205,98,0.12)_0%,transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(100,180,220,0.08)_0%,transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(180,120,200,0.06)_0%,transparent_35%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(239,205,98,0.08)] via-transparent to-[rgba(100,180,220,0.04)]" />
      </div>

      {/* ===== Floating Gems ===== */}

      {/* Gem 1 */}
      <motion.svg
        className="absolute w-10 h-10 opacity-30"
        style={{ left: "10%", top: "15%" }}
        animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        viewBox="0 0 40 40"
      >
        <polygon
          points="20,5 30,10 30,30 20,35 10,30 10,10"
          fill="rgba(100,180,120,0.06)"
          stroke="rgba(100,180,120,0.2)"
        />
      </motion.svg>

      {/* Gem 2 */}
      <motion.svg
        className="absolute w-12 h-12 opacity-35"
        style={{ right: "15%", top: "20%" }}
        animate={{ y: [0, 25, 0], x: [0, -15, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="rgba(239,205,98,0.05)"
          stroke="rgba(239,205,98,0.25)"
        />
      </motion.svg>

      {/* Gem 3 */}
      <motion.svg
        className="absolute w-11 h-11 opacity-30"
        style={{ left: "25%", top: "60%" }}
        animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [45, 52, 45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        viewBox="0 0 45 45"
      >
        <rect
          x="7.5"
          y="7.5"
          width="30"
          height="30"
          fill="rgba(100,150,220,0.06)"
          stroke="rgba(100,150,220,0.22)"
          transform="rotate(45 22.5 22.5)"
        />
      </motion.svg>

      {/* Sparkles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
    </div>
  );
}
