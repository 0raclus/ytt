-- YTT Platform - Complete Reset and Setup
-- This will DROP all existing tables and recreate them
-- WARNING: This will delete all existing data!

-- ============================================
-- DROP EXISTING TABLES (if they exist)
-- ============================================

-- Drop all triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
DROP TRIGGER IF EXISTS update_plants_updated_at ON plants;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS update_event_registrations_updated_at ON event_registrations;

-- Drop functions with CASCADE to remove dependent triggers
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop all tables
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS plants CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
  phone TEXT,
  department TEXT,
  student_level TEXT,
  bio TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{"notifications": true, "newsletter": true, "reminder_time": 1, "language": "tr", "theme": "system"}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  two_factor_enabled BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  instructor TEXT,
  capacity INTEGER DEFAULT 20,
  current_participants INTEGER DEFAULT 0,
  category TEXT,
  difficulty TEXT,
  requirements TEXT[],
  image_url TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Registrations Table
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Plants Table
CREATE TABLE plants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  category TEXT,
  difficulty TEXT,
  description TEXT,
  care_instructions JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  reading_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources Table
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT,
  downloads INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- User Profiles Policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events Policies
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Event Registrations Policies
CREATE POLICY "Users can view own registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own registrations" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own registrations" ON event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Plants Policies
CREATE POLICY "Anyone can view plants" ON plants FOR SELECT USING (true);
CREATE POLICY "Admins can manage plants" ON plants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Blog Posts Policies
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
CREATE POLICY "Admins can manage posts" ON blog_posts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Resources Policies
CREATE POLICY "Anyone can view resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Admins can manage resources" ON resources FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.email = 'ebrar@ytt.dev' THEN 'admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON plants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Sample Events
INSERT INTO events (title, description, date, time, location, instructor, capacity, current_participants, category, difficulty, requirements, image_url, status)
VALUES 
(
  'Bitki Bakımı Workshop',
  'Ev bitkilerinizin bakımını öğrenin. Bu workshop''ta temel bitki bakımı, sulama teknikleri ve hastalıklarla mücadele yöntemlerini öğreneceksiniz.',
  CURRENT_DATE + INTERVAL '7 days',
  '14:00',
  'YTT Merkez Ofis',
  'Ahmet Yılmaz',
  25,
  0,
  'Workshop',
  'Başlangıç',
  ARRAY['Not defteri', 'Kalem'],
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
  'upcoming'
),
(
  'Hidroponik Tarım Eğitimi',
  'Topraksız tarım yöntemleri ve hidroponik sistem kurulumu hakkında detaylı bilgi edinin.',
  CURRENT_DATE + INTERVAL '14 days',
  '10:00',
  'YTT Sera',
  'Ayşe Demir',
  15,
  0,
  'Eğitim',
  'Orta',
  ARRAY['Temel bitki bilgisi'],
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
  'upcoming'
),
(
  'Organik Gübre Yapımı',
  'Evde organik gübre nasıl yapılır? Kompost hazırlama teknikleri ve ipuçları.',
  CURRENT_DATE + INTERVAL '21 days',
  '15:30',
  'YTT Bahçe',
  'Mehmet Kaya',
  20,
  0,
  'Workshop',
  'Başlangıç',
  ARRAY['Eldiven', 'Maske'],
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
  'upcoming'
);

