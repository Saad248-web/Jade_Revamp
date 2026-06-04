/**
 * Enquire overlay variants — separated by experience page context.
 * `enquireReturnPath` from AnimationContext selects copy, defaults, API source, OKAY target.
 */
import {
  WEEKEND_GETAWAYS_OCCASION,
  type OccasionOption,
} from "@/lib/enquiryFormOptions";
import {
  ENQUIRY_SUCCESS_RETURN_PATH,
  EXPERIENCE_PAGE_PATHS,
} from "@/lib/enquiryReturnPath";

export type EnquiryOverlayVariantId = "default" | "weekend-getaways";

export type EnquiryOverlayVariant = {
  id: EnquiryOverlayVariantId;
  leadSource: string;
  defaultOccasionType: OccasionOption | "";
  title: string;
  description: string;
  okayReturnPath: string;
};

const VARIANTS: Record<EnquiryOverlayVariantId, EnquiryOverlayVariant> = {
  "weekend-getaways": {
    id: "weekend-getaways",
    leadSource: "weekend_getaways_enquiry",
    defaultOccasionType: WEEKEND_GETAWAYS_OCCASION,
    title: "Plan Your Weekend Getaway",
    description:
      "Share your dates and group size. Our team will help you choose the right private villa for a relaxed weekend escape.",
    okayReturnPath: EXPERIENCE_PAGE_PATHS.weekendGetaways,
  },
  default: {
    id: "default",
    leadSource: "general_enquiry",
    defaultOccasionType: "",
    title: "Enquire Now",
    description:
      "Tell us your preferred dates, group size, and occasion. Our team will help you design a curated luxury experience.",
    okayReturnPath: ENQUIRY_SUCCESS_RETURN_PATH,
  },
};

export function resolveEnquiryVariantId(
  returnPath: string | null,
): EnquiryOverlayVariantId {
  if (returnPath === EXPERIENCE_PAGE_PATHS.weekendGetaways) {
    return "weekend-getaways";
  }
  return "default";
}

export function getEnquiryOverlayVariant(
  returnPath: string | null,
): EnquiryOverlayVariant {
  return VARIANTS[resolveEnquiryVariantId(returnPath)];
}
