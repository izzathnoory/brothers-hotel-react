-- Run this in Supabase SQL Editor
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS offer_text text;

-- No extra policies needed as existing RLS covers "all columns" for admin
