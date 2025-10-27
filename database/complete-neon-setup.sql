-- ============================================
-- YTT PLATFORM - COMPLETE DATABASE SETUP
-- Neon PostgreSQL - Production Ready
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (if any) - CAREFUL!
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS plants CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS event_categories CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ============================================
-- TABLE: user_profiles
-- ============================================
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    avatar_url TEXT,
    phone VARCHAR(20),
    bio TEXT,
    department VARCHAR(100),
    student_level VARCHAR(50),
    preferences JSONB DEFAULT '{}',
    password_hash TEXT,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- ============================================
-- TABLE: event_categories
-- ============================================
CREATE TABLE event_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_event_categories_slug ON event_categories(slug);

-- ============================================
-- TABLE: events
-- ============================================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES event_categories(id) ON DELETE SET NULL,
    date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    capacity INTEGER DEFAULT 0,
    registered_count INTEGER DEFAULT 0,
    image_url TEXT,
    organizer_id UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    tags TEXT[],
    requirements TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);

-- ============================================
-- TABLE: event_registrations
-- ============================================
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
    registration_date TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);

-- ============================================
-- TABLE: plants
-- ============================================
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    description TEXT,
    care_instructions TEXT,
    watering_frequency VARCHAR(100),
    sunlight_requirements VARCHAR(100),
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    image_url TEXT,
    added_by UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_plants_name ON plants(name);
CREATE INDEX idx_plants_difficulty_level ON plants(difficulty_level);
CREATE INDEX idx_plants_added_by ON plants(added_by);

-- ============================================
-- TABLE: blog_posts
-- ============================================
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
    category VARCHAR(100),
    tags TEXT[],
    image_url TEXT,
    published BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- ============================================
-- TABLE: notifications
-- ============================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- TABLE: resources
-- ============================================
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('document', 'video', 'link', 'image', 'other')),
    url TEXT NOT NULL,
    category VARCHAR(100),
    uploaded_by UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
    tags TEXT[],
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_uploaded_by ON resources(uploaded_by);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Event Categories
INSERT INTO event_categories (name, slug, description, color, icon) VALUES
('Teknoloji', 'teknoloji', 'Teknoloji ve yazılım etkinlikleri', '#3B82F6', 'Laptop'),
('Çevre', 'cevre', 'Çevre ve sürdürülebilirlik etkinlikleri', '#10B981', 'Leaf'),
('Sosyal', 'sosyal', 'Sosyal ve kültürel etkinlikler', '#F59E0B', 'Users'),
('Eğitim', 'egitim', 'Eğitim ve workshop etkinlikleri', '#8B5CF6', 'GraduationCap'),
('Spor', 'spor', 'Spor ve sağlık etkinlikleri', '#EF4444', 'Dumbbell');

-- Insert Admin User (password: admin123)
INSERT INTO user_profiles (user_id, email, full_name, role, password_hash, bio, created_at) VALUES
(
    uuid_generate_v4(),
    'admin@ytt.dev',
    'YTT Admin',
    'admin',
    '$2a$10$rOvHPZYQKjKxMxW5YJ5zKOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
    'YTT Platform Yöneticisi',
    NOW()
);

-- Insert Sample User (password: user123)
INSERT INTO user_profiles (user_id, email, full_name, role, password_hash, department, student_level, created_at) VALUES
(
    uuid_generate_v4(),
    'user@ytt.dev',
    'Test Kullanıcı',
    'user',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Bilgisayar Mühendisliği',
    '3. Sınıf',
    NOW()
);

