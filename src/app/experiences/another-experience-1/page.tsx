import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import JsonLd from "@/components/seo/JsonLd";
import dynamic from "next/dynamic";

const AnotherExperienceOneClient = dynamic(
  () => import("./AnotherExperienceOneClient"),
  { ssr: false },
);

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export const metadata: Metadata = {
  title: "Another Experience · 1",
  description:
    "Curated Jade experiences in a scroll-linked horizontal journey — same galleries as Experiences, alternate motion and layout.",
  alternates: {
    canonical:
      "https://jadehospitainment.com/experiences/another-experience-1",
  },
  openGraph: {
    title: "Another Experience · 1 | Jade Hospitainment",
    description:
      "Alternate scroll-driven presentation of Jade’s curated experiences.",
    url: "https://jadehospitainment.com/experiences/another-experience-1",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://jadehospitainment.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Experiences",
      item: "https://jadehospitainment.com/experiences",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Another Experience · 1",
      item: "https://jadehospitainment.com/experiences/another-experience-1",
    },
  ],
};

export default function AnotherExperienceOnePage() {
  return (
    <main className="min-h-dscreen bg-[#1A1C1E]">
      <JsonLd schema={breadcrumbSchema} />
      <Navbar />
      {/* Intro: distinct from Experiences hero — split grid + vertical accent, no LiveBackground / Framer */}
      <section className="relative border-b border-white/10 bg-[#121416] px-4 py-fluid-xl md:px-fluid-lg">
        <div className="mx-auto grid max-w-6xl gap-fluid-lg md:grid-cols-[auto_1fr] md:items-center md:gap-fluid-xl">
          <div
            className="hidden h-[min(42dvh,280px)] w-1 shrink-0 rounded-full bg-gradient-to-b from-jade-gold via-jade-gold-muted to-transparent md:block"
            aria-hidden
          />
          <div className="space-y-fluid-sm md:space-y-fluid-md">
            <p className="font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-[0.32em] text-jade-gold">
              Curated journeys · Alt layout
            </p>
            <h1 className="font-philosopher text-[length:var(--fs-h1)] leading-tight text-white">
              Another Experience{" "}
              <span className="text-jade-gold">— scroll the story</span>
            </h1>
            <p className="max-w-2xl font-manrope text-[length:var(--fs-body)] leading-relaxed text-white/75">
              The same seven galleries as{" "}
              <Link
                href="/experiences"
                className="text-jade-gold underline-offset-2 hover:underline"
              >
                Experiences
              </Link>
              , rebuilt with horizontal scroll–linked motion (CSS scroll-driven
              timelines). Drag or swipe sideways, or use the index. The scene
              uses dynamic viewport height so mobile browser chrome does not clip
              the layout.
            </p>
          </div>
        </div>
      </section>

      <div data-lenis-prevent>
        <AnotherExperienceOneClient />
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
