# RouteArt — Development Roadmap

## Overview

RouteArt is built in iterative phases, starting from a static UI and progressively adding backend integration, user features, and polish.

---

## Phase 1 — Foundation & Static UI ✅ COMPLETE

**Goal**: Set up the project and build a polished static homepage.

- [x] Initialize Next.js with App Router, JavaScript, Tailwind v4
- [x] Install @iconify/react
- [x] Create folder structure (`src/components`, `src/features`, `src/lib`, etc.)
- [x] Build Navbar with logo and donation button
- [x] Build Hero Section with tagline, stats, and CTA buttons
- [x] Build Route Card component (reusable)
- [x] Build Route List with search and filter (client-side)
- [x] Build Submit Route Form with validation and success state
- [x] Build Footer
- [x] Write documentation (`ai-context.md`, `design.md`, `database.md`, `roadmap.md`)

---

## Phase 2 — Supabase Integration ✅ COMPLETE

**Goal**: Connect the app to a live database and serve real route data.

- [x] Install and configure `@supabase/supabase-js`
- [x] Create `src/lib/supabase.js` (null-safe, credentials via `.env.local`)
- [x] Create SQL migration files (`docs/migrations/001`, `002`, `003`)
- [x] Set up Row Level Security policies (in migrations)
- [x] Replace static route data with live Supabase query (server-side filter + sort)
- [x] Connect Submit Route Form to `submissions` table (Supabase insert)
- [x] Add pagination support (PAGE_SIZE=6, append-on-load-more)
- [x] Debounced full-text search (`ilike` on name + city)
- [x] Loading skeleton, error state with retry, empty state
- [ ] Create Supabase project (manual — user action)
- [ ] Run database migrations in Supabase SQL Editor (manual — user action)
- [ ] Create Supabase storage buckets: `route-thumbnails`, `route-gpx` (manual — user action)
- [ ] Fill in `.env.local` with project URL and anon key (manual — user action)

---

## Phase 3 — Route Detail Page ✅ COMPLETE

**Goal**: Build individual route pages with map preview and details.

- [x] Create `/routes/[slug]` dynamic route page (Server Component)
- [x] Display route metadata (name, city, distance, category)
- [x] Embed interactive Leaflet map with route path (react-leaflet v5, OSM tiles, accent-colored polyline + circle markers)
- [x] Show GPX download button (when `gpx_file_url` present)
- [x] Add "Mulai Navigasi" link (deep-link to Google Maps via `start_lat`/`start_lng`)
- [x] SEO metadata per route page (Open Graph title, description, image)
- [x] Generate static paths for published routes (`generateStaticParams`)
- [x] Custom 404 page (`/app/not-found.jsx`)
- [x] Skeleton loading state (`loading.jsx`)
- [x] `RouteCard` "Lihat Rute" button links to `/routes/[slug]`

---

## Phase 4 — Admin Panel 🔲 PENDING

**Goal**: Allow trusted admins to review and publish routes.

- [ ] Create `/admin` protected route
- [ ] Supabase Auth login for admin
- [ ] Submissions list with status management (pending / approved / rejected)
- [ ] Route management (create, edit, publish, unpublish)
- [ ] Thumbnail upload interface
- [ ] GPX file upload and preview
- [ ] Bulk status update

---

## Phase 5 — Search & Filtering Improvements 🔲 PENDING

**Goal**: Improve discoverability of routes.

- [ ] Full-text search via Supabase (PostgreSQL)
- [ ] Filter by category (hewan, bunga, karakter, objek)
- [ ] Filter by city (dropdown with available cities)
- [ ] Filter by distance range (slider)
- [ ] Sort by: newest, shortest, longest
- [ ] URL-based filter state (shareable links)
- [ ] Infinite scroll or proper pagination

---

## Phase 6 — Social & Sharing Features 🔲 PENDING

**Goal**: Enable community engagement and virality.

- [ ] Share route button (Web Share API + fallback copy link)
- [ ] Open Graph image generation per route (using @vercel/og)
- [ ] "Saya sudah lari rute ini!" button (track runs, no auth needed — cookie-based)
- [ ] Run count display on route cards
- [ ] Optional: user-facing leaderboard by city

---

## Phase 7 — Performance & SEO 🔲 PENDING

**Goal**: Optimize for speed and search engine visibility.

- [ ] Image optimization (next/image for all thumbnails)
- [ ] Implement ISR (Incremental Static Regeneration) for route pages
- [ ] Sitemap generation (`/sitemap.xml`)
- [ ] robots.txt
- [ ] Structured data (JSON-LD) for route pages
- [ ] Web Vitals audit (LCP, CLS, INP targets)
- [ ] Bundle size analysis

---

## Phase 8 — Mobile App & PWA 🔲 PENDING

**Goal**: Deliver a native-like experience on mobile.

- [ ] PWA manifest and service worker
- [ ] Offline support (cache recent routes)
- [ ] Add to Home Screen prompt
- [ ] Push notifications for new routes in user's city
- [ ] Geolocation: show nearby routes
- [ ] Optional: React Native / Expo app

---

## Technical Debt & Ongoing

- [ ] End-to-end tests (Playwright)
- [ ] Component unit tests (React Testing Library)
- [ ] Storybook for component documentation
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Vercel Analytics or Plausible)
- [ ] Accessibility audit (WCAG 2.1 AA)
