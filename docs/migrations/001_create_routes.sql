-- Migration 001: Create ra_routes table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS ra_routes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  city          TEXT NOT NULL,
  distance_km   FLOAT NOT NULL,
  thumbnail_url TEXT,
  gpx_file_url  TEXT,
  geojson       JSONB DEFAULT '{"type":"LineString","coordinates":[]}'::jsonb,
  start_lat     FLOAT,
  start_lng     FLOAT,
  category      TEXT DEFAULT 'default',
  source_url    TEXT,
  status        TEXT DEFAULT 'draft',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ra_routes_status       ON ra_routes(status);
CREATE INDEX IF NOT EXISTS idx_ra_routes_city         ON ra_routes(city);
CREATE INDEX IF NOT EXISTS idx_ra_routes_slug         ON ra_routes(slug);
CREATE INDEX IF NOT EXISTS idx_ra_routes_distance     ON ra_routes(distance_km);
CREATE INDEX IF NOT EXISTS idx_ra_routes_created_at   ON ra_routes(created_at DESC);

-- Row Level Security
ALTER TABLE ra_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published routes"
  ON ra_routes FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin can manage routes"
  ON ra_routes FOR ALL
  USING (auth.role() = 'authenticated');
