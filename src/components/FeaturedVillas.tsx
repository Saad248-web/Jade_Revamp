"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

const VILLAS = [
  {
    id: 1,
    category: "HOBBIT THEMED FARMHOUSE",
    title: "Dome Villa",
    description:
      "A hobbit-home inspired retreat set amidst rolling hills, defined by its iconic dome architecture, private pool and immersive connection to nature. Ideal for intimate getaways and quiet celebrations.",
    desktopImage: "/assets/Dome_Villa.png",
    mobileImage: "/assets/Dome_Villa.png",
    link: "/villas/dome-villa",
  },
  {
    id: 2,
    category: "GARDEN FARM VILLA",
    title: "Lemon Tree",
    description:
      "A farmhouse retreat nestled within a lemon grove, featuring a rooftop pool and a flexible indoor hall—well suited for relaxed getaways, intimate celebrations, and countryside offsites.",
    desktopImage: "/assets/Lemon_Tree_for_Desktop.png",
    mobileImage: "/assets/Lemon_Tree_for_Mobile.png",
    link: "/villas/lemon-tree",
  },
  {
    id: 3,
    category: "HILL VIEW VILLA",
    title: "Retreat on the Ridge",
    description:
      "A hill-facing private villa known for panoramic views, sunset backdrops, and a serene pool setting—designed for group getaways, nature-led retreats, and slow weekends away from the city.",
    desktopImage: "/assets/ROR_for_Desktop.png",
    mobileImage: "/assets/ROR_for_Mobile.png",
    link: "/villas/retreat-on-ridge",
  },
  {
    id: 4,
    category: "CONTEMPORARY GLASS VILLA",
    title: "Magnolia",
    description:
      "A modern glass-walled estate with expansive lawns, a private pool, and an in-house theatre—crafted for vibrant celebrations, social gatherings, and large-format experiences with complete privacy.",
    desktopImage: "/assets/Magnolia_for_Desktop.png",
    mobileImage: "/assets/Magnolia_for_Mobile.png",
    link: "/villas/magnolia",
  },
];

