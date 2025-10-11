/*
  # Auth Kayıt Mekanizması İyileştirmeleri

  1. RLS Politikaları
    - Yeni kullanıcıların kendi kayıtlarını oluşturabilmesi için politikalar eklendi
    - Auth trigger ile otomatik profil oluşturma
    - Email doğrulama devre dışı bırakıldı (development için)
  
  2. Güvenlik
    - Kullanıcılar sadece kendi verilerini görebilir
    - Yeni kayıtlar için INSERT izni verildi
    - Admin kullanıcılar tüm verilere erişebilir
*/

-- Drop existing restrictive policies and create more permissive ones for registration
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Allow authenticated users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Allow authenticated users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow new users to insert their own record during registration
CREATE POLICY "Users can insert own data during registration" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow admins to do everything
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update user_profiles policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create user profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    preferences,
    is_active,
    email_verified,
    two_factor_enabled
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    jsonb_build_object(
      'notifications', true,
      'newsletter', true,
      'reminder_time', 1,
      'language', 'tr',
      'theme', 'system'
    ),
    true,
    NEW.email_confirmed_at IS NOT NULL,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = now();

  -- Create user profile
  INSERT INTO public.user_profiles (
    user_id,
    experience_level,
    interests,
    dietary_restrictions,
    medical_conditions,
    emergency_contact,
    social_links,
    privacy_settings
  )
  VALUES (
    NEW.id,
    'beginner',
    ARRAY[]::text[],
    ARRAY[]::text[],
    ARRAY[]::text[],
    '{}'::jsonb,
    '{}'::jsonb,
    jsonb_build_object(
      'profile_visible', true,
      'show_email', false,
      'show_phone', false
    )
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create a function to update last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET last_login = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update last_login on auth
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;

CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION update_last_login();
