"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import CorporateHeader from "@/components/CorporateHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import {
  Home,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Users,
  Wifi,
  Coffee,
  Heart,
  Music,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import LiveBackground from "@/components/LiveBackground";
import Footer from "@/components/Footer";

export default function PartyVillasPage() {
  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative h-screen w-full flex flex-col items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/celebrations_friends.png"
            alt="Party Villas"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content - Grouped at the Bottom */}
        <div className="relative z-10 flex flex-col items-center justify-end text-center px-6 w-full max-w-4xl mx-auto h-full pb-24 lg:pb-36">
          {/* Content Group - Tight Spacing */}
          <div className="flex flex-col items-center w-full">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-12 md:w-16 mb-4"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src="/assets/White_Logo.png"
                  alt="Jade Logo"
                  fill
                  sizes="(max-width: 768px) 48px, 64px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Headline & Description */}
            <div className="flex flex-col items-center max-w-2xl mb-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-philosopher text-white mb-4 leading-tight text-center">
                Celebrate in Style with
                <br />
                Jade Party Villas
              </h1>

              <p className="text-white/90 font-manrope text-sm md:text-base leading-relaxed text-center px-4">
                Host birthdays, pool parties, reunions or milestone celebrations
                in exclusive Jade villas with private pools, curated setups &
                personalized experiences.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-row gap-3 w-full max-w-md">
              <button className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors py-4 px-4 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> VENUES
              </button>
              <button className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors py-4 px-4 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold flex items-center justify-center gap-2">
                <Download className="w-4 h-4" strokeWidth={2.5} /> BROCHURE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ANIMATED TEXT SECTION */}
      <PartyAnimatedText />

      {/* SECTION 3: PARTY TYPES CAROUSEL */}
      <PartyTypesSection />

      {/* SECTION 4: CURATED EXPERIENCES */}
      <CuratedExperiencesSection />

      {/* SECTION 5: SPACES MADE FOR CELEBRATIONS */}
      <SpacesForCelebrationsSection />

      <Footer />
    </main>
  );
}

function PartyAnimatedText() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lines = [
    "Jade's private villas offer the perfect",
    "setting for unforgettable celebrations.",
    "Whether it's a birthday, anniversary,",
    "pool party, or reunion with friends,",
    "each space is designed for private",
    "gatherings with curated setups, great",
    "music, and moments worth celebrating.",
  ];

  const fadeOutStart = 0.8;
  const sectionY = useTransform(
    scrollYProgress,
    [0, fadeOutStart, 1],
    [0, 0, -50],
  );

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <LiveBackground />

        <motion.div
          style={{ y: sectionY }}
          className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center pt-16 md:pt-24"
        >
          <p className="text-[#EFCD62] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-12 text-center">
            CELEBRATIONS, REIMAGINED
          </p>

          <h2 className="font-manrope font-light text-base md:text-3xl lg:text-5xl leading-[1.8] md:leading-[1.6] text-white/90 flex flex-col items-center">
            {lines.map((line, idx) => {
              const start = idx * 0.08;
              const end = start + 0.12;
              const opacity = useTransform(
                scrollYProgress,
                [start, end, fadeOutStart, 1],
                [0, 1, 1, 0],
              );

              return (
                <motion.span
                  key={idx}
                  style={{ opacity }}
                  className="block text-center"
                >
                  {line}
                </motion.span>
              );
            })}
          </h2>

          <motion.div
            style={{
              height: useTransform(scrollYProgress, [0.7, 0.9], [0, 200]),
              opacity: useTransform(scrollYProgress, [0.7, 0.8], [0, 1]),
            }}
            className="w-px bg-white/20 mt-16 md:mt-24 mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}

