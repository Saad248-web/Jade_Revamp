# Design Guidelines

## Core Principles

- **Systematic Precision**: Elements should align strictly with the grid and device boundaries where applicable.
- **Geometric Sharpness**: We prioritize sharp, clean lines over soft, rounded curves to convey a premium, modern aesthetic.

## Components

### Buttons

- **Border Radius**: MUST be `0px` (Zero).
- **Class**: Use `rounded-none` in Tailwind.
- **Applicability**: This applies to all primary, secondary, and tertiary buttons, as well as icon buttons and navigation controls.

### Navigation

- **Active States**: Indicators (like dots or lines) should follow the sharp aesthetic where possible, or be deliberately distinct.

### Containers

- **Cards & Modals**: Should generally follow the zero-radius rule unless specific "organic" theming is required (e.g., bubbles). Current direction is to sharpen major containers.
