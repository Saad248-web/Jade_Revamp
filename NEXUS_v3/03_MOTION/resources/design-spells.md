# Design Spells — Magnetic, Physics, Delight
## Interactions that feel alive

---

## Magnetic Hover

Elements that attract the cursor — common on CTA buttons and nav items.

```tsx
import { useRef } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

const MagneticButton = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.35;  // 0.35 = magnetism strength
    const deltaY = (e.clientY - centerY) * 0.35;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};
```

---

## Cursor Follower

Custom cursor that trails behind the actual cursor.

```tsx
import { motion, useMotionValue, useSpring } from 'motion/react';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 400, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 400, damping: 40 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: springX,
        top: springY,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: 'var(--color-accent)',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
      }}
    />
  );
};
```

---

## Scroll-Linked Animations

Progress bar tied to page scroll position.

```tsx
import { motion, useScroll, useSpring } from 'motion/react';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        right: 0, height: 3,
        background: 'var(--color-accent)',
        transformOrigin: '0%',
        scaleX,
        zIndex: 100,
      }}
    />
  );
};
```

---

## Particle Explosion (Button click Easter egg)

```tsx
const ParticleButton = ({ children, onClick }) => {
  const [particles, setParticles] = useState([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setParticles(Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x, y,
      angle: (i / 12) * Math.PI * 2,
      distance: 40 + Math.random() * 40,
    })));
    onClick?.();
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={handleClick}>{children}</button>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
          animate={{
            x: p.x + Math.cos(p.angle) * p.distance,
            y: p.y + Math.sin(p.angle) * p.distance,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => setParticles(prev => prev.filter(pp => pp.id !== p.id))}
          style={{
            position: 'absolute',
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--color-accent)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
};
```

---

## Tilt Card (3D perspective on hover)

```tsx
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

const TiltCard = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 400, damping: 40 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 400, damping: 40 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
};
```

---

## Scramble Text (Hacker-style reveal)

```tsx
const ScrambleText = ({ text, trigger }: { text: string; trigger: boolean }) => {
  const chars = '!@#$%^&*()_+-=[]{}|;:,./<>?';
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text.split('').map((char, i) =>
          i < iteration
            ? char
            : chars[Math.floor(Math.random() * chars.length)]
        ).join('')
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, 30);
    return () => clearInterval(interval);
  }, [trigger, text]);

  return <span>{display}</span>;
};
```

---

## Delight Targets (when to use design spells)

| Interaction | Spell | Frequency |
|-------------|-------|-----------|
| Primary CTA hover | Magnetic button | Every hero CTA |
| Card grid hover | Tilt card | Feature cards, portfolio |
| Button click (success) | Particle explosion | Positive confirmations only |
| Page navigation | Progress bar | Blog posts, long-form |
| Creative portfolios | Custom cursor | Optional — when brand suits |
| Hero text reveal | Scramble text | One headline max per page |
| Testimonial section | Infinite marquee | Standard pattern |

**Rule:** Design spells are seasoning, not the main course. One per section maximum. They must enhance the message, never distract from it.
