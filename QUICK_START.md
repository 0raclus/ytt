# YTT Platform - Hızlı Başlangıç Rehberi

## 🚀 5 Dakikada Başlayın!

### Adım 1: Supabase Projesi Oluşturun

1. **Supabase'e gidin**: https://supabase.com
2. **Yeni proje oluşturun**:
   - "New Project" butonuna tıklayın
   - Proje adı: `ytt-platform`
   - Database şifresi: Güçlü bir şifre seçin (kaydedin!)
   - Region: Europe (Frankfurt) veya en yakın
   - "Create new project" butonuna tıklayın

3. **Credentials'ları kopyalayın**:
   - Sol menüden "Settings" → "API" sekmesine gidin
   - `Project URL` ve `anon public` key'i kopyalayın

### Adım 2: Environment Variables Ayarlayın

`.env` dosyasını açın ve credentials'ları yapıştırın:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Adım 3: Database Schema Oluşturun

Supabase SQL Editor'de aşağıdaki SQL'i çalıştırın:

```sql
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

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for event_registrations
CREATE POLICY "Users can view own registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own registrations" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own registrations" ON event_registrations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for plants
CREATE POLICY "Anyone can view plants" ON plants FOR SELECT USING (true);
CREATE POLICY "Admins can manage plants" ON plants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
CREATE POLICY "Admins can manage posts" ON blog_posts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for resources
CREATE POLICY "Anyone can view resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Admins can manage resources" ON resources FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Adım 4: Test Verisi Ekleyin (Opsiyonel)

```sql
-- Sample Event
INSERT INTO events (title, description, date, time, location, instructor, capacity, category, difficulty)
VALUES (
  'Bitki Bakımı Workshop',
  'Ev bitkilerinizin bakımını öğrenin',
  CURRENT_DATE + INTERVAL '7 days',
  '14:00',
  'YTT Merkez',
  'Ahmet Yılmaz',
  25,
  'Workshop',
  'Başlangıç'
);

-- Sample Plant
INSERT INTO plants (name, scientific_name, category, difficulty, description)
VALUES (
  'Monstera Deliciosa',
  'Monstera deliciosa',
  'Tropik',
  'Kolay',
  'Popüler iç mekan bitkisi'
);

-- Sample Blog Post
INSERT INTO blog_posts (title, slug, excerpt, content, status, author_name)
VALUES (
  'Bitki Bakımına Başlangıç',
  'bitki-bakimina-baslangic',
  'Bitki bakımı hakkında bilmeniz gerekenler',
  '<p>Bitki bakımı düşündüğünüzden daha kolay...</p>',
  'published',
  'YTT Ekibi'
);
```

### Adım 5: Uygulamayı Başlatın

```bash
# Server'ı yeniden başlatın
npm run dev
```

### Adım 6: İlk Admin Hesabını Oluşturun

1. http://localhost:5174/register adresine gidin
2. `ebrar@ytt.dev` email'i ile kayıt olun (otomatik admin olur)
3. Veya başka bir email ile kayıt olup Supabase'de manuel admin yapın:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## ✅ Tamamlandı!

Artık sisteminiz tamamen çalışıyor:

- ✅ Login/Register sistemi
- ✅ Admin paneli
- ✅ Event yönetimi
- ✅ Blog yönetimi
- ✅ Kullanıcı yönetimi

## 🎯 Sonraki Adımlar

1. **Email Templates**: Supabase → Authentication → Email Templates
2. **Storage**: Supabase → Storage → Create buckets for images
3. **Deploy**: Vercel veya Netlify'a deploy edin

## 🐛 Sorun Giderme

### "Failed to fetch" hatası
- `.env` dosyasındaki credentials'ları kontrol edin
- Supabase projesinin aktif olduğundan emin olun

### "Invalid API key" hatası
- Anon key'i doğru kopyaladığınızdan emin olun
- Supabase dashboard'dan tekrar kontrol edin

### Database hatası
- SQL script'in tamamen çalıştığından emin olun
- RLS policies'in aktif olduğunu kontrol edin

## 📞 Yardım

Sorun yaşarsanız:
- GitHub Issues
- Email: info@ytt.dev
- Dokümantasyon: README.md

---

**Kolay gelsin!** 🚀

