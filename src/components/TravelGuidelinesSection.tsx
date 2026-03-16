"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Diamond } from "lucide-react";

const GUIDELINES = [
  {
    title: "GUEST CAPACITY",
    desc: "The caravan comfortably accommodates 6–8 guests.",
  },
  {
    title: "APPROVED HALT LOCATIONS",
    desc: "Overnight halts are permitted only at approved resorts, caravan parks or private properties with prior permission.",
  },
  {
    title: "NO SMOKING INSIDE",
    desc: "Smoking is strictly not permitted inside the caravan to maintain a clean and comfortable environment for all guests.",
  },
];

export default function TravelGuidelinesSection() {
  return (
    <section className="bg-[#0D4032] py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1920px] mx-auto">
        {/* Banner Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] mb-12 overflow-hidden">
          <Image
            src="/assets/caravan_journey.png"
            alt="Rathaa Caravan"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Content */}
        <div className="max-w-4xl">
          <h2 className="text-[32px] md:text-[42px] font-philosopher text-white leading-tight mb-12">
            Important Travel Guidelines
          </h2>

          <div className="space-y-12 mb-16">
            {GUIDELINES.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="mt-1.5">
                  <div className="w-2.5 h-2.5 bg-[#EFCD62] rotate-45" />
                </div>
                <div>
                  <h3 className="text-[#EFCD62] text-[14px] font-bold tracking-[0.2em] uppercase font-manrope mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-[16px] leading-relaxed font-manrope max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="flex items-center gap-3 text-[#EFCD62] text-[14px] font-bold tracking-[0.2em] uppercase font-manrope group"
            onClick={() => window.open("/guidelines", "_blank")}
          >
            SEE ALL
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
