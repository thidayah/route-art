# RouteArt — Design System

> Last updated: Phase 1 refinement — synchronized with root `DESIGN.md` (Clay.com analysis).
> `DESIGN.md` = visual direction source · `docs/design.md` = implemented reference

---

## Design Direction

**Modern · Minimal · Sporty · Dark**

RouteArt uses a dark canvas with a single lime-400 accent, inspired by the typography and spacing discipline of `DESIGN.md`. The Clay.com system's core principles — tight negative letter-spacing on display type, 96px section rhythm, hairline borders, 44px touch targets, and no hover scale — are translated into RouteArt's dark-canvas context.

---

## Color Palette

### Backgrounds

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| Page background | `#0A0A0A` | `bg-neutral-950` | Main canvas |
| Card surface | `#171717` | `bg-neutral-900` | Cards, panels, form |
| Input surface | `#1C1C1C` | `bg-neutral-800` | Form inputs |

### Accent

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| Accent primary | `#A3E635` | `lime-400` | Primary buttons, badges, active states |
| Accent hover | `#BEF264` | `lime-300` | Hover on primary button |
| Accent dim | `lime-400/80` | — | Section labels (subdued) |
| Accent glow | `lime-400/10` | — | Focus rings |

### Text

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| Primary | `#F5F5F5` | `text-neutral-100` | Headings, primary body |
| Secondary | `#A3A3A3` | `text-neutral-400` | Descriptions, ghost button text |
| Muted | `#737373` | `text-neutral-500` | Captions, section descriptions |
| Disabled | `#525252` | `text-neutral-600` | Footer text, hints |

### Borders (Hairline System — from DESIGN.md)

All borders use white opacity, not neutral palette values. This creates a consistent "hairline" feel regardless of surface color.

| Usage | Class |
|---|---|
| Default card/section border | `border-white/6` |
| Input default | `border-white/8` |
| Input hover | `border-white/12` |
| Interactive hover | `border-white/16` |
| Dividers | `border-white/4` or `border-white/6` |

---

## Typography

### Font Family

- **Display/Headings**: Geist Sans (loaded via `next/font/google`)
- **Body / UI**: Geist Sans — same family, different weights
- **Fallback**: Arial, Helvetica, sans-serif

### Hierarchy (synchronized with DESIGN.md tokens)

| Role | Size | Weight | Tracking | Tailwind |
|---|---|---|---|---|
| Display / Hero h1 | 48–72px | 700 | `-0.05em` | `text-5xl md:text-7xl font-bold tracking-tighter` |
| Section heading h2 | 30–36px | 700 | `-0.025em` | `text-3xl sm:text-4xl font-bold tracking-tight` |
| Card title h3 | 14px | 600 | `-0.01em` | `text-sm font-semibold tracking-[-0.01em]` |
| Body | 14–16px | 400 | 0 | `text-sm sm:text-base` |
| Description | 14px | 400 | 0 | `text-sm leading-[1.6]` |
| Caption-uppercase label | 11px | 600 | `+0.1em` | `text-[11px] font-semibold uppercase tracking-widest` |
| Caption small | 11px | 500 | `+0.06em` | `text-[11px] uppercase tracking-[0.06em]` |
| Button | 13–14px | 600 | 0 | `text-sm font-semibold` |
| Nav link | 13–14px | 500 | 0 | `text-[13px] font-medium` |

### Principles (from DESIGN.md)

- Display type uses **font-bold (700)** with **negative letter-spacing** (`tracking-tight` or `tracking-tighter`) — not font-black (900). Weight 900 reads as bombastic on dark backgrounds.
- Body and UI copy stay at 400–600. Never use font-black for body text.
- Line height for body text: `leading-[1.6]` (1.55–1.6). For headings: `leading-none` (1.0).

---

## Spacing System

Based on DESIGN.md's 4px base unit and `{spacing.section}` = 96px rhythm.

