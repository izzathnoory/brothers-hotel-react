-- Run this in Supabase SQL Editor
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS offer_price decimal(10,2);
