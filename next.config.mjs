/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Enable gzip/brotli compression
  compress: true,

  images: {
    // Prefer AVIF then WebP for smaller file sizes
    formats: ["image/avif", "image/webp"],
    // Responsive image breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "jadehospitainment.com" },
    ],
  },

  // 301 redirects for old blog URLs → new clean slugs
  // Add one entry per migrated old article to preserve Google rankings
  async redirects() {
    return [
      // Example pattern — update with actual old URLs when migrating
      // {
      //   source: "/blog/:slug",
      //   destination: "/blogs/:slug",
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
