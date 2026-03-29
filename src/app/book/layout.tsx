// Route-segment layout — Server Component exports metadata for this client-component page
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Villa",
  description:
    "Book your stay at an exclusive Jade Hospitainment private villa near Bangalore. Select dates, guests, and add curated experiences.",
  alternates: { canonical: "https://jadehospitainment.com/book" },
  // Prevent Google from indexing the booking flow — it's a functional page not a content page
  robots: { index: false, follow: false },
  openGraph: {
    title: "Book a Villa | Jade Hospitainment",
    description:
      "Reserve your exclusive private villa stay at Jade Hospitainment. Curated experiences available.",
    url: "https://jadehospitainment.com/book",
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
