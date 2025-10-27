-- YTT Platform Database Schema
-- Production-ready PostgreSQL schema for Neon

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EVENT CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO event_categories (name, slug, description, icon, color) VALUES
  ('Atölye', 'workshop', 'Uygulamalı bitki yetiştirme ve bakım atölyeleri', 'wrench', '#10b981'),
  ('Yürüyüş', 'walk', 'Doğa yürüyüşleri ve bitki tanıma gezileri', 'map', '#3b82f6'),
  ('Seminer', 'seminar', 'Teorik bilgi ve sunum seminerleri', 'book', '#8b5cf6'),
  ('Ekim', 'planting', 'Toplu ekim ve bahçe düzenleme etkinlikleri', 'sprout', '#f59e0b')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  registered_count INTEGER DEFAULT 0 CHECK (registered_count >= 0),
  category_id UUID REFERENCES event_categories(id) ON DELETE SET NULL,
  requirements TEXT[], -- Array of requirements
  image_url TEXT,
  instructor VARCHAR(255),
  duration VARCHAR(50),
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed', 'full')),
  created_by UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_capacity CHECK (registered_count <= capacity)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- ============================================
-- EVENT REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  -- Prevent duplicate registrations
  UNIQUE(event_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON event_registrations(status);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON event_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update registered_count when registration is added/removed
CREATE OR REPLACE FUNCTION update_event_registered_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE events 
    SET registered_count = registered_count + 1,
        status = CASE 
          WHEN registered_count + 1 >= capacity THEN 'full'
          ELSE status
        END
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
    UPDATE events 
    SET registered_count = GREATEST(registered_count - 1, 0),
        status = CASE 
          WHEN status = 'full' AND registered_count - 1 < capacity THEN 'active'
          ELSE status
        END
    WHERE id = OLD.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
      UPDATE events 
      SET registered_count = GREATEST(registered_count - 1, 0),
          status = CASE 
            WHEN status = 'full' AND registered_count - 1 < capacity THEN 'active'
            ELSE status
          END
      WHERE id = NEW.event_id;
    ELSIF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
      UPDATE events 
      SET registered_count = registered_count + 1,
          status = CASE 
            WHEN registered_count + 1 >= capacity THEN 'full'
            ELSE status
          END
      WHERE id = NEW.event_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_registered_count_on_registration
  AFTER INSERT OR UPDATE OR DELETE ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_event_registered_count();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for events with category information
CREATE OR REPLACE VIEW events_with_categories AS
SELECT 
  e.*,
  c.name as category_name,
  c.slug as category_slug,
  c.icon as category_icon,
  c.color as category_color,
  CASE 
    WHEN e.registered_count >= e.capacity THEN true
    ELSE false
  END as is_full,
  CASE 
    WHEN e.date < CURRENT_DATE THEN true
    ELSE false
  END as is_past
FROM events e
LEFT JOIN event_categories c ON e.category_id = c.id;

-- View for user registrations with event details
CREATE OR REPLACE VIEW user_event_registrations AS
SELECT 
  r.id as registration_id,
  r.user_id,
  r.status as registration_status,
  r.registered_at,
  e.*,
  c.name as category_name,
  c.slug as category_slug
FROM event_registrations r
JOIN events e ON r.event_id = e.id
LEFT JOIN event_categories c ON e.category_id = c.id;

-- ============================================
-- SAMPLE DATA (for development)
-- ============================================

-- Insert sample events
INSERT INTO events (
  title, description, date, time, location, capacity, category_id,
  requirements, image_url, instructor, duration, difficulty
)
SELECT 
  'Bitki Tanıma Yürüyüşü',
  'Kampüs alanında doğal olarak yetişen bitkileri tanıma ve özelliklerini öğrenme yürüyüşü.',
  CURRENT_DATE + INTERVAL '30 days',
  '14:00',
  'Mühendislik Fakültesi Önü',
  20,
  (SELECT id FROM event_categories WHERE slug = 'walk'),
  ARRAY['Rahat ayakkabı', 'Su şişesi', 'Not defteri'],
  'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg',
  'Dr. Ayşe Botanik',
  '2 saat',
  'beginner'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Bitki Tanıma Yürüyüşü');

INSERT INTO events (
  title, description, date, time, location, capacity, category_id,
  requirements, image_url, instructor, duration, difficulty
)
SELECT 
  'Bitki Ekimi Atölyesi',
  'Sera ortamında lavanta, adaçayı ve diğer aromatik bitkilerin ekimi ve bakımı hakkında uygulamalı eğitim.',
  CURRENT_DATE + INTERVAL '45 days',
  '11:00',
  'Biyoloji Serası',
  15,
  (SELECT id FROM event_categories WHERE slug = 'workshop'),
  ARRAY['İş eldiveni', 'Önlük', 'Su şişesi'],
  'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg',
  'Prof. Mehmet Yeşil',
  '3 saat',
  'intermediate'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Bitki Ekimi Atölyesi');

INSERT INTO events (
  title, description, date, time, location, capacity, category_id,
  requirements, image_url, instructor, duration, difficulty
)
SELECT 
  'Aromatik Bitkiler Semineri',
  'Lavanta, adaçayı ve diğer aromatik bitkilerin tıbbi ve kullanım alanları hakkında teorik bilgi semineri.',
  CURRENT_DATE + INTERVAL '20 days',
  '10:00',
  'Konferans Salonu',
  50,
  (SELECT id FROM event_categories WHERE slug = 'seminar'),
  ARRAY['Not defteri', 'Kalem'],
  'https://images.pexels.com/photos/6629401/pexels-photo-6629401.jpeg',
  'Dr. Fatma Aroma',
  '1.5 saat',
  'beginner'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Aromatik Bitkiler Semineri');

-- ============================================
-- GRANTS (adjust based on your user)
-- ============================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;

