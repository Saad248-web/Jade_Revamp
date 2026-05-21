"use client";

import Link from "next/link";

export type MenuTabItem = { id: string; label: string; href: string };

export function MenuSectionChipTabs({
  tabs,
  bleedClassName = "",
  className = "",
}: {
  tabs: MenuTabItem[];
  bleedClassName?: string;
  className?: string;
}) {
  if (tabs.length === 0) return null;

  return (
    <div
      className={`jade-scroll-chrome sticky top-0 z-20 flex-shrink-0 bg-[#1E2023]/95 backdrop-blur-md border-b border-white/10 py-2.5 mb-4 ${className}`}
    >
      <nav
        className={`flex gap-2 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] ${bleedClassName}`}
        aria-label="Section pages"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 text-gh-label font-manrope font-medium transition-all duration-300 bg-transparent text-white/60 border border-white/20 hover:border-[#EFCD62] hover:text-[#EFCD62] hover:bg-[#EFCD62]/10"
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function MenuVillasExperiencesSwitcher({
  active,
  onVillas,
  onExperiences,
  className = "",
}: {
  active: "villas" | "experiences";
  onVillas: () => void;
  onExperiences: () => void;
  className?: string;
}) {
  const itemClass = (selected: boolean) =>
    `flex-1 py-2.5 text-center text-gh-label font-manrope font-bold tracking-[0.15em] uppercase transition-colors border ${selected ? "bg-[#EFCD62] text-[#1A1C1E] border-[#EFCD62]" : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white"}`;

  return (
    <div
      className={`flex gap-2 flex-shrink-0 mb-5 ${className}`}
      role="tablist"
      aria-label="Villas and experiences"
    >
      <button
        type="button"
        role="tab"
        aria-selected={active === "villas"}
        className={itemClass(active === "villas")}
        onClick={onVillas}
      >
        Villas
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={active === "experiences"}
        className={itemClass(active === "experiences")}
        onClick={onExperiences}
      >
        Experiences
      </button>
    </div>
  );
}
