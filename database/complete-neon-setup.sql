-- ============================================
-- YTT PLATFORM - COMPLETE DATABASE SETUP
-- Neon PostgreSQL - Production Ready
-- NO MOCK DATA - ONLY SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (if any) - CAREFUL!
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS system_metrics CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS plants CASCADE;
DROP TABLE IF EXISTS events CASCADE;
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
-- TABLE: events
-- ============================================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    max_participants INTEGER DEFAULT 0,
    current_participants INTEGER DEFAULT 0,
    image_url TEXT,
    organizer_id UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    tags TEXT[],
    requirements TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);

-- ============================================
-- TABLE: event_registrations
-- ============================================
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('pending', 'registered', 'confirmed', 'cancelled', 'attended')),
    registered_at TIMESTAMP DEFAULT NOW(),
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
    sunlight_requirement VARCHAR(100),
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    image_url TEXT,
    category VARCHAR(100),
    added_by UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_plants_name ON plants(name);
CREATE INDEX idx_plants_difficulty_level ON plants(difficulty_level);
CREATE INDEX idx_plants_category ON plants(category);
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
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
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
-- TABLE: audit_logs
-- ============================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    additional_info JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- TABLE: system_metrics
-- ============================================
CREATE TABLE system_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_unit VARCHAR(50),
    tags JSONB DEFAULT '{}',
    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_system_metrics_metric_name ON system_metrics(metric_name);
CREATE INDEX idx_system_metrics_recorded_at ON system_metrics(recorded_at DESC);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT 'Database setup completed successfully!' as status;

-- Show all tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Show all columns in user_profiles (verify password_hash exists)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Show all columns in events (verify max_participants, current_participants exist)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

-- Show all columns in plants (verify sunlight_requirement, category exist)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'plants'
ORDER BY ordinal_position;

-- Show all columns in blog_posts (verify status column exists)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

