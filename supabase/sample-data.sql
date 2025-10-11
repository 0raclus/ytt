-- YTT Platform Sample Data
-- Run this AFTER schema.sql to populate with test data

-- ============================================
-- SAMPLE EVENTS
-- ============================================

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

-- ============================================
-- SAMPLE PLANTS
-- ============================================

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

-- ============================================
-- SAMPLE BLOG POSTS
-- ============================================

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

-- ============================================
-- SAMPLE RESOURCES
-- ============================================

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
-- ADMIN USER SETUP
-- ============================================

-- Note: Admin user will be created when someone registers with ebrar@ytt.dev
-- The trigger will automatically set role to 'admin' for this email
-- You can also manually update any user to admin:
-- UPDATE user_profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if data was inserted correctly
SELECT 'Events' as table_name, COUNT(*) as count FROM events
UNION ALL
SELECT 'Plants', COUNT(*) FROM plants
UNION ALL
SELECT 'Blog Posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'Resources', COUNT(*) FROM resources;

