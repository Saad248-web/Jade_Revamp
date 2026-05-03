"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Share2,
  MapPin,
  Users,
  Home,
  ArrowRight,
  Calendar,
  ChevronRight,
  Play,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { buildVillaGalleryItems } from "@/lib/villaGallery";
import { getEventCapacity, getStayCapacity } from "@/lib/villaDisplay";
import type { OverlayPageKey } from "@/lib/overlayVillaData";
import { getOverlayVillaData } from "@/lib/overlayVillaData";
import type { HeroSplitCustom } from "@/lib/heroSplitCarouselVariants";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";
import VillaPricingBlocks, {
  buildCorporateOverlayPricingBlocks,
} from "@/components/experience/VillaPricingBlocks";
import ExperienceFaqAccordion, {
  ExperiencePolicyCompactList,
} from "@/components/experience/ExperienceFaqAccordion";
import {
  EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS,
  EXPERIENCE_OVERLAY_ROOT_CLASS,
} from "@/lib/experienceOverlayTheme";
import {
  VillaExperienceBookingBottomBar,
  VillaExperienceHeroCarousel,
  VillaExperienceOverlayCloseFramer,
  VillaExperienceOverlayContentFrame,
  VillaExperienceStickyTabs,
} from "@/components/experience/VillaExperienceOverlayLayout";

interface CorporateVenueOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  villa: any;
  overlayPage?: OverlayPageKey;
}

