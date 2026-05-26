"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import JadeImage from "@/components/ui/JadeImage";
import { useMediaMinLg } from "@/lib/useMediaMinLg";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import PrimaryButton from "@/components/PrimaryButton";
import { experiencePanelTextOpacity } from "@/lib/experiencePanelMotion";
import {
  experiencePanelHref,
  villaListingPath,
} from "@/lib/appRoutes";
import {
  scrollLinkedPanelAreaClass,
  scrollLinkedPanelBodyClass,
  scrollLinkedPanelOuterClass,
  scrollLinkedPanelImageFrameClass,
  scrollLinkedPanelSlideClass,
  scrollLinkedPanelSlideInteractiveClass,
  scrollLinkedPanelStackClass,
  scrollLinkedPanelStackWrapClass,
  scrollLinkedSectionHeaderClass,
  scrollLinkedStickyStageClass,
  scrollLinkedStickyStageInnerClass,
} from "@/lib/scrollLinkedPanelLayout";

const PANELS = [
  {
    id: "weekend",
    title: "Weekend Getaways",
    subtext:
      "A day or two with your friends and family away from the bustling city in the wilderness is truly on everyone’s wishlist.",
    cta: "SEE WHAT A GETAWAY LOOKS LIKE",
    href: experiencePanelHref("Weekend Getaways"),
    image: "/Experiences/Weekend Getaways/1-Hero/casual stays.webp",
    mobileImage: "/Website Ratio Changes/Weekend_GetAways.webp",
  },
  {
    id: "celebrations",
    title: "Celebrations & Parties",
    subtext:
      "Birthdays, pool parties and bachelor celebrations unfold across private farmhouse Villas with pools, open lawns, and entertainment-ready spaces.",
    cta: "SEE HOW CELEBRATIONS COME ALIVE",
    href: experiencePanelHref("Party Venues"),
    image: "/Home Page/2-Experiences/celebrations & parties.webp",
    mobileImage: "/Website Ratio Changes/POOL PARTY.webp",
  },
  {
    id: "weddings",
    title: "Weddings",
    subtext:
      "Intimate ceremonies to grand, multi-day wedding celebrations, set amid private gardens, sprawling lawns, and luxury rooms.",
    cta: "SEE HOW WEDDINGS UNFOLD",
    href: experiencePanelHref("Weddings"),
    image: "/Experiences/Weddings/1-Hero/2 (1).webp",
  },
  {
    id: "corporate",
    title: "Corporate Offsites",
    subtext:
      "Unwinding and ice-breaking sessions with colleagues, away from cubicles and glass walls, in private farmhouses ideal for offsites or workations.",
    cta: "SEE HOW TEAMS GATHER",
    href: experiencePanelHref("Corporate Retreats"),
    image: "/Experiences/Corporate Retreats/1-Hero/xhero.webp",
  },
  {
    id: "wellness",
    title: "Wellness Retreats",
    subtext:
      "Element-led wellness restoration through mud baths, massages, spa and aroma therapies, designed for deep rejuvenation.",
    cta: "SEE HOW RETREAT TAKES SHAPE",
    href: experiencePanelHref("Wellness Retreats"),
    image:
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Nature & Nearby Escapes.webp",
  },
  {
    id: "caravans",
    title: "Journeys in Caravans",
    subtext:
      "Luxury motor caravans carry the idea of private retreat onto the road, offering comfort and privacy for glamping, pilgrimages or any evolving journeys.",
    cta: "SEE HOW THE JOURNEY UNFOLDS",
    href: experiencePanelHref("caravans"),
    image: "/Experiences/Caravan/1-Hero/6.webp",
  },
  {
    id: "private-villas",
    title: "Private Villas",
    subtext:
      "A curated collection of fully private farmhouses, suited for everything from quiet stays to vibrant celebrations and bespoke experiences.",
    cta: "SEE THE Villas THAT HOST IT ALL",
    href: experiencePanelHref("villas"),
    image: "/Villa_Retreats/Magnolia/Hero/hero.webp",
    mobileImage: "/Website Ratio Changes/Magnoliaa.webp",
  },
];

