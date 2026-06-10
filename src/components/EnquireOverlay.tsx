"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import FormOverlayLayout from "@/components/overlays/FormOverlayLayout";
import EnquiryDateRangePicker from "@/components/enquiry/EnquiryDateRangePicker";
import { useAnimation } from "@/context/AnimationContext";
import { OCCASION_OPTIONS } from "@/lib/enquiryFormOptions";
import { formatPreferredDateRange } from "@/lib/enquiryDateRange";
import { isEnquiryDemoMode, simulateEnquirySubmit } from "@/lib/enquiryDemoMode";
import { getEnquiryOverlayVariant } from "@/lib/enquiryOverlayConfig";
import { resolveEnquiryOkayReturnPath } from "@/lib/enquiryReturnPath";
import { sanitizeGuestCountInput } from "@/lib/guestCountInput";
import { sanitizePhoneDigitsInput } from "@/lib/phoneNumberInput";
import {
  enquiryFieldErrors,
  isEnquiryFormValid,
  type EnquiryFieldKey,
} from "@/lib/leadFormValidation";
import {
  getFieldShellClass,
  JADE_FORM_WARN,
  JADE_OVERLAY_FORM_STACK_CLASS,
} from "@/lib/jadeFormTokens";
import JadeFormFieldError from "@/components/ui/form/JadeFormFieldError";
import {
  JadeFloatingField,
  JadeFloatingSelect,
  JadeFloatingTextarea,
} from "@/components/ui/form";