const CorporateVenueOverlay: React.FC<CorporateVenueOverlayProps> = ({
  isOpen,
  onClose,
  villa,
  overlayPage,
}) => {
  const MotionDiv = motion.div;
  const MotionButton = motion.button;
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Amenities");
  const [view, setView] = useState<"form" | "success">("form");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const reducedMotion = useReducedMotion();
  const overlayCarouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };
  const formRef = useRef<HTMLDivElement>(null);
  const corpDateRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [corpFullName, setCorpFullName] = useState("");
  const [corpCompany, setCorpCompany] = useState("");
  const [corpPhone, setCorpPhone] = useState("");
  const [corpEmail, setCorpEmail] = useState("");
  const [corpTeamSize, setCorpTeamSize] = useState("");
  const [corpDate, setCorpDate] = useState("");
  const [corpFormats, setCorpFormats] = useState<Set<string>>(new Set());
  const [corpServices, setCorpServices] = useState<Set<string>>(new Set());
  const [corpPref, setCorpPref] = useState<Set<string>>(new Set());
  const [corpNotes, setCorpNotes] = useState("");
  const [corpError, setCorpError] = useState<string | null>(null);

  const corpToggle = (
    setFn: React.Dispatch<React.SetStateAction<Set<string>>>,
    label: string,
  ) => {
    setFn((prev) => {
      const n = new Set(prev);
      if (n.has(label)) n.delete(label);
      else n.add(label);
      return n;
    });
  };

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentImageIndex(0);
    setDirection(0);
    setView("form");
  }, [isOpen, villa?.id]);

  const overlayVilla = getOverlayVillaData(overlayPage ?? "corporate", villa?.id);
  const v = overlayVilla ?? villa;
  const mapsHref = getVillaGoogleMapsUrl(v);
  const corporatePricingBlocks = buildCorporateOverlayPricingBlocks(v);

  const images = (() => {
    const gallery = buildVillaGalleryItems(v, 8);
    if (gallery.length > 0) return gallery;
    if (v?.spaces?.length > 0) return v.spaces;
    return [{ name: "Main", image: v?.image }];
  })();

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const tabs = ["Amenities", "Pricing", "Location", "Walkthrough", "FAQ"];

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      const container = element.closest(".overflow-y-auto");
      if (container) {
        const offset = 80;
        const elementPosition = element.offsetTop;
        container.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const container = document.querySelector(".fixed.inset-0.z-\\[9999\\]");
    if (!container) return;

    const sectionIds = [
      "amenities",
      "pricing",
      "location",
      "walkthrough",
      "faq",
    ];

    const observerOptions = {
      root: container,
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveTab(id.charAt(0).toUpperCase() + id.slice(1));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isOpen, mounted]);

  if (!mounted || !isOpen || !villa) return null;

  return createPortal(
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={EXPERIENCE_OVERLAY_ROOT_CLASS}
      data-lenis-prevent
    >
      <VillaExperienceOverlayCloseFramer MotionButton={MotionButton} onClose={onClose} />

      <VillaExperienceOverlayContentFrame>
            <VillaExperienceHeroCarousel
              images={images}
              currentImageIndex={currentImageIndex}
              carouselCustom={overlayCarouselCustom}
              onPrev={prevImage}
              onNext={nextImage}
              fallbackSlideLabel="Property"
            />

            {/* INFO SECTION */}
            <div className="px-6 py-8">
              <div className="mb-4">
                <span className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase block mb-1">
                  {villa.type || "HOBBIT-INSPIRED CORPORATE RETREAT"}
                </span>
                <div className="flex justify-between items-center">
                  <h1 className="text-gh-h1 font-philosopher leading-tight">
                    {villa.name}
                  </h1>
                  <button className="p-2 text-white/70 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-4 text-white/70 font-manrope text-gh-label mb-8">
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#EFCD62] focus-visible:outline-offset-2 rounded-sm"
                >
                  <MapPin className="w-4 h-4 text-[#EFCD62]" />
                  <span>{v.location.split("·")[0]}</span>
                </a>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#EFCD62]" />
                  <span>2-acre private retreat</span>
                </div>
              </div>

              <p className="text-white/80 text-gh-body leading-relaxed mb-10 text-justify">
                {villa.description ||
                  `${villa.name} by Jade is an expansive corporate retreat featuring private spaces, lush lawns, and dedicated outdoor areas. Designed for corporate offsites, team celebrations, and immersive workations, the venue balances structured productivity with open-air engagement.`}
              </p>

              {/* QUICK STATS */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {[
                  {
                    label: "Offsite Cap.",
                    value: getEventCapacity(villa)?.toString() || villa.stats?.events?.split(" ")[0] || "500",
                    icon: Users,
                  },
                  {
                    label: "Meeting Space",
                    value:
                      villa.stats?.lawn ||
                      villa.stats?.villaArea ||
                      "Lawn",
                    icon: Calendar,
                  },
                  {
                    label: "Stay Cap.",
                    value: getStayCapacity(villa)?.toString() || villa.stats?.stay?.split(" ")[0] || "20",
                    icon: Home,
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center py-6 border border-white/10 bg-white/5 rounded-sm"
                  >
                    <stat.icon className="w-5 h-5 text-[#EFCD62] mb-3" />
                    <span className="text-white font-philosopher text-gh-scroll md:text-gh-h3 mb-1">
                      {stat.value}
                    </span>
                    <span className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* PERFECT FOR */}
              <div className="mb-12">
                <h4 className="text-white font-manrope font-bold text-gh-label uppercase tracking-widest mb-4">
                  Perfect for:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Corporate Offsites",
                    "Leadership Retreats",
                    "Team Outings",
                    "Workations",
                    "Recognition Events",
                  ].map((tag: string) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-white/80 text-gh-label font-manrope"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <VillaExperienceStickyTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabClick={(tab) => scrollToSection(tab)}
              />

              {/* ALL SECTIONS RENDERED STATICALLY */}
              <div className="space-y-24">
                {/* Amenities Section */}
                <section id="amenities" className="scroll-mt-24">
                  <div className="space-y-8">
                    <h3 className="text-gh-h2 font-philosopher">
                      Corporate Amenities
                    </h3>
                    <div className="space-y-6">
                      {(
                        villa.amenities || [
                          { label: "Conference Room" },
                          { label: "High-speed Wi-Fi" },
                          { label: "AV Equipment" },
                          { label: "Team Building Areas" },
                          { label: "Dining Hall" },
                        ]
                      ).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 sm:gap-4">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 bg-[#EFCD62] shrink-0" />
                          <span className="text-white font-manrope font-bold text-gh-body uppercase tracking-wider">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Pricing Section */}
                {corporatePricingBlocks.length > 0 ? (
                  <section id="pricing" className="scroll-mt-24">
                    <VillaPricingBlocks
                      sectionTitle="Corporate Pricing"
                      blocks={corporatePricingBlocks}
                      footnote={
                        <p className="mt-6 text-gh-label text-white/30 leading-relaxed italic">
                          Note: All corporate pricing is exclusive of GST. Custom
                          packages for team building activities available.
                        </p>
                      }
                    />
                  </section>
                ) : null}

                {/* Location Section */}
                <section id="location" className="scroll-mt-24">
                  <div className="space-y-8">
                    <h3 className="text-gh-h2 font-philosopher">Location</h3>
                    <div className="rounded-xl overflow-hidden border border-white/5 bg-white/5">
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block aspect-video w-full bg-white/10 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EFCD62]/60"
                        aria-label="Open location in Google Maps"
                      >
                        <Image
                          src={
                            v.locationDetails?.mapImage ||
                            "/Villa_Retreats/Magnolia/Spaces/Villa.webp"
                          }
                          alt="Map"
                          fill
                          className="object-cover opacity-60"
                        />
                      </a>
                      <div className="p-6">
                        <div className="flex gap-4 mb-6">
                          <MapPin className="w-6 h-6 text-[#EFCD62] shrink-0" aria-hidden />
                          <div className="min-w-0">
                            <a
                              href={mapsHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gh-body font-manrope leading-relaxed text-white outline-none rounded-sm hover:text-[#EFCD62] hover:underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:ring-[#EFCD62]/60"
                            >
                              {v.locationDetails?.address || v.location}
                            </a>
                          </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg text-center">
                          <p className="text-gh-label text-white/60">
                            {v.locationDetails?.distance ||
                              "Approximately 45 minutes from Bangalore City Center"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Walkthrough Section */}
                <section id="walkthrough" className="scroll-mt-24">
                  <div className="space-y-8">
                    <h3 className="text-gh-h2 font-philosopher">
                      Video Walkthrough
                    </h3>
                    <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-black/40 border border-white/10 group cursor-pointer">
                      <Image
                        src="/Villa_Retreats/Magnolia/Hero/hero.webp"
                        alt="Video Cover"
                        fill
                        className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="scroll-mt-24">
                  <div className="space-y-8">
                    <h3 className="text-gh-h2 font-philosopher">FAQ</h3>
                    <ExperienceFaqAccordion
                      items={(villa.faq || []).map((item: any) => ({
                        question: item.question,
                        answer: item.answer,
                      }))}
                    />
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5">
                    <h3 className="text-gh-h2 font-philosopher mb-6">
                      Key Policies
                    </h3>
                    <ExperiencePolicyCompactList
                      policies={[
                        {
                          title: "AV Equipment",
                          desc:
                            "Projectors, screens, and basic sound systems are included. Specialized equipment on request.",
                        },
                        {
                          title: "Catering",
                          desc:
                            "In-house culinary team provides all meals. Customized corporate menus available.",
                        },
                        {
                          title: "Booking Policy",
                          desc:
                            "50% advance required to block dates. Full payment due week before the event.",
                        },
                      ]}
                    />
                  </div>
                </section>
              </div>

              {/* ENQUIRY FORM */}
              <section
                id="enquiry"
                ref={formRef}
                className="mt-24 pt-24 border-t border-white/10"
              >
                {view === "form" ? (
                  <>
                    <h2 className="text-gh-h1 font-philosopher mb-4">
                      Plan Your Corporate Retreat
                    </h2>
                    <p className="text-white/60 text-gh-body mb-12">
                      Share a few details. Our corporate team will guide you
                      through venues &amp; pricing.
                    </p>

                    <form
                      className="space-y-6"
                      noValidate
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!corpFullName.trim()) {
                          setCorpError("Please enter your full name.");
                          return;
                        }
                        if (!corpCompany.trim()) {
                          setCorpError("Please enter your company name.");
                          return;
                        }
                        if (!/^[\d\s+()-]{10,}$/.test(corpPhone.trim())) {
                          setCorpError(
                            "Please enter a valid phone number (at least 10 digits).",
                          );
                          return;
                        }
                        if (
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(corpEmail.trim())
                        ) {
                          setCorpError("Please enter a valid email address.");
                          return;
                        }
                        if (!corpTeamSize.trim()) {
                          setCorpError("Please enter an approximate team size.");
                          return;
                        }
                        if (!corpDate) {
                          setCorpError("Please choose an event date.");
                          return;
                        }
                        setCorpError(null);
                        setView("success");
                      }}
                    >
                      {corpError ? (
                        <p className="text-red-400 text-gh-label" role="alert">
                          {corpError}
                        </p>
                      ) : null}

                      <div className="relative">
                        <label
                          className={`absolute -top-3 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10 font-manrope`}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={corpFullName}
                          onChange={(e) => setCorpFullName(e.target.value)}
                          className="w-full bg-transparent border border-white/20 rounded-[4px] px-6 py-4 focus:border-[#EFCD62] outline-none transition-colors text-white text-gh-body"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                          placeholder="Company Name *"
                          value={corpCompany}
                          onChange={(e) => setCorpCompany(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors placeholder:text-white/35"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number *"
                          value={corpPhone}
                          onChange={(e) => setCorpPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors placeholder:text-white/35"
                          autoComplete="tel"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                          type="email"
                          placeholder="Email *"
                          value={corpEmail}
                          onChange={(e) => setCorpEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors placeholder:text-white/35"
                          autoComplete="email"
                        />
                        <input
                          placeholder="Team Size *"
                          value={corpTeamSize}
                          onChange={(e) => setCorpTeamSize(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors placeholder:text-white/35"
                        />
                      </div>

                      <div className="relative">
                        <label
                          htmlFor="corp-event-date"
                          className={`absolute -top-3 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10 font-manrope`}
                        >
                          Event date *
                        </label>
                        <input
                          ref={corpDateRef}
                          id="corp-event-date"
                          type="date"
                          value={corpDate}
                          min={new Date().toISOString().slice(0, 10)}
                          onChange={(e) => setCorpDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 pr-12 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors [color-scheme:dark]"
                        />
                        <button
                          type="button"
                          aria-label="Open date picker"
                          onClick={() => {
                            corpDateRef.current?.showPicker?.();
                            corpDateRef.current?.focus();
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-[#EFCD62] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="py-6">
                        <h4 className="text-white font-bold text-gh-body mb-4">
                          Retreat Format
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                          {[
                            "Leadership Retreat",
                            "Day Outing / Team Outing",
                            "Recognition Programme",
                            "Offsite (Overnight)",
                            "Conference / Workshop",
                            "Success Party",
                          ].map((label) => (
                            <label
                              key={label}
                              className="flex items-center gap-3 cursor-pointer min-h-[1.5rem]"
                            >
                              <input
                                type="checkbox"
                                checked={corpFormats.has(label)}
                                onChange={() =>
                                  corpToggle(setCorpFormats, label)
                                }
                                className="w-4 h-4 shrink-0 rounded-sm border-white/30 bg-transparent accent-[#EFCD62] focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                              />
                              <span className="text-gh-label text-white/70 leading-snug">
                                {label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="py-6 border-t border-white/5">
                        <h4 className="text-white font-bold text-gh-body mb-4">
                          Services Required
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                          {[
                            "Décor & Event Setup",
                            "AV & Presentation Setup",
                            "Emcee / Host",
                            "Photography/Videography",
                            "Catering & F&B",
                            "Team-Building Activities",
                            "DJ & Entertainment",
                            "Not Sure Yet",
                          ].map((label) => (
                            <label
                              key={label}
                              className="flex items-center gap-3 cursor-pointer min-h-[1.5rem]"
                            >
                              <input
                                type="checkbox"
                                checked={corpServices.has(label)}
                                onChange={() =>
                                  corpToggle(setCorpServices, label)
                                }
                                className="w-4 h-4 shrink-0 rounded-sm border-white/30 bg-transparent accent-[#EFCD62] focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                              />
                              <span className="text-gh-label text-white/70 leading-snug">
                                {label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="py-6 border-t border-white/5">
                        <h4 className="text-white font-bold text-gh-body mb-4">
                          Preferred Setting
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                          {[
                            "Outdoor Lawn Setup",
                            "Poolside / Informal Setup",
                            "Indoor Conference Setup",
                            "Indoor & Outdoor",
                          ].map((label) => (
                            <label
                              key={label}
                              className="flex items-center gap-3 cursor-pointer min-h-[1.5rem]"
                            >
                              <input
                                type="checkbox"
                                checked={corpPref.has(label)}
                                onChange={() => corpToggle(setCorpPref, label)}
                                className="w-4 h-4 shrink-0 rounded-sm border-white/30 bg-transparent accent-[#EFCD62] focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                              />
                              <span className="text-gh-label text-white/70 leading-snug">
                                {label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="relative py-6">
                        <textarea
                          placeholder="Additional requests"
                          rows={4}
                          value={corpNotes}
                          onChange={(e) => setCorpNotes(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors placeholder:text-white/35"
                        />
                      </div>

                      <p className="text-[11px] text-white/30 pt-2 text-center font-manrope">
                        By proceeding, you agree to our{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={onClose}
                        >
                          Privacy Policy
                        </Link>
                        ,{" "}
                        <Link
                          href="/terms-conditions"
                          className="text-[#EFCD62] hover:underline"
                          onClick={onClose}
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/refund-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={onClose}
                        >
                          Refund Policy
                        </Link>
                      </p>

                      <button
                        type="submit"
                        className="w-full py-5 bg-[#174539] border border-white/10 text-white font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                      >
                        SUBMIT ENQUIRE
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-[180px] h-[180px] shrink-0 relative mb-8 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl">
                      <div className="w-[84px] h-[84px] shrink-0 relative drop-shadow-2xl">
                        <Image
                          src="/assets/JAde%20Correction.png"
                          alt="Success Check"
                          fill
                          sizes="96px"
                          quality={100}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <h2 className="text-white text-shadow-sm text-[36px] font-philosopher mb-4">
                      We've got it from here
                    </h2>

                    <p className="text-white/90 text-[16px] leading-relaxed mb-12 max-w-sm mx-auto">
                      Thanks for sharing your details!
                      <br />
                      Our team will take a look and reach out shortly to
                      understand things better.
                    </p>

                    <div className="flex flex-col w-full max-w-[300px] mx-auto">
                      <p className="text-white/60 text-[11px] font-bold tracking-[0.2em] uppercase mb-5">
                        MEANWHILE CHECK US OUT HERE
                      </p>

                      <div className="flex justify-center gap-4">
                        {[
                          {
                            Icon: Facebook,
                            href: "https://www.facebook.com/jadehospitainment/",
                          },
                          {
                            Icon: Instagram,
                            href: "https://www.instagram.com/jadehospitainment/?hl=en",
                          },
                          {
                            Icon: Youtube,
                            href: "https://www.youtube.com/@jade_hospitainment",
                          },
                        ].map(({ Icon, href }, i) => (
                          <a
                            key={i}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-[#EFCD62] hover:text-black transition-all"
                          >
                            <Icon className="w-5 h-5" />
                          </a>
                        ))}
                      </div>

                      <p className="text-white/60 text-[13px] mb-10 mt-6">
                        Thoughtfully operated. Always.
                      </p>

                      <PrimaryButton
                        withArrow={false}
                        className="w-full"
                        onClick={() => setView("form")}
                      >
                        SUBMIT ANOTHER
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </section>
            </div>
      </VillaExperienceOverlayContentFrame>

      <VillaExperienceBookingBottomBar
        villaId={v.id}
        onwardPrice={(overlayVilla as any)?.overlay?.onwardsPrice ?? null}
        onEnquireClick={() => scrollToSection("enquiry")}
      />
    </MotionDiv>,
    document.body,
  );
};

export default CorporateVenueOverlay;
