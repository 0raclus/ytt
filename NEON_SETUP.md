# 🚀 YTT Platform - Neon PostgreSQL + Vercel Setup

## ✅ Kurulum Tamamlandı!

### 📦 Yüklenen Paketler
- `@neondatabase/serverless` - Neon PostgreSQL client
- `ws` - WebSocket support
- `@vercel/node` - Vercel serverless functions

### 📁 Oluşturulan Dosyalar

#### **1. Database Client**
- `src/lib/db.ts` - Neon PostgreSQL client ve helper functions

#### **2. API Routes (Vercel Serverless Functions)**
- `api/events/index.ts` - GET /api/events, POST /api/events
- `api/events/[id].ts` - GET/PUT/DELETE /api/events/:id
- `api/plants/index.ts` - GET /api/plants, POST /api/plants
- `api/blog/index.ts` - GET /api/blog, POST /api/blog

#### **3. Database Migration**
- `database/neon-setup.sql` - Complete database schema + sample data

#### **4. Configuration**
- `.env` - Updated with Neon DATABASE_URL
- `vercel.json` - API routes configuration

---

## 🎯 ŞİMDİ YAPMANIZ GEREKENLER

### **ADIM 1: Neon Database'i Kurun**

1. **Neon Dashboard'a Gidin**
   ```
   https://console.neon.tech
   ```

2. **SQL Editor'ı Açın**
   - Sol menüden "SQL Editor" seçin

3. **Migration SQL'i Çalıştırın**
   - `database/neon-setup.sql` dosyasını açın
   - Tüm içeriği kopyalayın
   - Neon SQL Editor'a yapıştırın
   - "Run" butonuna tıklayın

4. **Başarı Mesajını Görün**
   ```
   Database setup completed successfully!
   ```

### **ADIM 2: Vercel Environment Variables**

1. **Vercel Dashboard'a Gidin**
   ```
   https://vercel.com/dashboard
   ```

2. **Projenizi Seçin**
   - `ytt` projesine tıklayın

3. **Settings → Environment Variables**
   
4. **Şu Variable'ı Ekleyin**
   ```
   Name: VITE_DATABASE_URL
   Value: postgresql://neondb_owner:npg_DvAa7CF2IGpu@ep-hidden-breeze-agkweyze-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
   
   Environment: Production, Preview, Development
   ```

5. **Şu Variable'ı Ekleyin**
   ```
   Name: VITE_API_URL
   Value: https://ytt-c3g9.vercel.app/api
   
   Environment: Production, Preview, Development
   ```

### **ADIM 3: Deploy**

1. **Commit ve Push**
   ```bash
   git add .
   git commit -m "feat: Migrate to Neon PostgreSQL with Vercel API"
   git push origin main
   ```

2. **Vercel Otomatik Deploy Edecek**
   - Build: ~1-2 dakika
   - Deploy: ~30 saniye

3. **Test Edin**
   ```
   https://ytt-c3g9.vercel.app/
   ```

---

## 🔌 API Endpoints

### **Events**
- `GET /api/events` - Tüm etkinlikleri listele
- `GET /api/events/:id` - Tek etkinlik detayı
- `POST /api/events` - Yeni etkinlik oluştur
- `PUT /api/events/:id` - Etkinlik güncelle
- `DELETE /api/events/:id` - Etkinlik sil

### **Plants**
- `GET /api/plants` - Tüm bitkileri listele
- `POST /api/plants` - Yeni bitki ekle

### **Blog**
- `GET /api/blog` - Blog yazıları
- `GET /api/blog?limit=3` - Son 3 yazı
- `POST /api/blog` - Yeni yazı oluştur

---

## 🧪 Local Test

```bash
# Development server
npm run dev

# API test
curl http://localhost:5174/api/events
```

---

## 📊 Database Schema

### **Tables**
- `user_profiles` - Kullanıcı profilleri
- `events` - Etkinlikler
- `event_registrations` - Etkinlik kayıtları
- `plants` - Bitki kütüphanesi
- `blog_posts` - Blog yazıları
- `notifications` - Bildirimler
- `resources` - Kaynaklar

### **Sample Data**
- ✅ Admin user: ebrar@ytt.dev
- ✅ 3 sample events
- ✅ 3 sample plants
- ✅ 1 sample blog post

---

## 🎊 Avantajlar

### **Neon PostgreSQL**
- ✅ Serverless - Auto-scaling
- ✅ Free tier: 3 GB storage
- ✅ Instant branching
- ✅ Point-in-time recovery
- ✅ Connection pooling

### **Vercel API Routes**
- ✅ Serverless functions
- ✅ Auto-scaling
- ✅ Global edge network
- ✅ Zero config
- ✅ TypeScript support

### **Full-Stack on Vercel**
- ✅ Frontend + Backend tek yerde
- ✅ Tek deployment
- ✅ Tek domain
- ✅ CORS yok
- ✅ Production-ready

---

## 🔧 Troubleshooting

### **Database Connection Error**
```
Error: Could not connect to database
```
**Çözüm:** Vercel environment variables'ı kontrol edin

### **API 404 Error**
```
GET /api/events 404
```
**Çözüm:** Vercel'de redeploy yapın

### **CORS Error**
```
Access-Control-Allow-Origin error
```
**Çözüm:** `vercel.json` CORS headers'ı kontrol edin

---

## 📞 Support

Sorun yaşarsanız:
1. Neon Dashboard → Logs
2. Vercel Dashboard → Deployments → Logs
3. Browser Console → Network tab

---

**Hazır! Artık full-stack PostgreSQL + Vercel uygulamanız var!** 🚀

