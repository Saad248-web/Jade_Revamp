"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Facebook, Instagram, Youtube, Calendar } from "lucide-react";
import Image from "next/image";
import PrimaryButton from "@/components/PrimaryButton";
import { useAnimation } from "@/context/AnimationContext";

export default function EnquireOverlay() {
  const { isEnquireOverlayOpen, setEnquireOverlayOpen } = useAnimation();
  const [view, setView] = useState<"form" | "success">("form");

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    guests: "",
    preferredDate: "",
    travelFormat: {
      weekendGetaway: false,
      corporateRetreat: false,
      celebrationEvents: false,
    },
    occasion: "",
  });

  const handleClose = () => {
    setEnquireOverlayOpen(false);
    setTimeout(() => {
      setView("form");
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        guests: "",
        preferredDate: "",
        travelFormat: {
          weekendGetaway: false,
          corporateRetreat: false,
          celebrationEvents: false,
        },
        occasion: "",
      });
    }, 500);
  };

  const isFormValid = () => {
    const {
      fullName,
      phoneNumber,
      email,
      guests,
      preferredDate,
      travelFormat,
      occasion,
    } = formData;
    const hasFormat =
      travelFormat.weekendGetaway ||
      travelFormat.corporateRetreat ||
      travelFormat.celebrationEvents;
    return (
      fullName.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      email.trim() !== "" &&
      guests.trim() !== "" &&
      preferredDate.trim() !== "" &&
      occasion.trim() !== "" &&
      hasFormat
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setView("success");
    }
  };

  const toggleFormat = (key: keyof typeof formData.travelFormat) => {
    setFormData((prev) => ({
      ...prev,
      travelFormat: {
        ...prev.travelFormat,
        [key]: !prev.travelFormat[key],
      },
    }));
  };

  if (!isEnquireOverlayOpen) return null;

  return (
    <AnimatePresence>
      {isEnquireOverlayOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Centering wrapper */}
          <div
            className="fixed inset-0 z-[101] flex flex-col items-center justify-end md:justify-center px-4 md:px-0"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Floating close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClose}
              className="w-12 h-12 mb-3 rounded-full bg-[#124131] flex items-center justify-center text-white hover:bg-[#1f5c48] transition-colors shadow-2xl flex-shrink-0 z-[102]"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </motion.button>

            {/* Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full md:w-[600px] h-[80vh] md:h-[82vh] md:max-h-[760px] bg-[#0E3A2F] flex flex-col font-manrope rounded-t-2xl md:rounded-lg shadow-2xl border border-white/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,205,98,0.05)_0%,transparent_50%)] pointer-events-none" />
              {/* CONTENT AREA */}
              <div
                className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-6 pb-8"
                data-lenis-prevent
              >
                {view === "form" ? (
                  <form onSubmit={handleSubmit} className="flex flex-col">
                    <h2 className="text-white text-[32px] leading-tight md:text-gh-h2 font-philosopher mb-3">
                      Enquire Now
                    </h2>
                    <p className="text-white/80 text-gh-body mb-8">
                      Tell us your preferred dates, group size, and occasion.
                      Our team will help you design a curated luxury experience.
                    </p>

                    <div className="flex flex-col gap-5 flex-1">
                      {/* Floating Label Input - Full Name */}
                      <div className="relative border border-white/20 focus-within:border-[#EFCD62] transition-colors rounded-sm group">
                        <label className="absolute -top-3 left-4 bg-[#123A2D] px-1 text-white text-gh-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full bg-transparent px-4 py-3.5 text-white text-gh-body placeholder:text-white/40 focus:outline-none focus:border-transparent font-manrope"
                        />
                      </div>

                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62] transition-colors"
                      />

                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62] transition-colors"
                      />

                      <input
                        type="text"
                        placeholder="Number of Guests"
                        value={formData.guests}
                        onChange={(e) =>
                          setFormData({ ...formData, guests: e.target.value })
                        }
                        className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62] transition-colors"
                      />

                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Preferred Date"
                          value={formData.preferredDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferredDate: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62] transition-colors pr-12"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                      </div>

                      {/* Travel Format Checkboxes */}
                      <div className="mt-2 text-white">
                        <h3 className="text-white text-gh-body mb-4">
                          Interest:
                        </h3>
                        <div className="flex flex-col gap-3">
                          {[
                            {
                              key: "weekendGetaway",
                              label: "Weekend Getaway",
                            },
                            {
                              key: "corporateRetreat",
                              label: "Corporate Retreat",
                            },
                            {
                              key: "celebrationEvents",
                              label: "Celebrations & Events",
                            },
                          ].map((item) => (
                            <label
                              key={item.key}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFormat(
                                  item.key as keyof typeof formData.travelFormat,
                                );
                              }}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <div
                                className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors shrink-0 bg-[#0E2E23]
                                  ${formData.travelFormat[item.key as keyof typeof formData.travelFormat] ? "border-white bg-white" : "border-white/40 group-hover:border-white/80"}`}
                              >
                                {formData.travelFormat[
                                  item.key as keyof typeof formData.travelFormat
                                ] && (
                                  <Check
                                    className="w-3.5 h-3.5 text-[#123A2D]"
                                    strokeWidth={3}
                                  />
                                )}
                              </div>
                              <span className="text-white/90 text-[15px] group-hover:text-white transition-colors">
                                {item.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mt-2 text-white">
                        <textarea
                          placeholder="Occasion / Special Requests"
                          value={formData.occasion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              occasion: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-4 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62] h-24 resize-none font-manrope transition-colors"
                        />
                      </div>
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-6">
                      <button
                        type="submit"
                        disabled={!isFormValid()}
                        className={`w-full py-4 font-manrope font-bold text-gh-label tracking-[0.3em] uppercase transition-all border ${
                          isFormValid()
                            ? "bg-[#EFCD62] hover:bg-white text-black border-transparent"
                            : "bg-transparent border-white/10 text-white/40 cursor-not-allowed"
                        }`}
                      >
                        SEND INQUIRY
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full px-4 text-center pb-8">
                    {/* Glassy circular wrapper for the checkmark */}
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

                    <div className="flex flex-col w-full max-w-[300px] mx-auto mt-auto">
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
                        onClick={handleClose}
                      >
                        OKAY
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
