"use client";

import Image from "next/image";
import { Facebook, Instagram, Youtube } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import { OVERLAY_MOBILE_ACTION_BAR_PB_CLASS } from "@/lib/overlayMobileChrome";

const SOCIAL_LINKS = [
  { Icon: Facebook, href: "https://www.facebook.com/jadehospitainment/" },
  { Icon: Instagram, href: "https://www.instagram.com/jadehospitainment/?hl=en" },
  { Icon: Youtube, href: "https://www.youtube.com/@jade_hospitainment" },
] as const;

export type OverlayEnquirySuccessContentProps = {
  onOkay: () => void;
  /** Embedded in FormOverlayLayout — no extra chrome padding */
  embedded?: boolean;
};

/** Shared success body — Partner / Know More / venue enquiry parity */
export default function OverlayEnquirySuccessContent({
  onOkay,
  embedded = false,
}: OverlayEnquirySuccessContentProps) {
  return (
    <div
      className={`flex min-h-full flex-col items-center justify-between gap-8 text-center font-manrope ${
        embedded
          ? "min-h-[min(84dvh,680px)] px-6 md:px-8 py-8 md:py-10 pb-[max(1.75rem,env(safe-area-inset-bottom,0px))]"
          : `px-6 md:px-8 py-8 md:py-10 ${OVERLAY_MOBILE_ACTION_BAR_PB_CLASS} md:pb-10`
      }`}
    >
      <div className="flex w-full shrink-0 flex-col items-center">
        <div className="mb-6 flex h-[160px] w-[160px] shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] shadow-2xl backdrop-blur-md md:h-[180px] md:w-[180px]">
          <div className="relative h-[72px] w-[72px] shrink-0 drop-shadow-2xl md:h-[84px] md:w-[84px]">
            <Image
              src="/assets/JAde%20Correction.png"
              alt="Success"
              fill
              sizes="96px"
              quality={100}
              className="object-contain"
            />
          </div>
        </div>

        <h2
          id="overlay-success-title"
          className="font-philosopher text-gh-h1 text-white text-shadow-sm mb-3"
        >
          We&apos;ve got it from here
        </h2>

        <p className="max-w-sm mx-auto text-gh-body leading-relaxed text-white/90">
          Thanks for sharing your details!
          <br />
          Our team will take a look and reach out shortly to understand things
          better.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-[300px] shrink-0 flex-col gap-5">
        <p className="text-gh-label font-bold tracking-[0.2em] uppercase text-white/60">
          MEANWHILE CHECK US OUT HERE
        </p>

        <div className="flex justify-center gap-3">
          {SOCIAL_LINKS.map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center border border-white/20 bg-white/5 transition-all hover:bg-[#EFCD62] hover:text-black"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <p className="text-gh-label italic text-white/50">Thoughtfully operated. Always.</p>

        <PrimaryButton withArrow={false} className="mt-1 w-full" onClick={onOkay}>
          OKAY
        </PrimaryButton>
      </div>
    </div>
  );
}
