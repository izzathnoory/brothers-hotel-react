-- Update Today's Special: replace boolean with timestamp for 24h auto-expiry
-- Run this in the Supabase SQL Editor

-- Drop the boolean column (if it exists)
ALTER TABLE public.menu_items DROP COLUMN IF EXISTS is_today_special;

-- Add timestamp column (NULL = not special, set = marked at that time)
ALTER TABLE public.menu_items ADD COLUMN today_special_at TIMESTAMPTZ DEFAULT NULL;
