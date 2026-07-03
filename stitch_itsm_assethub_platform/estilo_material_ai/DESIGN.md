---
name: Estilo Material AI
colors:
  surface: '#f3f8f4'
  surface-dim: '#ced6d1'
  surface-bright: '#f3f8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf2ee'
  surface-container: '#e3eae5'
  surface-container-high: '#dde4e0'
  surface-container-highest: '#d7dfda'
  on-surface: '#2a302d'
  on-surface-variant: '#575d5a'
  inverse-surface: '#0a0f0d'
  inverse-on-surface: '#999e9b'
  outline: '#727875'
  outline-variant: '#a9aeab'
  surface-tint: '#0058bc'
  primary: '#0058bc'
  on-primary: '#f0f2ff'
  primary-container: '#6d9fff'
  on-primary-container: '#00214f'
  inverse-primary: '#4d8efe'
  secondary: '#b41a14'
  on-secondary: '#ffefed'
  secondary-container: '#ffc3bb'
  on-secondary-container: '#940004'
  tertiary: '#765600'
  on-tertiary: '#fff1db'
  tertiary-container: '#febf0d'
  on-tertiary-container: '#563e00'
  error: '#b31b25'
  on-error: '#ffefee'
  error-container: '#fb5151'
  on-error-container: '#570008'
  primary-fixed: '#6d9fff'
  primary-fixed-dim: '#5291ff'
  on-primary-fixed: '#000000'
  on-primary-fixed-variant: '#002a61'
  secondary-fixed: '#ffc3bb'
  secondary-fixed-dim: '#ffb0a5'
  on-secondary-fixed: '#700002'
  on-secondary-fixed-variant: '#a4090a'
  tertiary-fixed: '#febf0d'
  tertiary-fixed-dim: '#eeb200'
  on-tertiary-fixed: '#3d2b00'
  on-tertiary-fixed-variant: '#614700'
  primary-dim: '#004ca5'
  secondary-dim: '#a30709'
  tertiary-dim: '#674b00'
  error-dim: '#9f0519'
  background: '#f3f8f4'
  on-background: '#2a302d'
  surface-variant: '#d7dfda'
typography:
  display-lg:
    fontFamily: Roboto
    fontSize: 4rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Roboto
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Roboto
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Roboto
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Roboto
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  code:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 1.5rem
  section-gap-min: 4rem
  section-gap-max: 8rem
---

## Overview

Estilo Material AI — Design tech-inspired com ai, generative ai, cloud. Template e prompt pronto para IA. Estilo Estilo Material AI representa uma tendência moderna em design UI/UX web com foco em tech-inspired.

- Density: 3/10 — Airy
- Variance: 3/10 — Restrained
- Motion: 4/10 — Subtle

- **Style:** Clean, Vibrant, User-Friendly
- **Keywords:** AI, generative AI, cloud, developer, intuitive, vibrant, clean, modern
- **Era:** 2026+ AI-First
- **Light/Dark:** ✓ Full / ✗ No (com opções de tema)

## Colors

- **Azul Vibrante** (#4285F4) — Accent highlight, links and focus states
- **Vermelho Ousado** (#EA4335) — Error states, destructive actions
- **Amarelo Energético** (#FBBC05) — Warning states, attention indicators
- **Verde Pálido Neutro** (#EDF2EE) — Modern neutral used for surfaces and backgrounds, providing a cleaner, less saturated feel
- **Branco** (#FFFFFF) — Secondary surface
- **Cinza Claro** (#F8F9FA) — Secondary text, borders, muted elements
- **Cinza Escuro** (#3C4043) — Deep contrast surface
- **Ciano** (#00BCD4) — Extended palette, decorative use

## Typography

- **Display / Hero:** Roboto — Weight 700, tight tracking, used for headline impact
- **Body:** Roboto — Weight 400, 16px/1.6 line-height, max 72ch per line
- **UI Labels / Captions:** Roboto — 0.875rem, weight 500, slight letter-spacing
- **Monospace:** JetBrains Mono — Used for code, metadata, and technical values

Scale:
- Hero: clamp(2.5rem, 5vw, 4rem)
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem

## Layout

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Section vertical gaps:** clamp(4rem, 8vw, 8rem).
- **Hero layout:** Split-screen (text left, visual right).
- **Feature sections:** Zig-zag alternating text+image rows. No 3-equal-columns.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).

## Elevation & Depth

Sombras sutis (Material Design), gradientes dinâmicos, micro-interações responsivas, tipografia legível (sans-serif), elementos flutuantes, animações de carregamento de IA, ilustrações abstratas de dados.

- **Physics:** Ease-out curves, 200-300ms duration. Smooth and predictable.
- **Entry animations:** Fade + translate-Y (16px → 0) over 420ms ease-out. Staggered cascades for lists: 80ms between items.
- **Hover states:** Subtle color shift + shadow adjustment over 200ms.
- **Page transitions:** Fade only (200ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.

## Shapes

Base corner radius: 8px. See rounded tokens in front matter for the full scale.

## Components

- **Primary Button:** Rounded (8px) shape. Accent color fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Rounded (8px) corners. Neutral surface background (#EDF2EE). Subtle shadow (0 2px 12px rgba(0,0,0,0.06)). 1px border stroke.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px accent color offset 2px. Error text below in semantic red. No floating labels.
- **Navigation:** Primary surface background. Active item: accent color indicator. Font weight 500 when active.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty States:** Icon-based composition with descriptive text and action button.

## Do's and Don'ts

- No emojis in UI — use icon system only (Lucide, Heroicons)
- No pure black (#000000) — use off-black or charcoal variants
- No oversaturated accent colors (saturation cap: 80%)
- No 3-column equal-width feature layouts — use zig-zag or asymmetric grid
- No `h-screen` — use `min-h-[100dvh]`
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No broken external image links — use picsum.photos or inline SVG
- No generic lorem ipsum in demos

- Do Cores vibrantes da marca
- Do Sombras Material Design
- Do Gradientes dinâmicos
- Do Tipografia legível
- Do Animações de IA
- Do Foco no desenvolvedor.

## Use Case

Landing pages, Websites modernas