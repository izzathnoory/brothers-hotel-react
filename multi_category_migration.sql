-- =============================================================
-- Migration: Multi-Category Menu Items (many-to-many)
-- Run this in the Supabase SQL Editor BEFORE deploying updated code.
-- =============================================================

-- 1. Create junction table
CREATE TABLE public.menu_item_categories (
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  category_id  UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, category_id)
);

-- 2. Enable RLS
ALTER TABLE public.menu_item_categories ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies: public read, admin write
CREATE POLICY "Allow public read on menu_item_categories"
  ON public.menu_item_categories FOR SELECT USING (true);

CREATE POLICY "Allow admin all on menu_item_categories"
  ON public.menu_item_categories FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.admin_users));

-- 4. Migrate existing category_id data into junction table
INSERT INTO public.menu_item_categories (menu_item_id, category_id)
SELECT id, category_id
FROM public.menu_items
WHERE category_id IS NOT NULL;

-- 5. Drop old category_id column from menu_items
ALTER TABLE public.menu_items DROP COLUMN category_id;
