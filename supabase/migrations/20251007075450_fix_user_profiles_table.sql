/*
  # Fix User Profiles Table

  1. Changes
    - Add missing columns to user_profiles table
    - Add email, full_name, role, department, phone, student_level
    - Update handle_new_user function to sync properly

  2. Security
    - Maintains existing RLS policies
*/

-- Add missing columns to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT 'Yeni Kullanıcı',
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS student_level TEXT;

-- Update existing records from users table
UPDATE user_profiles up
SET 
  email = u.email,
  full_name = u.full_name,
  role = u.role,
  department = u.department,
  phone = u.phone,
  student_level = u.student_level
FROM users u
WHERE up.user_id = u.id
AND up.email IS NULL;

-- Recreate the handle_new_user function with updated logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    department,
    student_level,
    phone,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Yeni Kullanıcı'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'student_level',
    NEW.raw_user_meta_data->>'phone',
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    updated_at = EXCLUDED.updated_at;

  -- Insert into user_profiles table
  INSERT INTO public.user_profiles (
    user_id,
    full_name,
    email,
    role,
    department,
    phone,
    student_level,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Yeni Kullanıcı'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'student_level',
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name),
    role = COALESCE(EXCLUDED.role, public.user_profiles.role),
    updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