-- Get admin user_id for events
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT user_id INTO admin_user_id FROM user_profiles WHERE email = 'admin@ytt.dev';

    -- Insert Sample Events
    INSERT INTO events (title, description, category_id, date, location, capacity, registered_count, image_url, organizer_id, status, tags) VALUES
    (
        'Web Geliştirme Workshop',
        'Modern web teknolojileri ile full-stack uygulama geliştirme workshop''u. React, Node.js ve PostgreSQL kullanarak gerçek dünya projeleri oluşturacağız.',
        1,
        NOW() + INTERVAL '7 days',
        'Teknoloji Fakültesi - Lab 101',
        30,
        12,
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        admin_user_id,
        'upcoming',
        ARRAY['web', 'react', 'nodejs', 'workshop']
    ),
    (
        'Kampüs Ağaçlandırma Projesi',
        'Kampüsümüzü daha yeşil hale getirmek için düzenlediğimiz ağaçlandırma etkinliği. Herkes davetlidir!',
        2,
        NOW() + INTERVAL '14 days',
        'Kampüs Ana Bahçe',
        100,
        45,
        'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
        admin_user_id,
        'upcoming',
        ARRAY['çevre', 'doğa', 'gönüllülük']
    ),
    (
        'Yapay Zeka ve Makine Öğrenmesi Semineri',
        'Yapay zeka ve makine öğrenmesi alanında güncel gelişmeler ve uygulamalar üzerine seminer.',
        4,
        NOW() + INTERVAL '21 days',
        'Konferans Salonu',
        150,
        78,
        'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        admin_user_id,
        'upcoming',
        ARRAY['ai', 'ml', 'teknoloji', 'seminer']
    );

    -- Insert Sample Plants
    INSERT INTO plants (name, scientific_name, description, care_instructions, watering_frequency, sunlight_requirements, difficulty_level, image_url, added_by, tags) VALUES
    (
        'Monstera Deliciosa',
        'Monstera deliciosa',
        'Büyük, delik delik yaprakları ile tanınan popüler bir iç mekan bitkisi.',
        'Parlak dolaylı ışık altında tutun. Toprak kuruduğunda sulayın. Yaprakları nemli bir bezle silin.',
        'Haftada 1-2 kez',
        'Parlak dolaylı ışık',
        'easy',
        'https://images.unsplash.com/photo-1614594975525-e45190c55d0b',
        admin_user_id,
        ARRAY['iç mekan', 'kolay', 'popüler']
    ),
    (
        'Sukulent Karışımı',
        'Various succulents',
        'Bakımı kolay, az su isteyen çeşitli sukulent bitkiler.',
        'Bol güneş ışığı verin. Ayda 1-2 kez sulayın. İyi drene olan toprak kullanın.',
        'Ayda 1-2 kez',
        'Doğrudan güneş ışığı',
        'easy',
        'https://images.unsplash.com/photo-1459156212016-c812468e2115',
        admin_user_id,
        ARRAY['sukulent', 'kolay', 'az su']
    ),
    (
        'Ficus Lyrata',
        'Ficus lyrata',
        'Keman yapraklı incir olarak bilinen, büyük yapraklı dekoratif bitki.',
        'Parlak dolaylı ışık. Toprak yüzeyi kuruduğunda sulayın. Taşımayı sevmez.',
        'Haftada 1 kez',
        'Parlak dolaylı ışık',
        'medium',
        'https://images.unsplash.com/photo-1509937528035-ad76254b0356',
        admin_user_id,
        ARRAY['iç mekan', 'dekoratif', 'orta']
    );

    -- Insert Sample Blog Post
    INSERT INTO blog_posts (title, slug, content, excerpt, author_id, category, tags, image_url, published, views) VALUES
    (
        'Sürdürülebilir Kampüs Yaşamı İçin 10 İpucu',
        'surdurulebilir-kampus-yasami-icin-10-ipucu',
        '# Sürdürülebilir Kampüs Yaşamı

Kampüs yaşamınızı daha sürdürülebilir hale getirmek için pratik öneriler...

## 1. Tek Kullanımlık Plastikten Kaçının
Kendi su şişenizi ve kahve kupanızı kullanın.

## 2. Geri Dönüşüm Yapın
Kampüsteki geri dönüşüm kutularını aktif kullanın.

## 3. Bisiklet veya Toplu Taşıma Kullanın
Karbon ayak izinizi azaltın.

[... devamı]',
        'Kampüs yaşamınızı daha çevre dostu hale getirmek için basit ama etkili 10 ipucu.',
        admin_user_id,
        'Çevre',
        ARRAY['sürdürülebilirlik', 'çevre', 'kampüs', 'yaşam'],
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
        true,
        156
    );

END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT 'Database setup completed successfully!' as status;

SELECT 'User Profiles' as table_name, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'Event Categories', COUNT(*) FROM event_categories
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Plants', COUNT(*) FROM plants
UNION ALL
SELECT 'Blog Posts', COUNT(*) FROM blog_posts;

-- Show all columns in user_profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

