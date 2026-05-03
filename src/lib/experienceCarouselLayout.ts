/**
 * Shared layout for “Section 3” experience carousels:
 * Party Villas · Weekend Getaways · Caravans
 *
 * Keeps frame height, section padding, and CTA inset consistent with design frames.
 */

export const experienceCarouselDefaults = {
  /** Section shell — no min-height stretch so CTA stays 16px under the frame */
  containerClassName: "bg-[#141517] overflow-x-hidden",

  /**
   * Inner column — horizontal + vertical padding scale with viewport (fluid tokens + steps).
   */
  innerClassName:
    "w-full max-w-5xl mx-auto flex flex-col px-fluid-sm sm:px-fluid-md md:px-8 lg:px-10 pt-fluid-sm sm:pt-fluid-md md:pt-fluid-lg lg:pt-fluid-xl pb-fluid-md sm:pb-fluid-lg md:pb-10 lg:pb-12",

  /**
   * Image frame — explicit stepped heights only (avoid `min(dvh,*)` arbitrary classes;
   * they parse unreliably in Tailwind JIT and collapse position:absolute slides).
   * Portrait-ish rail — stepped heights (raised for more visual presence).
   */
  aspectClass:
    "relative w-full max-w-5xl mx-auto bg-[#121417] overflow-hidden rounded-sm shadow-2xl h-[456px] sm:h-[480px] md:h-[528px] lg:h-[576px] min-h-[360px]",

  /** Frame → CTA: 16px floor on mobile, then scales with viewport (capped for large screens). */
  buttonContainerClassName:
    "mt-[clamp(16px,4vw,32px)] w-full max-w-xl mx-auto",
} as const;
