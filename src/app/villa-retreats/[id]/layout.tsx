import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import SchemaMarkup from "@/components/SchemaMarkup";
import { VILLAS } from "@/lib/mockData";
import type { Villa } from "@/lib/types";
import {
  SITE_ORIGIN,
  absoluteSiteUrl,
} from "@/lib/seo/meta";
import { buildVillaMetaDescription } from "@/lib/seo/villaMetaDescription";

type Props = { children: ReactNode; params: { id: string } };

/** Villa page uses `useSearchParams()` etc.; avoid SSG/prerender bailout on build. SSR metadata + JSON-LD still apply per request. */
export const dynamic = "force-dynamic";

function vacationRentalJsonLd(villa: Villa, canonical: string) {
  const image = villa.image ? absoluteSiteUrl(villa.image) : undefined;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": `${canonical}#property`,
    name: `${villa.name} — Jade Hospitainment`,
    description: villa.description,
    url: canonical,
    ...(image ? { image: [image] } : {}),
    brand: { "@type": "Brand", name: "Jade Hospitainment" },
  };

  const addr = villa.locationDetails?.address?.trim();
  if (addr) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: addr,
      addressCountry: "IN",
    };
  } else {
    schema.address = {
      "@type": "PostalAddress",
      addressLocality: villa.location.replace(/\s*[·\.]\s*.+$/, "").trim(),
      addressRegion: "Karnataka",
      addressCountry: "IN",
    };
  }

  const geo = villa.locationDetails?.coordinates;
  if (geo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: geo.lat,
      longitude: geo.lng,
    };
  }

  return schema;
}

export function generateMetadata({ params }: Props): Metadata {
  const villa = VILLAS.find((v) => v.id === params.id) as Villa | undefined;
  if (!villa) {
    return { title: "Villa", robots: { index: false, follow: false } };
  }

  const canonical = `${SITE_ORIGIN}/villa-retreats/${villa.id}`;
  const title = `${villa.name} — ${villa.type} near ${villa.location.replace(/\s*[·\.]\s*.+$/, "").trim()}`;
  const description = buildVillaMetaDescription(villa);
  const ogPath = villa.image;

  return {
    title,
    description,
    keywords: [
      ...villa.categories,
      villa.name,
      villa.location,
      "luxury villa Karnataka",
      "Bangalore retreat",
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: "en_IN",
      type: "website",
      siteName: "Jade Hospitainment",
      images: ogPath
        ? [
            {
              url: ogPath,
              width: 1200,
              height: 630,
              alt: `${villa.name} — ${villa.type}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogPath ? [ogPath] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default function VillaSegmentLayout({ children, params }: Props) {
  const villa = VILLAS.find((v) => v.id === params.id) as Villa | undefined;
  if (!villa) notFound();

  const canonical = `${SITE_ORIGIN}/villa-retreats/${villa.id}`;

  return (
    <>
      {children}
      <SchemaMarkup schema={vacationRentalJsonLd(villa, canonical)} />
    </>
  );
}
