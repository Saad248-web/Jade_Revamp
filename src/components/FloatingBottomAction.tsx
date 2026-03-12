"use client";

import Link from "next/link";

interface FloatingBottomActionProps {
  price: string;
  linkHref: string;
  linkLabel: string;
}

export default function FloatingBottomAction({
  price,
  linkHref,
  linkLabel,
}: FloatingBottomActionProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#1A1C1E] border-t border-white/10 p-3 md:p-4 md:px-8 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
        <p className="text-white text-gh-label font-bold font-manrope">
          {price}
        </p>
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/contact"
            className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase px-2 py-2 md:px-4 md:py-3 hover:text-white transition-colors border border-white/10 rounded-sm"
          >
            ENQUIRE
          </Link>
          <Link
            href={linkHref}
            className="bg-[#EFCD62] text-[#1A1C1E] text-gh-label font-bold tracking-[0.2em] uppercase px-4 py-2 md:px-8 md:py-3 rounded-sm hover:bg-white transition-colors"
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