export default function EnquireOverlay() {
  const router = useRouter();
  const {
    isEnquireOverlayOpen,
    setEnquireOverlayOpen,
    enquireReturnPath,
  } = useAnimation();

  const enquiryVariant = useMemo(
    () => getEnquiryOverlayVariant(enquireReturnPath),
    [enquireReturnPath],
  );
  const [view, setView] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    guests: "",
    travelFormat: {
      weekendGetaway: false,
      corporateRetreat: false,
      celebrationEvents: false,
    },
    occasionType: "",
    specialRequests: "",
  });

  const resetOverlayState = () => {
    setTimeout(() => {
      setView("form");
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        guests: "",
        travelFormat: {
          weekendGetaway: false,
          corporateRetreat: false,
          celebrationEvents: false,
        },
        occasionType: "",
        specialRequests: "",
      });
      setCheckIn(null);
      setCheckOut(null);
    }, 500);
  };

  const handleClose = () => {
    setEnquireOverlayOpen(false);
    setSubmitError(null);
    setSubmitting(false);
    resetOverlayState();
  };

  const handleSuccessOkay = () => {
    const returnPath = resolveEnquiryOkayReturnPath(enquireReturnPath);
    handleClose();
    router.push(returnPath);
  };

  useEffect(() => {
    if (!isEnquireOverlayOpen) return;
    setView("form");
    setSubmitError(null);
    setFormData((prev) => ({
      ...prev,
      occasionType: enquiryVariant.defaultOccasionType || "",
    }));
  }, [isEnquireOverlayOpen, enquiryVariant.defaultOccasionType]);

  const fieldErrors = useMemo(
    () => enquiryFieldErrors(formData, checkIn),
    [formData, checkIn],
  );

  const formValid = isEnquiryFormValid(formData, checkIn);

  const showFieldError = (key: EnquiryFieldKey) => {
    if (!fieldErrors[key]) return false;
    if (key === "preferredDate") return checkIn !== null;
    if (key === "fullName") return formData.fullName.trim().length > 0;
    if (key === "phoneNumber") return formData.phoneNumber.trim().length > 0;
    if (key === "email") return formData.email.trim().length > 0;
    if (key === "guests") return formData.guests.trim().length > 0;
    if (key === "occasionType") return formData.occasionType.length > 0;
    if (key === "specialRequests") {
      return (formData.specialRequests ?? "").trim().length > 0;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      if (isEnquiryDemoMode()) {
        await simulateEnquirySubmit();
        setView("success");
        return;
      }

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: enquiryVariant.leadSource,
          payload: {
            ...formData,
            preferredDate: formatPreferredDateRange(checkIn, checkOut),
            enquiryPage: enquireReturnPath ?? undefined,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setView("success");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to send inquiry.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isEnquireOverlayOpen) return null;

  const canDismiss = view === "form" && !submitting;
  const dateShellClass = getFieldShellClass({
    invalid: Boolean(fieldErrors.preferredDate),
    showError: showFieldError("preferredDate"),
    variant: "standard",
  });

  return (
    <AnimatePresence>
      {isEnquireOverlayOpen && (
        <FormOverlayLayout
          onClose={handleClose}
          canDismiss={canDismiss}
          scrollClassName="px-6 pt-6 pb-6 font-manrope relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,205,98,0.05)_0%,transparent_50%)] pointer-events-none" />
          <div className="relative z-[1]">
                {view === "form" ? (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col"
                    noValidate
                  >
                    {submitError ? (
                      <p
                        className="text-sm font-manrope mb-3"
                        style={{ color: JADE_FORM_WARN }}
                        role="alert"
                      >
                        {submitError}
                      </p>
                    ) : null}
                    <h2 className="text-white text-[32px] leading-tight md:text-gh-h2 font-philosopher mb-2.5">
                      {enquiryVariant.title}
                    </h2>
                    <p className="text-white/80 text-gh-body mb-6">
                      {enquiryVariant.description}
                    </p>
                    {isEnquiryDemoMode() ? (
                      <p className="text-white/45 text-xs mb-4 -mt-4">
                        Demo mode: submission is not saved. Connect Postgres and
                        set{" "}
                        <span className="text-white/60">
                          NEXT_PUBLIC_ENQUIRY_DEMO_MODE=false
                        </span>{" "}
                        to enable live leads.
                      </p>
                    ) : null}

                    <div className={JADE_OVERLAY_FORM_STACK_CLASS}>
                      <JadeFloatingField
                        id="enquire-fullName"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={(v) =>
                          setFormData({ ...formData, fullName: v })
                        }
                        theme="overlayGreen"
                        invalid={Boolean(fieldErrors.fullName)}
                        showError={showFieldError("fullName")}
                        errorMessage={fieldErrors.fullName}
                      />

                      <JadeFloatingField
                        id="enquire-phone"
                        label="Phone Number"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        value={formData.phoneNumber}
                        onChange={(v) =>
                          setFormData({
                            ...formData,
                            phoneNumber: sanitizePhoneDigitsInput(v),
                          })
                        }
                        theme="overlayGreen"
                        invalid={Boolean(fieldErrors.phoneNumber)}
                        showError={showFieldError("phoneNumber")}
                        errorMessage={fieldErrors.phoneNumber}
                      />

                      <JadeFloatingField
                        id="enquire-email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(v) =>
                          setFormData({ ...formData, email: v })
                        }
                        theme="overlayGreen"
                        invalid={Boolean(fieldErrors.email)}
                        showError={showFieldError("email")}
                        errorMessage={fieldErrors.email}
                      />

                      <JadeFloatingField
                        id="enquire-guests"
                        label="Number of Guests"
                        inputMode="numeric"
                        autoComplete="off"
                        value={formData.guests}
                        onChange={(v) =>
                          setFormData({
                            ...formData,
                            guests: sanitizeGuestCountInput(v),
                          })
                        }
                        theme="overlayGreen"
                        invalid={Boolean(fieldErrors.guests)}
                        showError={showFieldError("guests")}
                        errorMessage={fieldErrors.guests}
                      />

                      <div className="flex flex-col gap-1.5">
                        <div className={dateShellClass}>
                          <EnquiryDateRangePicker
                            label="Preferred Date"
                            theme="overlay"
                            checkIn={checkIn}
                            checkOut={checkOut}
                            onDatesChange={(inDate, outDate) => {
                              setCheckIn(inDate);
                              setCheckOut(outDate);
                            }}
                            invalid={showFieldError("preferredDate")}
                          />
                        </div>
                        {showFieldError("preferredDate") &&
                        fieldErrors.preferredDate ? (
                          <JadeFormFieldError
                            id="enquire-date-err"
                            message={fieldErrors.preferredDate}
                          />
                        ) : null}
                      </div>

                      <JadeFloatingSelect
                        id="enquire-occasion"
                        label="Occasion type"
                        value={formData.occasionType}
                        onChange={(v) =>
                          setFormData({ ...formData, occasionType: v })
                        }
                        options={OCCASION_OPTIONS}
                        theme="overlayGreen"
                        invalid={Boolean(fieldErrors.occasionType)}
                        showError={showFieldError("occasionType")}
                        errorMessage={fieldErrors.occasionType}
                      />

                      <JadeFloatingTextarea
                        id="enquire-notes"
                        label="Special requests (optional)"
                        value={formData.specialRequests}
                        onChange={(v) =>
                          setFormData({ ...formData, specialRequests: v })
                        }
                        theme="overlayGreen"
                        required={false}
                        invalid={Boolean(fieldErrors.specialRequests)}
                        showError={showFieldError("specialRequests")}
                        errorMessage={fieldErrors.specialRequests}
                      />
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-5">
                      <p className="text-[11px] text-white/40 mb-3 text-center font-manrope">
                        By sending an inquiry, you agree to our{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={() => setEnquireOverlayOpen(false)}
                        >
                          Privacy Policy
                        </Link>
                        ,{" "}
                        <Link
                          href="/terms-conditions"
                          className="text-[#EFCD62] hover:underline"
                          onClick={() => setEnquireOverlayOpen(false)}
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/refund-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={() => setEnquireOverlayOpen(false)}
                        >
                          Refund Policy
                        </Link>
                      </p>
                      <button
                        type="submit"
                        disabled={!formValid || submitting}
                        aria-disabled={!formValid || submitting}
                        className={`w-full py-4 font-manrope font-bold text-gh-label tracking-[0.3em] uppercase transition-all border ${
                          formValid && !submitting
                            ? "bg-[#EFCD62] hover:bg-white text-black border-transparent"
                            : "bg-transparent border-white/10 text-white/40 cursor-not-allowed"
                        }`}
                      >
                        {submitting ? "SENDING…" : "SEND INQUIRY"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full px-4 text-center pb-6">
                    {/* Glassy circular wrapper for the checkmark */}
                    <div className="w-[180px] h-[180px] shrink-0 relative mb-6 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl">
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

                    <h2 className="text-white text-shadow-sm text-[36px] font-philosopher mb-3">
                      We've got it from here
                    </h2>

                    <p className="text-white/90 text-[16px] leading-relaxed mb-10 max-w-sm mx-auto">
                      Thanks for sharing your details!
                      <br />
                      Our team will take a look and reach out shortly to
                      understand things better.
                    </p>

                    <div className="flex flex-col w-full max-w-[300px] mx-auto mt-auto">
                      <p className="text-white/60 text-[11px] font-bold tracking-[0.2em] uppercase mb-4">
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

                      <p className="text-white/60 text-[13px] mb-8 mt-5">
                        Thoughtfully operated. Always.
                      </p>

                      <PrimaryButton
                        withArrow={false}
                        className="w-full"
                        onClick={handleSuccessOkay}
                      >
                        OKAY
                      </PrimaryButton>
                    </div>
                  </div>
                )}
          </div>
        </FormOverlayLayout>
      )}
    </AnimatePresence>
  );
}
