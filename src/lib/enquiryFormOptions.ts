export const OCCASION_OPTIONS = [
  "Weekend getaway",
  "Wedding",
  "Corporate offsite",
  "Birthday / celebration",
  "Anniversary",
  "Other",
] as const;

export type OccasionOption = (typeof OCCASION_OPTIONS)[number];
