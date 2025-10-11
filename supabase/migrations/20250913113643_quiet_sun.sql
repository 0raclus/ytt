/*
  # YTT - Comprehensive Database Schema
  
  1. User Management
    - `users` table with extended profile information
    - `user_profiles` for additional details
    - Role-based access control
  
  2. Event Management
    - `events` table with full event details
    - `event_registrations` for user registrations
    - `event_categories` for better organization
  
  3. Plant Library
    - `plants` table with detailed botanical information
    - `plant_categories` and `plant_tags` for classification
    - `user_favorite_plants` for personalization
  
  4. Notification System
    - `notifications` with real-time support
    - `notification_templates` for consistency
    - `notification_preferences` for user control
  
  5. Analytics & Monitoring
    - `audit_logs` for security and compliance
    - `system_metrics` for performance monitoring
    - `user_activity` for engagement tracking
  
  6. Content Management
    - `blog_posts` for educational content
    - `resources` for downloadable materials
    - `faqs` for customer support
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Management Tables
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
  avatar_url text,
  department text,
  student_level text,
  phone text,
  bio text,
  preferences jsonb DEFAULT '{
    "notifications": true,
    "newsletter": true,
    "reminder_time": 1,
    "language": "tr",
    "theme": "system"
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz,
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  two_factor_enabled boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  interests text[] DEFAULT '{}',
  emergency_contact jsonb DEFAULT '{}',
  dietary_restrictions text[] DEFAULT '{}',
  medical_conditions text[] DEFAULT '{}',
  experience_level text DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  social_links jsonb DEFAULT '{}',
  privacy_settings jsonb DEFAULT '{
    "profile_visible": true,
    "show_email": false,
    "show_phone": false
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event Management Tables
CREATE TABLE IF NOT EXISTS event_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#10b981',
  icon text DEFAULT 'calendar',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  instructor text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  end_time time,
  duration text,
  location text NOT NULL,
  capacity integer NOT NULL DEFAULT 20,
  registered_count integer DEFAULT 0,
  waiting_list_count integer DEFAULT 0,
  category_id uuid REFERENCES event_categories(id),
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  requirements text[] DEFAULT '{}',
  image_url text,
  gallery_images text[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed', 'draft', 'postponed')),
  price decimal(10,2) DEFAULT 0,
  is_free boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  meeting_point text,
  parking_info text,
  weather_dependent boolean DEFAULT false,
  min_age integer,
  max_age integer,
  materials_provided boolean DEFAULT true,
  certificate_provided boolean DEFAULT false,
  created_by uuid REFERENCES users(id),
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist', 'completed', 'no_show')),
  notes text,
  dietary_requirements text,
  emergency_contact jsonb,
  attendance_confirmed boolean DEFAULT false,
  feedback jsonb,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Plant Library Tables
CREATE TABLE IF NOT EXISTS plant_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES plant_categories(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  scientific_name text NOT NULL,
  common_names text[] DEFAULT '{}',
  description text,
  characteristics text[] DEFAULT '{}',
  habitat text,
  native_region text,
  uses text[] DEFAULT '{}',
  care_instructions text[] DEFAULT '{}',
  image_url text,
  gallery_images text[] DEFAULT '{}',
  seasonal_info jsonb DEFAULT '{
    "blooming": "",
    "planting": "",
    "harvesting": ""
  }'::jsonb,
  growth_info jsonb DEFAULT '{
    "height": "",
    "spread": "",
    "growth_rate": "medium"
  }'::jsonb,
  environmental_needs jsonb DEFAULT '{
    "sunlight": "full_sun",
    "water": "moderate",
    "soil_type": "well_drained",
    "temperature_min": 0,
    "temperature_max": 40,
    "humidity": "moderate"
  }'::jsonb,
  tags text[] DEFAULT '{}',
  category_id uuid REFERENCES plant_categories(id),
  difficulty_level text DEFAULT 'easy' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  toxicity_info text,
  conservation_status text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_favorite_plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plant_id uuid REFERENCES plants(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, plant_id)
);

-- Notification System Tables
CREATE TABLE IF NOT EXISTS notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  title_template text NOT NULL,
  message_template text NOT NULL,
  type text NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error', 'reminder')),
  category text NOT NULL CHECK (category IN ('system', 'event', 'admin', 'marketing')),
  variables text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error', 'reminder')),
  category text NOT NULL CHECK (category IN ('system', 'event', 'admin', 'marketing')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  read boolean DEFAULT false,
  read_at timestamptz,
  event_id uuid REFERENCES events(id),
  action_url text,
  expires_at timestamptz,
  scheduled_for timestamptz,
  sent_at timestamptz,
  delivery_method text[] DEFAULT ARRAY['web'],
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL,
  email_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT false,
  in_app_enabled boolean DEFAULT true,
  frequency text DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'daily', 'weekly', 'never')),
  quiet_hours jsonb DEFAULT '{
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category)
);

-- Analytics & Monitoring Tables
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  session_id text,
  additional_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS system_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_unit text,
  tags jsonb DEFAULT '{}',
  recorded_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  resource_type text,
  resource_id text,
  duration_seconds integer,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Content Management Tables
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image text,
  author_id uuid REFERENCES users(id),
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  category text DEFAULT 'general',
  access_level text DEFAULT 'public' CHECK (access_level IN ('public', 'registered', 'premium')),
  download_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  order_index integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  not_helpful_count integer DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category text DEFAULT 'general',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Events
CREATE POLICY "Everyone can read active events" ON events
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can manage events" ON events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for Event Registrations
CREATE POLICY "Users can read own registrations" ON event_registrations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own registrations" ON event_registrations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own registrations" ON event_registrations
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all registrations" ON event_registrations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for Plants
CREATE POLICY "Everyone can read plants" ON plants
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage plants" ON plants
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for Notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON plants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update event registration count
CREATE OR REPLACE FUNCTION update_event_registration_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events 
    SET registered_count = registered_count + 1 
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events 
    SET registered_count = GREATEST(registered_count - 1, 0)
    WHERE id = OLD.event_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.status != NEW.status THEN
      IF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
        UPDATE events 
        SET registered_count = GREATEST(registered_count - 1, 0)
        WHERE id = NEW.event_id;
      ELSIF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
        UPDATE events 
        SET registered_count = registered_count + 1 
        WHERE id = NEW.event_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_registration_count
  AFTER INSERT OR UPDATE OR DELETE ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION update_event_registration_count();

-- Insert default data
INSERT INTO event_categories (name, slug, description, color, icon) VALUES
  ('Atölyeler', 'workshops', 'Uygulamalı öğrenme etkinlikleri', '#3b82f6', 'wrench'),
  ('Yürüyüşler', 'walks', 'Doğa yürüyüşleri ve keşif turları', '#10b981', 'map'),
  ('Seminerler', 'seminars', 'Bilgilendirici sunum ve konferanslar', '#8b5cf6', 'presentation'),
  ('Dikim', 'planting', 'Bitki dikimi ve bahçıvanlık etkinlikleri', '#f59e0b', 'sprout')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO plant_categories (name, slug, description) VALUES
  ('Aromatik Bitkiler', 'aromatic-plants', 'Güçlü kokuya sahip tıbbi ve kulinary bitkiler'),
  ('Süs Bitkileri', 'ornamental-plants', 'Dekoratif amaçlı yetiştirilen bitkiler'),
  ('Ağaçlar', 'trees', 'Odunsu gövdeli büyük bitkiler'),
  ('Çiçekler', 'flowers', 'Süs amaçlı çiçekli bitkiler'),
  ('Sebzeler', 'vegetables', 'Gıda amaçlı yetiştirilen bitkiler')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO notification_templates (name, title_template, message_template, type, category, variables) VALUES
  ('event_reminder', 'Etkinlik Hatırlatması', 'Merhaba {{user_name}}! {{event_title}} etkinliği {{time_until}} sonra başlayacak.', 'reminder', 'event', ARRAY['user_name', 'event_title', 'time_until']),
  ('registration_success', 'Kayıt Başarılı', '{{event_title}} etkinliğine başarıyla kayıt oldunuz.', 'success', 'event', ARRAY['user_name', 'event_title']),
  ('welcome_user', 'Hoş Geldiniz', 'YTT platformuna hoş geldiniz {{user_name}}!', 'info', 'system', ARRAY['user_name']),
  ('event_cancelled', 'Etkinlik İptal Edildi', 'Maalesef {{event_title}} etkinliği iptal edilmiştir.', 'warning', 'event', ARRAY['user_name', 'event_title'])
ON CONFLICT (name) DO NOTHING;

INSERT INTO system_settings (key, value, description, category, is_public) VALUES
  ('site_name', '"YTT - Yenilikçi Teknoloji Takımı"', 'Website adı', 'general', true),
  ('site_description', '"Doğa ve teknoloji ile sürdürülebilir geleceği inşa ediyoruz"', 'Website açıklaması', 'general', true),
  ('contact_email', '"info@ytt.dev"', 'İletişim e-posta adresi', 'contact', true),
  ('max_event_capacity', '100', 'Maksimum etkinlik kapasitesi', 'events', false),
  ('registration_deadline_hours', '2', 'Etkinlik başlamadan kaç saat önce kayıt kapanır', 'events', false),
  ('notification_reminder_hours', '1', 'Etkinlik başlamadan kaç saat önce hatırlatma gönderilir', 'notifications', false)
ON CONFLICT (key) DO NOTHING;