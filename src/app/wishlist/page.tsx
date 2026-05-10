"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import EmptyState from "@/components/ui/EmptyState";
import { VILLAS } from "@/lib/mockData";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, count } = useWishlist();

  return (
    <main className="min-h-screen bg-[#1A1C1E]">
      <Navbar />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-16 pt-28 pb-32">
        {/* Header */}
        <div className="mb-10">
          <span className="text-jade-gold text-gh-label font-manrope font-bold tracking-[0.2em] uppercase">
            Your Saved Villas
          </span>
          <h1 className="font-philosopher text-gh-h1 text-white mt-2 leading-tight">
            Wishlist
            {count > 0 && (
              <span className="ml-3 text-white/30 font-manrope text-gh-body font-normal">
                ({count})
              </span>
            )}
          </h1>
        </div>

        {/* Empty State */}
        {count === 0 && (
          <EmptyState
            icon={<Heart className="w-full h-full" />}
            headline="Your wishlist is empty"
            subtext="Save villas you love by tapping the heart icon on any villa card."
            ctaLabel="EXPLORE VILLAS"
            onCta={() => router.push("/villas")}
          />
        )}

        {/* Wishlist Grid */}
        <AnimatePresence mode="popLayout">
          {count > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item, i) => {
                const matchedVilla = VILLAS.find((v) => v.id === item.id);
                const mapsHref = getVillaGoogleMapsUrl(
                  matchedVilla ?? { location: item.location },
                );
                return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.06 },
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative group bg-white/3 border border-white/8 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Type badge */}
                    <span className="absolute bottom-3 left-3 text-jade-gold text-gh-label font-manrope font-bold tracking-[0.15em] uppercase">
                      {item.type}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-philosopher text-gh-h3 text-white mb-1">
                      {item.name}
                    </h3>
                    <a
                      href={mapsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-white/50 text-gh-desc font-manrope mb-3 w-fit max-w-full rounded-sm outline-none hover:text-[#EFCD62] transition-colors focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="hover:underline underline-offset-2">
                        {item.location}
                      </span>
                    </a>
                    {item.startingPrice && (
                      <p className="text-white/40 font-manrope text-gh-villa-footer-row mb-3">
                        From{" "}
                        <span className="text-white font-bold">
                          {item.startingPrice}
                        </span>{" "}
                        onwards
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      <Link
                        href={`/villas/${item.id}`}
                        className="flex-1 border border-white/20 text-white font-manrope font-bold text-gh-label tracking-widest uppercase text-center py-2.5 hover:bg-white hover:text-black transition-colors"
                      >
                        VIEW
                      </Link>
                      <Link
                        href={`/book?villa=${item.id}`}
                        className="flex-1 bg-jade-gold text-[#0B2C23] font-manrope font-bold text-gh-label tracking-widest uppercase text-center py-2.5 hover:bg-white transition-colors flex items-center justify-center gap-1"
                      >
                        BOOK <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* CTA when list not empty */}
        {count > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/villas"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white font-manrope text-gh-desc transition-colors"
            >
              <span>Continue exploring villas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      <div className="h-24 md:hidden" />
      <MobileBottomNav />
    </main>
  );
}
