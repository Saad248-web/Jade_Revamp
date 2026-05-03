# 3D Assets Source Guide
## Where to find · What they provide · How to use

---

## 3D Letters / Text
**artify.co/3dlettering**
- Pre-made 3D letter renders and typography
- PNG with transparent background
- Best for: hero headlines, branding elements
- Usage: export PNG, use as `<img>` or CSS background

---

## 3D Icons
**3dicons.co**
- 460+ 3D icon library, multiple styles
- Free for commercial use
- Formats: PNG, WebP, BLEND, FBX, glTF
- Styles: Bright, Dark, Gradient, Neumorphic
- Usage: `<img src="icon.png" alt="..." width="64" height="64" />`

---

## 3D Illustrations
**icons8.com/l/3d**
- Comprehensive 3D illustration packs
- Characters, objects, UI elements
- Multiple style collections

**homies-f662e0.webflow.io**
- Premium 3D character and scene illustrations
- Editorial-grade quality

**handz.design**
- 3D hands and device mockup illustrations
- Perfect for app showcases and feature sections
- Gestures: pointing, holding phone, typing

---

## 3D Model Generation
**meshy.ai** (image → 3D model)
- Upload any image → receive downloadable 3D model
- Output: glTF, OBJ, FBX, USDZ
- Best for: product shots, custom hero objects
- Pipeline: Design in Figma → screenshot → Meshy → glTF → Three.js/Spline

---

## Interactive 3D Scenes
**Spline (spline.design)**
- Designer-friendly 3D tool with export to web
- No-code 3D scenes embeddable via `<script>` or React component
- Best for: hero backgrounds, interactive product viewers

```tsx
// Spline React embed
import Spline from '@splinetool/react-spline';

<Spline
  scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode"
  onLoad={(spline) => {
    // Access scene objects
    const obj = spline.findObjectByName('cube');
  }}
/>
```

**React Three Fiber (custom 3D)**
```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

const Scene = () => (
  <Canvas camera={{ position: [0, 0, 5] }}>
    <Environment preset="studio" />
    <OrbitControls enableZoom={false} />
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  </Canvas>
);
```

---

## Product Showcase
**SketchFab (sketchfab.com)**
- Embed existing 3D models from community
- Best for: real product showcases, detailed models

```html
<!-- SketchFab iframe embed -->
<div class="sketchfab-embed-wrapper">
  <iframe
    title="Product Model"
    frameborder="0"
    allowfullscreen
    mozallowfullscreen="true"
    webkitallowfullscreen="true"
    allow="autoplay; fullscreen; xr-spatial-tracking"
    src="https://sketchfab.com/models/MODEL_ID/embed?autospin=1&ui_theme=dark"
    width="100%"
    height="480"
  ></iframe>
</div>
```

---

## 3D Asset Decision Tree

```
Need animated interactive 3D hero?
→ Spline (designer-friendly) or R3F (developer control)

Need static 3D illustration for sections?
→ 3dicons.co (icons) · handz.design (hands/devices) · icons8.com (scenes)

Need 3D text for headlines?
→ artify.co/3dlettering

Need custom 3D model from sketch/image?
→ meshy.ai → export glTF → load in R3F or Spline

Need real product 3D viewer?
→ SketchFab embed

Need icon with subtle 3D animation?
→ Lottie Files (lottiefiles.com)
```

---

## Performance Rules for 3D

```
□ Lazy-load all 3D (intersection observer or dynamic import)
□ Show 2D fallback on mobile or slow connections
□ Spline scenes < 5MB (check in Spline editor)
□ R3F: dispose geometry and materials on unmount
□ R3F: use <Suspense> with a fallback
□ NEVER block page render on 3D load
□ Compressed textures (KTX2 / WebP) when possible
□ LOD (Level of Detail) on complex scenes
```
