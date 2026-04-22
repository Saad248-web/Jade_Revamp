/**
 * SHARED TYPE SYSTEM — Single source of truth for all interfaces.
 * These replace the 4 inline type definitions previously scattered across:
 *   - GlobalBookingOverlay.tsx (deleted)
 *   - /book/page.tsx
 *   - BookingContext.tsx
 *   - ReservationOverlay.tsx
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
}

export interface VillaSpaceGroup {
  id: string;
  title: string;
  category: "Outdoors" | "Indoors" | "Bed & Bath";
  amenities: string[];
  images: string[];
}

export interface VillaFAQ {
  question: string;
  answer: string;
}

export interface Villa {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  image: string;
  images?: string[];
  stats: VillaStats;
  perfectFor: string[];
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
