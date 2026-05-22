"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import LuxuryPattern from "./LuxuryPattern";
import SectionWrapper from "./SectionWrapper";
import { JADE_GREEN } from "@/lib/jadeSectionColors";
import PrimaryButton from "@/components/PrimaryButton";
import {
  usePreloadNeighborImages,
  useSnappedScrollProgress,
} from "@/lib/carouselMotion";
import {
  liquidCarouselBgVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";
import CarouselSwipeLayer from "@/components/ui/CarouselSwipeLayer";

const VILLAS = [
  {
    id: 1,
    category: "HOBBIT THEMED FARMHOUSE",
    title: "Dome Villa",
    description:
      "A hobbit-home inspired retreat set amidst rolling hills, defined by its iconic dome architecture, private pool and immersive connection to nature. Ideal for intimate getaways and quiet celebrations.",
    images: [
      "/Home Page/Featured Villa Retreats/HOBBIT THEMED FARMHOUSE/1-4.webp",
      "/Home Page/Featured Villa Retreats/HOBBIT THEMED FARMHOUSE/Dome Villa Retreats by Jade - Blue v3_Page_01_Image_0001.webp",
      "/Home Page/Featured Villa Retreats/HOBBIT THEMED FARMHOUSE/domeye.webp",
    ],
    mobileImages: [
      "/Website Ratio Changes/dome.webp",
      "/Home Page/Featured Villa Retreats/HOBBIT THEMED FARMHOUSE/Dome Villa Retreats by Jade - Blue v3_Page_01_Image_0001.webp",
      "/Home Page/Featured Villa Retreats/HOBBIT THEMED FARMHOUSE/domeye.webp",
    ],
    link: "/villa-retreats/dome-villa-retreats",
  },
  {
    id: 2,
    category: "HILL VIEW VILLA",
    title: "Retreat on the Ridge",
    description:
      "A hill-facing private villa known for panoramic views, sunset backdrops, and a serene pool setting—designed for group getaways, nature-led retreats, and slow weekends away from the city.",
    images: [
      "/Home Page/Featured Villa Retreats/HILL VIEW VILLA/1.webp",
      "/Home Page/Featured Villa Retreats/HILL VIEW VILLA/2.webp",
      "/Home Page/Featured Villa Retreats/HILL VIEW VILLA/3.webp",
    ],
    mobileImages: [
      "/Website Ratio Changes/ror.webp",
      "/Home Page/Featured Villa Retreats/HILL VIEW VILLA/2.webp",
      "/Home Page/Featured Villa Retreats/HILL VIEW VILLA/3.webp",
    ],
    link: "/villa-retreats/retreat-on-ridge",
  },
  {
    id: 3,
    category: "CONTEMPORARY GLASS VILLA",
    title: "Magnolia",
    description:
      "A modern glass-walled estate with expansive lawns, a private pool, and an in-house theatre—crafted for vibrant celebrations, social gatherings, and large-format experiences with complete privacy.",
    images: [
      "/Home Page/Featured Villa Retreats/CONTEMPORARY GLASS VILLA/1.webp",
      "/Home Page/Featured Villa Retreats/CONTEMPORARY GLASS VILLA/2.webp",
      "/Home Page/Featured Villa Retreats/CONTEMPORARY GLASS VILLA/3.webp",
    ],
    mobileImages: [
      "/Website Ratio Changes/Magnoliaa.webp",
      "/Home Page/Featured Villa Retreats/CONTEMPORARY GLASS VILLA/2.webp",
      "/Home Page/Featured Villa Retreats/CONTEMPORARY GLASS VILLA/3.webp",
    ],
    link: "/villa-retreats/magnolia",
  },
];

export default function FeaturedVillas() {
  const targetRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.6,
    restDelta: 0.001,
  });

  const totalVillas = VILLAS.length;
  const totalSteps = totalVillas + 2;
  const dwellProgress = useSnappedScrollProgress(
    smoothProgress,
    totalSteps + 1,
    reducedMotion,
    0.32,
  );
  const snappedProgress = useSpring(dwellProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  });

  return (
    <SectionWrapper
      ref={targetRef}
      bg={JADE_GREEN}
      className="h-[650vh]"
      pattern={{
        opacity: 0.09,
        strokeColor: "#EFCD62",
        edgeFade: "18vh",
      }}
    >
      <NavbarThemeTrigger theme="white" sectionRef={targetRef} />
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Overlay Pattern */}
        {/* Sections */}
        <div className="relative w-full h-full z-10">
          {/* Panel 0: Intro */}
          <IntroPanel globalProgress={snappedProgress} totalSteps={totalSteps} />

          {VILLAS.map((villa, i) => (
            <VillaSlide
              key={villa.id}
              data={villa}
              index={i + 1}
              globalProgress={snappedProgress}
              totalSteps={totalSteps}
            />
          ))}

          <EndButton globalProgress={snappedProgress} />
        </div>
      </div>
    </SectionWrapper>
  );
}

