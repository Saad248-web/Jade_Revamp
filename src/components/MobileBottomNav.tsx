"use client";

import { Waves, Warehouse, Menu, LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  type?: "logo";
  icon?: LucideIcon;
  href: string;
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Home",
      type: "logo",
      href: "/",
    },
    {
      label: "Experiences",
      icon: Waves,
      href: "/experiences",
    },
    {
      label: "Villas",
      icon: Warehouse,
      href: "/villas",
    },
    {
      label: "Menu",
      icon: Menu,
      href: "/menu",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-t border-white/10 pb-safe shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around py-4 pb-safe-offset">
        {navItems.map((item) => {
          const isActive =
            item.href === pathname || (item.href === "/" && pathname === "/");
          const colorClass = isActive ? "text-jade-gold" : "text-[#9CA3AF]";

          if (item.type === "logo") {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-1.5 w-16 ${colorClass}`}
              >
                <div
                  className={`relative w-8 h-8 ${isActive ? "" : "opacity-50 grayscale"}`}
                >
                  <Image
                    src="/assets/Golden_Logo.png"
                    alt="Home"
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <span className="text-[10px] font-manrope font-medium tracking-wide translate-y-[-2px]">
                  {item.label}
                </span>
              </Link>
            );
          }

          const Icon = item.icon || Warehouse;

          return (
            <Link
              key={item.label}
              href={item.href}
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