-- Sample Plants
INSERT INTO plants (name, scientific_name, category, difficulty, description, care_instructions, image_url)
VALUES 
(
  'Monstera Deliciosa',
  'Monstera deliciosa',
  'Tropik',
  'Kolay',
  'Popüler iç mekan bitkisi. Büyük, delikli yaprakları ile tanınır.',
  '{"sulama": "Haftada 1-2 kez", "isik": "Dolaylı güneş ışığı", "sicaklik": "18-27°C", "nem": "Orta-Yüksek"}'::jsonb,
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800'
),
(
  'Pothos',
  'Epipremnum aureum',
  'Tropik',
  'Çok Kolay',
  'Bakımı kolay, hızlı büyüyen asma bitki. Yeni başlayanlar için ideal.',
  '{"sulama": "Toprak kuruduğunda", "isik": "Düşük-Orta ışık", "sicaklik": "15-30°C", "nem": "Orta"}'::jsonb,
  'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=800'
),
(
  'Yılan Bitkisi',
  'Sansevieria trifasciata',
  'Sukulent',
  'Çok Kolay',
  'Dayanıklı ve bakımı kolay. Hava temizleyici özelliği vardır.',
  '{"sulama": "2-3 haftada bir", "isik": "Düşük-Yüksek ışık", "sicaklik": "15-30°C", "nem": "Düşük"}'::jsonb,
  'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=800'
),
(
  'Aloe Vera',
  'Aloe barbadensis miller',
  'Sukulent',
  'Kolay',
  'Tıbbi özellikleri olan sukulent bitki. Cilt bakımında kullanılır.',
  '{"sulama": "2-3 haftada bir", "isik": "Parlak dolaylı ışık", "sicaklik": "13-27°C", "nem": "Düşük"}'::jsonb,
  'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800'
),
(
  'Ficus Elastica',
  'Ficus elastica',
  'Tropik',
  'Orta',
  'Kauçuk ağacı olarak da bilinir. Büyük, parlak yaprakları vardır.',
  '{"sulama": "Haftada 1 kez", "isik": "Parlak dolaylı ışık", "sicaklik": "15-24°C", "nem": "Orta"}'::jsonb,
  'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=800'
);

-- Sample Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author_name, status, reading_time)
VALUES 
(
  'Bitki Bakımına Başlangıç Rehberi',
  'bitki-bakimina-baslangic-rehberi',
  'Bitki bakımı hakkında bilmeniz gereken her şey. Yeni başlayanlar için kapsamlı rehber.',
  '<h2>Giriş</h2><p>Bitki bakımı düşündüğünüzden daha kolay! Bu rehberde temel bilgileri öğreneceksiniz.</p><h2>Sulama</h2><p>Her bitkinin farklı sulama ihtiyacı vardır. Toprak kuruluğunu kontrol edin.</p><h2>Işık</h2><p>Bitkiler için doğru ışık çok önemlidir. Dolaylı güneş ışığı çoğu bitki için idealdir.</p>',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
  'YTT Ekibi',
  'published',
  5
),
(
  'Ev İçi Hava Temizleyen Bitkiler',
  'ev-ici-hava-temizleyen-bitkiler',
  'Evinizin havasını temizleyen en iyi 10 bitki ve bakım ipuçları.',
  '<h2>Neden Hava Temizleyici Bitkiler?</h2><p>NASA''nın araştırmasına göre bazı bitkiler havadaki toksinleri temizler.</p><h2>En İyi 10 Bitki</h2><ol><li>Yılan Bitkisi</li><li>Pothos</li><li>Barış Çiçeği</li></ol>',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800',
  'Ayşe Demir',
  'published',
  7
),
(
  'Hidroponik Tarıma Giriş',
  'hidroponik-tarim-giris',
  'Topraksız tarım yöntemleri ve evde hidroponik sistem kurulumu.',
  '<h2>Hidroponik Nedir?</h2><p>Topraksız tarım yöntemidir. Bitkiler besin çözeltisi içinde yetiştirilir.</p><h2>Avantajları</h2><ul><li>Daha hızlı büyüme</li><li>Daha az su kullanımı</li><li>Yıl boyunca üretim</li></ul>',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
  'Mehmet Kaya',
  'published',
  10
);

-- Sample Resources
INSERT INTO resources (title, description, file_url, file_type, file_size, category)
VALUES 
(
  'Bitki Bakım Takvimi',
  'Aylık bitki bakım takvimi PDF. Hangi ayda ne yapılmalı?',
  'https://example.com/bitki-bakim-takvimi.pdf',
  'PDF',
  2048000,
  'Rehber'
),
(
  'Sulama Rehberi',
  'Farklı bitki türleri için sulama rehberi.',
  'https://example.com/sulama-rehberi.pdf',
  'PDF',
  1536000,
  'Rehber'
),
(
  'Hastalık Tanıma Kılavuzu',
  'Bitki hastalıklarını tanıma ve tedavi kılavuzu.',
  'https://example.com/hastalik-kilavuzu.pdf',
  'PDF',
  3072000,
  'Kılavuz'
);

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'Setup completed successfully!' as message;

SELECT 'Tables created:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT 'Data inserted:' as info;
SELECT 'Events' as table_name, COUNT(*) as count FROM events
UNION ALL
SELECT 'Plants', COUNT(*) FROM plants
UNION ALL
SELECT 'Blog Posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'Resources', COUNT(*) FROM resources;