| Token | Value | Tailwind |
|---|---|---|
| xxs | 4px | `p-1` |
| xs | 8px | `p-2` |
| sm | 12px | `p-3` |
| md | 16px | `p-4` |
| lg | 24px | `p-6` |
| xl | 32px | `p-8` |
| xxl | 48px | `p-12` |
| **section** | **96px** | **`py-24`** |

### Layout Standards

- **Max content width**: `max-w-5xl` (1024px) for all sections
- **Form max width**: `max-w-xl` (672px)
- **Section padding**: `py-24 px-4 sm:px-6` (96px vertical)
- **Section header bottom margin**: `mb-12`
- **Card grid gap**: `gap-4`
- **Card internal padding**: `p-4`
- **Form card padding**: `p-6 sm:p-8`

---

## Border Radius Scale

From DESIGN.md:

| DESIGN.md token | Value | Tailwind | Usage |
|---|---|---|---|
| `rounded.xs` | 6px | `rounded` | Small inline elements |
| `rounded.sm` | 8px | `rounded-lg` | Card action buttons |
| `rounded.md` | 12px | `rounded-xl` | Buttons, inputs, filter pills active |
| `rounded.lg` | 16px | `rounded-2xl` | Route cards, form cards |
| `rounded.xl` | 24px | `rounded-3xl` | (reserved for future feature cards) |
| `rounded.pill` | 9999px | `rounded-full` | Filter pills, badge pills |

---

## Components

### Navbar

```
height: h-16 (64px)
scrolled: bg-neutral-950/95 backdrop-blur-sm border-b border-white/6
transparent: bg-transparent
logo: font-semibold text-sm tracking-tight
nav-link: text-[13px] font-medium
button: h-[36px] px-3 rounded-lg bg-white/4 border-white/8
```

### Buttons

**Primary (Lime) — main CTA**
```
bg-lime-400 hover:bg-lime-300 text-neutral-950 font-semibold text-sm
h-[44px] px-6 rounded-xl
active:scale-95 transition-colors duration-150
NO hover scale, NO hover shadow
```

**Secondary (Ghost) — paired with primary**
```
bg-transparent hover:bg-white/4 text-neutral-300 hover:text-white font-medium text-sm
h-[44px] px-6 rounded-xl
border border-white/10 hover:border-white/16
active:scale-95 transition-colors duration-150
```

**Tertiary (Neutral) — load more, cancel**
```
bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-sm font-semibold
px-6 py-2.5 rounded-xl border border-white/8
active:scale-95 transition-colors duration-150
```

**Filter Pills — search/filter toggles**
```
rounded-full text-[11px] font-medium px-4 py-2
active:  bg-lime-400 text-neutral-950 border-lime-400
inactive: bg-transparent text-neutral-500 border-white/8 hover:border-white/16
```

### Touch Targets (from DESIGN.md)

All interactive elements minimum **44 × 44px** (WCAG AAA). Enforce with `h-[44px]` or `min-h-[44px]` on primary and secondary buttons. Form inputs also `h-[44px]`.

### Cards (Route Cards)

```
bg-neutral-900 rounded-2xl overflow-hidden
border border-white/6 hover:border-white/10
transition-colors duration-200
NO shadow on hover (DESIGN.md: no heavy shadows — depth through surface contrast)
thumbnail: h-48
content: p-4
```

### Inputs & Form

```
bg-neutral-800 border border-white/10
focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/10
rounded-xl px-4 py-3 h-[44px] text-white placeholder-neutral-600 text-sm
outline-none transition-colors duration-150
```

Form card wrapper:
```
bg-neutral-900 rounded-2xl border border-white/6 p-6 sm:p-8
```

### Section Labels (Caption-Uppercase)

Directly from DESIGN.md `{typography.caption-uppercase}`: 12px / 600 / 1.5px letter-spacing.

```
text-[11px] font-semibold uppercase tracking-widest text-lime-400/80
```

