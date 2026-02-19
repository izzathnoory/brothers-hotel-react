-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Ensure Storage Bucket Exists for Gallery
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for Gallery (Fix "Permission Denied" on Image Upload)
-- We need to ensure we don't duplicate policies, so we drop first.
-- Note: Supabase storage policies are on the 'storage.objects' table.

DROP POLICY IF EXISTS "Public Access Gallery" ON storage.objects;
CREATE POLICY "Public Access Gallery" ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery-images' );

DROP POLICY IF EXISTS "Admin Upload Gallery" ON storage.objects;
CREATE POLICY "Admin Upload Gallery" ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'gallery-images' AND auth.uid() IN (SELECT id FROM public.admin_users) );

DROP POLICY IF EXISTS "Admin Update Gallery" ON storage.objects;
CREATE POLICY "Admin Update Gallery" ON storage.objects FOR UPDATE
USING ( packet_id = 'gallery-images' AND auth.uid() IN (SELECT id FROM public.admin_users) );

DROP POLICY IF EXISTS "Admin Delete Gallery" ON storage.objects;
CREATE POLICY "Admin Delete Gallery" ON storage.objects FOR DELETE
USING ( bucket_id = 'gallery-images' AND auth.uid() IN (SELECT id FROM public.admin_users) );

-- 3. Ensure Gallery Table Policies are correct (Just in case)
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on gallery" ON public.gallery;
CREATE POLICY "Allow public read on gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all on gallery" ON public.gallery;
CREATE POLICY "Allow admin all on gallery" ON public.gallery FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.admin_users));
