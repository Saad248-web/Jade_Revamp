/**
 * SHARED TYPE SYSTEM — Single source of truth for all interfaces.
 * Shared booking/enquiry types for /book, BookingContext, and overlays.
 */

// ─── Date & Booking Core ──────────────────────────────────
export interface DateRange {
  checkIn: { month: number; day: number } | null;
  checkOut: { month: number; day: number } | null;
}

export interface Guests {
  adults: number;
  children: number;
  pets: number;
}

export interface UserDetails {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

// ─── Booking Payload (sent to API) ───────────────────────
export interface BookingPayload {
  villaId: string;
  villaName: string;
  dateRange: DateRange;
  guests: Guests;
  details: UserDetails;
  addOns: string[];
  totalAmount: number;
}

// ─── Villa ────────────────────────────────────────────────
export interface VillaStats {
  stay: string;
  events: string;
  bhk: string;
  lawn?: string;
  homeTheater?: string;
  villaArea?: string;
}

export interface VillaPricingPackage {
  label: string;
  sublabel?: string;
  price: string;
}

export interface VillaPricingTier {
  title: string;
  subtitle: string;
  packages: VillaPricingPackage[];
  features: string[];
}

export interface VillaAmenity {
  label: string;
  icon: string;
  description?: string;
}

/** Intro-band horizontal amenity tiles on villa detail page */
export interface VillaAmenityHighlight {
  label: string;
  sublabel?: string;
  icon: string;
}

export interface VillaPerfectForCard {
  title: string;
  image: string;
}

export interface VillaService {
  title: string;
  description: string;
  footer: string;
  icon: string;
}

export interface VillaSpace {
  name: string;
  image: string;
}

export interface VillaActivity {
  title: string;
  image: string;
  description?: string;
}

export interface VillaSpaceGroup {
  id: string;
  title: string;
  category: string;
  amenities: string[];
  images: string[];
}

export interface VillaFAQ {
  question: string;
  answer: string;
}

export interface Villa {
  id: string;
  /** When true, excluded from `/villas` listing only (deep links unchanged). */
  hideFromVillasDirectory?: boolean;
  name: string;
  /** One-line trust signal shown under villa name on detail page */
  socialProof?: string;
  type: string;
  location: string;
  description: string;
  image: string;
  images?: string[];
  stats: VillaStats;
  /** Intro chips on villa detail + listing cards */
  perfectForTags: string[];
  /** Image gallery section on villa detail */
  perfectForCards: VillaPerfectForCard[];
  /** Intro horizontal scroll tiles (distinct from full amenities grid) */
  amenityHighlights: VillaAmenityHighlight[];
  categories: string[];
  spaces?: VillaSpace[];
  amenities: VillaAmenity[];
  services?: VillaService[];
  propertyDetails?: Array<{
    label?: string;
    title?: string;
    description: string;
    icon?: string;
  }>;
  pricing?: {
    stay: VillaPricingTier;
    event: VillaPricingTier;
  };
  locationDetails?: {
    mapImage: string;
    address: string;
    distance: string;
    nearby: Array<{ label: string; distance: string }>;
    /** Full Google Maps URL when you need an exact listing pin */
    googleMapsUrl?: string;
    /** Prefer over address search when set */
    coordinates?: { lat: number; lng: number };
  };
  activities?: VillaActivity[];
  categorizedSpaces?: VillaSpaceGroup[];
  video?: {
    youtubeUrl: string;
    thumbnail: string;
    duration: string;
  };
  faq?: VillaFAQ[];
}

// ─── Blog ─────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  content?: string;
  date?: string;
  category?: string;
  tags?: string[];
}

// ─── Wishlist ─────────────────────────────────────────────
export interface WishlistItem {
  id: string;
  name: string;
  type: string;
  location: string;
  image: string;
  startingPrice: string | null;
}

// ─── API Response ─────────────────────────────────────────
export interface BookingResponse {
  success: boolean;
  referenceId: string;
  message?: string;
}

export interface EnquiryResponse {
  success: boolean;
  message?: string;
}
