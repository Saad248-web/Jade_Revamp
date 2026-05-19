"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Headset,
  Check,
  Facebook,
  Instagram,
  Youtube,
  ArrowLeft,
  Upload,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import PrimaryButton from "@/components/PrimaryButton";
import { useAnimation } from "@/context/AnimationContext";
import Link from "next/link";

export default function PartnerOverlay() {
  const { isPartnerOverlayOpen, setPartnerOverlayOpen } = useAnimation();
  const [view, setView] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<
    { file: File; preview: string }[]
  >([]);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    company: "",
    partnershipType: {
      propertyOwner: false,
      weddingPlanner: false,
      corporatePartner: false,
      musicEntertainment: false,
    },
    partnershipOther: "",
    propertyType: {
      privateVilla: false,
      farmhouse: false,
      villaInGated: false,
      retreatSpace: false,
    },
    propertyOther: "",
    propertyDetails: {
      location: "",
      bedrooms: "",
      eventCapacity: "",
    },
  });

  const handleClose = () => {
    setPartnerOverlayOpen(false);
    // Reset view back to form after animation completes
    setTimeout(() => {
      setView("form");
      setSubmitting(false);
      setSubmitError(null);
      setSelectedImages([]); // Clear previews on close
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        company: "",
        partnershipType: {
          propertyOwner: false,
          weddingPlanner: false,
          corporatePartner: false,
          musicEntertainment: false,
        },
        partnershipOther: "",
        propertyType: {
          privateVilla: false,
          farmhouse: false,
          villaInGated: false,
          retreatSpace: false,
        },
        propertyOther: "",
        propertyDetails: {
          location: "",
          bedrooms: "",
          eventCapacity: "",
        },
      });
    }, 500);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const hasPartnership = Object.values(formData.partnershipType).some(Boolean);
    if (!hasPartnership) {
      setSubmitError("Please select at least one partnership interest.");
      return;
    }
    if (formData.fullName.trim().length < 2) {
      setSubmitError("Please enter your name.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formData.email.trim().toLowerCase(),
    );
    if (!emailOk) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("meta", JSON.stringify(formData));
      for (const row of selectedImages) {
        fd.append("photos", row.file);
      }
      const res = await fetch("/api/leads/partner", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error ?? "Submission failed.");
      }

      selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setSelectedImages([]);
      setView("success");
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setSelectedImages((prev) => [...prev, ...newImages].slice(0, 6)); // Limit to 6 for UI stability
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const togglePartnership = (key: keyof typeof formData.partnershipType) => {
    setFormData((prev) => ({
      ...prev,
      partnershipType: {
        ...prev.partnershipType,
        [key]: !prev.partnershipType[key],
      },
    }));
  };

  const togglePropertyType = (key: keyof typeof formData.propertyType) => {
    setFormData((prev) => ({
      ...prev,
      propertyType: {
        ...prev.propertyType,
        [key]: !prev.propertyType[key],
      },
    }));
  };

  if (!isPartnerOverlayOpen) return null;

  return (
    <AnimatePresence>
      {isPartnerOverlayOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Centering wrapper — stops Lenis seeing wheel events */}
          <div
            className="fixed inset-0 z-[101] flex flex-col items-center justify-end md:justify-center"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Floating close button — sits above the panel */}
            <button
              onClick={handleClose}
              className="w-12 h-12 mb-2.5 rounded-full bg-[#124131] flex items-center justify-center text-white hover:bg-[#1f5c48] transition-colors shadow-2xl flex-shrink-0"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>

            {/* Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`relative w-full md:w-[600px] bg-jade-green flex flex-col font-manrope rounded-t-2xl md:rounded-lg shadow-2xl border border-white/10 ${view === "success" ? "h-[80vh] md:h-[650px]" : "max-h-[calc(100dvh-8rem)]"}`}
            >
              {/* Header */}
              {view === "form" && (
                <div className="flex items-center px-6 pt-5 pb-2">
                  <h2 className="text-white text-gh-h2 font-philosopher">
                    Partner with us
                  </h2>
                </div>
              )}

              {/* CONTENT AREA */}
              <div
                className="flex-1 overflow-y-auto scrollbar-hide"
                data-lenis-prevent
              >
                {view === "form" ? (
                  <div className="flex flex-col px-6 pb-6">
                    <p className="text-white/80 text-gh-body mb-5 mt-2">
                      Share a few details. Our team will get back to you shortly
                    </p>

                    <div className="flex flex-col gap-3">
                      {/* Floating Label Input - Full Name */}
                      <div className="relative">
                        <input
                          type="text"
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          className="block w-full bg-transparent border border-white/20 rounded-sm px-4 pt-4 pb-2 text-white text-gh-body focus:outline-none focus:border-[#EFCD62] peer"
                          placeholder=" "
                        />
                        <label
                          htmlFor="fullName"
                          className="absolute text-white/80 text-gh-label duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gh-body peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-white bg-jade-green px-1"
                        >
                          Full Name
                        </label>
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
                        className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62]"
                      />

                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62]"
                      />

                      <input
                        type="text"
                        placeholder="Company/Organization"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62]"
                      />

                      {/* Partnership Type Checkboxes */}
                      <div className="mt-3">
                        <h3 className="text-white text-gh-body mb-2.5">
                          Partnership Type:
                        </h3>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                          {[
                            { key: "propertyOwner", label: "Property Owner" },
                            { key: "weddingPlanner", label: "Wedding Planner" },
                            {
                              key: "corporatePartner",
                              label: "Corporate Partner",
                            },
                            {
                              key: "musicEntertainment",
                              label: "Music & Entertainment",
                            },
                          ].map((item) => (
                            <label
                              key={item.key}
                              onClick={(e) => {
                                e.preventDefault();
                                togglePartnership(
                                  item.key as keyof typeof formData.partnershipType,
                                );
                              }}
                              className="flex items-center gap-2 cursor-pointer group"
                            >
                              <div
                                className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors shrink-0 ${formData.partnershipType[item.key as keyof typeof formData.partnershipType] ? "bg-white border-white" : "border-white group-hover:border-white/70"}`}
                              >
                                {formData.partnershipType[
                                  item.key as keyof typeof formData.partnershipType
                                ] && (
                                  <Check
                                    className="w-3 h-3 text-jade-green"
                                    strokeWidth={3}
                                  />
                                )}
                              </div>
                              <span className="text-white/90 text-gh-label leading-none group-hover:text-white transition-colors tracking-wide">
                                {item.label}
                              </span>
                            </label>
                          ))}
                        </div>
                        <textarea
                          placeholder="Other"
                          value={formData.partnershipOther}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              partnershipOther: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3 mt-3 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62] h-20 resize-none font-manrope"
                        />
                      </div>

                      {/* Property Type Checkboxes */}
                      <div className="mt-2 text-white">
                        <h3 className="text-white text-gh-body mb-2.5">
                          Property Type
                        </h3>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                          {[
                            { key: "privateVilla", label: "Private Villa" },
                            { key: "farmhouse", label: "Farmhouse" },
                            {
                              key: "villaInGated",
                              label: "Villa in gated community",
                            },
                            { key: "retreatSpace", label: "Retreat Space" },
                          ].map((item) => (
                            <label
                              key={item.key}
                              onClick={(e) => {
                                e.preventDefault();
                                togglePropertyType(
                                  item.key as keyof typeof formData.propertyType,
                                );
                              }}
                              className="flex items-center gap-2 cursor-pointer group"
                            >
                              <div
                                className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors shrink-0 ${formData.propertyType[item.key as keyof typeof formData.propertyType] ? "bg-white border-white" : "border-white group-hover:border-white/70"}`}
                              >
                                {formData.propertyType[
                                  item.key as keyof typeof formData.propertyType
                                ] && (
                                  <Check
                                    className="w-3 h-3 text-jade-green"
                                    strokeWidth={3}
                                  />
                                )}
                              </div>
                              <span className="text-white/90 text-gh-label leading-none group-hover:text-white transition-colors tracking-wide">
                                {item.label}
                              </span>
                            </label>
                          ))}
                        </div>
                        <textarea
                          placeholder="Other"
                          value={formData.propertyOther}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyOther: e.target.value,
                            })
                          }
                          className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3 mt-3 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62] h-20 resize-none font-manrope"
                        />
                      </div>

                      {/* Property Details */}
                      <div className="mt-2 flex flex-col gap-3 text-white">
                        <h3 className="text-white text-gh-body mb-0">
                          Property Details
                        </h3>
                        <input
                          type="text"
                          placeholder="Location"
                          value={formData.propertyDetails.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyDetails: {
                                ...formData.propertyDetails,
                                location: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62]"
                        />
                        <input
                          type="text"
                          placeholder="Number of Bedrooms"
                          value={formData.propertyDetails.bedrooms}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyDetails: {
                                ...formData.propertyDetails,
                                bedrooms: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62]"
                        />
                        <input
                          type="text"
                          placeholder="Outdoor Event Capacity"
                          value={formData.propertyDetails.eventCapacity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyDetails: {
                                ...formData.propertyDetails,
                                eventCapacity: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-white text-gh-body placeholder:text-white/80 focus:outline-none focus:border-[#EFCD62]"
                        />
                      </div>

                      {/* Image Upload Area */}
                      <div className="mt-5 flex flex-col items-center">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          multiple
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase mb-5 hover:text-white transition-colors"
                        >
                          UPLOAD IMAGES
                          <Upload className="w-4 h-4" />
                        </button>

                        {selectedImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 w-full mb-2">
                            {selectedImages.map((img, i) => (
                              <div
                                key={i}
                                className="relative aspect-square w-full bg-white/5 border border-white/10 rounded-sm overflow-hidden group/thumb"
                              >
                                <Image
                                  src={img.preview}
                                  alt={`Upload ${i}`}
                                  fill
                                  className="object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(i)}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 transition-colors z-20"
                                >
                                  <X className="w-3.5 h-3.5 text-white stroke-[3]" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {submitError && (
                        <p
                          role="alert"
                          className="text-sm text-red-300 border border-red-400/40 rounded-sm px-3 py-2"
                        >
                          {submitError}
                        </p>
                      )}

                      <p className="text-[11px] text-white/30 pt-2 text-center font-manrope">
                        By proceeding, you agree to our{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={handleClose}
                        >
                          Privacy Policy
                        </Link>
                        ,{" "}
                        <Link
                          href="/terms-conditions"
                          className="text-[#EFCD62] hover:underline"
                          onClick={handleClose}
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/refund-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={handleClose}
                        >
                          Refund Policy
                        </Link>
                      </p>

                      <PrimaryButton
                        className="w-full mt-2"
                        onClick={() => {
                          void handleSubmit();
                        }}
                        disabled={submitting}
                      >
                        {submitting ? "SENDING…" : "SUBMIT"}
                      </PrimaryButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full px-8 text-center pt-6 md:pt-10 pb-10">
                    {/* Glassy circular wrapper for the checkmark */}
                    <div className="w-[180px] h-[180px] md:w-48 md:h-48 shrink-0 relative mb-6 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl">
                      <div className="w-[72px] h-[72px] md:w-[84px] md:h-[84px] shrink-0 relative drop-shadow-2xl">
                        <Image
                          src="/assets/JAde%20Correction.png" // Using provided success check icon
                          alt="Success Check"
                          fill
                          sizes="96px"
                          quality={100}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <h2 className="text-white text-shadow-sm text-gh-h1 font-philosopher mb-3">
                      We've got it from here
                    </h2>

                    <p className="text-white text-gh-body leading-relaxed mb-10 max-w-xs mx-auto">
                      Thanks for sharing your details!
                      <br />
                      Our team will take a look and reach out shortly to
                      understand things better.
                    </p>

                    <div className="flex flex-col w-full max-w-[280px] mx-auto mt-auto">
                      <p className="text-white/60 text-gh-label font-bold tracking-[0.2em] uppercase mb-3">
                        MEANWHILE CHECK US OUT HERE
                      </p>

                      <div className="flex justify-center gap-3">
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

                      <p className="text-white/60 text-gh-label mb-6">
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
