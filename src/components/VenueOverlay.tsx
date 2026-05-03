"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Share2,
  MapPin,
  Users,
  Car,
  Home,
  Play,
  Phone,
  Mail,
  User,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { usePathname } from "next/navigation";
import PrimaryButton from "@/components/PrimaryButton";
import { buildVillaGalleryItems } from "@/lib/villaGallery";
import { getEventCapacity, getStayCapacity } from "@/lib/villaDisplay";
import type { OverlayPageKey } from "@/lib/overlayVillaData";
import { getOverlayVillaData } from "@/lib/overlayVillaData";
import type { HeroSplitCustom } from "@/lib/heroSplitCarouselVariants";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";
import VillaPricingBlocks, {
  buildWeddingWeekendOverlayPricingBlocks,
} from "@/components/experience/VillaPricingBlocks";
import ExperienceFaqAccordion, {
  ExperiencePolicyCompactList,
} from "@/components/experience/ExperienceFaqAccordion";
import WeddingVenueEnquiryForm from "@/components/experience/WeddingVenueEnquiryForm";
import { EXPERIENCE_OVERLAY_ROOT_CLASS } from "@/lib/experienceOverlayTheme";
import {
  VillaExperienceBookingBottomBar,
  VillaExperienceHeroCarousel,
  VillaExperienceOverlayCloseFramer,
  VillaExperienceOverlayContentFrame,
  VillaExperienceStickyTabs,
} from "@/components/experience/VillaExperienceOverlayLayout";

interface VenueOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  villa: any;
  context?: "wedding" | "weekend";
  overlayPage?: OverlayPageKey;
}

