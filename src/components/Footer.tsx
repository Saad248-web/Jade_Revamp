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

  const isFormValid =
    formData.fullName.trim() !== "" && formData.phoneNumber.trim() !== "";

  const LINKS_COLUMN_1 = [
    { label: "VILLAS", href: "/villas" },
    { label: "EXPERIENCES", href: "/experiences" },
    { label: "ABOUT", href: "/about" },
    { label: "CAREERS", href: "/careers" },
  ];

  const LINKS_COLUMN_2 = [
    { label: "PRIVACY POLICY", href: "/privacy-policy" },
    { label: "TERMS & CONDITIONS", href: "/terms-conditions" },
    { label: "REFUND POLICY", href: "/refund-policy" },
  ];

  return (
    <footer
      className="relative z-20 overflow-hidden"
      style={{ backgroundColor: "#2E3034" }}
    >
      {/* Decorative top border */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#EFCD62]/40 to-transparent" />

      {/* Background Watermark */}
      <div className="absolute top-1/2 right-0 w-[700px] h-[700px] opacity-[0.025] pointer-events-none -translate-y-1/2 translate-x-1/4">
        <Image
          src="/assets/Golden_Logo.png"
          alt="Watermark"
          fill
          className="object-contain"
        />
      </div>

      {/* ── FORM SECTION ─────────────────────────────────────────────── */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 relative z-10 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* LEFT: Heading + (Desktop) Links + Contact */}
          <div className="lg:col-span-6 flex flex-col gap-16">
            {/* Heading */}
            <div>
              <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#EFCD62]/70 mb-4">
                Get In Touch
              </p>
              <h2 className="font-philosopher text-5xl md:text-6xl text-white leading-tight">
                We'd love to <br />
                hear from <span className="italic text-[#EFCD62]">you</span>
              </h2>
            </div>

            {/* Desktop: Links + Contact */}
            <div className="hidden lg:flex flex-col gap-12">
              {/* Links Grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 max-w-md">
                <div className="flex flex-col gap-3">
                  {LINKS_COLUMN_1.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group font-manrope text-sm text-[#EFCD62] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors duration-300"
                    >
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-[10px]">
                        ▶
                      </span>
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {LINKS_COLUMN_2.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group font-manrope text-sm text-[#EFCD62] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors duration-300"
                    >
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-[10px]">
                        ▶
                      </span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Logo + Contact Info */}
              <div className="flex flex-col gap-6">
                <div className="w-14 h-14 relative">
                  <Image
                    src="/assets/Golden_Logo.png"
                    alt="Jade Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-3 text-white/60 font-manrope text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#EFCD62] shrink-0 mt-0.5" />
                    <span>
                      76, phase II, Royal Enclave, Srirampura, Bengaluru - 64
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#EFCD62] shrink-0" />
                    <span>0897 066 3366</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#EFCD62] shrink-0" />
                    <span>Info@jadehospitainment.com</span>
                  </div>
                </div>
                {/* Social Icons */}
                <div className="flex gap-3">
                  {[Facebook, Instagram, Youtube].map((Icon, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 border border-white/15 flex items-center justify-center hover:bg-[#EFCD62] hover:border-[#EFCD62] group transition-all duration-300 cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-white/70 group-hover:text-black transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="lg:col-span-6 lg:pl-12 pt-0 lg:pt-16">
            <form className="space-y-5">
              {/* Name */}
              <div className="group relative">
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder=" "
                  className="peer w-full bg-white/[0.04] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors rounded-none h-14 placeholder-transparent"
                />
                <label
                  htmlFor="fullName"
                  className="absolute left-4 -top-2.5 text-xs text-white/50 bg-[#2E3034] px-2 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-white/50 peer-focus:-top-2.5 peer-focus:text-[#EFCD62]"
                >
                  Full Name
                </label>
              </div>

              {/* Phone */}
              <div className="group relative">
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder=" "
                  className="peer w-full bg-white/[0.04] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors rounded-none h-14 placeholder-transparent"
                />
                <label
                  htmlFor="phoneNumber"
                  className="absolute left-4 -top-2.5 text-xs text-white/50 bg-[#2E3034] px-2 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-white/50 peer-focus:-top-2.5 peer-focus:text-[#EFCD62]"
                >
                  Phone Number
                </label>
              </div>

              {/* Date */}
              <div className="group relative">
                <input
                  type="text"
                  id="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  placeholder=" "
                  className="peer w-full bg-white/[0.04] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors rounded-none h-14 placeholder-transparent"
                />
                <label
                  htmlFor="date"
                  className="absolute left-4 top-4 text-xs text-white/50 bg-[#2E3034] px-2 transition-all duration-300 peer-focus:-top-2.5 peer-focus:text-[#EFCD62] peer-[:not(:placeholder-shown)]:-top-2.5"
                >
                  Check-In &amp; Out Date
                </label>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="appearance-none w-4 h-4 border border-white/25 bg-transparent checked:bg-[#EFCD62] checked:border-[#EFCD62] focus:ring-0 transition-colors cursor-pointer mt-0.5 shrink-0"
                />
                <label
                  htmlFor="terms"
                  className="font-manrope text-xs text-white/40 leading-loose cursor-pointer select-none"
                >
                  Welcome to Jade Hospitainment, where hospitality meets
                  entertainment in unique and unforgettable ways. With over two
                  decades of experience.
                </label>
              </div>

              {/* Submit */}
              <button
                disabled={!isFormValid}
                className={`w-full py-4 mt-6 font-manrope tracking-[0.25em] text-xs transition-all duration-300 uppercase border ${
                  isFormValid
                    ? "bg-transparent border-[#EFCD62]/50 text-[#EFCD62] hover:bg-[#EFCD62] hover:text-black hover:border-[#EFCD62]"
                    : "bg-white/[0.03] border-white/10 text-white/20 cursor-not-allowed"
                }`}
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>

        {/* ── MOBILE ONLY: Links + Contact ─────── */}
        <div className="lg:hidden mt-14 flex flex-col gap-10">
          <div className="w-full h-[1px] bg-white/10" />

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div className="flex flex-col gap-4">
              {LINKS_COLUMN_1.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group font-manrope text-[11px] text-[#EFCD62] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors duration-300"
                >
                  <span className="text-[9px] inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                    ▶
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {LINKS_COLUMN_2.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group font-manrope text-[11px] text-[#EFCD62] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors duration-300"
                >
                  <span className="text-[9px] inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                    ▶
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Logo + Contact */}
          <div className="flex flex-col gap-6">
            <div className="w-10 h-10 relative">
              <Image
                src="/assets/Golden_Logo.png"
                alt="Jade Logo"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-3 text-white/55 font-manrope text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#EFCD62] shrink-0 mt-0.5" />
                <span>
                  76, phase II, Royal Enclave, Srirampura, Bengaluru - 64
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#EFCD62] shrink-0" />
                <span>0897 066 3366</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#EFCD62] shrink-0" />
                <span>Info@jadehospitainment.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 border border-white/15 flex items-center justify-center hover:bg-[#EFCD62] hover:border-[#EFCD62] group transition-all duration-300 cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-white/70 group-hover:text-black transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM COPYRIGHT BAR ─────────────────────────────────────── */}
        <div className="border-t border-white/8 mt-14 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-manrope text-[10px] text-white/35 tracking-widest uppercase">
            © {currentYear} Jade Hospitainment — All Rights Reserved
          </p>
          <p className="font-manrope text-[10px] text-white/25 tracking-wide">
            Crafted with excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
