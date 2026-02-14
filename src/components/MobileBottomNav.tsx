"use client";

import { useAnimation } from "@/context/AnimationContext";
import { Waves, Warehouse, Menu, LucideIcon } from "lucide-react"; // Replaced House with Warehouse
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  type?: "logo";
  icon?: LucideIcon;
  href: string | null;
  action: (() => void) | null;
}

export default function MobileBottomNav() {
  const { setMenuOpen, isMenuOpen } = useAnimation();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Home",
      type: "logo", // Custom type for Image
      href: "/",
      action: null,
    },
    {
      label: "Experiences",
      icon: Waves, // Pool icon replacement
      href: "#experiences",
      action: null,
    },
    {
      label: "Villas",
      icon: Warehouse, // Villa icon replacement (House -> Warehouse)
      href: "#villas",
      action: null,
    },
    {
      label: "Menu",
      icon: Menu,
      href: null,
      action: () => setMenuOpen(true),
    },
  ];

  return (
    // Glassmorphism: bg-black/30 backdrop-blur-xl border-white/10
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-t border-white/10 pb-safe shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around py-4 pb-safe-offset">
        {navItems.map((item) => {
          const isActive =
            item.href === pathname || (item.href === "/" && pathname === "/");
          // Simple active check. Ideally section observation, but simple path/href check is okay for now.

          const colorClass = isActive ? "text-jade-gold" : "text-[#9CA3AF]"; // Gray-400 for inactive

          if (item.action) {
            const Icon = item.icon || Menu; // Fallback ensure Icon is valid
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`flex flex-col items-center gap-1.5 w-16 ${
                  isMenuOpen ? "text-jade-gold" : "text-[#9CA3AF]"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[10px] font-manrope font-medium tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          }

          if (item.type === "logo") {
            return (
              <Link
                key={item.label}
                href={item.href || "#"}
                className={`flex flex-col items-center gap-1.5 w-16 ${colorClass}`}
              >
                {/* Use Golden Logo for Active, otherwise grayscale or opacity */}
                <div
                  className={`relative w-8 h-8 ${isActive ? "" : "opacity-50 grayscale"}`}
                >
                  <Image
                    src="/assets/Golden_Logo.png"
                    alt="Home"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[10px] font-manrope font-medium tracking-wide translate-y-[-2px]">
                  {item.label}
                </span>
              </Link>
            );
          }

          const Icon = item.icon || Warehouse; // Fallback

          return (
            <Link
              key={item.label}
              href={item.href || "#"}
              className={`flex flex-col items-center gap-1.5 w-16 ${colorClass}`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[10px] font-manrope font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
