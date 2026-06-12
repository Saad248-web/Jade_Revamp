const CDN = process.env.NEXT_PUBLIC_CDN_BASE ?? "/videos";

export const videoSources = {
  homepage: {
    landscape: `${CDN}/landscape/landscape_homepage.mp4`,
    mobile: `${CDN}/mobile/mobile_homepage.mp4`,
  },
  corporate: {
    landscape: `${CDN}/landscape/landscape_corporate.mp4`,
    mobile: `${CDN}/mobile/mobile_corporate.mp4`,
  },
  weddings: {
    landscape: `${CDN}/landscape/landscape_weddings.mp4`,
    mobile: `${CDN}/mobile/mobile_weddings.mp4`,
  },
  parties: {
    landscape: `${CDN}/landscape/landscape_parties.mp4`,
    mobile: `${CDN}/mobile/mobile_parties.mp4`,
  },
  getaways: {
    landscape: `${CDN}/landscape/landscape_getaways.mp4`,
    mobile: `${CDN}/mobile/mobile_weekend_getaways.mp4`,
  },
} as const;

export type VideoSlug = keyof typeof videoSources;
