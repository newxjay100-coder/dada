-- ========================================================
-- DASSOBA (다써바) Storage Buckets & Policies
-- Supabase Migration: 20261006000003_storage_buckets.sql
-- ========================================================

-- Insert storage buckets if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('reviews', 'reviews', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('events', 'events', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('boards', 'boards', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('profiles', 'profiles', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- 1. Products Bucket: Public Read, Admin Write
CREATE POLICY "Public read products images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Admin upload products images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'products' AND (auth.role() = 'authenticated'));

-- 2. Reviews Bucket: Public Read, Authenticated Insert
CREATE POLICY "Public read reviews images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'reviews');

CREATE POLICY "Users upload reviews images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'reviews' AND (auth.role() = 'authenticated'));

-- 3. Events Bucket: Public Read, Admin Write
CREATE POLICY "Public read events images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'events');

CREATE POLICY "Admin upload events images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'events' AND (auth.role() = 'authenticated'));

-- 4. Boards Bucket: Public Read, Authenticated Insert
CREATE POLICY "Public read boards attachments" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'boards');

CREATE POLICY "Users upload boards attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'boards' AND (auth.role() = 'authenticated'));

-- 5. Profiles Bucket: Public Read, Authenticated Insert
CREATE POLICY "Public read profiles avatar" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profiles');

CREATE POLICY "Users upload profile avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profiles' AND (auth.role() = 'authenticated'));