Stat labels (smaller):
```
text-[11px] uppercase tracking-[0.06em] text-neutral-500
```

### Badges (Distance)

```
Short (< 10 KM): bg-lime-400 text-neutral-950 text-xs font-bold px-2 py-0.5 rounded-md tracking-wide
Long (≥ 10 KM):  bg-neutral-950/80 text-lime-400 border border-lime-400/25 backdrop-blur-sm
                 text-xs font-bold px-2 py-0.5 rounded-md tracking-wide
```

---

## Elevation & Depth

From DESIGN.md's elevation philosophy: **no heavy shadows**. Depth through surface color contrast and hairline borders only.

| Level | Treatment |
|---|---|
| Flat | No border, no shadow — hero, page sections |
| Hairline | `border-white/6` — cards, form containers |
| Input border | `border-white/8` default, `border-white/12` hover |
| Active | `border-white/10` hover on cards |
| Focus | `focus:ring-2 focus:ring-lime-400/10` — inputs only |

No `shadow-lg`, no `shadow-xl` on cards or buttons (removed per DESIGN.md).

---

## Animation & Motion

| Property | Value |
|---|---|
| Default transition | `transition-colors duration-150` |
| Card transition | `transition-colors duration-200` |
| Navbar transition | `transition-colors duration-200` |
| Button press | `active:scale-95` |
| Scroll indicator | `animate-bounce` |
| Loading | `animate-spin` |
| **No hover scale** | Removed per DESIGN.md — only `active:scale-95` for press feedback |

---

## Icon Library

**`@iconify/react` v6** with MDI and Simple Icons.

### Next.js App Router Rule

Every component that imports `{ Icon }` from `@iconify/react` **must** have `"use client"` at the top. The Icon component requires a browser runtime. Without it, icons are silently absent in Server Components.

Currently marked as Client Components:
- `Navbar.jsx` ✓
- `HeroSection.jsx` ✓
- `RouteCard.jsx` ✓
- `RouteList.jsx` ✓
- `SubmitRouteForm.jsx` ✓
- `Footer.jsx` ✓

### Icon Sizing

| Context | Class |
|---|---|
| Inline / city label | `w-3 h-3` |
| Card row / caption | `w-3.5 h-3.5` |
| Default body | `w-4 h-4` |
| Emphasis / CTA | `w-5 h-5` |
| Empty state | `w-10 h-10` |

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile `< 640px` | Single column cards; stacked CTA buttons; hero h1 `text-5xl`; filter pills scroll horizontally |
| Tablet `640–1024px` | 2-column cards; side-by-side CTA buttons; hero `text-6xl` |
| Desktop `≥ 1024px` | 3-column cards; hero `text-7xl`; full nav |

---

## UI Principles

1. **Dark-only** — cream/light themes are not in scope for RouteArt
2. **Mobile-first** — 375px minimum viewport, thumb reachability
3. **44px touch targets** — enforced on all interactive elements (from DESIGN.md)
4. **Tight display tracking** — negative letter-spacing on h1/h2 (from DESIGN.md)
5. **No hover scale on buttons** — press-only `active:scale-95` (from DESIGN.md)
6. **No hover shadows on cards** — hairline border change only (from DESIGN.md)
7. **96px section rhythm** — `py-24` between all major sections (from DESIGN.md)
8. **Single accent** — lime-400 used only for the most important action per screen
9. **Caption-uppercase labels** — all section labels follow 11px / semibold / uppercase / tracking-widest pattern
10. **Hairline borders** — `border-white/N` not `border-neutral-N` for consistent depth across surfaces


# Route Thumbnail Strategy

Route thumbnails are generated automatically from GeoJSON route data.

Flow:
GPX → GeoJSON → SVG → WEBP preview

Storage:
- Supabase Storage
- stored as files, not base64

Formats:
- SVG for scalable source asset
- WEBP for UI preview and sharing