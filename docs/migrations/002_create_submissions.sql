-- Migration 002: Create ra_submissions table

-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS ra_submissions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  location    TEXT NOT NULL,
  strava_url  TEXT NOT NULL,
  status      TEXT DEFAULT 'pending',
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ra_submissions_status     ON ra_submissions(status);
CREATE INDEX IF NOT EXISTS idx_ra_submissions_created_at ON ra_submissions(created_at DESC);

-- Row Level Security
ALTER TABLE ra_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (no auth needed to submit a route)
CREATE POLICY "Anyone can submit routes"
  ON ra_submissions FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can read/update/delete
CREATE POLICY "Admin can manage submissions"
  ON ra_submissions FOR ALL
  USING (auth.role() = 'authenticated');
