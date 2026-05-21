# RouteArt — AI Development Context

## Project Overview

**RouteArt** is a mobile-first web application for discovering and following creative running routes shaped like animals, flowers, objects, characters, and artistic drawings. It is NOT a running tracker — it is a route discovery and sharing platform.

## Core Value Proposition

- Users can discover pre-defined routes that form artistic shapes when viewed from above (GPS art)
- Routes are submitted via Strava activity links and curated by the team
- Community-driven content with moderation workflow
- Focused on Indonesian cities and running communities

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: JavaScript (no TypeScript)
- **Styling**: Tailwind CSS v4
- **Icons**: @iconify/react
- **Database**: Supabase (planned — Phase 2)
- **Storage**: Supabase Storage for thumbnails and GPX files
- **Deployment**: Vercel (planned)

## Architecture Decisions

- **App Router** (not Pages Router) for modern React Server Components support
- **No TypeScript** to keep iteration speed high in early phases
- **Tailwind v4** using `@import "tailwindcss"` syntax (not `@tailwind` directives)
- **Component-based structure** with small, focused components
- **Client components** (marked with `"use client"`) only for interactive elements (search, form, navbar scroll)
- **Server components** by default for static sections (hero, footer)

## Folder Structure

```
/src
  /app           → Next.js App Router pages and layouts
  /components    → Shared UI components
  /features      → Feature-specific modules (future use)
  /hooks         → Custom React hooks (future use)
  /lib           → Utility libraries and clients (Supabase client, etc.)
  /services      → API service functions (future use)
  /types         → Shared type definitions (JSDoc types, future use)
  /utils         → Pure utility functions
  /styles        → Additional global styles (future use)
/docs            → Project documentation
/public          → Static assets
```

## Current Status

**Phase 1 — COMPLETE**

- Next.js project initialized with App Router, JavaScript, Tailwind v4
- @iconify/react installed
- Complete folder structure created
- Homepage static UI implemented:
  - Sticky Navbar with logo and coffee donation button
  - Hero Section with tagline, stats, and CTA buttons
  - Route List with search, filters, and sample route cards
  - Submit Route Form with validation and success state
  - Footer
- Documentation files created

## User-Facing Language

All UI text is in **Bahasa Indonesia**. English is only used in:
- Code (variable names, comments)
- Documentation files
- Configuration files

## Key Design Constraints

1. All text visible to users must be in Bahasa Indonesia
2. Dark-only theme — no light mode
3. Lime/green accent (#a3e635, #84cc16) on dark neutral backgrounds
4. Mobile-first — designed for thumb navigation
5. No TypeScript — use JSDoc for type documentation when needed

## Sample Data Structure

Routes follow this structure (will be backed by Supabase in Phase 2):

```js
{
  id: number | string,
  name: string,       // e.g. "Kucing Tidur Senayan"
  city: string,       // e.g. "Jakarta Selatan"
  distance: number,   // in KM
  category: string,   // "hewan" | "bunga" | "karakter" | "objek" | "default"
  thumbnailUrl: string | null,
  slug: string,       // URL-friendly identifier
}
```

## AI Development Guidelines

When working on this project:

1. **Always use JavaScript** — never generate `.ts` or `.tsx` files
2. **Tailwind v4 syntax** — use `@import "tailwindcss"` not `@tailwind base/components/utilities`
3. **Component naming** — use PascalCase `.jsx` files for components
4. **"use client" directive** — only add when the component uses hooks, event handlers, or browser APIs
5. **Bahasa Indonesia** — all user-facing text, labels, placeholders, error messages
6. **Mobile-first** — start with mobile layout, enhance for desktop
7. **Dark theme** — bg-neutral-950 for page, bg-neutral-900 for cards
8. **Accent color** — lime-400 (#a3e635) for primary actions, badges, highlights


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
