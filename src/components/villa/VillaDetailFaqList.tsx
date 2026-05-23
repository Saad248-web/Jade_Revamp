"use client";

import { useState } from "react";

type FaqItem = { question: string; answer: string };

const INITIAL_VISIBLE = 3;

export default function VillaDetailFaqList({ items }: { items: FaqItem[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!items?.length) return null;

  const hasMore = items.length > INITIAL_VISIBLE;
  const visible = expanded ? items : items.slice(0, INITIAL_VISIBLE);

  return (
    <div className="flex flex-col gap-6">
      <dl className="flex flex-col gap-6 m-0">
        {visible.map((item, i) => (
          <div key={i} className="m-0">
            <dt className="flex gap-2.5 items-start m-0">
              <span
                className="w-2 h-2 rotate-45 bg-[#EFCD62] shrink-0 mt-2 opacity-90"
                aria-hidden
              />
              <span className="text-white font-manrope font-semibold text-gh-body leading-snug">
                {item.question}
              </span>
            </dt>
            <dd className="text-white/50 text-gh-desc font-manrope leading-relaxed mt-2 ml-[18px] m-0">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
      {hasMore ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="text-[#EFCD62] uppercase tracking-[0.2em] text-gh-label font-bold font-manrope w-fit hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55 rounded-sm"
        >
          {expanded ? "VIEW LESS" : "VIEW MORE"}
        </button>
      ) : null}
    </div>
  );
}
