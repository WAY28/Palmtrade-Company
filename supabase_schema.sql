-- ============================================================
-- PT PUTRI PALMA NUSANTARA - Supabase Schema (FINAL)
-- Aman dijalankan berkali-kali, tidak akan error
-- ============================================================


-- ============================================================
-- STEP 1: HAPUS SEMUA POLICY LAMA (agar tidak konflik)
-- ============================================================

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;


-- ============================================================
-- STEP 2: BUAT TABEL (IF NOT EXISTS = aman jika sudah ada)
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market        TEXT NOT NULL,
  weight_range  TEXT NOT NULL,
  husk_type     TEXT DEFAULT 'Semi Husked',
  condition     TEXT,
  packaging     TEXT DEFAULT 'Nett Bag (export packing)',
  capacity      TEXT DEFAULT '± 2,800 Tons per Month',
  price         TEXT DEFAULT 'Negotiable with buyers',
  contact       TEXT DEFAULT '082293807717',
  quality       TEXT,
  color         TEXT,
  documents     TEXT[],
  image_url     TEXT,
  is_active     BOOLEAN DEFAULT true,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id      TEXT NOT NULL,
  title_en      TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  excerpt_id    TEXT,
  excerpt_en    TEXT,
  content_id    TEXT,
  content_en    TEXT,
  image_url     TEXT,
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url     TEXT NOT NULL,
  caption_id    TEXT,
  caption_en    TEXT,
  category      TEXT DEFAULT 'product',
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  role_id       TEXT NOT NULL,
  role_en       TEXT NOT NULL,
  photo_url     TEXT,
  social_url    TEXT,
  sort_order    INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  country       TEXT,
  message       TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);


-- ============================================================
-- STEP 3: AKTIFKAN ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery       ENABLE ROW LEVEL SECURITY;
ALTER TABLE team          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- STEP 4: BUAT SEMUA POLICY (policy lama sudah dihapus di Step 1)
-- ============================================================

-- Products
CREATE POLICY "Public read products"  ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Service full products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Posts
CREATE POLICY "Public read posts"     ON posts FOR SELECT USING (is_published = true);
CREATE POLICY "Service full posts"    ON posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Gallery
CREATE POLICY "Public read gallery"   ON gallery FOR SELECT USING (true);
CREATE POLICY "Service full gallery"  ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Team
CREATE POLICY "Public read team"      ON team FOR SELECT USING (is_active = true);
CREATE POLICY "Service full team"     ON team FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contacts
CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Service full contacts"  ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Site settings (hanya diakses lewat API route dengan service role key)
CREATE POLICY "Public read settings"   ON site_settings FOR SELECT USING (true);
CREATE POLICY "Service full settings"  ON site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================
-- STEP 5: STORAGE BUCKET UNTUK UPLOAD GAMBAR
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('palmtrade-images', 'palmtrade-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname IN ('Public read images','Auth upload images','Auth delete images')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'palmtrade-images');
CREATE POLICY "Auth upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'palmtrade-images');
CREATE POLICY "Auth delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'palmtrade-images');


-- ============================================================
-- STEP 6: DATA AWAL
-- Dibungkus pengecekan "tabel masih kosong" karena products/team
-- tidak punya unique constraint alami untuk di-ON-CONFLICT-kan
-- (kalau tidak, data akan terduplikasi setiap kali script ini dijalankan ulang)
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products) THEN
    INSERT INTO products (market, weight_range, quality, color, husk_type, condition, packaging, capacity, price, contact, documents, sort_order)
    VALUES
      ('Thailand', '0.8 – 1.2 Kg per coconut', 'Export Premium (Thailand Standard)', 'Natural Brown Shell', 'Semi Husked', 'Export ready', 'Nett Bag (export packing)', '± 2,800 Tons per Month', 'Negotiable with buyers', '082293807717',
        ARRAY['Phytosanitary Certificate','Certificate of Origin (Form E – ACFTA)','Commercial Invoice','Packing List','Bill of Lading (B/L)'], 1),
      ('China', '1.0 – 1.4 Kg per coconut', NULL, NULL, 'Semi Husked', 'Non-germinated, clean shell, export ready', 'Nett Bag (export packing)', '± 2,800 Tons per Month', 'Negotiable with buyers', '082293807717',
        ARRAY['GACC Registration (China Customs)','Phytosanitary Certificate','Certificate of Origin (Form E – ACFTA)','Commercial Invoice & Packing List','Bill of Lading (B/L)','Export Declaration (PEB Indonesia)'], 2),
      ('India', '0.9 – 1.3 Kg per coconut', NULL, NULL, 'Semi Husked', 'Non-germinated, clean shell, export ready', 'Nett Bag (export packing)', '± 2,800 Tons per Month', 'Negotiable with buyers', '082293807717',
        ARRAY['Phytosanitary Certificate','Certificate of Origin (COO)','Commercial Invoice','Packing List','Bill of Lading (B/L)'], 3);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM team) THEN
    INSERT INTO team (name, role_id, role_en, sort_order)
    VALUES
      ('Ari Sadhu',      'Marketing', 'Marketing', 1),
      ('Ayu Sintyawati', 'Marketing', 'Marketing', 2);
  END IF;
END $$;

INSERT INTO site_settings (key, value) VALUES
  ('wa_number',          '6282293807717'),
  ('wa_message',         'Halo, saya ingin menanyakan produk kelapa PT Putri Palma Nusantara.'),
  ('wa_show',            'true'),
  ('company_name',       'PT Putri Palma Nusantara'),
  ('company_tagline_id', 'Eksportir Kelapa Semi Husked Terpercaya'),
  ('company_tagline_en', 'Trusted Semi Husked Coconut Exporter'),
  ('hero_stat1_value',   '2,800+'),
  ('hero_stat2_value',   '3'),
  ('hero_stat3_value',   '5+')
ON CONFLICT (key) DO NOTHING;


-- ============================================================
SELECT '✅ Semua berhasil! Database siap digunakan.' as status;
-- ============================================================
