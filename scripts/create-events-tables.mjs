#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.VITE_DATABASE_URL);

async function createTables() {
  console.log('🚀 Creating events tables...\n');
  
  try {
    // Create event_categories table
    console.log('📁 Creating event_categories table...');
    await sql`
      CREATE TABLE IF NOT EXISTS event_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ event_categories created\n');
    
    // Insert categories
    console.log('📝 Inserting categories...');
    await sql`
      INSERT INTO event_categories (name, slug, description, icon, color) VALUES
        ('Atölye', 'workshop', 'Uygulamalı bitki yetiştirme ve bakım atölyeleri', 'wrench', '#10b981'),
        ('Yürüyüş', 'walk', 'Doğa yürüyüşleri ve bitki tanıma gezileri', 'map', '#3b82f6'),
        ('Seminer', 'seminar', 'Teorik bilgi ve sunum seminerleri', 'book', '#8b5cf6'),
        ('Ekim', 'planting', 'Toplu ekim ve bahçe düzenleme etkinlikleri', 'sprout', '#f59e0b')
      ON CONFLICT (slug) DO NOTHING
    `;
    console.log('✅ Categories inserted\n');
    
    // Create events table
    console.log('📅 Creating events table...');
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        location VARCHAR(255) NOT NULL,
        capacity INTEGER NOT NULL CHECK (capacity > 0),
        registered_count INTEGER DEFAULT 0 CHECK (registered_count >= 0),
        category_id UUID REFERENCES event_categories(id) ON DELETE SET NULL,
        requirements TEXT[],
        image_url TEXT,
        instructor VARCHAR(255),
        duration VARCHAR(50),
        difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed', 'full')),
        created_by UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT valid_capacity CHECK (registered_count <= capacity)
      )
    `;
    console.log('✅ events created\n');
    
    // Create indexes
    console.log('🔍 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_events_date ON events(date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_events_status ON events(status)`;
    console.log('✅ Indexes created\n');
    
    // Create event_registrations table
    console.log('✅ Creating event_registrations table...');
    await sql`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
        registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        cancelled_at TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        UNIQUE(event_id, user_id)
      )
    `;
    console.log('✅ event_registrations created\n');
    
    // Create indexes for registrations
    console.log('🔍 Creating registration indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_registrations_user ON event_registrations(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_registrations_status ON event_registrations(status)`;
    console.log('✅ Registration indexes created\n');
    
    // Insert sample events
    console.log('📝 Inserting sample events...');
    
    const walkCat = await sql`SELECT id FROM event_categories WHERE slug = 'walk'`;
    const workshopCat = await sql`SELECT id FROM event_categories WHERE slug = 'workshop'`;
    const seminarCat = await sql`SELECT id FROM event_categories WHERE slug = 'seminar'`;
    
    await sql`
      INSERT INTO events (
        title, description, date, time, location, capacity, category_id,
        requirements, image_url, instructor, duration, difficulty
      ) VALUES (
        'Bitki Tanıma Yürüyüşü',
        'Kampüs alanında doğal olarak yetişen bitkileri tanıma ve özelliklerini öğrenme yürüyüşü.',
        CURRENT_DATE + INTERVAL '30 days',
        '14:00',
        'Mühendislik Fakültesi Önü',
        20,
        ${walkCat[0].id},
        ARRAY['Rahat ayakkabı', 'Su şişesi', 'Not defteri'],
        'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg',
        'Dr. Ayşe Botanik',
        '2 saat',
        'beginner'
      )
      ON CONFLICT DO NOTHING
    `;
    
    await sql`
      INSERT INTO events (
        title, description, date, time, location, capacity, category_id,
        requirements, image_url, instructor, duration, difficulty
      ) VALUES (
        'Bitki Ekimi Atölyesi',
        'Sera ortamında lavanta, adaçayı ve diğer aromatik bitkilerin ekimi ve bakımı hakkında uygulamalı eğitim.',
        CURRENT_DATE + INTERVAL '45 days',
        '11:00',
        'Biyoloji Serası',
        15,
        ${workshopCat[0].id},
        ARRAY['İş eldiveni', 'Önlük', 'Su şişesi'],
        'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg',
        'Prof. Mehmet Yeşil',
        '3 saat',
        'intermediate'
      )
      ON CONFLICT DO NOTHING
    `;
    
    await sql`
      INSERT INTO events (
        title, description, date, time, location, capacity, category_id,
        requirements, image_url, instructor, duration, difficulty
      ) VALUES (
        'Aromatik Bitkiler Semineri',
        'Lavanta, adaçayı ve diğer aromatik bitkilerin tıbbi ve kullanım alanları hakkında teorik bilgi semineri.',
        CURRENT_DATE + INTERVAL '20 days',
        '10:00',
        'Konferans Salonu',
        50,
        ${seminarCat[0].id},
        ARRAY['Not defteri', 'Kalem'],
        'https://images.pexels.com/photos/6629401/pexels-photo-6629401.jpeg',
        'Dr. Fatma Aroma',
        '1.5 saat',
        'beginner'
      )
      ON CONFLICT DO NOTHING
    `;
    
    console.log('✅ Sample events inserted\n');
    
    console.log('🎉 All tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

createTables();

