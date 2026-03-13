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
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import LiveBackground from "@/components/LiveBackground";
import Footer from "@/components/Footer";
import ExperienceHero from "@/components/ExperienceHero";
import ScrollSectionComposer, {
  ScrollSlide,
} from "@/components/ScrollSectionComposer";

const animatedSlides: ScrollSlide[] = [
  {
    label: "A DIFFERENT KIND OF WEEKEND ESCAPE",
    lines: [
      "Jade’s private villas offer space,",
      "privacy, and comfort just outside the",
      "city. Whether you’re planning a",
      "relaxed stay with friends, a family",
      "getaway, or a small celebration, each",
      "retreat is designed to let you slow",
      "down and enjoy the moment.",
    ],
  },
];

export default function WeekendGetawaysPage() {
  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        backgroundImage="/assets/weekend_getaway_hero.png"
        backgroundAlt="Weekend Getaways"
        heading={
          <>
            Weekend Getaways
            <br />
            In Bangalore
          </>
        }
        description="Private villas designed for relaxed escapes, small celebrations, and memorable weekends with friends and family."
        buttons={[
          {
            icon: <Calendar className="w-4 h-4" />,
            label: "VENUES",
            onClick: () => {
              const venuesSection = document.getElementById("themed-villas");
              if (venuesSection)
                venuesSection.scrollIntoView({ behavior: "smooth" });
            },
          },
          {
            icon: <Download className="w-4 h-4" />,
            label: "BROCHURE",
            onClick: () => window.open("/brochure.pdf", "_blank"),
          },
        ]}
      />

      {/* SECTION 2: ANIMATED TEXT SECTION */}
      <ScrollSectionComposer slides={animatedSlides} height="250vh" />

      {/* SECTION 3: CAROUSEL SECTION */}
      <WeekendCarouselSection />

      {/* SECTION 4: CURATED EXPERIENCES */}
      <EnhanceYourStaySection />

      {/* SECTION 5: WHY CHOOSE JADE */}
      <WhyChooseJadeSection />

      {/* SECTION 6: THEMED VILLAS */}
      <ThemedVillasSection />

      <Footer />
    </main>
  );
}