function PartyTypesSection() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const slides = [
    {
      title: "Pool Parties",
      desc: "Celebrate poolside with loungers, BBQ setups, cocktail stations, and vibrant lighting.",
      image: "/assets/poolside_exp.png",
    },
    {
      title: "Bachelor/Bachelorette Parties",
      desc: "Private villas designed for pre-wedding celebrations with music, entertainment, and curated dining.",
      image: "/assets/caravan_journey.png", // Using relevant existing assets
    },
    {
      title: "Reunions & Graduation Parties",
      desc: "Spacious villas perfect for reconnecting, celebrating milestones, and hosting memorable gatherings.",
      image: "/assets/outdoor_dining.png",
    },
    {
      title: "Birthdays & Anniversaries",
      desc: "Host memorable celebrations in beautifully curated villas with décor, dining, music, and private pools.",
      image: "/assets/celebrations_friends.png",
    },
  ];

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="py-24 bg-[#141517]">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="relative">
          {/* Header Area */}
          <div className="relative z-10 mb-10">
            <p className="text-[#EFCD62] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase font-manrope mb-6">
              WHAT WE OFFER
            </p>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-4xl md:text-6xl font-philosopher text-white leading-tight">
                Party Types
              </h2>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-none border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 stroke-[1.25]" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-none border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                >
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 stroke-[1.25]" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Content */}
          <div className="relative aspect-[4/5] md:aspect-[21/9] w-full bg-[#121417] overflow-hidden mb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[activeSlide].image}
                  alt={slides[activeSlide].title}
                  fill
                  sizes="100vw"
                  className="object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col items-center justify-end pb-12 md:pb-20 px-8 text-center">
                  <h3 className="text-3xl md:text-6xl font-philosopher text-white mb-4">
                    {slides[activeSlide].title}
                  </h3>
                  <p className="text-white/60 font-manrope text-xs md:text-base max-w-xl mx-auto leading-relaxed">
                    {slides[activeSlide].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Button */}
          <div className="relative z-10 pt-4">
            <button className="w-full bg-[#EFCB62] border-[1.5px] border-[#634F1B] text-[#634F1B] font-manrope font-bold py-6 md:py-8 flex items-center justify-center gap-4 hover:bg-[#E5C158] transition-all uppercase tracking-[0.3em] text-[12px] md:text-sm group">
              BOOK A PARTY VILLA
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CuratedExperiencesSection() {
  const experiences = [
    { title: "DJ & Music Setup", image: "/assets/music_exp.png" },
    { title: "BBQ & Live Grills", image: "/assets/bbq_exp.png" },
    { title: "Cocktail Bar Setup", image: "/assets/poolside_exp.png" },
    { title: "Bonfire Nights", image: "/assets/bonfire_exp.png" },
    { title: "Movie Under the Stars", image: "/assets/movie_exp.png" },
    { title: "Themed Decor & Styling", image: "/assets/dinner_exp.png" },
  ];

  return (
    <section className="py-24 bg-[#141517]">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#EFCD62] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6">
            PERSONALIZE YOUR CELEBRATION
          </p>
          <h2 className="text-4xl md:text-6xl font-philosopher text-white">
            Curated Experiences
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-[4/5] overflow-hidden group border border-white/5"
            >
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center p-4 text-center">
                <h3 className="text-white text-lg md:text-2xl font-philosopher leading-tight">
                  {exp.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpacesForCelebrationsSection() {
  const cards = [
    {
      label: "enjoy",
      title: "PRIVATE PARTY VILLAS",
      desc: "Exclusive villas with private pools and spacious outdoor areas designed for unforgettable celebrations.",
    },
    {
      label: "customise",
      title: "YOUR CELEBRATION",
      desc: "Tailor décor, dining, and music to match your theme and make your occasion truly yours.",
    },
    {
      label: "experience",
      title: "EXPERT HOSTING",
      desc: "From planning to execution, our team ensures every detail is taken care of for a seamless event.",
    },
  ];

  return (
    <section className="py-24 bg-[#1A1C1E] border-t border-white/5">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#EFCD62] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6">
            WHY CELEBRATE AT JADE
          </p>
          <h2 className="text-4xl md:text-6xl font-philosopher text-white max-w-3xl mx-auto leading-tight">
            Spaces Made for Celebrations
          </h2>
        </div>

        {/* Cards */}
        <div className="relative mb-8 md:mb-12 -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24">
          <div className="flex overflow-x-auto hide-scrollbar gap-6 snap-x snap-mandatory pb-8 lg:justify-center">
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative p-8 md:p-10 w-[280px] md:w-[320px] lg:w-[350px] aspect-[3/4] flex flex-col justify-between bg-gradient-to-b from-[#2C2E31] to-[#1A1C1E] border border-white/5 group hover:border-[#EFCD62]/30 transition-colors flex-shrink-0 snap-center first:ml-0"
              >
                <div>
                  <p className="text-[#EFCD62] font-philosopher italic text-lg mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {card.label}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-bold font-manrope text-white leading-tight tracking-tight uppercase">
                    {card.title.split(" ").map((word, i) => (
                      <React.Fragment key={i}>
                        {word}
                        <br />
                      </React.Fragment>
                    ))}
                  </h3>
                </div>
                <p className="text-white/50 font-manrope text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Text & Button */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-white/60 font-philosopher text-sm md:text-base leading-relaxed italic px-4">
            Private villas and curated experiences designed to make every
            celebration a masterpiece.
          </p>
          <button className="w-full bg-[#EFCB62] border-[1.5px] border-[#634F1B] text-[#634F1B] font-manrope font-bold py-5 md:py-7 flex items-center justify-center gap-4 hover:bg-[#E5C158] transition-all uppercase tracking-[0.2em] text-[12px] md:text-sm group">
            PLAN YOUR CELEBRATION
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
