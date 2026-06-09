"use client";

import { useState } from "react";
import DetailsDrawer from "@/components/DetailsDrawer";

type FaqItem = { question: string; answer: string };

const INITIAL_VISIBLE = 3;

function toDrawerItems(items: FaqItem[]) {
  return items.map((item) => ({
    label: item.question,
    icon: "",
    description: item.answer,
  }));
}

export default function VillaDetailFaqList({ items }: { items: FaqItem[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!items?.length) return null;

  const hasMore = items.length > INITIAL_VISIBLE;
  const preview = items.slice(0, INITIAL_VISIBLE);

  return (
    <>
      <div className="flex flex-col gap-6">
        <dl className="m-0 flex flex-col gap-6">
          {preview.map((item, i) => (
            <div key={i} className="m-0">
              <dt className="m-0 flex items-start gap-2.5">
                <span
                  className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-[#EFCD62] opacity-90"
                  aria-hidden
                />
                <span className="font-manrope text-gh-body font-semibold leading-snug text-white">
                  {item.question}
                </span>
              </dt>
              <dd className="m-0 ml-[18px] mt-2 font-manrope text-gh-desc leading-relaxed text-white/50">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
        {hasMore ? (
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-fit rounded-sm font-manrope text-gh-label font-bold uppercase tracking-[0.2em] text-[#EFCD62] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
          >
            VIEW MORE
          </button>
        ) : null}
      </div>

      <DetailsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="FAQ"
        items={toDrawerItems(items)}
      />
    </>
  );
}
