-- Run this in Supabase SQL Editor

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id integer primary key default 1,
    opening_hours text default '05:00 AM – 04:00 PM',
    is_closed boolean default false,
    reopening_date date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    CONSTRAINT single_row CHECK (id = 1)
);

-- 2. Insert default row (if not exists)
INSERT INTO public.site_settings (id, opening_hours, is_closed)
VALUES (1, '05:00 AM – 04:00 PM', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Allow everyone to read
DROP POLICY IF EXISTS "Allow public read settings" ON public.site_settings;
CREATE POLICY "Allow public read settings" ON public.site_settings FOR SELECT USING (true);

-- Allow admin to update
DROP POLICY IF EXISTS "Allow admin update settings" ON public.site_settings;
CREATE POLICY "Allow admin update settings" ON public.site_settings FOR UPDATE
USING (auth.uid() IN (SELECT id FROM public.admin_users))
WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users));
