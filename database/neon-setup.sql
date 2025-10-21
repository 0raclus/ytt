-- YTT Platform - Neon PostgreSQL Setup
-- Run this in Neon SQL Editor

-- Drop existing tables if any
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS plants CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS resources CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  bio TEXT,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  date_of_birth DATE,
  gender VARCHAR(50),
  interests TEXT[],
  emergency_contact JSONB,
  dietary_restrictions TEXT[],
  medical_conditions TEXT[],
  experience_level VARCHAR(50) DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  social_links JSONB,
  privacy_settings JSONB DEFAULT '{"profile_visible": true, "email_visible": false}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  image_url TEXT,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Event Registrations Table
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'waitlist', 'completed', 'no_show')),
  notes TEXT,
  dietary_requirements TEXT,
  emergency_contact JSONB,
  attendance_confirmed BOOLEAN DEFAULT FALSE,
  feedback JSONB,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  registered_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Plants Table
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255),
  description TEXT NOT NULL,
  care_instructions TEXT NOT NULL,
  watering_frequency VARCHAR(100),
  sunlight_requirement VARCHAR(100),
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  image_url TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  featured_image TEXT,
  category VARCHAR(100),
  tags TEXT[],
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'event', 'system')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP,
  delivery_method TEXT[] DEFAULT ARRAY['in_app'],
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Resources Table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('document', 'video', 'link', 'guide', 'tool')),
  url TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Sample Data

-- Admin User
INSERT INTO user_profiles (user_id, email, full_name, role) VALUES
  (uuid_generate_v4(), 'ebrar@ytt.dev', 'Ebrar Admin', 'admin');

-- Sample Events
INSERT INTO events (title, description, date, location, max_participants, category, image_url) VALUES
  ('Bahar Bahçe Festivali', 'Bahar mevsiminin gelişini kutluyoruz! Bahçe düzenleme, bitki bakımı ve sürdürülebilir yaşam üzerine atölyeler.', '2024-04-15 10:00:00', 'Merkez Park, İstanbul', 100, 'festival', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64'),
  ('Organik Tarım Atölyesi', 'Organik tarım teknikleri ve kompost yapımı üzerine uygulamalı eğitim.', '2024-04-20 14:00:00', 'YTT Eğitim Merkezi', 30, 'workshop', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399'),
  ('Şehir Bahçeciliği Semineri', 'Küçük alanlarda verimli bahçecilik yapmanın yolları.', '2024-04-25 16:00:00', 'Online', 200, 'seminar', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b');

-- Sample Plants
INSERT INTO plants (name, scientific_name, description, care_instructions, watering_frequency, sunlight_requirement, difficulty_level, category, image_url) VALUES
  ('Monstera Deliciosa', 'Monstera deliciosa', 'Büyük, delik delik yaprakları ile popüler bir iç mekan bitkisi.', 'Haftada bir kez sulayın, parlak dolaylı ışık tercih eder.', 'Haftada 1', 'Parlak dolaylı ışık', 'easy', 'İç Mekan', 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b'),
  ('Lavanta', 'Lavandula', 'Güzel kokulu mor çiçekleri ile bilinen Akdeniz bitkisi.', 'Az su ile yetinir, bol güneş ister.', '10 günde 1', 'Tam güneş', 'easy', 'Dış Mekan', 'https://images.unsplash.com/photo-1611251180889-f4d6ab5b5f96'),
  ('Bonsai Ağacı', 'Ficus retusa', 'Geleneksel Japon sanatı ile şekillendirilmiş minyatür ağaç.', 'Düzenli budama ve şekillendirme gerektirir.', 'Haftada 2', 'Parlak dolaylı ışık', 'hard', 'İç Mekan', 'https://images.unsplash.com/photo-1585288766827-c3f1f6c7b5e7');

-- Sample Blog Posts
INSERT INTO blog_posts (title, content, excerpt, author_id, category, tags, status, featured_image) VALUES
  (
    'Sürdürülebilir Bahçecilik İpuçları',
    'Sürdürülebilir bahçecilik, doğal kaynakları korurken güzel bir bahçe oluşturmanın yollarını araştırır...',
    'Çevre dostu bahçecilik teknikleri ile doğayı koruyun.',
    (SELECT user_id FROM user_profiles WHERE email = 'ebrar@ytt.dev'),
    'Sürdürülebilirlik',
    ARRAY['bahçecilik', 'sürdürülebilirlik', 'çevre'],
    'published',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b'
  );

-- Success message
SELECT 'Database setup completed successfully!' as message;

