# Easing Library — Emil Kowalski System
## Advanced motion patterns from animations.dev

---

## The Easing Hierarchy

Never use `linear`. It's mechanical and lifeless.
Never use `ease` (CSS default) — it's imprecise.
Always use `cubic-bezier` with intent.

```
Enters (things appearing):   ease-out family
Exits (things disappearing): ease-in family
Position changes:            ease-in-out
Spring/bounce:               overshoot cubic-bezier
Scroll scrub:                linear (only exception — tied to scroll position)
```

---

## GSAP Easing Reference

```js
// Recommended eases for production
'power3.out'    // Standard reveal — most used
'power4.out'    // More dramatic reveal (hero headlines)
'expo.out'      // Cinematic — dramatic deceleration
'back.out(1.7)' // Spring with overshoot — interactive elements
'circ.out'      // Circular deceleration — premium feel
'elastic.out(1, 0.3)' // Physics spring — playful only

// In ScrollTrigger scrubs — linear only
ease: 'none'    // Tied 1:1 to scroll position

// Stagger patterns
stagger: {
  amount: 0.6,      // Total time for all items
  from: 'start',    // 'start' | 'end' | 'center' | 'random'
  ease: 'power2.out',
}
```

---

## Framer Motion Spring Configs

```tsx
// Snappy UI (hover, tap)
const snappy = { type: 'spring', stiffness: 400, damping: 35 }

// Smooth reveal (page sections)
const smooth = { type: 'spring', stiffness: 100, damping: 25 }

// Bouncy playful
const bouncy = { type: 'spring', stiffness: 200, damping: 10, mass: 0.5 }

// Gentle float
const gentle = { type: 'spring', stiffness: 50, damping: 20 }

// Duration-based (when you need precise timing)
const timed = { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
```

---

## Scroll Narrative Patterns

### Sticky Feature Showcase (most popular SaaS pattern)
```tsx
import { useScroll, useTransform, motion } from 'motion/react';

const StickyFeatures = ({ features }) => {
  const { scrollYProgress } = useScroll();
  const [activeIndex, setActiveIndex] = useState(0);

  const opacity1 = useTransform(scrollYProgress, [0, 0.25, 0.5], [1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.75, 1], [0, 1, 1]);

  return (
    <div style={{ height: `${features.length * 100}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {features.map((feature, i) => (
          <motion.div key={i} style={{ opacity: [opacity1, opacity2, opacity3][i], position: 'absolute', inset: 0 }}>
            <FeatureScreen feature={feature} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
```

### Counter Animation (numbers rolling up)
```tsx
import { useInView, useMotionValue, useSpring, animate } from 'motion/react';

const AnimatedCounter = ({ target, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v));

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 2, ease: [0.16, 1, 0.3, 1] });
    }
  }, [isInView]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
};

// Usage: <AnimatedCounter target={10000} suffix="+" />
```

---

## Page Transition (Next.js App Router)

```tsx
// components/PageTransition.tsx
'use client';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';

export const PageTransition = ({ children }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

---

## Duration Reference Chart

| Interaction type | Duration | Easing |
|-----------------|----------|--------|
| Button hover | 100–150ms | ease-out |
| Button press (tap) | 80ms | ease-in |
| Modal open | 250ms | spring(400, 35) |
| Modal close | 180ms | ease-in |
| Toast in | 300ms | spring(200, 25) |
| Toast out | 200ms | ease-in |
| Page transition | 250ms | expo-out |
| Scroll reveal | 500–700ms | expo-out |
| Hero headline | 700–900ms | expo-out |
| Counter animation | 1500–2000ms | expo-out |
| Parallax | tied to scroll | linear only |
