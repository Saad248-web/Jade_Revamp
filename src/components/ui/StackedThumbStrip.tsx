"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

export type StackedThumbItem = {
  key: string;
  src: string;
  alt: string;
};

export default function StackedThumbStrip({
  items,
  activeIndex,
  direction,
  visibleCount = 4,
  size = 44,
  overlap = 14,
  onSelect,
  className = "",
}: {
  items: StackedThumbItem[];
  activeIndex: number;
  direction: number;
  visibleCount?: number;
  size?: number;
  overlap?: number;
  onSelect?: (index: number) => void;
  className?: string;
}) {
  const safeCount = Math.max(1, Math.min(visibleCount, items.length || 1));
  const step = Math.max(1, size - overlap);

  const windowItems = useMemo(() => {
    if (!items.length) return [];
    const out: Array<{ item: StackedThumbItem; globalIndex: number; order: number }> = [];
    for (let i = 0; i < safeCount; i++) {
      const globalIndex = (activeIndex + i + items.length) % items.length;
      out.push({ item: items[globalIndex], globalIndex, order: i });
    }
    return out;
  }, [activeIndex, items, safeCount]);

  const width = size + step * (safeCount - 1);

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width, height: size }}
      aria-hidden={items.length <= 1}
    >
      <AnimatePresence initial={false}>
        {windowItems.map(({ item, globalIndex, order }) => {
          const scale = 1 - order * 0.06;
          const opacity = 1 - order * 0.18;
          const x = order * step;

          return (
            <motion.button
              key={item.key}
              type="button"
              onClick={onSelect ? () => onSelect(globalIndex) : undefined}
              className="absolute top-0 left-0 overflow-hidden border border-white/15 bg-white/5"
              style={{
                width: size,
                height: size,
                zIndex: safeCount - order,
                borderRadius: 2,
                cursor: onSelect ? "pointer" : "default",
              }}
              initial={{
                x: direction > 0 ? x + step : x - step,
                opacity: 0,
                scale: scale * 0.98,
              }}
              animate={{ x, opacity, scale }}
              exit={{
                x: direction > 0 ? x - step : x + step,
                opacity: 0,
                scale: scale * 0.98,
              }}
              transition={{
                type: "spring",
                stiffness: 520,
                damping: 42,
                mass: 0.6,
              }}
              whileTap={onSelect ? { scale: scale * 0.98 } : undefined}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={`${size}px`}
                className="object-cover"
                priority={order === 0}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    order === 0
                      ? "linear-gradient(to top, rgba(0,0,0,0.25), rgba(0,0,0,0))"
                      : "linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0))",
                }}
              />
              {order === 0 && (
                <div className="absolute inset-0 ring-1 ring-[#EFCD62]/35" />
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

