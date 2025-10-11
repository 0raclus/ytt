# 🚀 Database Setup - Tek Adımda Tamamlayın!

## ⚠️ Önemli Not

Eski schema'da `current_participants` kolonu eksikti. Yeni bir **tek dosyalı** setup hazırladım.

## ✅ Tek Adımda Kurulum

### Adım 1: Supabase SQL Editor'ı Açın

1. https://supabase.com/dashboard/project/qohkqpyxxryrevbqiqoq adresine gidin
2. Sol menüden **SQL Editor** sekmesine tıklayın
3. **New Query** butonuna tıklayın

### Adım 2: SQL'i Çalıştırın

```bash
# Terminal'de dosyayı görüntüleyin:
cat supabase/reset-and-setup.sql
```

**Veya doğrudan kopyalayın:**

1. `supabase/reset-and-setup.sql` dosyasını açın
2. **TÜM içeriği** kopyalayın (Cmd+A, Cmd+C)
3. Supabase SQL Editor'e yapıştırın (Cmd+V)
4. **Run** butonuna tıklayın (veya Cmd+Enter)

### Adım 3: Sonucu Kontrol Edin

SQL çalıştıktan sonra şu mesajları görmelisiniz:

```
✅ Setup completed successfully!
✅ Tables created: 7 tables
✅ Data inserted:
   - Events: 3
   - Plants: 5
   - Blog Posts: 3
   - Resources: 3
```

## 📋 Bu SQL Ne Yapar?

### 1. Temizlik (Drop)
- Eski tabloları siler (varsa)
- Eski trigger'ları siler
- Eski function'ları siler

### 2. Tablo Oluşturma
- ✅ `user_profiles` - Kullanıcı profilleri
- ✅ `events` - Etkinlikler (**current_participants** dahil!)
- ✅ `event_registrations` - Etkinlik kayıtları
- ✅ `plants` - Bitki kütüphanesi
- ✅ `blog_posts` - Blog yazıları
- ✅ `notifications` - Bildirimler
- ✅ `resources` - Kaynaklar

### 3. Güvenlik (RLS)
- Row Level Security aktif
- Policies oluşturuldu
- Admin/User rolleri ayarlandı

### 4. Performans
- Indexler oluşturuldu
- Optimizasyon yapıldı

### 5. Otomasyonlar
- User signup trigger (otomatik profil oluşturma)
- Updated_at trigger (otomatik timestamp güncelleme)
- **ebrar@ytt.dev otomatik admin olur!**

### 6. Sample Data
- 3 örnek etkinlik
- 5 örnek bitki
- 3 örnek blog yazısı
- 3 örnek kaynak

## 🎯 Sonraki Adım: Admin Hesabı

SQL çalıştıktan sonra:

### Yöntem 1: Otomatik Admin (Önerilen)

```
1. http://localhost:5174/register
2. Email: ebrar@ytt.dev
3. Password: filistin (veya istediğiniz)
4. Kayıt ol
5. ✅ Otomatik admin olursunuz!
```

### Yöntem 2: Manuel Admin

Başka bir email ile kayıt olduktan sonra:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## ✅ Test Edin

1. **Register**: http://localhost:5174/register
2. **Login**: http://localhost:5174/login
3. **Admin Panel**: http://localhost:5174/admin
4. **Events**: http://localhost:5174/events
5. **Plants**: http://localhost:5174/plants
6. **Blog**: http://localhost:5174/blog

## 🐛 Sorun Giderme

### "permission denied for schema public"
```sql
-- SQL Editor'de çalıştırın:
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
```

### "relation already exists"
- Normal! DROP IF EXISTS kullanıyoruz
- SQL tekrar çalıştırılabilir

### "function does not exist"
- SQL'in tamamını çalıştırdığınızdan emin olun
- Dosyanın sonuna kadar scroll edin

## 📊 Doğrulama

SQL çalıştıktan sonra kontrol edin:

```sql
-- Tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Veri sayılarını kontrol et
SELECT 'Events' as table_name, COUNT(*) as count FROM events
UNION ALL
SELECT 'Plants', COUNT(*) FROM plants
UNION ALL
SELECT 'Blog Posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'Resources', COUNT(*) FROM resources;
```

Beklenen sonuç:
```
✅ 7 tablo
✅ 3 event
✅ 5 plant
✅ 3 blog post
✅ 3 resource
```

## 🎊 Tamamlandı!

SQL başarıyla çalıştıysa:

- ✅ Database hazır
- ✅ Sample data yüklendi
- ✅ Security ayarlandı
- ✅ Triggers aktif
- ✅ Sistem kullanıma hazır!

**Şimdi yapın:**
1. Admin hesabı oluşturun
2. Login olun
3. Admin paneli test edin
4. Etkinlik oluşturun
5. Blog yazısı ekleyin

## 📞 Yardım

Sorun yaşarsanız:
- SQL'in tamamını çalıştırdığınızdan emin olun
- Hata mesajını kontrol edin
- Gerekirse SQL'i tekrar çalıştırın (DROP IF EXISTS kullanıyor)

---

**Kolay gelsin!** 🚀

Tek bir SQL dosyası ile her şey hazır!

