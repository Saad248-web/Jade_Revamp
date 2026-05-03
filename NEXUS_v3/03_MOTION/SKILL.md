---
name: nexus-motion
description: "Animation, scroll narratives, micro-interactions, 3D, physics-based interactions, design spells. Emil Kowalski motion philosophy — no linear easing, ever. GPU-only animations. Framer Motion v11, GSAP + ScrollTrigger + Lenis, Anime.js, Spline, Lottie, SketchFab, Three.js/R3F. Use when: adding animation to any UI, scroll experiences, 3D heroes, interactive physics, loading animations, page transitions, hover effects, magnetic interactions."
triggers: ["animation", "motion", "scroll", "parallax", "3d", "spline", "lottie", "gsap", "framer motion", "animate", "transition", "hover effect", "loading animation", "page transition", "reveal", "magnetic", "physics", "spring", "stagger", "infinite scroll", "marquee", "ticker", "three.js", "r3f", "three fiber", "sketchfab", "design spell", "micro-interaction", "easter egg"]
---

# NEXUS MOTION Engine v3.0
**No linear easing. GPU-only. Delight is the goal.**

---

## PHASE 0 — Motion Feasibility Check

Before adding any animation:

```
1. Does this animation convey meaning or aid comprehension?
   → If no: remove it. Decoration for decoration's sake = noise.

2. Is it GPU-only? (transform + opacity ONLY in loops)
   → If animating layout properties (width, height, padding, margin): STOP.
   → Restructure using transform: translateX/Y/scale instead.

3. prefers-reduced-motion handled?
   → If no: add before writing a single keyframe.

4. Duration appropriate?
   Micro (hover, tap): 100–200ms
   Transition (nav, modal open): 200–350ms
   Reveal (on scroll): 400–700ms
   Cinematic (hero, full-page): 700–1200ms
```

---

## PHASE 1 — Emil Kowalski Motion Philosophy

**Core principles (from animations.dev):**

1. **Never use linear easing.** Linear = mechanical, robotic, lifeless.
   Use `cubic-bezier` always. The easing IS the personality of the motion.

2. **Spring physics for interactions** — things that respond to user input should feel physical.

3. **Stagger reveals** — list items, cards, grid items should enter sequentially, not all at once.

4. **One well-orchestrated reveal > ten scattered micro-animations.**

5. **Exit animations matter as much as entrances.**

6. **The best animation is one the user never consciously notices** — it just feels right.

**Easing reference (from global.css):**
```css
--ease-out:      cubic-bezier(0.0, 0.0, 0.2, 1);       /* Standard exits */
--ease-in:       cubic-bezier(0.4, 0.0, 1, 1);         /* Standard entrances */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);    /* Playful/bouncy UI */
--ease-smooth:   cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Refined transitions */
--ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);         /* Dramatic scroll reveals */
```

---

## PHASE 2 — Stack Selection

| Need | Tool | Install |
|------|------|---------|
| React components | **Framer Motion v11** | `npm i motion` |
| Scroll + timeline | **GSAP + ScrollTrigger** | `npm i gsap` |
| Smooth scroll | **Lenis** | `npm i lenis` |
| SVG / timeline | **Anime.js** | `npm i animejs` |
| Designer 3D | **Spline** | spline.design |
| Code 3D | **React Three Fiber** | `npm i @react-three/fiber @react-three/drei` |
| Icon animations | **Lottie** | `npm i @lottie-files/lottie-player` |
| Product showcase | **SketchFab** | iframe embed |

Read `resources/easing-library.md` for advanced patterns.
Read `resources/design-spells.md` for magnetic/physics interactions.
Read `resources/3d-assets.md` for 3D source guide.

---

## PHASE 3 — Framer Motion v11 Patterns

### Page / Section Reveals (most used)
```tsx
import { motion } from 'motion/react';

// Fade up reveal — the standard
const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </motion.div>
);

// Staggered list — cards, features, testimonials
const StaggerContainer = ({ children }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.1 } }
    }}
  >
    {children}
  </motion.div>
);

const StaggerItem = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
    }}
  >
    {children}
  </motion.div>
);
```

### Interactive Hover States
```tsx
// Card lift
<motion.div
  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
  transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
>

// Button press
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
>

// Image scale
<motion.img
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
  style={{ transformOrigin: 'center' }}
/>
```

