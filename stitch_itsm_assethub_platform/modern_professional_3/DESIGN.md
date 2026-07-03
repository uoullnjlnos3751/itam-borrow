---
name: Modern Professional
colors:
  surface: '#f9f9ff'
  surface-dim: '#d7dae3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fc'
  surface-container: '#ebedf7'
  surface-container-high: '#e6e8f1'
  surface-container-highest: '#e0e2eb'
  on-surface: '#181c22'
  on-surface-variant: '#414753'
  inverse-surface: '#2d3037'
  inverse-on-surface: '#eef0fa'
  outline: '#717785'
  outline-variant: '#c1c6d5'
  surface-tint: '#005db8'
  primary: '#005ab4'
  on-primary: '#ffffff'
  primary-container: '#0a73e0'
  on-primary-container: '#fefcff'
  inverse-primary: '#aac7ff'
  secondary: '#465f88'
  on-secondary: '#ffffff'
  secondary-container: '#b6d0ff'
  on-secondary-container: '#3f5881'
  tertiary: '#964400'
  on-tertiary: '#ffffff'
  tertiary-container: '#bd5700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458d'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aec7f7'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#2d476f'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#763400'
  background: '#f9f9ff'
  on-background: '#181c22'
  surface-variant: '#e0e2eb'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
---

# Design System: Modern Professional

## Brand & Style
The brand identity has transitioned from a high-energy, warm aesthetic to a reliable, calm, and professional persona. The "Modern Professional" style prioritizes clarity, trust, and technical precision. By moving away from aggressive oranges and sharp corners toward a balanced blue palette with softened edges, the UI evokes a sense of stability and modern efficiency. 

The design style is **Corporate / Modern**, drawing inspiration from contemporary interface standards like Material 3 and HIG. It utilizes a structured layout, purposeful color application, and high-readability typography to serve users who require a focused and dependable digital environment.

## Colors
The color palette is anchored by a foundational "fidelity" blue. The **Primary** color (#1275e2) is a vibrant, trustworthy blue used for key actions and brand presence. The **Secondary** color (#5f78a3) is a desaturated slate blue that provides professional balance and supports the primary actions without competing for attention. 

A **Tertiary** burnt orange (#c55b00) is used sparingly as an accent for highlights or specific callouts that require contrast against the cool-toned primary palette. The **Neutral** tones (#74777f) are cool grays that ground the interface, used for secondary text, borders, and structural elements. The system operates in a **Light** color mode, ensuring high legibility and a clean, open feel.

## Typography
The system uses **Inter** for all typographic roles (Headlines, Body, and Labels). Inter is chosen for its exceptional legibility on digital screens and its neutral, modern character. 

Headlines use a semi-bold weight to establish a clear hierarchy. Body text is set with generous line heights to ensure comfortable reading of long-form content. Labels utilize a slightly tighter tracking and medium weight to remain distinct even at smaller scales.

*   **Headline Large:** Inter, 32px, Semi-bold
*   **Body Medium:** Inter, 14px, Regular
*   **Label Medium:** Inter, 12px, Medium

## Layout & Spacing
The layout follows a **Fluid Grid** philosophy based on an 8px square rhythm. This ensures that all components, margins, and gutters scale proportionally.

On desktop, the layout utilizes a 12-column grid with 24px margins. On mobile, it collapses to a 4-column grid with 16px margins. Vertical rhythm is maintained by using the spacing variables (md: 16px for standard gaps, lg: 24px for section separation). 

## Elevation & Depth
Visual hierarchy is conveyed through **Tonal Layers** and subtle **Ambient Shadows**. Surfaces are tiered to represent depth: the background is the lowest level, with cards and modals sitting on elevated "containers" that use slightly different surface colors or soft, diffused shadows. Shadows should be low-opacity and tinted with the neutral color to avoid a "muddy" appearance.

## Shapes
The shape language uses a **Rounded** approach. Standard UI elements like buttons and input fields feature a 0.5rem (8px) corner radius. Larger components like cards or containers use a 1rem (16px) radius, while extra-large surfaces like modals use 1.5rem (24px). This rounding softens the technical nature of the professional blue palette.

## Components
- **Buttons:** Filled buttons use the Primary Blue (#1275e2) with 8px rounded corners. Text is centered Inter Semi-bold.
- **Input Fields:** Outlined style using the Neutral border (#74777f) with an 8px radius. 
- **Cards:** Use a 16px radius with subtle ambient shadows for depth.
- **Chips:** Highly rounded (pill-shaped) using the Secondary Blue palette.
- **Lists:** Clean rows with 16px horizontal padding and subtle neutral dividers.