const VenueOverlay: React.FC<VenueOverlayProps> = ({
  isOpen,
  onClose,
  villa,
  context,
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
  const pathname = usePathname();

  const resolvedContext: VenueOverlayProps["context"] =
    context ??
    (pathname?.includes("/weekend-getaways")
      ? "weekend"
      : pathname?.includes("/weddings")
        ? "wedding"
        : undefined);

  const resolvedPage: OverlayPageKey =
    overlayPage ?? (resolvedContext === "weekend" ? "weekend" : "wedding");

  const overlayVilla = getOverlayVillaData(resolvedPage, villa?.id);
  const v = overlayVilla ?? villa;
  const mapsHref = getVillaGoogleMapsUrl(v);

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

  const price = (overlayVilla as any)?.overlay?.onwardsPrice ?? null;

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
            <div className="px-4 py-8">
              <div className="mb-4">
                <span className="text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase block mb-2">
                  {v.type || "HOBBIT THEMED FARMHOUSE"}
                </span>
                <div className="flex justify-between items-center">
                  <h1 className="text-gh-h1 font-philosopher leading-tight">
                    {v.name}
                  </h1>
                  <button className="p-2 text-white hover:text-[#EFCD62] transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-white/70 font-manrope text-gh-body mb-8">
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-sm outline-none hover:text-[#EFCD62] transition-colors focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                  aria-label="Open location in Google Maps"
                >
                  <MapPin className="w-5 h-5 text-[#EFCD62] shrink-0" />
                  <span className="hover:underline underline-offset-4">{v.location.split("·")[0]}</span>
                </a>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#EFCD62]" />
                  <span>2-acre estate</span>
                </div>
              </div>

              <p className="text-white/70 text-gh-body leading-relaxed mb-12 text-justify">
                {v.description}
              </p>

              {/* QUICK STATS */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {[
                  {
                    label: "Guests",
                    value:
                      getEventCapacity(v)?.toString() ||
                      v.stats?.events?.split(" ")[0] ||
                      (resolvedContext === "weekend" ? "15+" : "600"),
                    icon: Users,
                  },
                  {
                    label: "Parking",
                    value:
                      (overlayVilla as any)?.overlay?.parking ??
                      (resolvedContext === "weekend" ? "20+" : "80"),
                    icon: Car,
                  },
                  {
                    label: "Stay",
                    value:
                      getStayCapacity(v)?.toString() ||
                      v.stats?.stay?.split(" ")[0] ||
                      (resolvedContext === "weekend" ? "6-12" : "20"),
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
                  {(v.perfectFor || []).map((tag: any) => (
                    <span
                      key={typeof tag === "string" ? tag : tag.title}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-white/80 text-gh-label font-manrope"
                    >
                      {typeof tag === "string" ? tag : tag.title}
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
                      Venue Amenities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                      {(
                        v.amenities || [
                          { label: "Lawn Space" },
                          { label: "Private Pool" },
                          { label: "Stay Accommodation" },
                          { label: "Kitchen Access" },
                          { label: "Parking" },
                        ]
                      ).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 group"
                        >
                          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rotate-45 bg-[#EFCD62]" />
                          </div>
                          <span className="text-white font-manrope font-bold text-gh-body uppercase tracking-wider">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="scroll-mt-24">
                  <VillaPricingBlocks
                    blocks={buildWeddingWeekendOverlayPricingBlocks(v)}
                    footnote={
                      <p className="text-white/40 text-gh-label leading-relaxed">
                        Note: Prices are base rates and may vary based on
                        season, day of week, and specific requirements.
                        Additional charges may apply for decorations, catering,
                        and extended hours.
                      </p>
                    }
                  />
                </section>

                {/* Location Section */}
                <section id="location" className="scroll-mt-24">
                  <div className="space-y-8">
                    <h3 className="text-gh-h2 font-philosopher">Location</h3>
                    <a
                      href={mapsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block aspect-video w-full overflow-hidden rounded-sm bg-gray-800 border border-white/10 outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                      aria-label="Open location in Google Maps"
                    >
                      <Image
                        src={
                          v.locationDetails?.mapImage ||
                          "/Villa_Retreats/Magnolia/Spaces/Villa.webp"
                        }
                        alt="Map"
                        fill
                        className="object-cover opacity-80"
                      />
                    </a>
                    <div className="border border-white/10 p-6 md:p-8 rounded-sm bg-white/5 flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-[#EFCD62] shrink-0 mt-1" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <a
                          href={mapsHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-manrope text-gh-body leading-relaxed mb-4 block outline-none rounded-sm hover:text-[#EFCD62] hover:underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                        >
                          {v.locationDetails?.address ||
                            "Tranquil Woods, Kanakapura Road, Bangalore - 560062"}
                        </a>
                        <div className="px-4 py-2 bg-white/5 rounded-sm inline-block">
                          <span className="text-white/60 text-gh-label">
                            {v.locationDetails?.distance ||
                              "Approximately 45 minutes from Bangalore City Center"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8">
                      <h4 className="text-[#EFCD62] font-manrope font-bold text-gh-label uppercase tracking-widest mb-6">
                        WHATS NEARBY:
                      </h4>
                      <div className="space-y-4">
                        {(
                          v.locationDetails?.nearby || [
                            { label: "JW MARRIOT", distance: "1 km away" },
                            { label: "AIRPORT", distance: "5 km away" },
                            { label: "BUS STATION", distance: "2 km away" },
                          ]
                        ).map((place: any) => (
                          <div
                            key={place.label}
                            className="flex justify-between items-center py-2 border-b border-white/5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rotate-45 bg-[#EFCD62]" />
                              <span className="text-white font-bold uppercase tracking-wider text-gh-desc">
                                {place.label}
                              </span>
                            </div>
                            <span className="text-white/60 text-gh-desc">
                              {place.distance || place.dist}
                            </span>
                          </div>
                        ))}
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
                        <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 rounded text-gh-label">
                        1:41
                      </div>
                    </div>
                  </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="scroll-mt-24">
                  <div className="space-y-8">
                    <h3 className="text-gh-h2 font-philosopher">FAQ</h3>
                    <ExperienceFaqAccordion
                      items={(v.faq || []).map((item: any) => ({
                        question: item.question,
                        answer: item.answer,
                      }))}
                    />

                    <div className="pt-8 border-t border-white/5">
                      <h3 className="text-gh-h2 font-philosopher mb-6">
                        Key Policies
                      </h3>
                      <ExperiencePolicyCompactList
                        policies={[
                          {
                            title: "Cancellation Policy",
                            desc:
                              "Full refund if cancelled 90+ days before. 50% refund for 30-90 days. No refund within 30 days.",
                          },
                          {
                            title: "Booking Requirements",
                            desc:
                              "30% advance payment required. Balance due 15 days before event. Refundable security deposit applicable.",
                          },
                          {
                            title: "Outside Vendors",
                            desc:
                              "You can bring your own caterers, decorators, and photographers. Coordination required.",
                          },
                        ]}
                      />
                    </div>
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
                      Plan Your Wedding at Jade
                    </h2>
                    <p className="text-white/60 text-gh-body mb-12">
                      Share a few details. Our wedding team will guide you
                      through venues & pricing.
                    </p>

                    <WeddingVenueEnquiryForm
                      onSuccess={() => setView("success")}
                      onClosePrivacyNav={onClose}
                    />
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
        onwardPrice={price}
        onEnquireClick={() => scrollToSection("enquiry")}
      />
    </MotionDiv>,
    document.body,
  );
};

export default VenueOverlay;
