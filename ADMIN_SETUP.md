# 👑 Admin Kurulum Rehberi

## 🎯 Admin Olmanın 3 Yolu

### Yöntem 1: Otomatik Admin (Önerilen)

Email adresiniz admin listesinde ise otomatik admin olursunuz.

**Admin listesini düzenleyin:**
```javascript
// dev-server.js - Line 19
const ADMIN_EMAILS = [
  'klausmullermaxwell@gmail.com',
  'your-email@gmail.com', // Buraya email ekleyin
];
```

**Adımlar:**
1. `dev-server.js` dosyasını açın
2. `ADMIN_EMAILS` dizisine email'inizi ekleyin
3. Sunucuyu yeniden başlatın: `npm run dev:all`
4. Google ile giriş yapın
5. Otomatik admin olacaksınız! 🎉

---

### Yöntem 2: Manuel Admin Yapma (Script)

Mevcut bir kullanıcıyı admin yapmak için:

```bash
# 1. Önce Google ile giriş yapın (kullanıcı oluşturun)
# 2. Sonra bu komutu çalıştırın:
node scripts/make-admin.mjs
```

**Script size soracak:**
- Email adresi
- Admin secret key (`.env` dosyasında: `ytt-admin-2025`)

---

### Yöntem 3: API ile Manuel Admin

```bash
curl -X POST http://localhost:3001/api/auth/make-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com",
    "secret": "ytt-admin-2025"
  }'
```

---

## 🔐 Admin Secret Key

Admin secret key `.env` dosyasında:

```env
ADMIN_SECRET=ytt-admin-2025
```

**Production'da mutlaka değiştirin!**

---

## ✅ Admin Kontrolü

Admin olduktan sonra:

1. **Profil sayfanızda** role: "admin" görünecek
2. **Admin paneline** erişebileceksiniz
3. **Event oluşturabileceksiniz**
4. **Kullanıcıları yönetebileceksiniz**

---

## 🚀 Hızlı Başlangıç

```bash
# 1. Sunucuyu başlatın
npm run dev:all

# 2. Tarayıcıda açın
http://localhost:5174

# 3. Google ile giriş yapın
# Email: klausmullermaxwell@gmail.com (otomatik admin)

# 4. Admin paneline gidin
http://localhost:5174/admin
```

---

## 🔧 Sorun Giderme

### "User not found" hatası
- Önce Google ile giriş yapın
- Kullanıcı oluşturulduktan sonra admin yapın

### "Invalid secret key" hatası
- `.env` dosyasındaki `ADMIN_SECRET` değerini kontrol edin
- Sunucuyu yeniden başlatın

### Admin paneline erişemiyorum
- Profil sayfanızda role'ü kontrol edin
- `user_profiles` tablosunda role'ü kontrol edin:
  ```bash
  node -e "import dotenv from 'dotenv'; import {neon} from '@neondatabase/serverless'; dotenv.config(); const sql = neon(process.env.VITE_DATABASE_URL); const result = await sql\`SELECT email, role FROM user_profiles\`; console.log(result);"
  ```

---

## 📊 Database Kontrolü

Tüm admin kullanıcıları görmek için:

```bash
node -e "import dotenv from 'dotenv'; import {neon} from '@neondatabase/serverless'; dotenv.config(); const sql = neon(process.env.VITE_DATABASE_URL); const result = await sql\`SELECT email, full_name, role FROM user_profiles WHERE role = 'admin'\`; console.log(JSON.stringify(result, null, 2));"
```

---

## 🎉 Başarılı!

Admin olduktan sonra:
- ✅ Event oluşturabilirsiniz
- ✅ Event düzenleyebilirsiniz
- ✅ Event silebilirsiniz
- ✅ Kullanıcıları yönetebilirsiniz
- ✅ İstatistikleri görebilirsiniz

**Hoş geldiniz, Admin!** 👑

