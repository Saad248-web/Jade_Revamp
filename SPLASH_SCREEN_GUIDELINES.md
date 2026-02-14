# Splash Screen Guidelines

## Overview

The Splash Screen acts as the initial "curtain" reveal for the application, setting the tone for the "Jade Hospitainment" experience.

## Animation Sequence

1.  **Initial State**:
    - Curtain (Transparent Div) is hidden or practically invisible.
    - Text is hidden.
2.  **Introduction (Stage 1)**:
    - **Delay**: The sequence begins after a **200ms** delay.
    - **Action**: Text fades in / curtain prepares.
3.  **Reading Time (Stage 2)**:
    - Text remains visible for reading.
4.  **Exit (Stage 3)**:
    - **Action**: Each text line individually wipes disappearing from **Top to Bottom**.
    - **Sync**: All lines animate simultaneously (No stagger).
    - **Method**: `clip-path: inset(100% 0 0 0)` on each item.
    - **Easing**: "Fast to Slow" movement (Cubic Bezier: `0.22, 1, 0.36, 1`).
    * **Curtain Expansion**: The transparent div expands to fill the screen.
    * **Systematic Expansion**: The expansion must reach exactly **100vw** and **100vh** to ensure the corners of the "window" touch the corners of the device screen precisely.

## Design Specs

### Transparent Div (The Curtain)

- **Border Radius**: **0px** (Zero). Must be a sharp rectangle.
- **Shadow**: Uses a massive box-shadow to create the "cutout" effect.

### Typography & Logo

- **Sizing**: Kept refined and elegant (smaller than default hero text).
  - _Mobile_: Text ~10px-12px / Headings ~3xl-5xl.
  - _Desktop_: Text ~xs-sm / Headings ~5xl-7xl.
- **Layout**: Stacked VERTICALLY.
  - "Step into the world of"
  - "Jade"
  - "Hospitainment"
  - [Logo]

## Code Reference

- **File**: `src/components/SplashScreen.tsx`
- **Key Variants**: `curtainVariants` (controls width/height/transition).
