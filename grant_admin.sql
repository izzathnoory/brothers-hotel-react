-- Run this in your Supabase SQL Editor to grant admin permissions to your user

INSERT INTO public.admin_users (id, email, role)
VALUES 
  ('88ca3a05-60be-4f18-b3ad-f7df8762d14e', 'izzathnoory11@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Verification
SELECT * FROM public.admin_users WHERE id = '88ca3a05-60be-4f18-b3ad-f7df8762d14e';