export default function ExperiencesScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const totalSteps = PANELS.length + 1;
  const panelCount = PANELS.length;

  return (
    <section ref={targetRef} className="relative h-[800vh] bg-[#1A1C1E]">
      <motion.div
        className={`${scrollLinkedStickyStageClass} ${scrollLinkedStickyStageInnerClass} bg-[#1A1C1E]`}
      >
        <motion.div className={scrollLinkedSectionHeaderClass}>
          <span className="font-manrope text-gh-label tracking-[0.3em] uppercase font-semibold text-jade-gold drop-shadow-lg block">
            WAYS JADE IS EXPERIENCED
          </span>
        </motion.div>

        <motion.div className={scrollLinkedPanelAreaClass}>
          {PANELS.map((panel, i) => (
            <PanelSlide
              key={panel.id}
              data={panel}
              index={i}
              globalProgress={scrollYProgress}
              totalSteps={totalSteps}
              panelCount={panelCount}
            />
          ))}
        </motion.div>
        <EndButton globalProgress={scrollYProgress} />
      </motion.div>
    </section>
  );
}

function EndButton({ globalProgress }: { globalProgress: MotionValue<number> }) {
  const opacity = useTransform(globalProgress, [0.85, 1.0], [0, 1]);
  const scale = useTransform(globalProgress, [0.85, 1.0], [0.8, 1]);
  const y = useTransform(globalProgress, [0.85, 1.0], [60, 0]);

  return (
    <motion.div
      style={{ opacity, scale, y, zIndex: 100 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <motion.div className="pointer-events-auto">
        <PrimaryButton
          href={villaListingPath()}
          className="shadow-[0_16px_40px_rgba(239,205,98,0.4)] hover:shadow-[0_20px_50px_rgba(239,205,98,0.6)] transition-transform duration-300 hover:scale-[1.03]"
        >
          <span className="font-bold whitespace-nowrap text-center">
            See Best Experience Villas
          </span>
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
}

function PanelSlide({
  data,
  index,
  globalProgress,
  totalSteps,
  panelCount,
}: {
  data: (typeof PANELS)[number];
  index: number;
  globalProgress: MotionValue<number>;
  totalSteps: number;
  panelCount: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isLg = useMediaMinLg();
  const panelImageSrc = data.mobileImage
    ? isLg
      ? data.image
      : data.mobileImage
    : data.image;

  const [offsetPx, setOffsetPx] = useState(1000);

  useEffect(() => {
    const computeOffset = () => {
      const vw = window.innerWidth;
      const panelWidth =
        vw >= 1280 ? 896 : vw >= 768 ? 672 : vw >= 640 ? 512 : 448;
      const cappedPanel = Math.min(panelWidth, vw - 48);
      const visibleGap = 20;
      return Math.ceil(vw / 2 + cappedPanel / 2 + visibleGap);
    };
    const handleResize = () => setOffsetPx(computeOffset());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const x = useTransform(globalProgress, (p: number) => {
    return (index - p * totalSteps) * offsetPx;
  });

  const zIndex = useTransform(globalProgress, (p: number) => {
    const centered = Math.min(Math.round(p * totalSteps), panelCount - 1);
    return index === centered ? 100 : index * 10;
  });

  const textOpacity = useTransform(globalProgress, (p: number) =>
    experiencePanelTextOpacity(p, index, totalSteps),
  );

  return (
    <motion.div
      style={{ x, zIndex, willChange: "transform" }}
      className={`${scrollLinkedPanelSlideClass} bg-transparent`}
    >
      <motion.div className={scrollLinkedPanelSlideInteractiveClass}>
        <NavbarThemeTrigger theme="white" sectionRef={panelRef} />
        <motion.div className={scrollLinkedPanelOuterClass}>
          <motion.div className={scrollLinkedPanelStackWrapClass}>
            <motion.div className={scrollLinkedPanelStackClass}>
            <motion.div className={scrollLinkedPanelImageFrameClass}>
              <motion.div className="w-full h-full relative">
                <JadeImage
                  src={panelImageSrc}
                  alt={data.title}
                  fill
                  className="object-cover"
                  sizes={
                    data.mobileImage
                      ? isLg
                        ? "600px"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 600px"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 600px"
                  }
                />
                <motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>
            </motion.div>

            <motion.div
              style={{ opacity: textOpacity }}
              className="relative w-full flex flex-col items-start text-left mt-1 shrink-0"
            >
              <motion.h2
                className="font-philosopher text-gh-h2 text-white leading-none mb-2 lg:mb-2.5"
              >
                {data.title}
              </motion.h2>
              <motion.p className={scrollLinkedPanelBodyClass}>
                {data.subtext}
              </motion.p>
              <motion.div className="w-full max-w-md">
                <Link
                  href={data.href || "#"}
                  className="inline-flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase hover:gap-3 transition-all"
                >
                  {data.cta} <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
