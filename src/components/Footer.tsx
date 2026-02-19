"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    date: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isFormValid =
    formData.fullName.trim() !== "" && formData.phoneNumber.trim() !== "";

  const LINKS_COLUMN_1 = [
    { label: "VILLAS", href: "/villas" },
    { label: "EXPERIENCES", href: "/experiences" },
    { label: "ABOUT", href: "/about" },
  ];

  const LINKS_COLUMN_2 = [
    { label: "PRIVACY POLICY", href: "/privacy-policy" },
    { label: "TERMS & CONDITIONS", href: "/terms-conditions" },
    { label: "REFUND POLICY", href: "/refund-policy" },
  ];

  return (
    <footer className="relative z-20 pt-20 pb-10 overflow-hidden bg-[#1A1C1E]">
      {/* Background Watermark - Moved to Left to avoid Form Overlap */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] opacity-[0.02] pointer-events-none -translate-x-1/4 -translate-y-1/4">
        <Image
          src="/assets/Golden_Logo.png"
          alt="Watermark"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* LEFT COLUMN: Heading & Links & Contact Info */}
          <div className="lg:col-span-6 flex flex-col gap-16">
            {/* 1. Heading */}
            <div className="mb-12 lg:mb-16">
              <h2 className="font-philosopher text-5xl md:text-7xl text-white mb-6 leading-tight">
                We’d love to <br /> hear from you
              </h2>
            </div>

            {/* Desktop: Links & Info showing here. Mobile: Hidden and shown below form */}
            <div className="hidden lg:flex flex-col gap-12">
              {/* Links Grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-w-md">
                <div className="flex flex-col gap-4">
                  {LINKS_COLUMN_1.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="font-manrope text-sm text-[#EFCD62] tracking-widest uppercase hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  {LINKS_COLUMN_2.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="font-manrope text-sm text-[#EFCD62] tracking-widest uppercase hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Logo & Contact */}
              <div className="flex flex-col gap-8">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/assets/Golden_Logo.png"
                    alt="Jade Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-4 text-white/80 font-manrope text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-white stroke-[1.5]" />
                    <span>
                      76, phase II, Royal Enclave, Srirampura, Bengaluru - 64
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-white stroke-[1.5]" />
                    <span>0897 066 3366</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-white stroke-[1.5]" />
                    <span>Info@jadehospitainment.com</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  {[Facebook, Instagram, Youtube].map((Icon, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#EFCD62] hover:border-[#EFCD62] group transition-all duration-300 cursor-pointer"
                    >
                      <Icon className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-6 lg:pl-12 pt-0 lg:pt-20">
            <form className="space-y-6">
              {/* Name Field */}
              <div className="group relative">
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder=" "
                  className="peer w-full bg-transparent border border-white/20 px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors rounded-none h-14 placeholder-transparent"
                />
                <label
                  htmlFor="fullName"
                  className="absolute left-4 -top-2.5 text-xs text-white/60 bg-[#1A1C1E] px-2 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-white/60 peer-focus:-top-2.5 peer-focus:text-[#EFCD62]"
                >
                  Full Name
                </label>
              </div>

              {/* Phone Field */}
              <div className="group relative">
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder=" "
                  className="peer w-full bg-transparent border border-white/20 px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors rounded-none h-14 placeholder-transparent"
                />
                <label
                  htmlFor="phoneNumber"
                  className="absolute left-4 -top-2.5 text-xs text-white/60 bg-[#1A1C1E] px-2 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-white/60 peer-focus:-top-2.5 peer-focus:text-[#EFCD62]"
                >
                  Phone Number
                </label>
              </div>

              {/* Date Field */}
              <div className="group relative">
                <input
                  type="text"
                  id="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  placeholder=" "
                  className="peer w-full bg-transparent border border-white/20 px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors rounded-none h-14 placeholder-transparent"
                />
                <label
                  htmlFor="date"
                  className="absolute left-4 top-4 text-xs text-white/60 bg-[#1A1C1E] px-2 transition-all duration-300 peer-focus:-top-2.5 peer-focus:text-[#EFCD62] peer-[:not(:placeholder-shown)]:-top-2.5"
                >
                  Check-In & Out Date
                </label>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 mt-6">
                <div className="relative flex items-center pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    className="appearance-none w-4 h-4 border border-white/30 bg-transparent checked:bg-white checked:border-white focus:ring-0 transition-colors cursor-pointer"
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-black opacity-0 peer-checked:opacity-100">
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <label
                  htmlFor="terms"
                  className="font-manrope text-xs text-white/50 leading-loose cursor-pointer select-none"
                >
                  Welcome to Jade Hospitainment, where hospitality meets
                  entertainment in unique and unforgettable ways. With over two
                  decades of experience.
                </label>
              </div>

              {/* Submit Button */}
              <button
                disabled={!isFormValid}
                className={`w-full py-4 mt-8 font-manrope tracking-[0.2em] text-xs transition-all duration-300 uppercase border ${
                  isFormValid
                    ? "bg-white/5 border-white/20 text-white hover:bg-[#EFCD62] hover:text-black hover:border-[#EFCD62]"
                    : "bg-white/5 border-white/10 text-white/20 cursor-not-allowed"
                }`}
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>

        {/* MOBILE ONLY: Links & Info (Shown after form on mobile) */}
        <div className="lg:hidden mt-16 flex flex-col gap-12">
          {/* Divider */}
          <div className="w-full h-[1px] bg-white/10" />

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col gap-4">
              {LINKS_COLUMN_1.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-manrope text-xs text-[#EFCD62] tracking-widest uppercase hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {LINKS_COLUMN_2.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-manrope text-xs text-[#EFCD62] tracking-widest uppercase hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Logo & Contact Stack */}
          <div className="flex flex-col gap-8">
            <div className="w-12 h-12 relative">
              <Image
                src="/assets/Golden_Logo.png"
                alt="Jade Logo"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-4 text-white/70 font-manrope text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#EFCD62]" />
                <span>
                  76, phase II, Royal Enclave, Srirampura, Bengaluru - 64
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#EFCD62]" />
                <span>0897 066 3366</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#EFCD62]" />
                <span>Info@jadehospitainment.com</span>
              </div>
            </div>

            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#EFCD62] group transition-all cursor-pointer rounded-none"
                >
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#15171a] transition-colors">
                    <Icon className="w-4 h-4 text-white group-hover:text-[#15171a]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 mt-16 pt-8 text-center md:text-left">
          <p className="font-manrope text-[10px] text-white/40 tracking-wide">
            © Copyright {currentYear} Jade Hospitainment – All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
