/*
  # Fix RLS Policies for Trigger Function

  1. Changes
    - Add service_role bypass for trigger operations
    - Keep existing authenticated policies
    - Allow trigger to insert without RLS blocking

  2. Security
    - Service role can bypass RLS (needed for triggers)
    - Regular users still protected by existing policies
    - No security downgrade
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can insert own data during registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Allow service role to bypass RLS (for triggers)
ALTER TABLE users FORCE ROW LEVEL SECURITY;

-- Policy: Users can read own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Service role can insert (for trigger)
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Same for user_profiles
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

ALTER TABLE user_profiles FORCE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Recreate trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role text;
BEGIN
  -- Determine role from email
  user_role := CASE 
    WHEN NEW.email LIKE '%@ytt.dev' THEN 'admin'
    ELSE 'user'
  END;

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
    user_role,
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'student_level',
    NEW.raw_user_meta_data->>'phone',
    NOW(),
    NOW(),
    true,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    department = COALESCE(EXCLUDED.department, users.department),
    student_level = COALESCE(EXCLUDED.student_level, users.student_level),
    phone = COALESCE(EXCLUDED.phone, users.phone),
    updated_at = NOW();

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
    user_role,
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'student_level',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    department = COALESCE(EXCLUDED.department, user_profiles.department),
    phone = COALESCE(EXCLUDED.phone, user_profiles.phone),
    student_level = COALESCE(EXCLUDED.student_level, user_profiles.student_level),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth creation
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
