/*
  # Auth User Creation Fix

  1. Changes
    - Create function to handle new user creation from auth.users
    - Create trigger on auth.users to automatically create user profile
    - Ensures user data is synced between auth.users and public.users

  2. Security
    - Function runs with SECURITY DEFINER to bypass RLS
    - Only creates user if they don't already exist
*/

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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

  -- Also create user_profiles entry
  INSERT INTO public.user_profiles (
    user_id,
    full_name,
    email,
    role,
    department,
    phone,
    student_level,
    created_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Yeni Kullanıcı'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'student_level',
    NEW.created_at
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
