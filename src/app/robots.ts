import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/book", "/menu", "/api/"],
      },
    ],
    sitemap: "https://jadehospitainment.com/sitemap.xml",
    host: "https://jadehospitainment.com",
  };
}
