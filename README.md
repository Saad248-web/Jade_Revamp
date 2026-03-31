# Jade Hospitainment — ReVamp

Welcome to the **Jade Hospitainment** digital platform. This is a high-performance, SEO-first Next.js 14 application designed for India's premium private retreat operator.

## 🚀 Project Overview

Jade Hospitainment redefines luxury stays, destination weddings, and corporate retreats. This platform serves as a cinematic gateway for guests to explore a curated portfolio of private estates near Bangalore.

## 🛠️ Technical Excellence

### Core Stack

- **Next.js 14 (App Router)**: Utilizing Server Components for optimal SEO and performance.
- **TypeScript**: Strict type-safety across the data and component layers, ensuring robust production builds.
- **Tailwind CSS**: Utility-first styling for a premium, responsive UI.
- **Animations**: GSAP, Framer Motion, and Rive for immersive user experiences.

### Performance & Asset Optimization

- **Asset Optimization**: Complete migration to compressed WebP/AVIF formats. Unused assets and legacy scripts have been pruned to maintain a minimal repository footprint.
- **Code Splitting**: Heavy components (Carousels, GSAP sections) are dynamically imported to improve TTI (Time to Interactive).
- **Responsive Images**: Configured with smart breakpoints in `next.config.mjs`.
- **Zero Layout Shift**: Font optimization and pre-allocation of image spaces ensure a stable CLS score.

### SEO & Structured Data

- **Dynamic Metadata**: Automated SEO tags for all routes, including dynamic blog posts.
- **JSON-LD Schema**: Full implementation of Organization, Lodging, Event, and Article schemas for Google Rich Results.
- **Crawl Efficiency**: Native `sitemap.ts` and `robots.ts` integration.

## 📂 Architecture

```bash
├── src/
│   ├── app/              # Next.js App Router (Layouts, Pages, Metadata)
│   ├── components/       # UI Components (Seo-optimized, dynamically imported)
│   ├── lib/              # API abstraction layer, Type definitions, and utility functions
│   ├── data/             # Hardened data models for Villas and Blogs
│   └── context/          # Global state (Animation, UI)
├── public/               # Optimized assets & social images
└── ...config files       # Performance-tuned Next.js & Tailwind configs
```

## ⚡ Development

1. **Install Dependencies**: `npm install`
2. **Launch Dev Server**: `npm run dev`
3. **Build Profile**: `npm run build` (Ensures all metadata, types, and sitemaps generate correctly)

---

> [!IMPORTANT]
> This platform is optimized for **Core Web Vitals** and maintains strict TypeScript standards. Any UI changes should be audited for performance impact, and all code must pass type-checking before deployment.

**Technical Architect**: Antigravity
