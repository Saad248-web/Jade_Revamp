"use client";

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
    <footer
      className="relative z-20 pt-20 pb-10 overflow-hidden"
      style={{ backgroundColor: "#15171a" }} // Deep Premium Black
    >
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#EFCD62]/20 to-transparent" />

      {/* Large JH Watermark */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] pointer-events-none translate-x-1/3 -translate-y-1/4">
        <Image
          src="/assets/Golden_Logo.png"
          alt="Watermark"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        {/* 1. Contact Section (Split Layout on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24 relative z-10">
          {/* Left Column: Heading & Logo */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 relative">
                  <Image
                    src="/assets/Golden_Logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <h2 className="font-philosopher text-4xl md:text-6xl text-white mb-6 leading-tight">
                We’d love to <br className="hidden lg:block" /> hear from you
              </h2>
              <p className="font-manrope text-white/60 text-lg max-w-sm">
                Reach out to us for enquiries, bookings, or just to say hello.
              </p>
            </div>

            {/* Desktop Contact Details (Moved up for better balance) */}
            <div className="hidden lg:flex flex-col gap-6 mt-12">
              <div className="flex items-center gap-4 group">
                <div className="p-3 border border-white/10 rounded-none group-hover:bg-[#EFCD62] transition-colors">
                  <MapPin className="w-5 h-5 text-[#EFCD62] group-hover:text-[#15171a]" />
                </div>
                <span className="text-white/80 font-manrope text-sm">
                  76, phase II, Royal Enclave, Srirampura, Bengaluru - 64
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 border border-white/10 rounded-none group-hover:bg-[#EFCD62] transition-colors">
                  <Phone className="w-5 h-5 text-[#EFCD62] group-hover:text-[#15171a]" />
                </div>
                <span className="text-white/80 font-manrope text-sm">
                  0897 066 3366
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 border border-white/10 rounded-none group-hover:bg-[#EFCD62] transition-colors">
                  <Mail className="w-5 h-5 text-[#EFCD62] group-hover:text-[#15171a]" />
                </div>
                <span className="text-white/80 font-manrope text-sm">
                  Info@jadehospitainment.com
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 lg:pl-12">
            <form className="space-y-6 bg-white/[0.02] p-8 md:p-12 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="group relative">
                  <label className="block text-xs font-manrope text-white/60 mb-1 ml-4 bg-[#15171a] px-2 w-max -mb-2 relative z-10">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-white/20 rounded-md px-4 py-4 text-white placeholder-transparent focus:border-[#EFCD62] focus:outline-none transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div className="group relative">
                  <label className="block text-xs font-manrope text-white/60 mb-1 ml-4 bg-[#15171a] px-2 w-max -mb-2 relative z-10">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-transparent border border-white/20 rounded-md px-4 py-4 text-white placeholder-transparent focus:border-[#EFCD62] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Check-In & Out Date */}
              <div className="group relative">
                <label className="block text-xs font-manrope text-white/60 mb-1 ml-4 bg-[#15171a] px-2 w-max -mb-2 relative z-10">
                  Check-In & Out Date
                </label>
                <input
                  type="text"
                  placeholder="Select dates"
                  className="w-full bg-transparent border border-white/20 rounded-md px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-transparent text-[#EFCD62] focus:ring-[#EFCD62]"
                />
                <p className="font-manrope text-xs text-white/50 leading-relaxed">
                  Welcome to Jade Hospitainment, where hospitality meets
                  entertainment in unique and unforgettable ways. With over two
                  decades of experience.
                </p>
              </div>

              {/* Submit Button */}
              <button className="w-full py-4 mt-4 border border-white/20 text-white font-manrope tracking-[0.2em] text-sm hover:bg-[#EFCD62] hover:border-[#EFCD62] hover:text-[#15171a] transition-all duration-300 uppercase">
                Contact Us
              </button>
            </form>
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/10 mb-12" />

        {/* 2. Links Section (Reorganized) */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
          {/* Left: Nav Links */}
          <div className="flex flex-wrap gap-12 lg:gap-24">
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

          {/* Right: Mobile Contact / Socials */}
          <div className="flex flex-col gap-8 lg:items-end">
            {/* Show Contact on Mobile only (since it's on top left for desktop) */}
            <div className="lg:hidden flex flex-col gap-4 text-white/70 font-manrope text-sm">
              <div className="flex items-center gap-3">
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

            {/* Socials */}
            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#EFCD62] hover:text-[#15171a] text-white/60 transition-all cursor-pointer rounded-none"
                >
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-8 border-t border-white/5 text-center md:text-left">
          <p className="font-manrope text-xs text-white/30 tracking-wide">
            © Copyright {currentYear} Jade Hospitainment – All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
