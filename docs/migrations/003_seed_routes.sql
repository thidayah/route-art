-- Migration 003: Seed sample published routes for development
-- Run this after 001_create_routes.sql

INSERT INTO ra_routes (name, slug, city, distance_km, category, status, geojson) VALUES
  ('Kucing Lucu',              'kucing-lucu',          'Jakarta Pusat',   8.2,  'hewan',    'published', '{"type":"LineString","coordinates":[]}'),
  ('Kupu-Kupu Sudirman',       'kupu-kupu-sudirman',       'Jakarta Selatan', 12.7, 'hewan',    'published', '{"type":"LineString","coordinates":[]}'),
  ('Bunga Tulip Senayan',      'bunga-tulip-senayan',      'Jakarta Selatan', 5.4,  'bunga',    'published', '{"type":"LineString","coordinates":[]}'),
  ('Ikan Layar Pantai Ancol',  'ikan-layar-pantai-ancol',  'Jakarta Utara',   15.1, 'hewan',    'published', '{"type":"LineString","coordinates":[]}'),
  ('Bintang Laut Kemayoran',   'bintang-laut-kemayoran',   'Jakarta Pusat',   9.8,  'objek',    'published', '{"type":"LineString","coordinates":[]}'),
  ('Angsa Putih Grogol',       'angsa-putih-grogol',       'Jakarta Barat',   6.3,  'hewan',    'published', '{"type":"LineString","coordinates":[]}'),
  ('Wayang Kulit Prambanan',   'wayang-kulit-prambanan',   'Yogyakarta',      11.5, 'karakter', 'published', '{"type":"LineString","coordinates":[]}'),
  ('Garuda Merbabu',           'garuda-merbabu',           'Magelang',        18.4, 'hewan',    'published', '{"type":"LineString","coordinates":[]}'),
  ('Bunga Anggrek Cikini',     'bunga-anggrek-cikini',     'Jakarta Pusat',   7.6,  'bunga',    'published', '{"type":"LineString","coordinates":[]}')
ON CONFLICT (slug) DO NOTHING;