### Layout Animations (AnimatePresence)
```tsx
import { AnimatePresence, motion } from 'motion/react';

// Modal
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* modal content */}
    </motion.div>
  )}
</AnimatePresence>

// Toast notifications
<AnimatePresence mode="popLayout">
  {toasts.map(toast => (
    <motion.div
      key={toast.id}
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
    >
      {toast.message}
    </motion.div>
  ))}
</AnimatePresence>
```

### Text Animations
```tsx
// Word-by-word reveal
const words = "Your headline text here".split(" ");

<div>
  {words.map((word, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'inline-block', marginRight: '0.25em' }}
    >
      {word}
    </motion.span>
  ))}
</div>

// Gradient text shimmer
<motion.span
  animate={{
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
  }}
  transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
  style={{
    background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
    backgroundSize: '200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  Gradient text
</motion.span>
```

---

## PHASE 4 — GSAP + ScrollTrigger + Lenis

### Lenis Smooth Scroll Setup
```tsx
import Lenis from 'lenis';
import { useEffect } from 'react';

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);
};
```

### GSAP ScrollTrigger Patterns
```tsx
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Parallax section
gsap.to('.parallax-bg', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});

// Pinned sticky scroll (feature showcase)
ScrollTrigger.create({
  trigger: '.sticky-section',
  start: 'top top',
  end: '+=200%',
  pin: true,
  pinSpacing: true,
  onUpdate: (self) => {
    // progress 0→1 drives the animation
    setProgress(self.progress);
  },
});

// Staggered card reveal on scroll
gsap.from('.card', {
  opacity: 0,
  y: 40,
  stagger: 0.1,
  duration: 0.7,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.cards-grid',
    start: 'top 80%',
    once: true,
  },
});
```

---

## PHASE 5 — Infinite Marquee / Ticker

```tsx
// CSS-only infinite marquee (no JS needed)
const Marquee = ({ items, speed = 30 }: { items: string[], speed?: number }) => (
  <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
    <div style={{
      display: 'inline-flex',
      animation: `marquee ${speed}s linear infinite`,
    }}>
      {[...items, ...items].map((item, i) => (
        <span key={i} style={{ padding: '0 2rem' }}>{item}</span>
      ))}
    </div>
    <style>{`
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @media (prefers-reduced-motion: reduce) {
        /* Stop animation, show as static row */
        div[style*="animation"] { animation: none; }
      }
    `}</style>
  </div>
);

// Dual-row (opposite directions) testimonials
<Marquee items={row1} speed={30} />
<Marquee items={row2} speed={20} direction="reverse" />
```

---

## PHASE 6 — GPU-Only Rule (Performance)

**What you can animate freely (GPU-composited):**
```css
transform: translateX/Y/Z, scale, rotate, skew
opacity
filter (blur, brightness — use sparingly)
```

**What you must NEVER animate in loops:**
```css
/* These trigger layout → NEVER */
width, height, padding, margin, top, left, right, bottom
border-width, font-size

/* Use transform equivalents instead */
/* width change → scaleX() */
/* position change → translateX/Y() */
```

**will-change — use sparingly:**
```css
/* Only on elements that WILL animate — not on everything */
.animated-element {
  will-change: transform;  /* Pre-promote to GPU layer */
}
/* Remove after animation: element.style.willChange = 'auto'; */
```

---

## PHASE 7 — Reduced Motion (Non-Negotiable)

```css
/* CSS */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// React — hook
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Framer Motion — built-in
import { useReducedMotion } from 'motion/react';
const shouldReduce = useReducedMotion();

<motion.div
  animate={{ opacity: shouldReduce ? 1 : [0, 1], y: shouldReduce ? 0 : [20, 0] }}
/>
```

---

## Delivery Checklist

```
□ No linear easing anywhere — cubic-bezier only
□ prefers-reduced-motion handled in all animations
□ GPU-only properties used in all loops (transform + opacity)
□ No layout properties animated (width, height, padding, margin)
□ Stagger delays reasonable (0.05–0.15s between items)
□ Exit animations defined for everything with enter animations
□ Duration matches motion type (micro: 100–200ms, reveal: 400–700ms)
□ will-change removed after animation completes
□ ScrollTrigger instances cleaned up on component unmount
□ No jank on low-end devices tested
```
