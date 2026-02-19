-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Ensure admin_users table exists and permissions are open enough for checks
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read admin_users (needed for RLS checks on other tables to work properly)
DROP POLICY IF EXISTS "Allow read all on admin_users" ON public.admin_users;
CREATE POLICY "Allow read all on admin_users" ON public.admin_users FOR SELECT USING (true);

-- Allow inserting into admin_users (fix for setup)
DROP POLICY IF EXISTS "Allow insert on admin_users" ON public.admin_users;
CREATE POLICY "Allow insert on admin_users" ON public.admin_users FOR INSERT WITH CHECK (true);

-- 2. Insert YOUR User
INSERT INTO public.admin_users (id, email, role)
VALUES 
  ('88ca3a05-60be-4f18-b3ad-f7df8762d14e', 'izzathnoory11@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- 3. Ensure Storage Bucket Exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage Policies (Fix "Permission Denied" on Image Upload)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING ( bucket_id = 'menu-images' );

DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'menu-images' AND auth.uid() IN (SELECT id FROM public.admin_users) );

DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE
USING ( packet_id = 'menu-images' AND auth.uid() IN (SELECT id FROM public.admin_users) );
