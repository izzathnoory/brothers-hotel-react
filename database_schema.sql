-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create categories table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create menu_items table
create table public.menu_items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create gallery table
create table public.gallery (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  comment text,
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create admin_users table (managed via Supabase Auth, but we can have a profile table if needed)
-- For this simple app, we might check roles in metadata or a separate table.
-- Let's assume we use a table to whitelist admins if we want, or just rely on Auth.
-- Use a profile table for admins.
create table public.admin_users (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.gallery enable row level security;
alter table public.reviews enable row level security;
alter table public.admin_users enable row level security;

-- Policies
-- Categories: Public read, Admin write
create policy "Allow public read on categories" on public.categories for select using (true);
create policy "Allow admin all on categories" on public.categories for all using (auth.uid() in (select id from public.admin_users));

-- Menu Items: Public read, Admin write
create policy "Allow public read on menu_items" on public.menu_items for select using (true);
create policy "Allow admin all on menu_items" on public.menu_items for all using (auth.uid() in (select id from public.admin_users));

-- Gallery: Public read, Admin write
create policy "Allow public read on gallery" on public.gallery for select using (true);
create policy "Allow admin all on gallery" on public.gallery for all using (auth.uid() in (select id from public.admin_users));

-- Reviews: Public read, Public insert (maybe), Admin all
create policy "Allow public read on reviews" on public.reviews for select using (true);
create policy "Allow public insert on reviews" on public.reviews for insert with check (true);
create policy "Allow admin all on reviews" on public.reviews for all using (auth.uid() in (select id from public.admin_users));

-- Admin Users: Read own, maybe only service role can insert
create policy "Allow read own on admin_users" on public.admin_users for select using (auth.uid() = id);

-- Storage Buckets
-- You will need to create 'menu-images' and 'gallery-images' buckets in Supabase dashboard.
-- Policies for storage: Public read, Admin upload.
