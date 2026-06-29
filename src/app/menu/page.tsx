import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore Jade Hospitainment — luxury villas, curated experiences, weddings, corporate retreats, and more.",
  alternates: { canonical: "https://jadehospitainment.com/menu" },
};

const MenuPageClient = dynamic(() => import("./MenuPageClient"), {
  loading: () => (
    <main className="min-h-[100dvh] bg-[#1E2023]" aria-busy="true" aria-label="Loading menu" />
  ),
});

export default function MenuPage() {
  return <MenuPageClient />;
}
