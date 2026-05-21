# RouteArt — Design System

## Design Direction

**Modern · Minimal · Sporty · Playful**

RouteArt's visual identity evokes the energy of running combined with the creativity of art. The design is intentionally dark and focused, letting the content (route cards, maps) take center stage.

## Color Palette

### Backgrounds

| Name              | Hex       | Tailwind           | Usage                              |
|-------------------|-----------|--------------------|------------------------------------|
| Page background   | `#0A0A0A` | `bg-neutral-950`   | Main page background               |
| Card background   | `#171717` | `bg-neutral-900`   | Cards, panels                      |
| Elevated surface  | `#1C1C1C` | `bg-neutral-800`   | Inputs, buttons, hover states      |
| Border subtle     | `#262626` | `border-neutral-800` | Card borders, dividers           |
| Border muted      | `#404040` | `border-neutral-700` | Input borders, interactive borders|

### Accent Colors

| Name          | Hex       | Tailwind       | Usage                                    |
|---------------|-----------|----------------|------------------------------------------|
| Accent primary | `#A3E635` | `lime-400`     | Primary buttons, badges, highlights      |
| Accent hover  | `#BEF264` | `lime-300`     | Hover state for primary buttons          |
| Accent dark   | `#84CC16` | `lime-500`     | Pressed state, secondary accent          |
| Accent glow   | `#A3E635/10` | `lime-400/10` | Background tints, glow effects          |

### Text Colors

| Name        | Hex       | Tailwind            | Usage                            |
|-------------|-----------|---------------------|----------------------------------|
| Primary     | `#F5F5F5` | `text-neutral-100`  | Main body text, headings         |
| Secondary   | `#A3A3A3` | `text-neutral-400`  | Supporting text, descriptions    |
| Muted       | `#737373` | `text-neutral-500`  | Placeholders, disabled, captions |
| Disabled    | `#525252` | `text-neutral-600`  | Disabled states, hints           |

### Category Accent Colors (Route Cards)

| Category  | Icon Color  | Background Gradient                 |
|-----------|-------------|-------------------------------------|
| hewan     | `orange-400`| `from-orange-500/20 to-yellow-500/20` |
| bunga     | `pink-400`  | `from-pink-500/20 to-rose-500/20`   |
| karakter  | `purple-400`| `from-purple-500/20 to-indigo-500/20` |
| objek     | `blue-400`  | `from-blue-500/20 to-cyan-500/20`   |
| default   | `lime-400`  | `from-lime-500/20 to-green-500/20`  |

## Typography

### Font

- **Primary**: Geist Sans (Google Fonts via Next.js)
- **Monospace**: Geist Mono (for code/data display)
- **Fallback**: Arial, Helvetica, sans-serif

### Scale

| Role         | Size      | Weight | Tailwind                              |
|--------------|-----------|--------|---------------------------------------|
| Hero heading | 64–96px   | 900    | `text-7xl sm:text-8xl font-black`    |
| Section heading | 30–36px | 800   | `text-3xl sm:text-4xl font-black`    |
| Card title   | 16px      | 700    | `text-base font-bold`                 |
| Body         | 14–16px   | 400    | `text-sm sm:text-base`               |
| Caption      | 12px      | 400    | `text-xs`                             |
| Badge/Label  | 11–12px   | 700    | `text-xs font-bold uppercase tracking-widest` |

## Component Patterns

### Buttons

**Primary (Lime)**
```
bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold
rounded-2xl px-8 py-4
hover:scale-105 hover:shadow-lg hover:shadow-lime-400/25
transition-all duration-200
```

**Secondary (Ghost)**
```
bg-transparent hover:bg-neutral-800 text-white font-bold
rounded-2xl px-8 py-4 border border-neutral-700
hover:border-neutral-600 hover:scale-105
transition-all duration-200
```

**Tertiary (Neutral)**
```
bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white
rounded-xl px-4 py-3 border border-neutral-800 hover:border-neutral-700
transition-all duration-200
```

### Cards

```
bg-neutral-900 rounded-2xl overflow-hidden
border border-neutral-800 hover:border-neutral-700
hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1
transition-all duration-300
```

### Inputs

```
bg-neutral-800 border border-neutral-700
focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/10
rounded-xl px-4 py-3 text-white placeholder-neutral-600
outline-none transition-all duration-200
```

### Badges

**Active/Short route:**
```
bg-lime-400 text-neutral-950 text-xs font-bold px-2 py-1 rounded-lg
```

**Long route:**
```
bg-neutral-950/80 text-lime-400 border border-lime-400/30
text-xs font-bold px-2 py-1 rounded-lg
```

## Spacing & Layout

- **Max content width**: `max-w-5xl` (1024px)
- **Section padding**: `py-16 px-4 sm:px-6`
- **Card grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`
- **Border radius**: `rounded-2xl` for cards/buttons, `rounded-xl` for inputs/small components

## Motion & Animation

- **Transition duration**: 200ms for interactions, 300ms for cards
- **Scale on hover**: `hover:scale-105` for primary buttons, `hover:-translate-y-1` for cards
- **Easing**: default Tailwind (ease-in-out)
- **Loading spinner**: `animate-spin` on Iconify loading icon
- **Bounce**: `animate-bounce` for scroll indicator
- **Blur**: `backdrop-blur-md` for sticky navbar background

## Icon Library

Using **@iconify/react** with primarily **MDI (Material Design Icons)** set.

Key icons used:
- Navigation: `mdi:map-marker-path`, `mdi:compass-outline`
- Route: `mdi:route`, `mdi:map-plus`, `mdi:map-marker`
- UI: `mdi:magnify`, `mdi:close-circle`, `mdi:refresh`, `mdi:chevron-down`
- Category: `mdi:paw`, `mdi:flower`, `mdi:account-star`, `mdi:shape`
- Actions: `mdi:send`, `mdi:loading`, `mdi:check-circle`, `mdi:alert-circle`
- Social: `mdi:coffee-outline`, `simple-icons:strava`

## UI Principles

1. **Dark-only** — no light mode toggle; the brand is dark
2. **Mobile-first** — design for 375px width minimum, thumb reachability
3. **Generous touch targets** — minimum 44px height for interactive elements
4. **Hierarchy through weight** — use font weight variation over font size variation
5. **Accent sparingly** — lime-400 highlights the most important action per screen
6. **Rounded consistently** — `rounded-2xl` for large containers, `rounded-xl` for smaller
7. **Subtle depth** — achieve depth through border, shadow, and background color variation
