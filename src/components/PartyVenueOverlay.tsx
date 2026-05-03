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
  Play,
  Waves,
  ShieldCheck,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { buildVillaGalleryItems } from "@/lib/villaGallery";
import { getBhk, getEventCapacity, getStayCapacity } from "@/lib/villaDisplay";
import { getOverlayVillaData } from "@/lib/overlayVillaData";
import type { HeroSplitCustom } from "@/lib/heroSplitCarouselVariants";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";
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
import VillaPricingBlocks, {
  buildPartyOverlayPricingBlocks,
} from "@/components/experience/VillaPricingBlocks";
import ExperienceFaqAccordion, {
  ExperiencePolicyCompactList,
} from "@/components/experience/ExperienceFaqAccordion";

interface PartyVenueOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  villa: any;
  overlayPage?: "party";
}

const PartyVenueOverlay: React.FC<PartyVenueOverlayProps> = ({
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
  const [partyFullName, setPartyFullName] = useState("");
  const [partyPhone, setPartyPhone] = useState("");
  const [partyEmail, setPartyEmail] = useState("");
  const [partyDate, setPartyDate] = useState("");
  const [partyType, setPartyType] = useState("Birthday Party");
  const [partyFormError, setPartyFormError] = useState<string | null>(null);

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

  const overlayVilla = getOverlayVillaData((overlayPage ?? "party") as any, villa?.id);
  const v = overlayVilla ?? villa;
  const mapsHref = getVillaGoogleMapsUrl(v);
  const partyPricingBlocks = buildPartyOverlayPricingBlocks(v);

  const images = (() => {
    const gallery = buildVillaGalleryItems(v, 8);
    if (gallery.length > 0) return gallery;
    if (v?.spaces?.length > 0) return v.spaces;
    return [{ name: "Main", image: v?.image }];
  })();

  const displayPrice = (overlayVilla as any)?.overlay?.onwardsPrice ?? null;

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
            />

            {/* INFO SECTION */}
            <div className="px-6 py-8">
              <div className="mb-4">
                <span className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase block mb-1">
                  {villa.type || "PARTY VILLA"}
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
                  className="flex items-center gap-2 rounded-sm outline-none hover:text-[#EFCD62] transition-colors focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                  aria-label="Open location in Google Maps"
                >
                  <MapPin className="w-4 h-4 text-[#EFCD62] shrink-0" />
                  <span className="hover:underline underline-offset-4">
                    {v.location.split("·")[0]}
                  </span>
                </a>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#EFCD62]" />
                  <span>Exclusive Estate</span>
                </div>
              </div>

              <p className="text-white/80 text-gh-body leading-relaxed mb-10 text-justify">
                {villa.description}
              </p>

              {/* QUICK STATS */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {[
                  {
                    label: "Capacity",
                    value: getEventCapacity(villa)?.toString() || villa.stats?.events?.split(" ")[0] || "30",
                    icon: Users,
                  },
                  {
                    label: "BHK",
                    value: getBhk(villa)?.toString() || villa.stats?.bhk?.split(" ")[0] || "4",
                    icon: Home,
                  },
                  {
                    label: "Stay",
                    value:
                      getStayCapacity(villa)?.toString() || villa.stats?.stay?.split(" ")[0] || "15",
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
                  PERFECT FOR CELEBRATIONS:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Birthdays",
                    "Anniversaries",
                    "Pool Parties",
                    "Reunions",
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
                  <h2 className="text-gh-h2 font-philosopher mb-8">
                    Villa Amenities
                  </h2>
                  <div className="space-y-6">
                    {(
                      villa.amenities || [
                        { label: "Private Pool" },
                        { label: "Music System" },
                        { label: "BBQ Setup" },
                        { label: "Indoor Games" },
                        { label: "Kitchen Access" },
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
                </section>

                {/* Pricing Section */}
                {partyPricingBlocks.length > 0 ? (
                  <section id="pricing" className="scroll-mt-24">
                    <VillaPricingBlocks
                      sectionTitle="Party Pricing"
                      blocks={partyPricingBlocks}
                      footnote={
                        <p className="mt-6 text-gh-label text-white/30 leading-relaxed italic">
                          Note: All party pricing is exclusive of GST. Custom
                          packages available.
                        </p>
                      }
                    />
                  </section>
                ) : null}

                {/* Location Section */}
                <section id="location" className="scroll-mt-24">
                  <h2 className="text-gh-h2 font-philosopher mb-8">Location</h2>
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
                </section>

                {/* Walkthrough Section */}
                <section id="walkthrough" className="scroll-mt-24">
                  <h2 className="text-gh-h2 font-philosopher mb-8">
                    Video Walkthrough
                  </h2>
                  <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-black/40 border border-white/10 group cursor-pointer">
                    <Image
                      src="/Villa_Retreats/Magnolia/Hero/hero.webp"
                      alt="Video Cover"
                      fill
                      className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 rounded text-gh-label">
                      1:41
                    </div>
                  </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="scroll-mt-24">
                  <div className="space-y-8">
                    <h2 className="text-gh-h2 font-philosopher">FAQ</h2>
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
                          title: "Check-in / Check-out",
                          desc:
                            "Standard check-in at 2:00 PM and check-out at 11:00 AM. Early check-in subject to availability.",
                        },
                        {
                          title: "Music & Noise",
                          desc:
                            "Outdoor music allowed till 10:00 PM as per local regulations. Indoor music can continue at moderate levels.",
                        },
                        {
                          title: "Refund Policy",
                          desc:
                            "Full refund for cancellations made 15 days prior to check-in. No refunds within 7 days of booking.",
                        },
                      ]}
                    />
                  </div>
                </section>
              </div>

              {/* ENQUIRY FORM */}
              <div
                id="enquiry"
                ref={formRef}
                className="mt-24 pt-24 border-t border-white/10"
              >
                {view === "form" ? (
                  <>
                    <h2 className="text-gh-h1 font-philosopher mb-4">
                      Plan Your Celebration
                    </h2>
                    <p className="text-white/50 text-gh-body mb-12">
                      Share a few details. Our concierge team will help you pick
                      the perfect villa for your party.
                    </p>

                    <form
                      className="space-y-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!partyFullName.trim()) {
                          setPartyFormError("Please enter your full name.");
                          return;
                        }
                        if (!/^[\d\s+()-]{10,}$/.test(partyPhone.trim())) {
                          setPartyFormError(
                            "Please enter a valid phone number (at least 10 digits).",
                          );
                          return;
                        }
                        if (
                          partyEmail.trim() &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                            partyEmail.trim(),
                          )
                        ) {
                          setPartyFormError("Please enter a valid email.");
                          return;
                        }
                        if (!partyDate) {
                          setPartyFormError("Please choose an event date.");
                          return;
                        }
                        setPartyFormError(null);
                        setView("success");
                      }}
                      noValidate
                    >
                      {partyFormError ? (
                        <p
                          className="text-red-400 text-gh-label font-manrope"
                          role="alert"
                        >
                          {partyFormError}
                        </p>
                      ) : null}
                      <div className="relative">
                        <label
                          className={`absolute -top-2.5 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10`}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={partyFullName}
                          onChange={(e) => setPartyFullName(e.target.value)}
                          className="w-full bg-transparent border border-white/20 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label
                            className={`absolute -top-2.5 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10`}
                          >
                            Phone *
                          </label>
                          <input
                            type="tel"
                            value={partyPhone}
                            onChange={(e) => setPartyPhone(e.target.value)}
                            className="w-full bg-transparent border border-white/20 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors"
                            placeholder="+91"
                            autoComplete="tel"
                          />
                        </div>
                        <div className="relative">
                          <label
                            htmlFor="party-event-date"
                            className={`absolute -top-2.5 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10`}
                          >
                            Event date *
                          </label>
                          <input
                            id="party-event-date"
                            type="date"
                            value={partyDate}
                            min={new Date().toISOString().slice(0, 10)}
                            onChange={(e) => setPartyDate(e.target.value)}
                            className="w-full bg-transparent border border-white/20 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors [color-scheme:dark]"
                          />
                        </div>
                      </div>

                      <input
                        type="email"
                        value={partyEmail}
                        onChange={(e) => setPartyEmail(e.target.value)}
                        placeholder="Email (optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/35"
                        autoComplete="email"
                      />

                      <div className="relative">
                        <label
                          className={`absolute -top-2.5 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10`}
                        >
                          Celebration Type
                        </label>
                        <select
                          value={partyType}
                          onChange={(e) => setPartyType(e.target.value)}
                          className={`w-full ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} border border-white/20 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors appearance-none`}
                        >
                          <option>Birthday Party</option>
                          <option>Anniversary</option>
                          <option>Pool Party</option>
                          <option>Get-together</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <p className="text-[11px] text-white/30 pt-2 text-center font-manrope">
                        By proceeding, you agree to our{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={() => onClose()}
                        >
                          Privacy Policy
                        </Link>
                        ,{" "}
                        <Link
                          href="/terms-conditions"
                          className="text-[#EFCD62] hover:underline"
                          onClick={() => onClose()}
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/refund-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={() => onClose()}
                        >
                          Refund Policy
                        </Link>
                      </p>

                      <button
                        type="submit"
                        className="w-full py-5 bg-[#174539] border border-white/10 text-white font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                      >
                        ENQUIRE NOW
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
              </div>
            </div>
      </VillaExperienceOverlayContentFrame>

      <VillaExperienceBookingBottomBar
        villaId={v.id}
        onwardPrice={displayPrice}
        onEnquireClick={() => scrollToSection("enquiry")}
      />
    </MotionDiv>,
    document.body,
  );
};

export default PartyVenueOverlay;
