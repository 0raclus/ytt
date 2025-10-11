/*
  # Fix Registration Trigger

  1. Changes
    - Drop incorrect trigger on public.users
    - Create correct trigger on auth.users
    - Fix handle_new_user function

  2. Security
    - Function runs with SECURITY DEFINER
    - Proper error handling
*/

-- Drop the incorrect trigger on public.users
DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;

-- Recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
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
    updated_at,
    is_active,
    email_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Yeni Kullanıcı'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'student_level',
    NEW.raw_user_meta_data->>'phone',
    NOW(),
    NOW(),
    true,
    false
  )
  ON CONFLICT (id) DO NOTHING;

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
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users (correct location)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
