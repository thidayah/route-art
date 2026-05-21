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

**Phases 1–6 — COMPLETE**

- Phase 1: Foundation & Static UI
- Phase 2: Supabase integration (live data, submissions)
- Phase 3: Route detail page with Leaflet map
- Phase 4: Admin panel (auth, route management, file uploads)
- Phase 5: Search & filtering (full-text, category, city, distance, URL state)
- Phase 6: Performance & SEO (next/image, ISR, sitemap, robots.txt, JSON-LD, bundle analyzer)

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


## GPX Processing Pipeline

When an admin uploads a GPX file, the following pipeline runs automatically in the browser (inside `handleGpxUpload` in `src/components/admin/RouteForm.jsx`):

1. **Upload GPX** → `route-gpx/{route_id}/route.gpx` in Supabase Storage
2. **Parse GPX → GeoJSON** via `src/lib/gpxToGeoJson.js` (`gpxFileToGeoJson`)
   - Uses `@tmcw/togeojson` + browser `DOMParser` to parse GPX XML
   - Merges all track segments (LineString + MultiLineString) into one LineString
   - Strips elevation — stores only `[longitude, latitude]` pairs (GeoJSON standard order)
   - Returns `null` if fewer than 2 points; pipeline stops without error
3. **Update GeoJSON field** — sets `form.geojson` textarea with pretty-printed LineString
4. **Generate SVG thumbnail** via `src/lib/generateThumbnail.js` (`generateRouteSvg`)
   - Normalizes coordinates to a 400×400 SVG viewport with 28px padding
   - Uniform scale preserves route shape (uses `Math.min` of x/y scale)
   - Flips Y-axis: higher latitude → lower SVG y-coordinate
   - Dark background `#0f0f0f`, lime-400 stroke `#a3e635`, 3.5px stroke-width
5. **Upload SVG** → `route-thumbnails/{route_id}/thumbnail.svg` with `contentType: image/svg+xml`
6. **Update thumbnail_url field** — sets `form.thumbnail_url` with public storage URL

Thumbnail auto-generation is skipped if the route already has a `thumbnail_url` set.

### Why Routes Previously Failed to Render

`src/components/RouteMap.jsx` reads `geojson.coordinates` to draw a Leaflet `Polyline`. Routes seeded via `docs/migrations/003_seed_routes.sql` have `{"type":"LineString","coordinates":[]}`. The old GPX upload handler only stored the file URL — it never parsed the GPX or populated `geojson`. Since `positions.length > 1` was false, no polyline rendered and the map showed "Peta rute belum tersedia".

### GeoJSON in Leaflet

`src/components/RouteMap.jsx:19–22` converts GeoJSON `[lng, lat]` to Leaflet's `[lat, lng]`:
```js
const positions = coords
  .filter((c) => Array.isArray(c) && c.length >= 2)
  .map(([lng, lat]) => [lat, lng]);
```
The filter accepts 2D and 3D coordinates, so elevation (if present) is safely ignored.
