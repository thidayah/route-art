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

## Phase 4 — Admin Panel ✅ COMPLETE

**Goal**: Allow trusted admins to review and publish routes.

- [x] Create `/admin` protected route (`/admin/(panel)/layout.jsx` with auth guard)
- [x] Supabase Auth login for admin (`/admin/login` with email/password)
- [x] Submissions list with status management (pending / approved / rejected)
- [x] Route management (create, edit, publish, unpublish, delete)
- [x] Thumbnail upload interface (URL input + file upload to Supabase Storage)
- [x] GPX file upload and preview (URL input + file upload to Supabase Storage)
- [x] Bulk status update (checkbox select + bulk approve/reject for submissions)

---

## Phase 5 — Search & Filtering Improvements ✅ COMPLETE

**Goal**: Improve discoverability of routes.

- [x] Full-text search via Supabase (PostgreSQL)
- [x] Filter by category (hewan, bunga, karakter, objek)
- [x] Filter by city (dropdown with available cities)
- [x] Filter by distance range (slider)
- [x] Sort by: newest, shortest, longest
- [x] URL-based filter state (shareable links)
- [x] Infinite scroll or proper pagination

---

## Phase 6 — Performance & SEO ✅ COMPLETE

**Goal**: Optimize for speed and search engine visibility.

- [x] Image optimization (next/image for all thumbnails)
- [x] Implement ISR (Incremental Static Regeneration) for route pages
- [x] Sitemap generation (`/sitemap.xml`)
- [x] robots.txt
- [x] Structured data (JSON-LD) for route pages
- [ ] Web Vitals audit (LCP, CLS, INP targets) — manual: run Lighthouse / PageSpeed Insights
- [x] Bundle size analysis (`npm run analyze`)

---

## Technical Debt & Ongoing

- [ ] End-to-end tests (Playwright)
- [ ] Component unit tests (React Testing Library)
- [ ] Storybook for component documentation
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Vercel Analytics or Plausible)
- [ ] Accessibility audit (WCAG 2.1 AA)
