-- Run this in Supabase SQL Editor
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS closed_days text DEFAULT 'Friday';
