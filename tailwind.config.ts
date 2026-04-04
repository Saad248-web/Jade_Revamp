import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
    },
  },
  plugins: [],
};
export default config;
