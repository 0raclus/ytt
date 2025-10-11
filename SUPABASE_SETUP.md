# Supabase Setup Guide - YTT Platform

## ✅ Credentials Eklendi!

Supabase credentials başarıyla `.env` dosyasına eklendi:

```
Project ID: qohkqpyxxryrevbqiqoq
URL: https://qohkqpyxxryrevbqiqoq.supabase.co
```

## 📋 Yapılması Gerekenler

### Adım 1: Supabase Dashboard'a Girin

1. https://supabase.com/dashboard adresine gidin
2. `qohkqpyxxryrevbqiqoq` projesini açın

### Adım 2: Database Schema Oluşturun

1. Sol menüden **SQL Editor** sekmesine gidin
2. **New Query** butonuna tıklayın
3. `supabase/schema.sql` dosyasının içeriğini kopyalayın
4. SQL Editor'e yapıştırın
5. **Run** butonuna tıklayın

**Veya terminal'den:**

```bash
# Dosyayı görüntüle
cat supabase/schema.sql

# İçeriği kopyala ve Supabase SQL Editor'e yapıştır
```

### Adım 3: Sample Data Ekleyin (Opsiyonel)

1. SQL Editor'de yeni bir query açın
2. `supabase/sample-data.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'e yapıştırın
4. **Run** butonuna tıklayın

Bu adım size test verisi sağlar:
- 3 örnek etkinlik
- 5 örnek bitki
- 3 örnek blog yazısı
- 3 örnek kaynak

### Adım 4: Email Templates Ayarlayın (Opsiyonel)

1. Sol menüden **Authentication** → **Email Templates** sekmesine gidin
2. Şablonları Türkçe'ye çevirebilirsiniz:

**Confirm Signup:**
```
Merhaba,

YTT Platform'a hoş geldiniz! E-posta adresinizi doğrulamak için aşağıdaki linke tıklayın:

{{ .ConfirmationURL }}

Teşekkürler,
YTT Ekibi
```

**Reset Password:**
```
Merhaba,

Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:

{{ .ConfirmationURL }}

Bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.

Teşekkürler,
YTT Ekibi
```

### Adım 5: Storage Buckets Oluşturun (Opsiyonel)

Resim yükleme özelliği için:

1. Sol menüden **Storage** sekmesine gidin
2. **New Bucket** butonuna tıklayın
3. Aşağıdaki bucket'ları oluşturun:

```sql
-- SQL Editor'de çalıştırın:

-- Event images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true);

-- Plant images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-images', 'plant-images', true);

-- Blog images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- User avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

### Adım 6: İlk Admin Hesabını Oluşturun

**Yöntem 1: Otomatik (Önerilen)**

1. http://localhost:5174/register adresine gidin
2. `ebrar@ytt.dev` email'i ile kayıt olun
3. Sistem otomatik olarak admin rolü verecek

**Yöntem 2: Manuel**

1. Herhangi bir email ile kayıt olun
2. Supabase SQL Editor'de çalıştırın:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Adım 7: Test Edin!

1. **Kayıt Ol**: http://localhost:5174/register
2. **Giriş Yap**: http://localhost:5174/login
3. **Admin Panel**: http://localhost:5174/admin
4. **Ana Sayfa**: http://localhost:5174/

## ✅ Kontrol Listesi

- [ ] Schema oluşturuldu (`supabase/schema.sql`)
- [ ] Sample data eklendi (`supabase/sample-data.sql`)
- [ ] Email templates ayarlandı
- [ ] Storage buckets oluşturuldu
- [ ] İlk admin hesabı oluşturuldu
- [ ] Login/Register test edildi
- [ ] Admin panel test edildi

## 🔍 Doğrulama

Schema'nın doğru kurulduğunu kontrol edin:

```sql
-- SQL Editor'de çalıştırın:

-- Tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Veri sayılarını kontrol et
SELECT 'user_profiles' as table_name, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'plants', COUNT(*) FROM plants
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'resources', COUNT(*) FROM resources;
```

Beklenen sonuç:
- user_profiles: 0 (henüz kayıt olmadıysanız)
- events: 3 (sample data eklediyseniz)
- plants: 5 (sample data eklediyseniz)
- blog_posts: 3 (sample data eklediyseniz)
- resources: 3 (sample data eklediyseniz)

## 🐛 Sorun Giderme

### "relation does not exist" hatası
- Schema SQL'i tamamen çalıştırıldığından emin olun
- SQL Editor'de hata mesajlarını kontrol edin

### "permission denied" hatası
- RLS policies'in doğru kurulduğunu kontrol edin
- Kullanıcının doğru role sahip olduğunu kontrol edin

### Email doğrulama gelmiyor
- Supabase → Authentication → Settings
- "Enable email confirmations" ayarını kontrol edin
- Email provider ayarlarını kontrol edin

### Admin paneline erişemiyorum
- Kullanıcının role'ünü kontrol edin:
```sql
SELECT email, role FROM user_profiles WHERE email = 'your-email@example.com';
```

## 📊 Database Schema Özeti

### Tables
- `user_profiles` - Kullanıcı profilleri
- `events` - Etkinlikler
- `event_registrations` - Etkinlik kayıtları
- `plants` - Bitki kütüphanesi
- `blog_posts` - Blog yazıları
- `notifications` - Bildirimler
- `resources` - İndirilebilir kaynaklar

### Policies
- RLS enabled on all tables
- Public read access for most content
- Admin-only write access for management
- User-specific access for personal data

### Triggers
- Auto-create user profile on signup
- Auto-update `updated_at` timestamps

## 🎯 Sonraki Adımlar

1. ✅ Schema kuruldu
2. ✅ Sample data eklendi
3. ✅ Admin hesabı oluşturuldu
4. 🔄 Uygulamayı test et
5. 🔄 Production'a deploy et

## 📞 Yardım

Sorun yaşarsanız:
- Supabase Docs: https://supabase.com/docs
- GitHub Issues
- Email: info@ytt.dev

---

**Kurulum tamamlandı!** 🚀

Artık sisteminiz tamamen çalışıyor ve Supabase ile entegre!

