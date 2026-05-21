# RouteArt — Database Schema

## Platform

**Supabase** (PostgreSQL with Row Level Security)

- Project URL: TBD
- Auth: Supabase Auth (admin-only for moderation)
- Storage: Supabase Storage (thumbnails, GPX files)
- RLS: Enabled on all tables

## Tables

---

### `ra_routes`

Stores approved and published running routes.

```sql
CREATE TABLE ra_routes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  city          TEXT NOT NULL,
  distance_km   FLOAT NOT NULL,
  thumbnail_url TEXT,
  gpx_file_url  TEXT,
  geojson       JSONB,
  start_lat     FLOAT,
  start_lng     FLOAT,
  category      TEXT DEFAULT 'default',  -- hewan | bunga | karakter | objek | default
  status        TEXT DEFAULT 'draft',    -- draft | published
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_ra_routes_status ON ra_routes(status);
CREATE INDEX idx_ra_routes_city ON ra_routes(city);
CREATE INDEX idx_ra_routes_slug ON ra_routes(slug);
CREATE INDEX idx_ra_routes_distance ON ra_routes(distance_km);
```

**Row Level Security:**
```sql
ALTER TABLE ra_routes ENABLE ROW LEVEL SECURITY;

-- Public can only read published routes
CREATE POLICY "Public can view published routes"
  ON ra_routes FOR SELECT
  USING (status = 'published');

-- Only authenticated admin can insert/update/delete
CREATE POLICY "Admin can manage routes"
  ON ra_routes FOR ALL
  USING (auth.role() = 'authenticated');
```

**Field Reference:**

| Column         | Type        | Nullable | Description                               |
|----------------|-------------|----------|-------------------------------------------|
| id             | uuid        | No       | Primary key, auto-generated               |
| name           | text        | No       | Display name (e.g. "Kucing Tidur Senayan")|
| slug           | text        | No       | URL slug (e.g. "kucing-tidur-senayan")    |
| city           | text        | No       | City name (e.g. "Jakarta Selatan")        |
| distance_km    | float       | No       | Route distance in kilometers              |
| thumbnail_url  | text        | Yes      | Public URL to thumbnail image             |
| gpx_file_url   | text        | Yes      | Public URL to GPX file                    |
| geojson        | jsonb       | Yes      | GeoJSON LineString of the route path      |
| start_lat      | float       | Yes      | Starting point latitude                   |
| start_lng      | float       | Yes      | Starting point longitude                  |
| category       | text        | Yes      | Route art category                        |
| status         | text        | No       | Publication status                        |
| created_at     | timestamptz | No       | Record creation timestamp                 |

---

### `ra_submissions`

Stores user-submitted routes awaiting moderation.

```sql
CREATE TABLE ra_submissions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  location    TEXT NOT NULL,
  strava_url  TEXT NOT NULL,
  status      TEXT DEFAULT 'pending',   -- pending | approved | rejected
  notes       TEXT,                     -- admin review notes
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_ra_submissions_status ON ra_submissions(status);
CREATE INDEX idx_ra_submissions_created_at ON ra_submissions(created_at DESC);
```

**Row Level Security:**
```sql
ALTER TABLE ra_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (submit a route)
CREATE POLICY "Anyone can submit routes"
  ON ra_submissions FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can read/update/delete
CREATE POLICY "Admin can manage submissions"
  ON ra_submissions FOR ALL
  USING (auth.role() = 'authenticated');
```

**Field Reference:**

| Column      | Type        | Nullable | Description                                    |
|-------------|-------------|----------|------------------------------------------------|
| id          | uuid        | No       | Primary key, auto-generated                    |
| name        | text        | No       | Route name proposed by submitter               |
| location    | text        | No       | City or area description                       |
| strava_url  | text        | No       | Public Strava activity URL                     |
| status      | text        | No       | Moderation status                              |
| notes       | text        | Yes      | Internal admin notes about the submission      |
| created_at  | timestamptz | No       | Submission timestamp                           |

---

## Supabase Storage Buckets

### `route-thumbnails`

- **Access**: Public
- **Purpose**: Store processed thumbnail images for routes
- **Format**: WebP, max 800x600px
- **Path pattern**: `{route_id}/thumbnail.webp`

### `route-gpx`

- **Access**: Public
- **Purpose**: Store GPX files for download/import
- **Format**: .gpx (XML)
- **Path pattern**: `{route_id}/route.gpx`

---

## Supabase Setup Notes

1. Create project at [supabase.com](https://supabase.com)
2. Copy project URL and anon key to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. Run the SQL migrations above in the Supabase SQL editor
4. Create the storage buckets via the Supabase dashboard
5. Install the Supabase client: `npm install @supabase/supabase-js`
6. Create `src/lib/supabase.js` with the client initialization

```js
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```