function IntroPanel({
  globalProgress,
  totalSteps,
}: {
  globalProgress: any;
  totalSteps: number;
}) {
  const step = 1 / totalSteps;

  // Transition: Exit to left after vertical parallax is mostly complete
  const exitStart = step * 0.85;
  const exitEnd = step;

  const x = useTransform(globalProgress, [exitStart, exitEnd], ["0%", "-100%"]);

  // Parallax - Text and Image overlap initially (at center) and then separate
  // Vertical animation finishes before horizontal slide starts
  const textY = useTransform(globalProgress, [0, step * 0.8], [0, -600]);
  const opacity = useTransform(globalProgress, [exitStart, exitEnd], [1, 0]);

  return (
    <motion.div
      style={{ x, opacity, zIndex: 5 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-6 md:px-24 pointer-events-none"
    >
      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.div style={{ y: textY }} className="z-10 relative">
          <span className="font-manrope text-gh-label tracking-[0.3em] uppercase text-[#EFCD62] mb-3 font-bold block">
            FEATURED VILLA RETREATS
          </span>
          <h2 className="font-philosopher text-gh-h1 text-white leading-tight mb-5">
            Spaces That Hold
            <br />
            the Experience
          </h2>
          <p className="font-manrope text-gh-body text-white/80 max-w-2xl mx-auto leading-relaxed">
            Every Jade experience is defined by its setting—chosen for
            atmosphere, flow, and the freedom it allows.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function VillaSlide({
  data,
  index,
  globalProgress,
  totalSteps,
}: {
  data: any;
  index: number;
  globalProgress: any;
  totalSteps: number;
}) {
  const innerRef = useRef<HTMLAnchorElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const reducedMotion = useReducedMotion();

  const carouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(1);
    setCurrentImageIndex((prev) =>
      prev === data.images.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(-1);
    setCurrentImageIndex((prev) =>
      prev === 0 ? data.images.length - 1 : prev - 1,
    );
  };

  usePreloadNeighborImages(data.images, currentImageIndex);

  const swipePrevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) =>
      prev === 0 ? data.images.length - 1 : prev - 1,
    );
  };

  const swipeNextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) =>
      prev === data.images.length - 1 ? 0 : prev + 1,
    );
  };

  // Zoom-safe offset: half-viewport + half-panel + 56px off-screen gap.
  // Ensures exactly one panel is visible at any zoom level (100/125/140/150%).
  const [offsetPx, setOffsetPx] = useState(1000);
  const [vw, setVw] = useState(1920);

  useEffect(() => {
    const computeOffset = () => {
      const w = window.innerWidth;
      const actualWidth = innerRef.current ? innerRef.current.offsetWidth : Math.min(768, w - 48);
      const visibleGap = 56;
      return Math.ceil(w / 2 + actualWidth / 2 + visibleGap);
    };
    const handleResize = () => {
      setOffsetPx(computeOffset());
      setVw(window.innerWidth);
    };
    handleResize();
    const t = setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t);
    };
  }, []);

  const x = useTransform(globalProgress, (p: number) => {
    const slideTime = p * totalSteps;

    // Position of Villa 1 (index=1)
    let villa1Pos;
    if (slideTime <= 1) {
      // During Intro (slideTime 0 to 1), Villa 1 flies in from off-screen right (vw) to center (0)
      villa1Pos = vw - slideTime * vw;
    } else {
      // After Intro, Villa 1 moves left into negative offset continuously
      villa1Pos = -(slideTime - 1) * offsetPx;
    }

    // Every other villa just mathematically locks into exactly offsetPx distance from Villa 1
    return villa1Pos + (index - 1) * offsetPx;
  });

  return (
    <motion.div
      style={{ x, zIndex: index * 10 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none bg-transparent"
    >
      <div className="pointer-events-none relative w-full h-full max-w-[1920px] mx-auto flex flex-col items-center justify-center px-6 md:px-20 lg:px-32 xl:px-48 pb-[64px] sm:pb-0">
        {/* Layout Container: Stacked universally on all screen sizes */}
        <Link
          href={data.link}
          ref={innerRef}
          className="pointer-events-auto relative w-full max-w-3xl mx-auto flex flex-col items-stretch justify-center gap-3 lg:gap-5 group rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EFCD62]"
        >
          <div
            className="relative w-full aspect-[343/420] sm:aspect-[4/3] md:aspect-[21/10] lg:h-[48vh] overflow-hidden shadow-2xl rounded-none bg-black shrink-0"
            style={{ perspective: "1500px" }}
          >
            <div className="w-full h-full relative">
              {data.mobileImages ? (
                <>
                  {/* Mobile & Tab View */}
                  <div className="block lg:hidden w-full h-full relative">
                    <AnimatePresence mode="sync" initial={false} custom={carouselCustom}>
                      <motion.div
                        key={currentImageIndex}
                        custom={carouselCustom}
                        variants={liquidCarouselBgVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full"
                        style={{
                          transformStyle: "preserve-3d",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <Image
                          src={data.mobileImages[currentImageIndex]}
                          alt={data.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1400px"
                          priority={currentImageIndex === 0}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  {/* Desktop View */}
                  <div className="hidden lg:block w-full h-full relative">
                    <AnimatePresence mode="sync" initial={false} custom={carouselCustom}>
                      <motion.div
                        key={currentImageIndex}
                        custom={carouselCustom}
                        variants={liquidCarouselBgVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full"
                        style={{
                          transformStyle: "preserve-3d",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <Image
                          src={data.images[currentImageIndex]}
                          alt={data.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 95vw, 1400px"
                          priority={currentImageIndex === 0}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <AnimatePresence mode="sync" initial={false} custom={carouselCustom}>
                  <motion.div
                    key={currentImageIndex}
                    custom={carouselCustom}
                    variants={liquidCarouselBgVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full"
                    style={{
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <Image
                      src={data.images[currentImageIndex]}
                      alt={data.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 95vw, 1400px"
                      priority={currentImageIndex === 0}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
              <CarouselSwipeLayer
                onPrev={swipePrevImage}
                onNext={swipeNextImage}
                slideCount={data.images.length}
                className="absolute inset-0 z-[50] touch-pan-y"
              />
              {/* Navigation Arrows */}
              <div className="absolute bottom-0 left-0 z-[100]">
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="p-4 bg-black/40 backdrop-blur-md text-white hover:bg-[#EFCD62] hover:text-black transition-colors rounded-none border-t border-r border-white/10 pointer-events-auto cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
              </div>
              <div className="absolute bottom-0 right-0 z-[100]">
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="p-4 bg-black/40 backdrop-blur-md text-white hover:bg-[#EFCD62] hover:text-black transition-colors rounded-none border-t border-l border-white/10 pointer-events-auto cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="relative w-full flex flex-col items-start text-left mt-2 h-auto shrink-0 pb-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-manrope text-gh-label tracking-[0.2em] uppercase text-[#EFCD62] mb-2 font-bold"
            >
              {data.category}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-philosopher text-gh-h2 text-white leading-none mb-3"
            >
              {data.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-manrope text-gh-body text-white/80 leading-relaxed mb-5 lg:mb-6 line-clamp-3"
            >
              {data.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase group-hover:gap-4 transition-all">
                Learn more about {data.title} <ArrowRight className="w-5 h-5" />
              </span>
            </motion.div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

function EndButton({ globalProgress }: { globalProgress: any }) {
  const opacity = useTransform(globalProgress, [0.85, 1.0], [0, 1]);
  const scale = useTransform(globalProgress, [0.85, 1.0], [0.8, 1]);
  const y = useTransform(globalProgress, [0.85, 1.0], [60, 0]);
  const pointerEvents = useTransform(
    globalProgress,
    [0.85, 0.9],
    ["none", "auto"],
  );

  return (
    <motion.div
      style={{ opacity, scale, y, zIndex: 110 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div style={{ pointerEvents: pointerEvents as any }} className="pointer-events-auto">
        <PrimaryButton
          href="/villa-retreats"
          className="rounded-none shadow-[0_16px_40px_rgba(239,205,98,0.4)] hover:shadow-[0_20px_50px_rgba(239,205,98,0.6)] transition-transform duration-300 hover:scale-[1.03]"
        >
          <span className="font-bold whitespace-nowrap">Explore All Villa Retreats</span>
        </PrimaryButton>
      </div>
    </motion.div>
  );
}
