import type { Config } from "tailwindcss";
import containerQueries from "@tailwindcss/container-queries";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jade: {
          text: "hsla(0, 0%, 98%, 0.8)",
          // New Palette
          charcoal: "#25282C", // Primary Background
          green: "#0B2C23", // Secondary Background
          gold: "#EFCD62", // Primary Accent (Jade Gold)
          "gold-muted": "#AC8831",
          "gold-dull": "#5C4009",

          // Legacy mappings (optional, to prevent breaking)
          dark: "#25282C",
        },
      },
      fontFamily: {
        philosopher: ["var(--font-philosopher)", "sans-serif"],
        manrope: ["var(--font-manrope)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      /* ============================================================
         ZOOM-SAFE FLUID SPACING TOKENS
         Use these instead of fixed `pt-24`, `gap-8`, etc. wherever a
         section looks tight at 125–150% Windows scaling.
         e.g. pt-fluid-lg  gap-fluid-md  px-fluid-md
         ============================================================ */
      spacing: {
        "fluid-xs": "clamp(4px, 0.5vw, 8px)",
        "fluid-sm": "clamp(8px, 1vw, 16px)",
        "fluid-md": "clamp(16px, 2vw, 32px)",
        "fluid-lg": "clamp(32px, 4vw, 64px)",
        "fluid-xl": "clamp(48px, 6vw, 96px)",
        "fluid-2xl": "clamp(64px, 8vw, 128px)",
      },
      /* Dynamic viewport units — prefer over vh/vw which misbehave at
         high Windows display scaling and on mobile browser chrome. */
      height: {
        dscreen: "100dvh",
        sscreen: "100svh",
        lscreen: "100lvh",
      },
      minHeight: {
        dscreen: "100dvh",
        sscreen: "100svh",
      },
      maxHeight: {
        dscreen: "100dvh",
      },
    },
  },
  plugins: [
    containerQueries,
    plugin(({ addVariant }) => {
      addVariant(
        "supports-sda",
        "@supports (animation-timeline: auto)",
      );
    }),
  ],
};
export default config;