function EnhanceYourStaySection() {
  const experiences = [
    { title: "Bonfire Nights", image: "/assets/bonfire_exp.png" },
    { title: "BBQ Evenings", image: "/assets/bbq_exp.png" },
    { title: "Movie Under the Stars", image: "/assets/movie_exp.png" },
    { title: "Candlelight Dinner", image: "/assets/dinner_exp.png" },
    { title: "Outdoor Games", image: "/assets/games_exp.png" },
    { title: "Live Music / DJ", image: "/assets/music_exp.png" },
    { title: "Private Chef Experience", image: "/assets/chef_exp.png" },
    { title: "Poolside Celebrations", image: "/assets/poolside_exp.png" },
  ];

  return (
    <section className="py-24 bg-[#141517]">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase mb-6">
            CURATED EXPERIENCES
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white">
            Enhance Your Stay
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center p-4 text-center">
                <h3 className="text-white text-gh-h3 font-philosopher leading-tight">
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

function WeekendCarouselSection() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const slides = [
    {
      title: "Poolside Mornings",
      desc: "Slow mornings by the pool with coffee, sunlight, and nowhere else to be.",
      image: "/assets/Bathing_Girls.png",
    },
    {
      title: "Evenings Under the Stars",
      desc: "Bonfires, music, and long conversations that stretch late into the night.",
      image: "/assets/evening_under_stars.png",
    },
    {
      title: "Outdoor Dining",
      desc: "Freshly grilled meals, laughter around the table, and food shared with friends.",
      image: "/assets/outdoor_dining.png",
    },
    {
      title: "Nature & Nearby Escapes",
      desc: "Morning treks, quiet lakes, and scenic walks just minutes from your villa.",
      image: "/assets/nature_escapes.png",
    },
    {
      title: "Celebrations With Friends",
      desc: "Birthdays, reunions, or simply an excuse to gather everyone together.",
      image: "/assets/celebrations_friends.png",
    },
    {
      title: "Movie Nights Under The Stars",
      desc: "Projector nights, cozy spaces, and the perfect way to wind down the day.",
      image: "/assets/movie_nights.png",
    },
    {
      title: "Private Dinners",
      desc: "Experience curated dining in the privacy of your villa under the starlit sky.",
      image: "/assets/corporate_retreat.png",
    },
    {
      title: "Golden Evenings",
      desc: "Watching the sun dip below the horizon with those who matter most.",
      image: "/assets/wellness_retreat.png",
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
            <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase font-manrope mb-6">
              WHAT WEEKENDS AT JADE LOOK LIKE
            </p>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-gh-h1 font-philosopher text-white leading-tight">
                Jade Weekends
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
                  <h3 className="text-gh-h1 font-philosopher text-white mb-4">
                    {slides[activeSlide].title}
                  </h3>
                  <p className="text-white/60 font-manrope text-gh-body max-w-xl mx-auto leading-relaxed">
                    {slides[activeSlide].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Button */}
          <div className="relative z-10 pt-4">
            <button className="w-full bg-[#EFCB62] border-[1.5px] border-[#634F1B] text-[#634F1B] font-manrope font-bold py-6 md:py-8 flex items-center justify-center gap-4 hover:bg-[#E5C158] transition-all uppercase tracking-[0.3em] text-gh-label group">
              BOOK JADE WEEKEND
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseJadeSection() {
  const cards = [
    {
      label: "provide",
      title: "PRIVATE VILLAS",
      desc: "Stay in fully private villas designed for relaxed getaways, with no shared spaces and complete freedom to enjoy your time.",
    },
    {
      label: "create",
      title: "ROOM TO UNWIND",
      desc: "Spacious lawns, private pools, and open settings that make it easy to slow down and enjoy the weekend.",
    },
    {
      label: "customise",
      title: "YOUR EXPERIENCE",
      desc: "Add bonfires, BBQ nights, movie screenings, or curated dining experiences to make your getaway truly memorable.",
    },
    {
      label: "host",
      title: "SEAMLESS STAYS",
      desc: "From check-in to curated experiences, our team ensures your weekend getaway is effortless and well taken care of.",
    },
  ];

  return (
    <section className="py-24 bg-[#1A1C1E] border-t border-white/5">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase mb-6">
            WHY CHOOSE JADE
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white max-w-3xl mx-auto leading-tight">
            Designed for Private Weekend Escapes
          </h2>
        </div>

        {/* Cards - Horizontally Stacked and Scrollable */}
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
                  <p className="text-[#EFCD62] font-philosopher italic text-gh-h3 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {card.label}
                  </p>
                  <h3 className="text-gh-h1 font-bold font-manrope text-white leading-tight tracking-tight uppercase">
                    {card.title.split(" ").map((word, i) => (
                      <React.Fragment key={i}>
                        {word}
                        <br />
                      </React.Fragment>
                    ))}
                  </h3>
                </div>
                <p className="text-white/50 font-manrope text-gh-body leading-relaxed group-hover:text-white/70 transition-colors">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Text & Button */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-white/60 font-philosopher text-gh-body leading-relaxed italic px-4">
            Private villas and curated experiences designed to make every
            weekend feel like an escape.
          </p>
          <button className="w-full bg-[#EFCB62] border-[1.5px] border-[#634F1B] text-[#634F1B] font-manrope font-bold py-5 md:py-7 flex items-center justify-center gap-4 hover:bg-[#E5C158] transition-all uppercase tracking-[0.2em] text-gh-label group">
            PLAN YOUR WEEKEND ESCAPE
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ThemedVillasSection() {
  const villas = [
    {
      name: "Dome Villa",
      tag: "HOBBIT-INSPIRED PRIVATE RETREAT",
      image: "/assets/Dome_Villa.png",
    },
    {
      name: "Magnolia",
      tag: "CONTEMPORARY LUXURY VILLA",
      image: "/assets/Magnolia_for_Desktop.png",
    },
    {
      name: "Diamond Pavilion",
      tag: "MODERN ARCHITECTURAL MARVEL",
      image: "/assets/Jade_735_for_Desktop.png",
    },
    {
      name: "Retreat on the Ridge",
      tag: "SCENIC HILLTOP ESCAPE",
      image: "/assets/ROR_for_Desktop.png",
    },
    {
      name: "The Haven",
      tag: "PRIVATE SERENE SANCTUARY",
      image: "/assets/Lemon_Tree_for_Desktop.png",
    },
  ];

  return (
    <section className="py-24 bg-[#141517] border-t border-white/5">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase mb-6">
            OUR VILLAS
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white leading-tight">
            Themed Villas
            <br />
            By Jade
          </h2>
        </div>

        {/* Scrollable List */}
        <div className="relative mb-8 md:mb-12 -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24">
          <div className="flex overflow-x-auto hide-scrollbar gap-8 snap-x snap-mandatory pb-8 lg:justify-center">
            {villas.map((villa, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[400px] snap-center group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6 border border-white/5 group-hover:border-[#EFCD62]/30 transition-colors">
                  <Image
                    src={villa.image}
                    alt={villa.name}
                    fill
                    sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 400px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <div>
                  <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-2 text-left">
                    {villa.tag}
                  </p>
                  <h3 className="text-gh-h2 font-philosopher text-white group-hover:text-[#EFCD62] transition-colors text-left leading-tight">
                    {villa.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="max-w-md mx-auto">
          <button className="w-full bg-[#EFCB62] border-[1.5px] border-[#634F1B] text-[#634F1B] font-manrope font-bold py-5 md:py-6 flex items-center justify-center gap-4 hover:bg-[#E5C158] transition-all uppercase tracking-[0.2em] text-gh-label group">
            VIEW ALL VILLA RETREATS
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
