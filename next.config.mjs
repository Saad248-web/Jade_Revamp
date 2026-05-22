import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Do not ship source maps to browsers in production (reduces attack surface)
  productionBrowserSourceMaps: false,

  // Enable gzip/brotli compression
  compress: true,

  async headers() {
    const globalSecurity = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
      },
      { key: "X-DNS-Prefetch-Control", value: "off" },
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin-allow-popups",
      },
    ];

    if (isProd) {
      globalSecurity.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }

    return [
      {
        source: "/:path*",
        headers: globalSecurity,
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  images: {
    // Prefer AVIF then WebP for smaller file sizes
    formats: ["image/avif", "image/webp"],
    // Responsive image breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "jadehospitainment.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },

  // 301 redirects for old blog URLs → new clean slugs
  // Add one entry per migrated old article to preserve Google rankings
  async redirects() {
    return [
      // Legacy policy shortcuts → canonical policy routes
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-conditions",
        permanent: true,
      },
      {
        source: "/refund",
        destination: "/refund-policy",
        permanent: true,
      },

      // Common legacy blog path → current blog path
      {
        source: "/blog/:slug*",
        destination: "/blogs/:slug*",
        permanent: true,
      },

      // Villas → Villa Retreats (legacy URLs)
      {
        source: "/villas/dome-villas/:path*",
        destination: "/villa-retreats/dome-villa-retreats/:path*",
        permanent: true,
      },
      {
        source: "/villas/dome-villas",
        destination: "/villa-retreats/dome-villa-retreats",
        permanent: true,
      },
      {
        source: "/villa-retreats/dome-villas/:path*",
        destination: "/villa-retreats/dome-villa-retreats/:path*",
        permanent: true,
      },
      {
        source: "/villa-retreats/dome-villas",
        destination: "/villa-retreats/dome-villa-retreats",
        permanent: true,
      },
      {
        source: "/villas/dome-villas-blue",
        destination: "/villa-retreats/dome-villa-retreats-blue",
        permanent: true,
      },
      {
        source: "/villas/dome-villas-red",
        destination: "/villa-retreats/dome-villa-retreats-red",
        permanent: true,
      },
      {
        source: "/villas/dome-villas-yellow",
        destination: "/villa-retreats/dome-villa-retreats-yellow",
        permanent: true,
      },
      {
        source: "/villas/:path*",
        destination: "/villa-retreats/:path*",
        permanent: true,
      },
      {
        source: "/villas",
        destination: "/villa-retreats",
        permanent: true,
      },
      {
        source: "/party-villas/:path*",
        destination: "/party-villa-retreats/:path*",
        permanent: true,
      },
      {
        source: "/party-villas",
        destination: "/party-villa-retreats",
        permanent: true,
      },
      {
        source: "/api/villas/:path*",
        destination: "/api/villa-retreats/:path*",
        permanent: true,
      },

      // Example pattern — update with actual old URLs when migrating
      // {
      //   source: "/blog/:slug",
      //   destination: "/blogs/:slug",
      //   permanent: true,
      // },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
});
