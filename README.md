# Jade Hospitainment - ReVamp

Welcome to the **Jade Hospitainment** web application repository. This project is a modern, high-performance Next.js application designed to showcase luxury villas and unique hospitality experiences.

## 🚀 Overview

Jade Hospitainment combines hospitality and entertainment to offer unforgettable stays and events. This web application serves as the digital front door for guests to explore properties, view amenities, and book their next getaway.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** Google Fonts (Philosopher & Manrope)

## ✨ Key Features

- **Cinematic Villa Showcases:** Detailed pages for each villa (`/villas/[id]`) featuring high-quality imagery, carousel sliders, and immersive descriptions.
- **Interactive Details:** Custom-built `DetailsDrawer` providing deep dives into amenities, services, and property specifications without cluttering the main view.
- **Performance Optimized:**
  - Aggressive image optimization using `next/image` with proper sizing and format selection.
  - GPU-accelerated animations for smooth scrolling and transitions on all devices.
  - Mobile-first design with reduced layout thrashing for low-end devices.
- **Responsive Design:** Fully responsive layout ensuring a premium experience across desktops, tablets, and mobile phones.

## 📂 Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # Reusable UI components (Navbar, Footer, Drawer, etc.)
│   ├── data/             # Static data files (villas.ts)
│   └── context/          # React Context providers (AnimationContext)
├── public/               # Static assets (images, fonts)
└── ...config files       # Tailwind, Next.js, TypeScript configurations
```

## ⚡ Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Jade_ReVamp
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Performance Notes

This application has been tuned for performance, particularly on mobile devices:

- **Backdrop Filters:** Heavy `backdrop-blur` effects have been minimized or replaced with semi-transparent backgrounds on mobile to ensure 60fps scrolling.
- **Image Loading:** Critical images use `priority` loading, while off-screen images are lazy-loaded with appropriate `sizes` attributes.

## 🤝 Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

---

_Verified & Refactored by Antigravity_