export default function FeaturedVillas() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Smooth scroll spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const totalVillas = VILLAS.length;
  const totalSteps = totalVillas + 2; // Intro + Villas + Final

  return (
    <section ref={targetRef} className="relative h-[650vh] bg-[#0D4032]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Global Label */}
        <div className="absolute top-8 left-0 w-full z-40 flex justify-center pointer-events-none">
          <span className="font-manrope text-xs md:text-sm tracking-[0.2em] uppercase font-bold text-[#EFCD62] drop-shadow-md">
            FEATURED VILLA'S
          </span>
        </div>

        {/* Sections */}
        <div className="relative w-full h-full">
          {/* Panel 0: Intro */}
          <IntroPanel globalProgress={smoothProgress} totalSteps={totalSteps} />

          {/* Villa Slides */}
          {VILLAS.map((villa, i) => (
            <VillaSlide
              key={villa.id}
              data={villa}
              index={i + 1} // Index starts from 1 because Panel 0 is at 0
              globalProgress={smoothProgress}
              totalSteps={totalSteps}
            />
          ))}

          {/* Final Green Section */}
          <FinalGreenSection
            globalProgress={smoothProgress}
            totalSteps={totalSteps}
          />
        </div>
      </div>
    </section>
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

  // Transition: Exit to left
  const exitStart = step * 0.8;
  const exitEnd = step;

  const x = useTransform(globalProgress, [exitStart, exitEnd], ["0%", "-100%"]);

  // Parallax - Text and Image overlap initially (at center) and then separate
  // Image moves down, Text moves up
  const textY = useTransform(globalProgress, [0, step], [0, -200]);
  const imageY = useTransform(globalProgress, [0, step], [0, 200]);
  const opacity = useTransform(globalProgress, [exitStart, exitEnd], [1, 0]);

  return (
    <motion.div
      style={{ x, opacity, zIndex: 50 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-6 md:px-24"
    >
      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.div style={{ y: textY }} className="z-10 relative">
          <span className="font-manrope text-xs tracking-[0.3em] uppercase text-[#EFCD62] mb-4 font-bold block">
            FEATURED VILLA'S
          </span>
          <h2 className="font-philosopher text-5xl md:text-8xl text-white leading-tight mb-6">
            Spaces That Hold
            <br />
            the Experience
          </h2>
          <p className="font-manrope text-sm md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Every Jade experience is defined by its setting—chosen for
            atmosphere, flow, and the freedom it allows.
          </p>
        </motion.div>

        <motion.div
          style={{ y: imageY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-[4/5] md:aspect-video opacity-40 mix-blend-overlay pointer-events-none"
        >
          <Image
            src="/assets/Dome_Villa.png"
            alt="Background Intro"
            fill
            className="object-cover"
          />
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
  const step = 1 / totalSteps;

  const enterStart = index * step - step;
  const enterEnd = index * step;
  const exitStart = index * step;
  const exitEnd = (index + 1) * step;

  // X Position: Slides in from right, active, then slides out to left
  const x = useTransform(
    globalProgress,
    [enterStart, enterEnd, exitEnd],
    ["100%", "0%", "-100%"],
  );

  const scale = useTransform(
    globalProgress,
    [enterStart, enterEnd, exitEnd],
    [1.1, 1, 0.9],
  );

  return (
    <motion.div
      style={{ x, zIndex: index * 10 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0D4032]"
    >
      <div className="relative w-full h-full max-w-[1920px] mx-auto flex flex-col items-center justify-center px-6 md:px-24">
        {/* Layout Container */}
        <div className="relative w-full h-full flex flex-col lg:flex-row items-center justify-center lg:gap-24 pt-8 md:pt-24 pb-12">
          {/* Image Section */}
          <div className="relative w-full lg:w-1/2 aspect-[4/5] lg:aspect-[4/3] max-h-[40vh] lg:max-h-[70vh]">
            <motion.div
              style={{ scale }}
              className="w-full h-full relative overflow-hidden shadow-2xl bg-black rounded-none"
            >
              <Image
                src={data.desktopImage}
                alt={data.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
              {/* Navigation Arrows (Visual) */}
              <div className="absolute bottom-0 left-0 z-20">
                <button className="p-4 bg-black/40 backdrop-blur-md text-white hover:bg-[#EFCD62] hover:text-black transition-colors rounded-none border-t border-r border-white/10">
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
              </div>
              <div className="absolute bottom-0 right-0 z-20">
                <button className="p-4 bg-black/40 backdrop-blur-md text-white hover:bg-[#EFCD62] hover:text-black transition-colors rounded-none border-t border-l border-white/10">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Text Section */}
          <div className="relative w-full lg:w-1/2 flex flex-col items-start text-left mt-4 lg:mt-0 lg:pl-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-manrope text-xs tracking-[0.2em] uppercase text-[#EFCD62] mb-2 font-bold"
            >
              {data.category}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-philosopher text-5xl md:text-7xl text-white leading-none mb-2"
            >
              {data.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-manrope text-sm md:text-lg text-white/80 leading-relaxed mb-4 max-w-lg"
            >
              {data.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href={data.link}
                className="inline-flex items-center gap-2 text-[#EFCD62] text-xs md:text-sm font-bold tracking-widest uppercase hover:gap-4 transition-all"
              >
                Learn more about {data.title} <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FinalGreenSection({
  globalProgress,
  totalSteps,
}: {
  globalProgress: any;
  totalSteps: number;
}) {
  const step = 1 / totalSteps;
  const start = 1.0 - step;
  const y = useTransform(globalProgress, [start, 1.0], ["100%", "0%"]);

  return (
    <motion.div
      style={{ y, zIndex: 100 }}
      className="absolute inset-0 w-full h-full bg-[#0D4032] flex items-center justify-center border-t border-white/5"
    >
      <div className="flex flex-col items-center justify-center p-12">
        <Link
          href="/villas"
          className="flex items-center gap-4 px-8 py-6 bg-[#EFCD62] text-[#1a1d21] rounded-none shadow-xl font-manrope font-bold text-sm tracking-[0.2em] uppercase hover:bg-white transition-colors"
        >
          EXPLORE ALL JADE VILLAS <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
}
